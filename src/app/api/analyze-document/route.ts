import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getActiveCompanyForUser } from '@/lib/company-context'
import { FileService } from '@/lib/fileService'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
})

const fileService = new FileService()

type ImageMediaType = 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp'

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const companyId = await getActiveCompanyForUser(session.user.id)

    if (!companyId) {
      return NextResponse.json(
        { error: 'No active company found' },
        { status: 400 }
      )
    }

    const { fileName, fileType, base64Content, saveToDatabase = true } = await request.json()

    if (!fileName || !fileType || !base64Content) {
      return NextResponse.json(
        { error: 'Missing required fields: fileName, fileType, base64Content' },
        { status: 400 }
      )
    }

    const analysisPrompt = `You are a financial document analyzer for South African accounting.

Analyze this financial document and extract information.

For BANK STATEMENTS, extract ALL individual transactions in a transactions array.
For other documents (INVOICE, RECEIPT, etc.), use the extractedInfo format.

Return ONLY valid JSON with no other text.

For BANK STATEMENTS:
{
  "documentType": "BANK_STATEMENT",
  "confidence": 0.95,
  "bankInfo": {
    "bankName": "Bank Name",
    "accountNumber": "****1234",
    "accountHolder": "Account Holder Name",
    "statementPeriod": {
      "from": "YYYY-MM-DD",
      "to": "YYYY-MM-DD"
    },
    "openingBalance": 50000.00,
    "closingBalance": 75000.00
  },
  "transactions": [
    {
      "date": "YYYY-MM-DD",
      "description": "Transaction description",
      "reference": "REF123",
      "debit": 0,
      "credit": 15000.00,
      "balance": 65000.00,
      "type": "INCOME|EXPENSE",
      "category": "Service Revenue|Salary|Office|Travel|Utilities|Marketing|Equipment|Bank Charges|Other"
    }
  ],
  "summary": {
    "totalDebits": 25000.00,
    "totalCredits": 50000.00,
    "transactionCount": 15
  },
  "notes": "any relevant notes"
}

For OTHER DOCUMENTS (INVOICE, RECEIPT, PAYSLIP, EXPENSE_REPORT):
{
  "documentType": "INVOICE|RECEIPT|PAYSLIP|EXPENSE_REPORT|OTHER",
  "confidence": 0.95,
  "extractedInfo": {
    "date": "YYYY-MM-DD",
    "vendor": "vendor name",
    "amount": 1000,
    "description": "description",
    "category": "Office|Travel|Utilities|Marketing|Equipment|Salary|Other"
  },
  "suggestedCategory": "Office|Travel|Utilities|Marketing|Equipment|Salary|Other",
  "notes": "notes"
}`

    const isPdf = fileType.includes('pdf')

    // Build the content array based on file type
    const contentBlocks: Anthropic.MessageCreateParams['messages'][0]['content'] = [
      { type: 'text', text: analysisPrompt },
    ]

    if (isPdf) {
      contentBlocks.push({
        type: 'document',
        source: {
          type: 'base64',
          media_type: 'application/pdf',
          data: base64Content,
        },
      })
    } else {
      const imageMediaType: ImageMediaType = fileType.includes('png')
        ? 'image/png'
        : 'image/jpeg'

      contentBlocks.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: imageMediaType,
          data: base64Content,
        },
      })
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: contentBlocks,
        },
      ],
    })

    const responseText =
      response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'Failed to parse analysis result' },
        { status: 500 }
      )
    }

    const analysisResult = JSON.parse(jsonMatch[0])
    const processingTime = Date.now() - startTime
    const tokensUsed = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0)

    // If saveToDatabase is true, upload file and save to pending_documents
    let pendingDocumentId: string | null = null
    let fileUrl: string | null = null

    if (saveToDatabase) {
      // Upload file to MinIO
      const buffer = Buffer.from(base64Content, 'base64')
      const generatedFileName = fileService.generateFileName(fileName, 'document')

      const uploadResult = await fileService.uploadFile(
        buffer,
        generatedFileName,
        fileType,
        {
          'original-filename': fileName,
          'company-id': companyId,
          'uploaded-by': session.user.id,
        }
      )

      if (!uploadResult.isSuccess) {
        return NextResponse.json(
          { error: 'Failed to upload file' },
          { status: 500 }
        )
      }

      fileUrl = uploadResult.url!

      // Build extracted_data based on document type
      const extractedData = analysisResult.documentType === 'BANK_STATEMENT'
        ? {
            bankInfo: analysisResult.bankInfo,
            transactions: analysisResult.transactions,
            summary: analysisResult.summary,
          }
        : analysisResult.extractedInfo || {}

      // Create pending document record
      const pendingDocument = await prisma.pendingDocument.create({
        data: {
          company_id: companyId,
          document_type: analysisResult.documentType,
          confidence: analysisResult.confidence,
          extracted_data: extractedData,
          original_filename: fileName,
          file_url: fileUrl,
          file_size: buffer.length,
          uploaded_by: session.user.id,
        },
      })

      pendingDocumentId = pendingDocument.id

      // Create analysis log
      await prisma.documentAnalysisLog.create({
        data: {
          pending_document_id: pendingDocument.id,
          analysis_result: analysisResult,
          confidence: analysisResult.confidence,
          tokens_used: tokensUsed,
          model_used: 'claude-sonnet-4-5',
          processing_time_ms: processingTime,
        },
      })
    }

    return NextResponse.json({
      success: true,
      fileName,
      pendingDocumentId,
      fileUrl,
      ...analysisResult,
    })
  } catch (error) {
    console.error('Document analysis error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed',
      },
      { status: 500 }
    )
  }
}
