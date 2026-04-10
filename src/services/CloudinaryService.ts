import {
  v2 as cloudinary,
  type AdminAndResourceOptions,
  type ResourceApiResponse,
} from 'cloudinary'
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

  async getImagesByCursor(nextCursor: string | null): Promise<ResourceApiResponse> {
    const CLOUDINARY_MAX_RESULTS = 500
    const options: AdminAndResourceOptions = {
      max_results: CLOUDINARY_MAX_RESULTS,
      asset_folder: this.assetFolder,
    }
    if (nextCursor) {
      options.next_cursor = nextCursor
    }
    return await cloudinary.api.resources(options)
  }

  async getAllImages(): Promise<ResourceApiResponse['resources']> {
    const images: ResourceApiResponse['resources'] =
      [] as unknown as ResourceApiResponse['resources']
    let nextCursor: string | null = null

    do {
      const { resources, next_cursor } = await this.getImagesByCursor(nextCursor)
      images.push(...resources)
      nextCursor = next_cursor ?? null
    } while (nextCursor !== null)
    return images
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
    console.info(`Deleted ${publicIds.length} images from Cloudinary`)
  }
}
