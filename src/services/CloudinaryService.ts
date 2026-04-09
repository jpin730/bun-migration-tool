import { v2 as cloudinary, type ResourceApiResponse } from 'cloudinary'
import { config } from '../consts/config'
import type { CloudinaryUploadApiResponse } from '../interfaces/CloudinaryUploadApiResponse'

export class CloudinaryService {
  private readonly assetFolder = 'portfolio/certificates'

  constructor() {
    cloudinary.config({
      cloud_name: config.cloudinary.cloudName,
      api_key: config.cloudinary.apiKey,
      api_secret: config.cloudinary.apiSecret,
      secure: true,
    })
  }

  async getAllImages(): Promise<ResourceApiResponse['resources']> {
    const { resources } = await cloudinary.api.resources_by_asset_folder(this.assetFolder)
    return resources
  }

  async uploadImage(filePath: string): Promise<CloudinaryUploadApiResponse> {
    const response = await cloudinary.uploader.upload(filePath, {
      public_id: crypto.randomUUID(),
      asset_folder: this.assetFolder,
      format: 'webp',
    })
    const optimizedUrl = response.secure_url.replace('/upload/', '/upload/q_auto/f_auto/')
    return {
      ...response,
      optimizedUrl,
    }
  }

  async deleteImages(publicIds: string[]): Promise<void> {
    if (publicIds.length === 0) {
      return
    }
    await cloudinary.api.delete_resources(publicIds)
  }
}
