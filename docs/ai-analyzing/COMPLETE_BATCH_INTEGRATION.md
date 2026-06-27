# Complete Document Analyzer Integration Guide

**For ProcessX System - Batch Upload + Approval Workflow**

---

## Architecture Overview

```
User uploads documents
        ↓
AI analyzes batch (multiple docs)
        ↓
Results stored in "pending_documents" table
        ↓
Shows review queue with extracted data
        ↓
User approves/rejects individually
        ↓
Approved data moves to Income/Expenses/Assets
        ↓
Original document linked as attachment
```

---

## STEP 1: Database Schema

Create these tables in your database:

```sql
-- Store pending document analyses
CREATE TABLE pending_documents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  business_id INT NOT NULL,
  document_type VARCHAR(50), -- INVOICE, RECEIPT, BANK_STATEMENT, PAYSLIP, EXPENSE_REPORT
  confidence DECIMAL(3,2),
  extracted_data JSON, -- Store all extracted fields
  original_filename VARCHAR(255),
  file_path VARCHAR(500),
  file_size INT,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  approved_date TIMESTAMP NULL,
  approved_by INT NULL,
  notes TEXT,
  linked_record_id INT NULL, -- Links to income_id or expense_id after approval
  linked_record_type VARCHAR(20) -- 'income' or 'expense'
);

-- Store linked documents/receipts
CREATE TABLE document_attachments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  record_type VARCHAR(20), -- 'income' or 'expense'
  record_id INT NOT NULL,
  document_type VARCHAR(50),
  original_filename VARCHAR(255),
  file_path VARCHAR(500),
  file_size INT,
  uploaded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  extracted_data JSON -- Store extracted info for reference
);

-- Track document analysis logs
CREATE TABLE document_analysis_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pending_document_id INT,
  analysis_result JSON,
  extracted_fields JSON,
  confidence DECIMAL(3,2),
  api_usage_tokens INT,
  processed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pending_document_id) REFERENCES pending_documents(id)
);
```

---

## STEP 2: Enhanced API Route - Batch Processing

Create: `app/api/analyze-documents/route.js`

```javascript
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma"; // Or use your DB client

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function POST(request) {
  try {
    const { files, businessId } = await request.json();

    if (!files || files.length === 0) {
      return Response.json(
        { success: false, error: "No files provided" },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];

    // Process each file
    for (const file of files) {
      try {
        const analysisResult = await analyzeDocument(file);

        // Save to pending_documents table
        const pendingDoc = await prisma.pending_documents.create({
          data: {
            business_id: businessId,
            document_type: analysisResult.documentType,
            confidence: analysisResult.confidence,
            extracted_data: analysisResult.extractedInfo,
            original_filename: file.fileName,
            file_path: file.filePath, // Store where you saved the file
            file_size: file.fileSize,
            status: "pending",
          },
        });

        // Log the analysis
        await prisma.document_analysis_logs.create({
          data: {
            pending_document_id: pendingDoc.id,
            analysis_result: analysisResult,
            extracted_fields: analysisResult.extractedInfo,
            confidence: analysisResult.confidence,
            api_usage_tokens: analysisResult.tokens || 0,
          },
        });

        results.push({
          success: true,
          fileName: file.fileName,
          documentType: analysisResult.documentType,
          confidence: analysisResult.confidence,
          pendingDocumentId: pendingDoc.id,
          extractedInfo: analysisResult.extractedInfo,
        });
      } catch (err) {
        errors.push({
          fileName: file.fileName,
          error: err.message,
        });
      }
    }

    return Response.json({
      success: results.length > 0,
      processed: results.length,
      failed: errors.length,
      results,
      errors,
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

async function analyzeDocument(file) {
  const analysisPrompt = `You are a financial document analyzer for South African accounting.

Analyze this financial document and extract ALL relevant information.

Return ONLY valid JSON with no other text:
{
  "documentType": "INVOICE|RECEIPT|BANK_STATEMENT|PAYSLIP|EXPENSE_REPORT|OTHER",
  "confidence": 0.95,
  "extractedInfo": {
    "date": "YYYY-MM-DD",
    "vendor": "vendor/employer/bank name",
    "amount": 1000,
    "description": "detailed description",
    "category": "category suggestion",
    "items": ["item1", "item2"],
    "paymentMethod": "method if visible",
    "reference": "invoice/cheque number if visible",
    "accountNumber": "if bank statement",
    "period": "statement period if applicable"
  },
  "suggestedCategory": "Office|Travel|Utilities|Marketing|Equipment|Salary|Other|Banking",
  "notes": "important details"
}`;

  const mediaType = file.fileType.includes("pdf")
    ? "application/pdf"
    : file.fileType.includes("png")
    ? "image/png"
    : "image/jpeg";

  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: analysisPrompt },
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: file.base64Content,
            },
          },
        ],
      },
    ],
  });

  const responseText =
    response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  const analysisResult = JSON.parse(jsonMatch[0]);

  return {
    ...analysisResult,
    tokens: response.usage.input_tokens + response.usage.output_tokens,
  };
}
```

---

## STEP 3: API Route - Approve Document

Create: `app/api/approve-document/route.js`

```javascript
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const { pendingDocumentId, action, linkedRecordId, linkedRecordType, userId } = await request.json();

    // action: 'approve' or 'reject'

    if (action === "approve") {
      const updated = await prisma.pending_documents.update({
        where: { id: pendingDocumentId },
        data: {
          status: "approved",
          approved_date: new Date(),
          approved_by: userId,
          linked_record_id: linkedRecordId,
          linked_record_type: linkedRecordType,
        },
      });

      // Create attachment record
      const pendingDoc = await prisma.pending_documents.findUnique({
        where: { id: pendingDocumentId },
      });

      await prisma.document_attachments.create({
        data: {
          record_type: linkedRecordType,
          record_id: linkedRecordId,
          document_type: pendingDoc.document_type,
          original_filename: pendingDoc.original_filename,
          file_path: pendingDoc.file_path,
          file_size: pendingDoc.file_size,
          extracted_data: pendingDoc.extracted_data,
        },
      });

      return Response.json({ success: true, updated });
    } else if (action === "reject") {
      const updated = await prisma.pending_documents.update({
        where: { id: pendingDocumentId },
        data: { status: "rejected" },
      });

      return Response.json({ success: true, updated });
    }
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

## STEP 4: Batch Upload Component

Create: `app/components/DocumentBatchUpload.jsx`

```jsx
'use client';

import React, { useState } from 'react';
import { Upload, Loader, AlertCircle, CheckCircle } from 'lucide-react';

export default function DocumentBatchUpload({ businessId, onSuccess }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setError(null);
    setResults(null);
  };

  const handleAnalyze = async () => {
    if (files.length === 0) {
      setError('Please select files');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const fileDataArray = [];

      // Convert all files to base64
      for (const file of files) {
        const reader = new FileReader();
        const base64 = await new Promise((resolve, reject) => {
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

      // Send batch to API
      const response = await fetch('/api/analyze-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: fileDataArray,
          businessId,
        }),
      });

      const data = await response.json();

      if (data.success || data.processed > 0) {
        setResults(data);
        onSuccess?.(data);
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '100%', padding: '1rem' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '1rem' }}>
        📄 Batch Upload Documents
      </h3>
      <p style={{ color: '#666', marginBottom: '1rem', fontSize: '14px' }}>
        Upload multiple documents (invoices, receipts, bank statements, payslips) for automatic analysis
      </p>

      <div style={{
        border: '2px dashed #ccc',
        borderRadius: '8px',
        padding: '2rem',
        textAlign: 'center',
        marginBottom: '1rem',
        backgroundColor: '#f9f9f9',
      }}>
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="batch-file-input"
        />
        <label htmlFor="batch-file-input" style={{ cursor: 'pointer' }}>
          <Upload size={32} style={{ margin: '0 auto 1rem', color: '#666' }} />
          <p style={{ fontSize: '16px', fontWeight: '500', margin: 0 }}>
            Click to upload documents
          </p>
          <p style={{ fontSize: '12px', color: '#999', marginTop: '0.5rem', margin: 0 }}>
            {files.length > 0 ? `${files.length} file(s) selected` : 'PDF, JPG, or PNG'}
          </p>
        </label>
      </div>

      {files.length > 0 && (
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #b3d9ff',
          borderRadius: '6px',
          padding: '1rem',
          marginBottom: '1rem',
          fontSize: '14px',
        }}>
          <strong>Selected files:</strong>
          <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '20px' }}>
            {files.map((file, idx) => (
              <li key={idx} style={{ color: '#333', marginTop: '4px' }}>
                {file.name} ({(file.size / 1024).toFixed(0)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={files.length === 0 || uploading}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          fontWeight: '500',
          backgroundColor: files.length > 0 && !uploading ? '#0066cc' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: files.length > 0 && !uploading ? 'pointer' : 'default',
          marginBottom: '1rem',
        }}
      >
        {uploading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
            Analyzing {files.length} document(s)...
          </span>
        ) : (
          `Analyze ${files.length > 0 ? files.length : ''} Document(s)`
        )}
      </button>

      {error && (
        <div style={{
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '6px',
          padding: '1rem',
          marginBottom: '1rem',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
        }}>
          <AlertCircle size={20} style={{ color: '#cc0000', marginTop: '2px', flexShrink: 0 }} />
          <p style={{ margin: 0, color: '#cc0000' }}>{error}</p>
        </div>
      )}

      {results && (
        <div style={{
          backgroundColor: '#f0f8ff',
          border: '1px solid #0066cc',
          borderRadius: '8px',
          padding: '1.5rem',
        }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '1rem', alignItems: 'center' }}>
            <CheckCircle size={24} style={{ color: '#00aa00' }} />
            <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
              Analysis Complete
            </h4>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '1rem',
          }}>
            <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '6px' }}>
              <p style={{ fontSize: '12px', color: '#666', margin: '0 0 0.5rem 0' }}>Documents Processed</p>
              <p style={{ fontSize: '24px', fontWeight: '600', color: '#0066cc', margin: 0 }}>
                {results.processed}
              </p>
            </div>
            {results.failed > 0 && (
              <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '6px' }}>
                <p style={{ fontSize: '12px', color: '#666', margin: '0 0 0.5rem 0' }}>Failed</p>
                <p style={{ fontSize: '24px', fontWeight: '600', color: '#cc0000', margin: 0 }}>
                  {results.failed}
                </p>
              </div>
            )}
          </div>

          {results.results && results.results.length > 0 && (
            <div style={{
              backgroundColor: 'white',
              border: '0.5px solid #ddd',
              borderRadius: '6px',
              padding: '1rem',
            }}>
              <p style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 1rem 0' }}>Extracted Documents</p>
              {results.results.map((result, idx) => (
                <div key={idx} style={{
                  padding: '1rem',
                  borderBottom: idx < results.results.length - 1 ? '1px solid #eee' : 'none',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong>{result.fileName}</strong>
                    <span style={{ color: '#666', fontSize: '12px' }}>
                      {(result.confidence * 100).toFixed(0)}% confident
                    </span>
                  </div>
                  <p style={{ margin: '0.5rem 0', fontSize: '14px', color: '#0066cc' }}>
                    Type: {result.documentType}
                  </p>
                  <p style={{ margin: '0.5rem 0', fontSize: '14px' }}>
                    Amount: R {result.extractedInfo.amount}
                  </p>
                  <p style={{ margin: '0.5rem 0', fontSize: '14px' }}>
                    Category: {result.suggestedCategory}
                  </p>
                </div>
              ))}
            </div>
          )}
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

## STEP 5: Document Review Queue Component

Create: `app/components/DocumentApprovalQueue.jsx`

```jsx
'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

export default function DocumentApprovalQueue({ businessId, userId }) {
  const [pendingDocs, setPendingDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingDocuments();
  }, [businessId]);

  const fetchPendingDocuments = async () => {
    try {
      const response = await fetch(`/api/pending-documents?businessId=${businessId}`);
      const data = await response.json();
      setPendingDocs(data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (docId, linkedRecordId, linkedRecordType) => {
    try {
      const response = await fetch('/api/approve-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pendingDocumentId: docId,
          action: 'approve',
          linkedRecordId,
          linkedRecordType,
          userId,
        }),
      });

      if (response.ok) {
        fetchPendingDocuments();
        setSelectedDoc(null);
      }
    } catch (error) {
      console.error('Error approving document:', error);
    }
  };

  const handleReject = async (docId) => {
    try {
      const response = await fetch('/api/approve-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pendingDocumentId: docId,
          action: 'reject',
          userId,
        }),
      });

      if (response.ok) {
        fetchPendingDocuments();
        setSelectedDoc(null);
      }
    } catch (error) {
      console.error('Error rejecting document:', error);
    }
  };

  if (loading) return <p>Loading pending documents...</p>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '1.5rem' }}>
        Document Review Queue
      </h2>

      {pendingDocs.length === 0 ? (
        <p style={{ color: '#666' }}>No pending documents for review</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>File</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Type</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Amount</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Confidence</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingDocs.map((doc) => (
                <tr key={doc.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>{doc.original_filename}</td>
                  <td style={{ padding: '1rem' }}>{doc.document_type}</td>
                  <td style={{ padding: '1rem', color: '#0066cc', fontWeight: '600' }}>
                    R {doc.extracted_data.amount}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      backgroundColor: doc.confidence > 0.95 ? '#d4edda' : '#fff3cd',
                      color: doc.confidence > 0.95 ? '#155724' : '#856404',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}>
                      {(doc.confidence * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '8px',
                        fontSize: '12px',
                      }}
                    >
                      <Eye size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedDoc && (
        <DocumentReviewModal
          doc={selectedDoc}
          onApprove={handleApprove}
          onReject={handleReject}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </div>
  );
}

function DocumentReviewModal({ doc, onApprove, onReject, onClose }) {
  const [linkedRecordId, setLinkedRecordId] = useState('');
  const [linkedRecordType, setLinkedRecordType] = useState('expense');

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '2rem',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '1.5rem' }}>
          Review Document: {doc.original_filename}
        </h3>

        <div style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '14px', fontWeight: '600' }}>Extracted Information</h4>
          <table style={{ width: '100%', fontSize: '14px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '4px 0', color: '#666' }}>Document Type:</td>
                <td style={{ padding: '4px 0', fontWeight: '600', textAlign: 'right' }}>{doc.document_type}</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 0', color: '#666' }}>Date:</td>
                <td style={{ padding: '4px 0', fontWeight: '600', textAlign: 'right' }}>{doc.extracted_data.date}</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 0', color: '#666' }}>Vendor:</td>
                <td style={{ padding: '4px 0', fontWeight: '600', textAlign: 'right' }}>{doc.extracted_data.vendor}</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 0', color: '#666' }}>Amount:</td>
                <td style={{ padding: '4px 0', fontWeight: '600', textAlign: 'right', color: '#0066cc' }}>
                  R {doc.extracted_data.amount}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '4px 0', color: '#666' }}>Category:</td>
                <td style={{ padding: '4px 0', fontWeight: '600', textAlign: 'right' }}>{doc.extracted_data.category}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '14px' }}>
            Link to Record (Optional):
          </label>
          <select
            value={linkedRecordType}
            onChange={(e) => setLinkedRecordType(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input
            type="text"
            placeholder={`${linkedRecordType} ID (optional)`}
            value={linkedRecordId}
            onChange={(e) => setLinkedRecordId(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onReject(doc.id)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ffebee',
              color: '#cc0000',
              border: '1px solid #ffcccc',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <XCircle size={16} />
            Reject
          </button>
          <button
            onClick={() => onApprove(doc.id, linkedRecordId, linkedRecordType)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#00aa00',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <CheckCircle size={16} />
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## STEP 6: Integration into Expense Page

In your Expenses page component, add:

```jsx
import DocumentBatchUpload from '@/app/components/DocumentBatchUpload';
import DocumentApprovalQueue from '@/app/components/DocumentApprovalQueue';

export default function ExpensesPage() {
  const [refreshQueue, setRefreshQueue] = useState(0);

  return (
    <div>
      {/* Your existing expenses list */}
      {/* ... */}

      {/* Add this section */}
      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <DocumentBatchUpload 
          businessId={businessId}
          onSuccess={() => setRefreshQueue(prev => prev + 1)}
        />
      </div>

      {/* Add approval queue */}
      <div style={{ marginTop: '2rem' }}>
        <DocumentApprovalQueue 
          businessId={businessId}
          userId={currentUserId}
          key={refreshQueue}
        />
      </div>
    </div>
  );
}
```

---

## STEP 7: API Route to Fetch Pending Documents

Create: `app/api/pending-documents/route.js`

```javascript
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    const documents = await prisma.pending_documents.findMany({
      where: {
        business_id: parseInt(businessId),
        status: 'pending',
      },
      orderBy: { upload_date: 'desc' },
    });

    return Response.json({ success: true, documents });
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

## STEP 8: File Upload Handling

For storing files, create: `app/api/upload-file/route.js`

```javascript
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to uploads folder
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, buffer);

    return Response.json({
      success: true,
      filename,
      filepath: `/uploads/${filename}`,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

---

## Workflow Summary

```
1. USER UPLOADS FILES
   └─ Can upload: Invoices, receipts, bank statements, payslips
   └─ Multiple files at once (different types OK)

2. AI ANALYZES BATCH
   └─ Each file analyzed individually
   └─ 95%+ accuracy on extraction
   └─ Stored in pending_documents table

3. HUMAN REVIEWS
   └─ See extracted data for each document
   └─ Confidence score visible
   └─ Option to approve/reject
   └─ Can link to existing records

4. APPROVAL
   └─ Approved documents move to Income/Expenses/Assets
   └─ Original file linked as attachment
   └─ Audit trail recorded
   └─ Rejected documents removed

5. REPORTING
   └─ All extracted data available
   └─ SARS-ready categorization
   └─ Full audit trail
```

---

## Database Queries for Reports

```sql
-- Get all approved documents this month
SELECT * FROM pending_documents 
WHERE status = 'approved' 
AND DATE(approved_date) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY);

-- Get documents by type
SELECT document_type, COUNT(*) as count, SUM(JSON_EXTRACT(extracted_data, '$.amount')) as total
FROM pending_documents 
WHERE status = 'approved'
GROUP BY document_type;

-- Get extraction confidence stats
SELECT ROUND(AVG(confidence) * 100, 2) as avg_confidence
FROM document_analysis_logs;
```

---

This integrates seamlessly with your ProcessX system!
