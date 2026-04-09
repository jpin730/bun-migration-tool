export const config = {
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID ?? '',
  },
  mongoDB: {
    uri: process.env.MONGO_DB_URI ?? '',
  },
} as const
