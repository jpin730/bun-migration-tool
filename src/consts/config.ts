export const config = {
  source: {
    projectId: process.env.SOURCE_PROJECT_ID ?? '',
    collectionName: process.env.SOURCE_COLLECTION_NAME ?? '',
  },
} as const
