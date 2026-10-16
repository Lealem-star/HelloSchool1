import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export const runtime = 'nodejs'

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
])

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload JPG, PNG, WebP, or PDF.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit.' },
        { status: 400 }
      )
    }

    // Determine extension safely
    let ext = path.extname(file.name).toLowerCase()
    if (!ext || ext.length > 5) {
      if (file.type === 'image/jpeg') ext = '.jpg'
      else if (file.type === 'image/png') ext = '.png'
      else if (file.type === 'image/webp') ext = '.webp'
      else if (file.type === 'application/pdf') ext = '.pdf'
      else ext = '.png'
    }

    const randomId = crypto.randomBytes(8).toString('hex')
    const fileName = `receipt-${Date.now()}-${randomId}${ext}`

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'receipts')
    await fs.promises.mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, fileName)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    await fs.promises.writeFile(filePath, buffer)

    const publicUrl = `/uploads/receipts/${fileName}`

    return NextResponse.json({
      url: publicUrl,
      fileName,
      size: file.size,
      mimeType: file.type,
    })
  } catch (error: any) {
    console.error('Receipt upload failed:', error)
    return NextResponse.json(
      { error: 'Upload failed: ' + (error?.message || 'Server error') },
      { status: 500 }
    )
  }
}
