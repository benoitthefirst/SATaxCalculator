# Integration: Add Document Upload to Expense Details Page

**Goal:** Add batch document upload to your existing Expense Details page

---

## STEP 1: Replace "Receipts & Attachments" Section

In your Expense Details page, replace the current empty attachment section with this:

```jsx
// In your expense detail page component

import { useState } from 'react';
import DocumentUploadWidget from '@/app/components/DocumentUploadWidget';
import ApprovedDocumentsList from '@/app/components/ApprovedDocumentsList';

export default function ExpenseDetails({ expenseId, businessId }) {
  const [refreshDocuments, setRefreshDocuments] = useState(0);

  return (
    <div>
      {/* Your existing expense details fields... */}
      
      {/* Replace the "Receipts & Attachments" section with this: */}
      <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '1rem' }}>
          Receipts & Attachments
        </h3>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '1.5rem' }}>
          Upload receipts, invoices, or other supporting documents. AI will automatically extract data.
        </p>

        {/* Document Upload Widget */}
        <DocumentUploadWidget
          businessId={businessId}
          recordType="expense"
          recordId={expenseId}
          onUploadSuccess={() => setRefreshDocuments(prev => prev + 1)}
        />

        {/* Show Already Approved Documents */}
        <div style={{ marginTop: '2rem' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '1rem' }}>
            Approved Documents
          </h4>
          <ApprovedDocumentsList
            recordType="expense"
            recordId={expenseId}
            key={refreshDocuments}
          />
        </div>
      </div>
    </div>
  );
}
```

---

## STEP 2: Create Document Upload Widget Component

Create: `app/components/DocumentUploadWidget.jsx`

```jsx
'use client';

import React, { useState } from 'react';
import { Upload, Loader, AlertCircle, CheckCircle, X } from 'lucide-react';

export default function DocumentUploadWidget({ businessId, recordType, recordId, onUploadSuccess }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const fileDataArray = [];

      for (const file of files) {
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        fileDataArray.push({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          base64Content: base64,
        });
      }

      const response = await fetch('/api/analyze-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: fileDataArray,
          businessId,
          recordType,
          recordId,
        }),
      });

      const data = await response.json();

      if (data.success || data.processed > 0) {
        setResults(data);
        setShowResults(true);
        setFiles([]);
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (showResults && results) {
    return (
      <div style={{
        backgroundColor: '#f0f8ff',
        border: '1px solid #0066cc',
        borderRadius: '8px',
        padding: '1.5rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <CheckCircle size={24} style={{ color: '#00aa00' }} />
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
              {results.processed} Document{results.processed !== 1 ? 's' : ''} Analyzed
            </h4>
          </div>
          <button
            onClick={() => {
              setShowResults(false);
              setResults(null);
              onUploadSuccess?.();
            }}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#666',
              fontSize: '14px',
            }}
          >
            ✕ Close
          </button>
        </div>

        {results.processed > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '12px',
            marginBottom: '1.5rem',
          }}>
            {results.results.map((result, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'white',
                  border: '0.5px solid #ddd',
                  borderRadius: '6px',
                  padding: '1rem',
                }}
              >
                <div style={{ marginBottom: '0.5rem' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666', fontWeight: '500' }}>
                    {result.fileName}
                  </p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '12px', color: '#999' }}>
                    {result.documentType}
                  </p>
                </div>

                <div style={{
                  backgroundColor: '#f9f9f9',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  marginBottom: '0.75rem',
                  fontSize: '12px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#666' }}>Amount:</span>
                    <span style={{ fontWeight: '600', color: '#0066cc' }}>
                      R {parseFloat(result.extractedInfo.amount).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#666' }}>Category:</span>
                    <span style={{ fontWeight: '600' }}>{result.suggestedCategory}</span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  color: result.confidence > 0.95 ? '#155724' : '#856404',
                  backgroundColor: result.confidence > 0.95 ? '#d4edda' : '#fff3cd',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}>
                  {(result.confidence * 100).toFixed(0)}% confident
                </div>
              </div>
            ))}
          </div>
        )}

        {results.failed > 0 && (
          <div style={{
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '6px',
            padding: '1rem',
            marginBottom: '1rem',
          }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#cc0000', fontWeight: '500' }}>
              {results.failed} file{results.failed !== 1 ? 's' : ''} failed to analyze
            </p>
            {results.errors.map((err, idx) => (
              <p key={idx} style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#cc0000' }}>
                • {err.fileName}: {err.error}
              </p>
            ))}
          </div>
        )}

        <button
          onClick={() => {
            setShowResults(false);
            setResults(null);
            onUploadSuccess?.();
          }}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '14px',
          }}
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div style={{
      border: '2px dashed #ccc',
      borderRadius: '8px',
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: '#f9f9f9',
    }}>
      <input
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="upload-files"
      />

      {files.length === 0 ? (
        <label htmlFor="upload-files" style={{ cursor: 'pointer', display: 'block' }}>
          <Upload size={32} style={{ margin: '0 auto 1rem', color: '#666' }} />
          <p style={{ fontSize: '16px', fontWeight: '500', margin: '0 0 0.5rem 0' }}>
            Click to upload documents
          </p>
          <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
            PDF, JPG, or PNG • Max 10MB per file
          </p>
        </label>
      ) : (
        <div>
          <p style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 1rem 0' }}>
            {files.length} file{files.length !== 1 ? 's' : ''} selected
          </p>
          <div style={{
            backgroundColor: '#f0f0f0',
            borderRadius: '6px',
            padding: '1rem',
            marginBottom: '1rem',
            maxHeight: '200px',
            overflowY: 'auto',
          }}>
            {files.map((file, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem',
                  borderBottom: idx < files.length - 1 ? '1px solid #ddd' : 'none',
                  fontSize: '12px',
                }}
              >
                <span style={{ color: '#333' }}>{file.name}</span>
                <button
                  onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#cc0000',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <label htmlFor="upload-files" style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            marginRight: '8px',
          }}>
            Add More
          </label>

          <button
            onClick={handleAnalyze}
            disabled={uploading}
            style={{
              padding: '8px 16px',
              backgroundColor: uploading ? '#ccc' : '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: uploading ? 'default' : 'pointer',
              fontSize: '12px',
              fontWeight: '500',
            }}
          >
            {uploading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                Analyzing...
              </span>
            ) : (
              'Analyze Documents'
            )}
          </button>
        </div>
      )}

      {error && (
        <div style={{
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '6px',
          padding: '1rem',
          marginTop: '1rem',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
        }}>
          <AlertCircle size={18} style={{ color: '#cc0000', marginTop: '2px', flexShrink: 0 }} />
          <p style={{ margin: 0, color: '#cc0000', fontSize: '13px' }}>{error}</p>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
```

---

## STEP 3: Create Approved Documents List Component

Create: `app/components/ApprovedDocumentsList.jsx`

```jsx
'use client';

import React, { useState, useEffect } from 'react';
import { Download, Trash2, Eye } from 'lucide-react';

export default function ApprovedDocumentsList({ recordType, recordId }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, [recordId]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(
        `/api/documents?recordType=${recordType}&recordId=${recordId}`
      );
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!confirm('Delete this document?')) return;

    try {
      const response = await fetch(`/api/documents/${docId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchDocuments();
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  if (loading) return <p style={{ color: '#666', fontSize: '13px' }}>Loading documents...</p>;

  if (documents.length === 0) {
    return (
      <div style={{
        backgroundColor: '#f9f9f9',
        border: '2px dashed #ddd',
        borderRadius: '8px',
        padding: '2rem',
        textAlign: 'center',
        color: '#999',
        fontSize: '13px',
      }}>
        No documents yet
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '13px',
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>File</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>Type</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600' }}>Uploaded</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>
                <a
                  href={doc.file_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#0066cc',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}
                >
                  {doc.original_filename}
                </a>
              </td>
              <td style={{ padding: '10px', color: '#666' }}>{doc.document_type}</td>
              <td style={{ padding: '10px', color: '#666' }}>
                {new Date(doc.uploaded_date).toLocaleDateString()}
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <a
                  href={doc.file_path}
                  download
                  style={{
                    color: '#0066cc',
                    textDecoration: 'none',
                    marginRight: '12px',
                    cursor: 'pointer',
                  }}
                  title="Download"
                >
                  <Download size={14} style={{ display: 'inline' }} />
                </a>
                <button
                  onClick={() => handleDelete(doc.id)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#cc0000',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                  title="Delete"
                >
                  <Trash2 size={14} style={{ display: 'inline' }} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## STEP 4: API Route - Get Documents for Record

Create: `app/api/documents/route.js`

```javascript
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const recordType = searchParams.get('recordType');
    const recordId = searchParams.get('recordId');

    const documents = await prisma.document_attachments.findMany({
      where: {
        record_type: recordType,
        record_id: parseInt(recordId),
      },
      orderBy: { uploaded_date: 'desc' },
    });

    return Response.json({ success: true, documents });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

## STEP 5: API Route - Delete Document

Create: `app/api/documents/[id]/route.js`

```javascript
import { prisma } from "@/lib/prisma";
import fs from 'fs';
import path from 'path';

export async function DELETE(request, { params }) {
  try {
    const doc = await prisma.document_attachments.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!doc) {
      return Response.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Delete file from disk if it exists
    if (doc.file_path) {
      const filePath = path.join(process.cwd(), 'public', doc.file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete from database
    await prisma.document_attachments.delete({
      where: { id: parseInt(params.id) },
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

## Summary

Now your Expense Details page will have:

✅ **Batch document upload** - Upload multiple files at once
✅ **AI analysis** - Auto-extract data from invoices, receipts, bank statements
✅ **Confidence scores** - See how confident the AI is about extraction
✅ **Document list** - See all attached documents
✅ **Download/Delete** - Manage documents
✅ **Professional UI** - Matches your ProcessX style

---

## What Users Can Do

1. **Click upload area** → Select multiple documents
2. **AI analyzes** → Extracts data automatically
3. **See results** → Amount, category, date, vendor
4. **Documents saved** → Stored with expense
5. **Download/Delete** → Manage attachments

---

## Next: Create Approval Queue

Want me to create the approval queue dashboard for manually reviewing documents before they move to records?

That would be a separate page where managers can:
- See all pending documents
- Approve/reject with one click
- Move data to actual Income/Expense records
- Track audit trail
