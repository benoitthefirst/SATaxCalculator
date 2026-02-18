import { minioClient } from './minio'
import { UploadResult, ObjectStorageCannedACL } from '@/lib/types/upload'
import { Readable } from 'stream'

export class FileService {
  private readonly bucketName = process.env.MINIO_BUCKET_NAME || 'processx'
  private readonly appFolder = process.env.MINIO_APP_FOLDER || 'receipts'
  private readonly blobBaseUrl = process.env.MINIO_BLOB_BASE_URL || ''

  async uploadFile(
    buffer: Buffer,
    fileName: string,
    contentType: string,
    metaData?: Record<string, string>,
    acl: ObjectStorageCannedACL = ObjectStorageCannedACL.PublicRead
  ): Promise<UploadResult> {
    try {
      const filePath = `${this.appFolder}/${fileName}`

      // Convert buffer to stream
      const stream = Readable.from(buffer)

      // Prepare metadata
      const headers: Record<string, string> = {
        'x-amz-acl': acl,
        'Content-Type': contentType,
      }

      if (metaData) {
        Object.entries(metaData).forEach(([key, value]) => {
          headers[`x-amz-meta-${key}`] = value
        })
      }

      await minioClient.putObject(
        this.bucketName,
        filePath,
        stream,
        buffer.length,
        headers
      )

      const url = this.blobBaseUrl
        ? `${this.blobBaseUrl}/${this.bucketName}/${filePath}`
        : `http${process.env.MINIO_USE_SSL === 'true' ? 's' : ''}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${this.bucketName}/${filePath}`

      return {
        isSuccess: true,
        url,
      }
    } catch (error) {
      console.error('Upload error:', error)
      return {
        isSuccess: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      }
    }
  }

  async deleteFile(filePath: string): Promise<UploadResult> {
    try {
      // Extract the file path from full URL if provided
      const path = filePath.includes(this.bucketName)
        ? filePath.split(`${this.bucketName}/`)[1]
        : filePath

      await minioClient.removeObject(this.bucketName, path)
      return {
        isSuccess: true,
      }
    } catch (error) {
      console.error('Delete error:', error)
      return {
        isSuccess: false,
        error: error instanceof Error ? error.message : 'Delete failed',
      }
    }
  }

  generateFileName(originalName: string, prefix = 'receipt'): string {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = originalName.split('.').pop()
    return `${prefix}_${timestamp}_${randomString}.${extension}`
  }

  getFilePathFromUrl(url: string): string {
    // Extract file path from full URL
    if (url.includes(this.bucketName)) {
      return url.split(`${this.bucketName}/`)[1]
    }
    return url
  }
}
