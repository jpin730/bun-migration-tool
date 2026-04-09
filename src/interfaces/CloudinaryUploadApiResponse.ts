import type { UploadApiResponse } from 'cloudinary'

export interface CloudinaryUploadApiResponse extends UploadApiResponse {
  optimizedUrl: string
}
