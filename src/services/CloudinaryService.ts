import { v2 as cloudinary } from 'cloudinary'
import { config } from '../consts/config'
import type { CloudinaryUploadApiResponse } from '../interfaces/CloudinaryUploadApiResponse'

export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: config.cloudinary.cloudName,
      api_key: config.cloudinary.apiKey,
      api_secret: config.cloudinary.apiSecret,
      secure: true,
    })
  }

  async uploadImage(filePath: string): Promise<CloudinaryUploadApiResponse> {
    const response = await cloudinary.uploader.upload(filePath, {
      public_id: crypto.randomUUID(),
      asset_folder: 'portfolio/certificates',
      format: 'webp',
    })
    const optimizedUrl = response.secure_url.replace('/upload/', '/upload/q_auto/f_auto/')
    return {
      ...response,
      optimizedUrl,
    }
  }
}
