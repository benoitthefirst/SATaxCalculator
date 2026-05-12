'use client'

import { useState } from 'react'
import { toast } from '@/hooks/useToast'

interface ExportButtonProps {
  href: string
  filename?: string
  children: React.ReactNode
  className?: string
}

export function ExportButton({ href, filename, children, className }: ExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleExport = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(href)

      // Check if the response is JSON (error) or CSV (success)
      const contentType = response.headers.get('content-type') || ''

      if (contentType.includes('application/json')) {
        // This is an error response
        const data = await response.json()

        if (data.upgradeRequired) {
          toast({
            title: 'Feature not available',
            description: data.message || 'This feature requires a higher plan. Upgrade to access.',
            variant: 'warning',
          })
        } else {
          toast({
            title: 'Export failed',
            description: data.error || 'An error occurred while exporting.',
            variant: 'destructive',
          })
        }
        return
      }

      // Success - download the file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url

      // Get filename from Content-Disposition header or use default
      const disposition = response.headers.get('content-disposition')
      let downloadFilename = filename || 'export.csv'
      if (disposition) {
        const match = disposition.match(/filename="(.+)"/)
        if (match) {
          downloadFilename = match[1]
        }
      }

      a.download = downloadFilename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: 'Export complete',
        description: `Downloaded ${downloadFilename}`,
        variant: 'success',
      })
    } catch {
      toast({
        title: 'Export failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <a
      href={href}
      onClick={handleExport}
      className={className}
      aria-disabled={isLoading}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Exporting...
        </>
      ) : (
        children
      )}
    </a>
  )
}
