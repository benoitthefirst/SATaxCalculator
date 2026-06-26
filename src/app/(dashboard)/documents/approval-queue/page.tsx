'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  Calendar,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  Upload,
  FileText,
  Filter,
  Plus,
  RefreshCw,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import DocumentApprovalModal from '@/components/documents/DocumentApprovalModal'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'

interface Transaction {
  date: string
  description: string
  reference?: string
  debit: number
  credit: number
  balance: number
  type: 'INCOME' | 'EXPENSE'
  category: string
}

interface BankInfo {
  bankName?: string
  accountNumber?: string
  accountHolder?: string
  statementPeriod?: {
    from: string
    to: string
  }
  openingBalance?: number
  closingBalance?: number
}

interface ExtractedData {
  date?: string
  vendor?: string
  amount?: number
  description?: string
  category?: string
  bankInfo?: BankInfo
  transactions?: Transaction[]
  summary?: {
    totalDebits: number
    totalCredits: number
    transactionCount: number
  }
}

interface PendingDocument {
  id: string
  document_type: string
  confidence: number
  extracted_data: ExtractedData
  original_filename: string
  file_url: string
  file_size: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  created_at: string
  approved_at?: string
  rejection_reason?: string
  notes?: string
  linked_expense_id?: string | null
  linked_income_id?: string | null
  uploader?: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
  approver?: {
    first_name: string
    last_name: string
  }
}

interface Stats {
  total: number
  pending: number
  approved: number
  rejected: number
}

type FilterStatus = 'all' | 'PENDING' | 'APPROVED' | 'REJECTED'
type SortField = 'name' | 'owner' | 'created_at' | 'updated_at' | 'status'
type SortOrder = 'asc' | 'desc'

const FILE_TYPE_ICONS: Record<string, { bg: string; text: string; label: string }> = {
  INVOICE: { bg: 'bg-red-100', text: 'text-red-600', label: 'INV' },
  RECEIPT: { bg: 'bg-orange-100', text: 'text-orange-600', label: 'RCT' },
  BANK_STATEMENT: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'BNK' },
  PAYSLIP: { bg: 'bg-purple-100', text: 'text-purple-600', label: 'PAY' },
  OTHER: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'DOC' },
}

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  PENDING: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  APPROVED: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  REJECTED: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
}

export default function ApprovalQueuePage() {
  const [documents, setDocuments] = useState<PendingDocument[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDocument, setSelectedDocument] = useState<PendingDocument | null>(null)
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view')
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; docId: string | null; docName: string }>({
    isOpen: false,
    docId: null,
    docName: '',
  })

  const fetchDocuments = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const url = new URL('/api/documents/pending', window.location.origin)
      if (filter !== 'all') {
        url.searchParams.set('status', filter)
      }

      const response = await fetch(url.toString())
      const data = await response.json()

      if (data.success) {
        setDocuments(data.documents)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [filter])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const handleApprove = async (id: string, notes?: string, editedData?: ExtractedData) => {
    const response = await fetch(`/api/documents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve', notes, editedData }),
    })

    if (!response.ok) {
      throw new Error('Failed to approve document')
    }

    fetchDocuments(true)
  }

  const handleReject = async (id: string, reason?: string) => {
    const response = await fetch(`/api/documents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject', rejectionReason: reason }),
    })

    if (!response.ok) {
      throw new Error('Failed to reject document')
    }

    fetchDocuments(true)
  }

  const handleCreateRecord = async (id: string) => {
    const response = await fetch(`/api/documents/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to create record')
    }

    fetchDocuments(true)
  }

  const openDeleteConfirm = (doc: PendingDocument) => {
    setDeleteConfirm({
      isOpen: true,
      docId: doc.id,
      docName: doc.original_filename,
    })
  }

  const closeDeleteConfirm = () => {
    setDeleteConfirm({ isOpen: false, docId: null, docName: '' })
  }

  const handleDelete = async () => {
    if (!deleteConfirm.docId) return

    setDeletingId(deleteConfirm.docId)
    try {
      const response = await fetch(`/api/documents/${deleteConfirm.docId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete document')
      }

      fetchDocuments(true)
      closeDeleteConfirm()
    } catch (error) {
      console.error('Error deleting document:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredDocuments.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredDocuments.map(d => d.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedIds(newSet)
  }

  // Filter and sort documents
  const filteredDocuments = documents
    .filter(doc => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        doc.original_filename.toLowerCase().includes(query) ||
        doc.document_type.toLowerCase().includes(query) ||
        doc.extracted_data.vendor?.toLowerCase().includes(query) ||
        `${doc.uploader?.first_name} ${doc.uploader?.last_name}`.toLowerCase().includes(query)
      )
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'name':
          comparison = a.original_filename.localeCompare(b.original_filename)
          break
        case 'owner':
          const ownerA = `${a.uploader?.first_name || ''} ${a.uploader?.last_name || ''}`
          const ownerB = `${b.uploader?.first_name || ''} ${b.uploader?.last_name || ''}`
          comparison = ownerA.localeCompare(ownerB)
          break
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
        case 'updated_at':
          const dateA = a.approved_at || a.created_at
          const dateB = b.approved_at || b.created_at
          comparison = new Date(dateA).getTime() - new Date(dateB).getTime()
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours} hrs ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return formatDate(dateString)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?'
  }

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-left font-semibold text-gray-500 hover:text-gray-700 transition-colors"
    >
      {children}
      <ArrowUpDown className={cn(
        "w-3.5 h-3.5",
        sortField === field ? "text-[#007AFF]" : "text-gray-400"
      )} />
    </button>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Documents</h1>
          <p className="mt-1 text-sm text-gray-500">
            Review, approve, and manage uploaded documents
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => fetchDocuments(true)}
            disabled={refreshing}
          >
            <RefreshCw className={cn('w-4 h-4 mr-2', refreshing && 'animate-spin')} />
            Refresh
          </Button>
          <Link href="/documents/analyze">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, vendor, or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* File Type Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              File type
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Date Filter */}
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Calendar className="w-4 h-4" />
            Date
          </button>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterStatus)}
              className="appearance-none flex items-center gap-2 px-4 py-2.5 pr-10 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Add Filter Button */}
          <button className="flex items-center gap-2 px-4 py-2.5 text-[#007AFF] text-sm font-medium hover:bg-blue-50 rounded-xl transition-colors">
            <Plus className="w-4 h-4" />
            Add filter
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-6 text-sm">
        <span className="text-gray-500">
          Showing <span className="font-semibold text-gray-900">{filteredDocuments.length}</span> of {stats.total} documents
        </span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-gray-600">{stats.pending} Pending</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-gray-600">{stats.approved} Approved</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-gray-600">{stats.rejected} Rejected</span>
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-[#007AFF] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Loading documents...</p>
            </div>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-base font-medium text-gray-900">No documents found</p>
            <p className="text-sm text-gray-500 mt-1">
              {searchQuery ? 'Try adjusting your search or filters' : 'Upload documents to get started'}
            </p>
            {!searchQuery && (
              <Link href="/documents/analyze" className="mt-4">
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filteredDocuments.length && filteredDocuments.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-[#007AFF] focus:ring-[#007AFF]/20"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <SortHeader field="name">Name</SortHeader>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <SortHeader field="owner">Owner</SortHeader>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <SortHeader field="created_at">Date Created</SortHeader>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <SortHeader field="updated_at">Last Updated</SortHeader>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <SortHeader field="status">Status</SortHeader>
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDocuments.map((doc) => {
                const fileType = FILE_TYPE_ICONS[doc.document_type] || FILE_TYPE_ICONS.OTHER
                const statusStyle = STATUS_STYLES[doc.status]
                const lastUpdated = doc.approved_at || doc.created_at
                const updatedBy = doc.approver
                  ? `${doc.approver.first_name} ${doc.approver.last_name}`
                  : doc.uploader
                    ? `${doc.uploader.first_name} ${doc.uploader.last_name}`
                    : 'Unknown'

                return (
                  <tr
                    key={doc.id}
                    className={cn(
                      "hover:bg-gray-50/50 transition-colors",
                      selectedIds.has(doc.id) && "bg-blue-50/50"
                    )}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(doc.id)}
                        onChange={() => toggleSelect(doc.id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#007AFF] focus:ring-[#007AFF]/20"
                      />
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                          fileType.bg
                        )}>
                          <span className={cn("text-xs font-bold", fileType.text)}>
                            {fileType.label}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                            {doc.original_filename}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(doc.file_size)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-white">
                            {getInitials(doc.uploader?.first_name, doc.uploader?.last_name)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-900">
                          {doc.uploader ? `${doc.uploader.first_name} ${doc.uploader.last_name}` : 'Unknown'}
                        </span>
                      </div>
                    </td>

                    {/* Date Created */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">
                        {formatDate(doc.created_at)}
                      </span>
                    </td>

                    {/* Last Updated */}
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600">
                        <span>{formatRelativeTime(lastUpdated)}</span>
                        <span className="text-gray-400"> • </span>
                        <span className="text-gray-500">{updatedBy}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                        statusStyle.bg,
                        statusStyle.text
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", statusStyle.dot)}></span>
                        {doc.status === 'PENDING' ? 'Pending' : doc.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {/* View - always available */}
                        <button
                          onClick={() => {
                            setModalMode('view')
                            setSelectedDocument(doc)
                          }}
                          className="p-2 text-gray-400 hover:text-[#007AFF] hover:bg-blue-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {/* Edit - only for pending documents */}
                        <button
                          onClick={() => {
                            setModalMode('edit')
                            setSelectedDocument(doc)
                          }}
                          disabled={doc.status !== 'PENDING'}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            doc.status === 'PENDING'
                              ? "text-gray-400 hover:text-amber-600 hover:bg-amber-50"
                              : "text-gray-200 cursor-not-allowed"
                          )}
                          title={doc.status === 'PENDING' ? "Edit" : "Cannot edit processed documents"}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {/* Delete - only for pending documents */}
                        <button
                          onClick={() => openDeleteConfirm(doc)}
                          disabled={deletingId === doc.id || doc.status !== 'PENDING'}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            doc.status === 'PENDING'
                              ? "text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                              : "text-gray-200 cursor-not-allowed"
                          )}
                          title={doc.status === 'PENDING' ? "Delete" : "Cannot delete processed documents"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Quick Stats Footer */}
      {filteredDocuments.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            {selectedIds.size > 0 && (
              <span className="text-[#007AFF] font-medium">
                {selectedIds.size} document{selectedIds.size > 1 ? 's' : ''} selected
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button className="hover:text-gray-700 transition-colors">
              Previous
            </button>
            <span className="px-3 py-1 bg-[#007AFF] text-white rounded-lg text-xs font-medium">
              1
            </span>
            <button className="hover:text-gray-700 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {selectedDocument && (
        <DocumentApprovalModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onCreateRecord={handleCreateRecord}
          mode={modalMode}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={closeDeleteConfirm}
        onConfirm={handleDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${deleteConfirm.docName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deletingId !== null}
      />
    </div>
  )
}
