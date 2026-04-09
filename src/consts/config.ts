export const config = {
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID ?? '',
  },
  mongoDB: {
    uri: process.env.MONGO_DB_URI ?? '',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    apiKey: process.env.CLOUDINARY_API_KEY ?? '',
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
  },
} as const
