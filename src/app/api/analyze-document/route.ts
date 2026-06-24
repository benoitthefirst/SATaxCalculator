import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
})

type ImageMediaType = 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp'
type DocumentMediaType = 'application/pdf'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { fileName, fileType, base64Content } = await request.json()

    if (!fileName || !fileType || !base64Content) {
      return NextResponse.json(
        { error: 'Missing required fields: fileName, fileType, base64Content' },
        { status: 400 }
      )
    }

    const analysisPrompt = `You are a financial document analyzer for South African accounting.

Analyze this financial document and extract information.

Return ONLY valid JSON with no other text:
{
  "documentType": "INVOICE|RECEIPT|BANK_STATEMENT|PAYSLIP|EXPENSE_REPORT|OTHER",
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
      // For PDFs, use document type
      contentBlocks.push({
        type: 'document',
        source: {
          type: 'base64',
          media_type: 'application/pdf' as DocumentMediaType,
          data: base64Content,
        },
      })
    } else {
      // For images, use image type
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
      max_tokens: 1000,
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

    return NextResponse.json({
      success: true,
      fileName,
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
