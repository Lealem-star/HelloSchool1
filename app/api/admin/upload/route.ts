import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export const runtime = 'nodejs'

const ALLOWED_MIME_TYPES = new Set([
  // Images
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  // Documents
  'application/pdf',
  // Videos
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-matroska',
  'video/ogg',
  'video/mpeg',
])

const MAX_FILE_SIZE = 250 * 1024 * 1024 // 250 MB for videos, manuals, and documents

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = String(formData.get('folder') || 'library').replace(/[^a-zA-Z0-9_-]/g, '')

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type (${file.type}). Supported types: PDF, MP4, WebM, JPEG, PNG, WebP.` },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 250MB limit.' },
        { status: 400 }
      )
    }

    // Determine extension
    let ext = path.extname(file.name).toLowerCase()
    if (!ext || ext.length > 5) {
      if (file.type === 'application/pdf') ext = '.pdf'
      else if (file.type === 'video/mp4') ext = '.mp4'
      else if (file.type === 'video/webm') ext = '.webm'
      else if (file.type === 'video/quicktime') ext = '.mov'
      else if (file.type === 'image/jpeg') ext = '.jpg'
      else if (file.type === 'image/png') ext = '.png'
      else if (file.type === 'image/webp') ext = '.webp'
      else if (file.type === 'image/gif') ext = '.gif'
      else ext = '.bin'
    }

    const randomId = crypto.randomBytes(8).toString('hex')
    const fileName = `${folder}-${Date.now()}-${randomId}${ext}`

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)
    await fs.promises.mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, fileName)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    await fs.promises.writeFile(filePath, buffer)

    const publicUrl = `/uploads/${folder}/${fileName}`

    return NextResponse.json({
      url: publicUrl,
      fileName,
      size: file.size,
      mimeType: file.type,
    })
  } catch (error: any) {
    console.error('Upload failed:', error)
    return NextResponse.json(
      { error: 'Upload failed: ' + error.message },
      { status: 500 }
    )
  }
}
