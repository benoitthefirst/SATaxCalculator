import { redirect } from 'next/navigation'

export default function DocumentsPage() {
  redirect('/dashboard/documents/approval-queue')
}
