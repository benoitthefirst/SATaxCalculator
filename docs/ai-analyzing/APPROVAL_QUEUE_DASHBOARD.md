# Document Approval Queue - ProcessX Style Dashboard

**Create a dedicated page for reviewing & approving documents**

---

## STEP 1: Create Queue Page

Create: `app/(main)/documents/approval-queue/page.jsx`

```jsx
'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, FileText, DollarSign, Calendar } from 'lucide-react';

export default function ApprovalQueuePage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [sortBy, setSortBy] = useState('date'); // date, amount, confidence

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/pending-documents-all');
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredDocuments = () => {
    let filtered = documents;

    if (filter !== 'all') {
      filtered = filtered.filter(doc => doc.status === filter);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.upload_date) - new Date(a.upload_date);
      } else if (sortBy === 'amount') {
        return (b.extracted_data.amount || 0) - (a.extracted_data.amount || 0);
      } else if (sortBy === 'confidence') {
        return b.confidence - a.confidence;
      }
      return 0;
    });

    return filtered;
  };

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === 'pending').length,
    approved: documents.filter(d => d.status === 'approved').length,
    rejected: documents.filter(d => d.status === 'rejected').length,
  };

  const filteredDocs = getFilteredDocuments();

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
          Document Review Queue
        </h1>
        <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
          Approve or reject pending documents before they're added to records
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '2rem',
      }}>
        <StatCard label="Total Documents" value={stats.total} color="#0066cc" />
        <StatCard label="Pending Review" value={stats.pending} color="#ff9800" />
        <StatCard label="Approved" value={stats.approved} color="#00aa00" />
        <StatCard label="Rejected" value={stats.rejected} color="#cc0000" />
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
      }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>
            Status
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '13px',
            }}
          >
            <option value="all">All Documents</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '13px',
            }}
          >
            <option value="date">Newest First</option>
            <option value="amount">Amount</option>
            <option value="confidence">Confidence</option>
          </select>
        </div>
      </div>

      {/* Document List */}
      {loading ? (
        <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
          Loading documents...
        </p>
      ) : filteredDocs.length === 0 ? (
        <div style={{
          backgroundColor: '#f9f9f9',
          border: '2px dashed #ddd',
          borderRadius: '8px',
          padding: '3rem',
          textAlign: 'center',
          color: '#999',
        }}>
          <FileText size={32} style={{ margin: '0 auto 1rem', display: 'block' }} />
          <p style={{ fontSize: '14px' }}>No documents to review</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '12px',
        }}>
          {filteredDocs.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onSelect={setSelectedDoc}
              onRefresh={fetchDocuments}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedDoc && (
        <DocumentDetailModal
          doc={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onRefresh={fetchDocuments}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '1.5rem',
    }}>
      <p style={{ color: '#666', fontSize: '12px', margin: '0 0 0.5rem 0' }}>
        {label}
      </p>
      <p style={{ fontSize: '28px', fontWeight: '600', color: color, margin: 0 }}>
        {value}
      </p>
    </div>
  );
}

function DocumentCard({ doc, onSelect, onRefresh }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ff9800';
      case 'approved':
        return '#00aa00';
      case 'rejected':
        return '#cc0000';
      default:
        return '#666';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'pending':
        return '#fff3cd';
      case 'approved':
        return '#d4edda';
      case 'rejected':
        return '#f8d7da';
      default:
        return '#f5f5f5';
    }
  };

  return (
    <div
      onClick={() => onSelect(doc)}
      style={{
        backgroundColor: 'white',
        border: doc.status === 'pending' ? '2px solid #ff9800' : '1px solid #ddd',
        borderRadius: '8px',
        padding: '1.5rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>
            {doc.original_filename}
          </h4>
          <span
            style={{
              backgroundColor: getStatusBg(doc.status),
              color: getStatusColor(doc.status),
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
            }}
          >
            {doc.status}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
          {doc.document_type} • {new Date(doc.upload_date).toLocaleDateString()}
        </p>
      </div>

      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '0.75rem',
        borderRadius: '4px',
        marginBottom: '1rem',
        fontSize: '12px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ color: '#666' }}>Amount:</span>
          <span style={{ fontWeight: '600', color: '#0066cc' }}>
            R {parseFloat(doc.extracted_data.amount || 0).toLocaleString('en-ZA', {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ color: '#666' }}>Vendor:</span>
          <span style={{ fontWeight: '500' }}>{doc.extracted_data.vendor || '—'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#666' }}>Category:</span>
          <span style={{ fontWeight: '500' }}>{doc.extracted_data.category || 'Other'}</span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '11px',
        backgroundColor: doc.confidence > 0.95 ? '#d4edda' : '#fff3cd',
        color: doc.confidence > 0.95 ? '#155724' : '#856404',
        padding: '4px 8px',
        borderRadius: '4px',
        marginBottom: '1rem',
      }}>
        ⚡ {(doc.confidence * 100).toFixed(0)}% confident
      </div>

      {doc.status === 'pending' && (
        <button
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(doc);
          }}
        >
          <Eye size={14} />
          Review
        </button>
      )}
    </div>
  );
}

function DocumentDetailModal({ doc, onClose, onRefresh }) {
  const [action, setAction] = useState(null);
  const [linkedRecordId, setLinkedRecordId] = useState('');
  const [linkedRecordType, setLinkedRecordType] = useState('expense');
  const [processing, setProcessing] = useState(false);

  const handleAction = async (actionType) => {
    setProcessing(true);

    try {
      const response = await fetch('/api/approve-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pendingDocumentId: doc.id,
          action: actionType,
          linkedRecordId: actionType === 'approve' ? linkedRecordId : undefined,
          linkedRecordType: actionType === 'approve' ? linkedRecordType : undefined,
          userId: 1, // Get from auth context
        }),
      });

      if (response.ok) {
        onRefresh();
        onClose();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setProcessing(false);
    }
  };

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
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
            Review Document
          </h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#999',
            }}
          >
            ✕
          </button>
        </div>

        {/* Document Info */}
        <div style={{
          backgroundColor: '#f9f9f9',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '1.5rem',
        }}>
          <p style={{ margin: '0 0 1rem 0', fontSize: '14px', fontWeight: '600', color: '#333' }}>
            {doc.original_filename}
          </p>

          <table style={{ width: '100%', fontSize: '13px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '6px 0', color: '#666' }}>Document Type:</td>
                <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: '600' }}>
                  {doc.document_type}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '6px 0', color: '#666', borderTop: '1px solid #ddd' }}>Confidence:</td>
                <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: '600', borderTop: '1px solid #ddd' }}>
                  {(doc.confidence * 100).toFixed(0)}%
                </td>
              </tr>
              <tr>
                <td style={{ padding: '6px 0', color: '#666', borderTop: '1px solid #ddd' }}>Date:</td>
                <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: '600', borderTop: '1px solid #ddd' }}>
                  {doc.extracted_data.date}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '6px 0', color: '#666', borderTop: '1px solid #ddd' }}>Vendor:</td>
                <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: '600', borderTop: '1px solid #ddd' }}>
                  {doc.extracted_data.vendor}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '6px 0', color: '#666', borderTop: '1px solid #ddd' }}>Amount:</td>
                <td style={{
                  padding: '6px 0',
                  textAlign: 'right',
                  fontWeight: '600',
                  color: '#0066cc',
                  borderTop: '1px solid #ddd',
                }}>
                  R {parseFloat(doc.extracted_data.amount || 0).toLocaleString('en-ZA', {
                    minimumFractionDigits: 2,
                  })}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '6px 0', color: '#666', borderTop: '1px solid #ddd' }}>Category:</td>
                <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: '600', borderTop: '1px solid #ddd' }}>
                  {doc.extracted_data.category}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {doc.status === 'pending' && (
          <>
            {/* Link to Record */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                fontSize: '13px',
              }}>
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
                  fontSize: '13px',
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
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                disabled={processing}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: processing ? 'default' : 'pointer',
                  fontWeight: '500',
                  fontSize: '13px',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction('reject')}
                disabled={processing}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ffebee',
                  color: '#cc0000',
                  border: '1px solid #ffcccc',
                  borderRadius: '4px',
                  cursor: processing ? 'default' : 'pointer',
                  fontWeight: '500',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <XCircle size={14} />
                {processing ? 'Rejecting...' : 'Reject'}
              </button>
              <button
                onClick={() => handleAction('approve')}
                disabled={processing}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#00aa00',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: processing ? 'default' : 'pointer',
                  fontWeight: '500',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CheckCircle size={14} />
                {processing ? 'Approving...' : 'Approve'}
              </button>
            </div>
          </>
        )}

        {doc.status === 'approved' && (
          <div style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '1rem',
            borderRadius: '4px',
            fontSize: '13px',
          }}>
            ✓ Approved on {new Date(doc.approved_date).toLocaleDateString()}
          </div>
        )}

        {doc.status === 'rejected' && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '1rem',
            borderRadius: '4px',
            fontSize: '13px',
          }}>
            ✕ Rejected
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## STEP 2: API Route - Fetch All Pending Documents

Create: `app/api/pending-documents-all/route.js`

```javascript
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const documents = await prisma.pending_documents.findMany({
      orderBy: { upload_date: 'desc' },
      take: 1000, // Limit to last 1000
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

## STEP 3: Add Menu Item

In your navigation/sidebar, add link to:

```
/documents/approval-queue
```

---

## Features

✅ **Dashboard Stats** - See pending/approved/rejected count
✅ **Filter & Sort** - By status, date, amount, confidence
✅ **Card View** - Easy scanning of documents
✅ **Detail Modal** - Full review with extracted data
✅ **Approve/Reject** - One click actions
✅ **Link Records** - Optionally link to expense/income records
✅ **Professional UI** - Matches ProcessX design

---

## Workflow

```
1. Document uploaded to Expense page
   ↓
2. AI analyzes immediately
   ↓
3. Goes to approval queue (pending status)
   ↓
4. Manager reviews in dashboard
   ↓
5. Approves or rejects
   ↓
6. If approved → becomes document attachment
   ↓
7. If rejected → removed from queue
```

---

## That's It!

You now have:
- ✅ Document upload on expense pages
- ✅ Batch processing (multiple files, different types)
- ✅ Database storage
- ✅ Manual approval workflow
- ✅ Professional approval queue dashboard
- ✅ Full audit trail

Everything working with your ProcessX system!
