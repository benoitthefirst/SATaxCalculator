'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/hooks/useToast'

interface TeamMember {
  id: string
  userId: string
  role: string
  joinedAt: string
  user: {
    email: string
    firstName: string
    lastName: string
    lastLoginAt: string | null
  }
}

interface PendingInvite {
  id: string
  email: string
  role: string
  expiresAt: string
  createdAt: string
  invitedBy: string
}

interface TeamResponse {
  members: TeamMember[]
  pendingInvites: PendingInvite[]
  currentUserRole: string
  companyId: string
  companyName: string
}

const roleLabels: Record<string, string> = {
  owner: 'Owner',
  admin: 'Admin',
  accountant: 'Accountant',
  viewer: 'Viewer',
}

const roleColors: Record<string, string> = {
  owner: 'bg-purple-100 text-purple-800',
  admin: 'bg-blue-100 text-blue-800',
  accountant: 'bg-green-100 text-green-800',
  viewer: 'bg-gray-100 text-gray-700',
}

export default function TeamSettingsPage() {
  const queryClient = useQueryClient()
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null)

  const { data, isLoading, error } = useQuery<TeamResponse>({
    queryKey: ['team'],
    queryFn: async () => {
      const response = await fetch('/api/team')
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to fetch team')
      }
      return response.json()
    },
  })

  const removeMember = useMutation({
    mutationFn: async (memberId: string) => {
      const response = await fetch(`/api/team/${memberId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to remove member')
      }
      return response.json()
    },
    onSuccess: (data) => {
      toast({ title: 'Member removed', description: data.message, variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['team'] })
      setMemberToRemove(null)
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const cancelInvite = useMutation({
    mutationFn: async (inviteId: string) => {
      const response = await fetch(`/api/team/invite?id=${inviteId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to cancel invitation')
      }
      return response.json()
    },
    onSuccess: () => {
      toast({ title: 'Invitation cancelled', variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['team'] })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const canManageTeam = data?.currentUserRole === 'owner' || data?.currentUserRole === 'admin'

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Failed to load team data. Please try again.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/settings"
              className="text-gray-500 hover:text-gray-700"
            >
              Settings
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">Team</span>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mt-2">Team Members</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage who has access to {data?.companyName}
          </p>
        </div>
        {canManageTeam && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-[#FF9500] to-[#FF6B00] text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Invite Member
          </button>
        )}
      </div>

      {/* Team Members List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            Active Members ({data?.members.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-100">
          {data?.members.map((member) => (
            <div
              key={member.id}
              className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-medium">
                  {member.user.firstName[0]}{member.user.lastName[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {member.user.firstName} {member.user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{member.user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${roleColors[member.role]}`}>
                  {roleLabels[member.role]}
                </span>

                {canManageTeam && member.role !== 'owner' && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingMember(member)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="Change role"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setMemberToRemove(member)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Remove member"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Invites */}
      {data?.pendingInvites && data.pendingInvites.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-amber-50">
            <h3 className="text-lg font-semibold text-amber-800">
              Pending Invitations ({data.pendingInvites.length})
            </h3>
          </div>

          <div className="divide-y divide-gray-100">
            {data.pendingInvites.map((invite) => (
              <div
                key={invite.id}
                className="px-6 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{invite.email}</p>
                    <p className="text-sm text-gray-500">
                      Invited by {invite.invitedBy} · Expires{' '}
                      {new Date(invite.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${roleColors[invite.role]}`}>
                    {roleLabels[invite.role]}
                  </span>

                  {canManageTeam && (
                    <button
                      onClick={() => cancelInvite.mutate(invite.id)}
                      disabled={cancelInvite.isPending}
                      className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Role Descriptions */}
      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Team Roles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-800">Owner:</span>
            <span className="text-blue-700 ml-1">Full access, can manage all settings and team members</span>
          </div>
          <div>
            <span className="font-medium text-blue-800">Admin:</span>
            <span className="text-blue-700 ml-1">Can manage data and invite team members</span>
          </div>
          <div>
            <span className="font-medium text-blue-800">Accountant:</span>
            <span className="text-blue-700 ml-1">Can view and manage financial data</span>
          </div>
          <div>
            <span className="font-medium text-blue-800">Viewer:</span>
            <span className="text-blue-700 ml-1">Read-only access to data</span>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          onClose={() => setShowInviteModal(false)}
          onSuccess={() => {
            setShowInviteModal(false)
            queryClient.invalidateQueries({ queryKey: ['team'] })
          }}
        />
      )}

      {/* Edit Role Modal */}
      {editingMember && (
        <EditRoleModal
          member={editingMember}
          currentUserRole={data?.currentUserRole || ''}
          onClose={() => setEditingMember(null)}
          onSuccess={() => {
            setEditingMember(null)
            queryClient.invalidateQueries({ queryKey: ['team'] })
          }}
        />
      )}

      {/* Remove Confirmation Modal */}
      {memberToRemove && (
        <ConfirmRemoveModal
          member={memberToRemove}
          isRemoving={removeMember.isPending}
          onClose={() => setMemberToRemove(null)}
          onConfirm={() => removeMember.mutate(memberToRemove.id)}
        />
      )}
    </div>
  )
}

function InviteModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('viewer')

  const invite = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to send invitation')
      }
      return response.json()
    },
    onSuccess: (data) => {
      toast({ title: 'Invitation sent', description: data.message, variant: 'success' })
      onSuccess()
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Invite Team Member</h2>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            invite.mutate()
          }}
          className="p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="admin">Admin</option>
              <option value="accountant">Accountant</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={invite.isPending}
              className="px-4 py-2 bg-gradient-to-br from-[#FF9500] to-[#FF6B00] text-white rounded-lg hover:shadow-lg disabled:opacity-50"
            >
              {invite.isPending ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EditRoleModal({
  member,
  currentUserRole,
  onClose,
  onSuccess,
}: {
  member: TeamMember
  currentUserRole: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [role, setRole] = useState(member.role)

  const updateRole = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/team/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to update role')
      }
      return response.json()
    },
    onSuccess: () => {
      toast({ title: 'Role updated', variant: 'success' })
      onSuccess()
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  // Admins can only set viewer/accountant, owners can set anything except owner
  const availableRoles = currentUserRole === 'owner'
    ? ['admin', 'accountant', 'viewer']
    : ['accountant', 'viewer']

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Change Role</h2>
          <p className="text-sm text-gray-500 mt-1">
            {member.user.firstName} {member.user.lastName}
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            updateRole.mutate()
          }}
          className="p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>
            <div className="space-y-2">
              {availableRoles.map((r) => (
                <label
                  key={r}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                    role === r ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={role === r}
                    onChange={(e) => setRole(e.target.value)}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  <span className="ml-3 font-medium text-gray-900">
                    {roleLabels[r]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateRole.isPending || role === member.role}
              className="px-4 py-2 bg-gradient-to-br from-[#FF9500] to-[#FF6B00] text-white rounded-lg hover:shadow-lg disabled:opacity-50"
            >
              {updateRole.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ConfirmRemoveModal({
  member,
  isRemoving,
  onClose,
  onConfirm,
}: {
  member: TeamMember
  isRemoving: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Remove Team Member</h3>
            <p className="text-sm text-gray-500">This action can be undone by re-inviting them.</p>
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to remove{' '}
          <strong>{member.user.firstName} {member.user.lastName}</strong> from the team?
          They will lose access to all company data.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isRemoving}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isRemoving ? 'Removing...' : 'Remove Member'}
          </button>
        </div>
      </div>
    </div>
  )
}
