export interface UploadResult {
  isSuccess: boolean
  url?: string
  error?: string
}

export enum ObjectStorageCannedACL {
  Private = 'private',
  PublicRead = 'public-read',
  PublicReadWrite = 'public-read-write',
  AuthenticatedRead = 'authenticated-read',
}
