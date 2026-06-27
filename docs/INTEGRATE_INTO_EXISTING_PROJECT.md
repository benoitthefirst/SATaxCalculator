# Add Document Analyzer to Your Existing Next.js Project

**Time: 10 minutes**

---

## Step 1: Install Dependencies (1 min)

```bash
npm install @anthropic-ai/sdk lucide-react
```

---

## Step 2: Set Environment Variable (1 min)

Add to your `.env.local`:

```env
CLAUDE_API_KEY=sk-ant-YOUR-API-KEY-HERE
```

Replace with your actual API key from console.anthropic.com

---

## Step 3: Create API Route (2 min)

Create: `app/api/analyze-document/route.js`

```javascript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function POST(request) {
  try {
    const { fileName, fileType, base64Content } = await request.json();

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
}`;

    const mediaType = fileType.includes("pdf")
      ? "application/pdf"
      : fileType.includes("png")
      ? "image/png"
      : "image/jpeg";

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1000,
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
                data: base64Content,
              },
            },
          ],
        },
      ],
    });

    const responseText = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const analysisResult = JSON.parse(jsonMatch[0]);

    return Response.json({
      success: true,
      fileName,
      ...analysisResult,
    });
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

## Step 4: Create Component (5 min)

Create: `app/components/DocumentAnalyzer.jsx`

```jsx
'use client';

import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function DocumentAnalyzer() {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setError(null);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target.result.split(',')[1];

        const response = await fetch('/api/analyze-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            base64Content: base64,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setResult(data);
        } else {
          setError(data.error || 'Analysis failed');
        }
        setAnalyzing(false);
      };

      reader.onerror = () => {
        setError('Failed to read file');
        setAnalyzing(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setError(err.message);
      setAnalyzing(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '1rem' }}>
        📄 Document Analyzer
      </h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Upload an invoice, receipt, bank statement, or payslip to extract data
      </p>

      <div style={{
        border: '2px dashed #ccc',
        borderRadius: '8px',
        padding: '2rem',
        textAlign: 'center',
        marginBottom: '2rem',
      }}>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="file-input"
        />
        <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
          <Upload size={32} style={{ margin: '0 auto 1rem', color: '#666' }} />
          <p style={{ fontSize: '16px', fontWeight: '500' }}>
            {file ? file.name : 'Click to upload a document'}
          </p>
          <p style={{ fontSize: '14px', color: '#999', marginTop: '0.5rem' }}>
            PDF, JPG, or PNG
          </p>
        </label>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!file || analyzing}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          fontWeight: '500',
          backgroundColor: !file || analyzing ? '#ccc' : '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: !file || analyzing ? 'default' : 'pointer',
          marginBottom: '2rem',
        }}
      >
        {analyzing ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
            Analyzing...
          </span>
        ) : (
          'Analyze Document'
        )}
      </button>

      {error && (
        <div style={{
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '6px',
          padding: '1rem',
          marginBottom: '2rem',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
        }}>
          <AlertCircle size={20} style={{ color: '#cc0000', marginTop: '2px', flexShrink: 0 }} />
          <p style={{ margin: 0, color: '#cc0000' }}>{error}</p>
        </div>
      )}

      {result && (
        <div style={{
          backgroundColor: '#f0f8ff',
          border: '1px solid #0066cc',
          borderRadius: '8px',
          padding: '1.5rem',
        }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', alignItems: 'center' }}>
            <CheckCircle size={24} style={{ color: '#00aa00' }} />
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
              Analysis Complete ✓
            </h2>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '14px', fontWeight: '600', color: '#666' }}>
              Document Type
            </h3>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: '500' }}>
              {result.documentType}
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '12px', color: '#999' }}>
              Confidence: {(result.confidence * 100).toFixed(0)}%
            </p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '14px', fontWeight: '600', color: '#666' }}>
              Extracted Information
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {Object.entries(result.extractedInfo || {}).map(([key, value]) => (
                  <tr key={key} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px 0', fontWeight: '500', color: '#333', textTransform: 'capitalize' }}>
                      {key.replace(/_/g, ' ')}:
                    </td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: '#0066cc', fontWeight: '500' }}>
                      {String(value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '6px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '14px', fontWeight: '600', color: '#666' }}>
              Suggested Category
            </h3>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: '500', color: '#0066cc' }}>
              {result.suggestedCategory}
            </p>
          </div>

          <button
            onClick={() => {
              setResult(null);
              setFile(null);
            }}
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '1.5rem',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            Analyze Another Document
          </button>
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

## Step 5: Add to Your Page (1 min)

In your page where you want it, import and use:

```jsx
import DocumentAnalyzer from '@/app/components/DocumentAnalyzer';

export default function YourPage() {
  return (
    <div>
      <DocumentAnalyzer />
    </div>
  );
}
```

---

## Step 6: Test It! (1 min)

```bash
npm run dev
```

Navigate to your page and:
1. Click upload
2. Select a document (invoice, receipt, etc.)
3. Click "Analyze Document"
4. See extracted data! ✨

---

## ✅ Done!

Your document analyzer is now integrated. Test with:
- Invoice images
- Receipt photos
- Bank statement screenshots
- Payslip PDFs

---

## Troubleshooting

**"API key not found"**
```
→ Check .env.local has key
→ Restart: npm run dev
```

**"Module not found"**
```bash
npm install @anthropic-ai/sdk lucide-react
```

**Spinner keeps spinning**
```
→ Press F12 (browser console)
→ Check for error messages
→ Check terminal for server errors
```

---

## Next: Integrate with Your App

Once working, add to your system:
- Save results to database
- Track categorizations
- Generate reports
- Link to your accounting app

---

That's it! You're ready to test! 🚀
