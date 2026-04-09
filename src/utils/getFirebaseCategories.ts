import type { FirebaseCertification } from '../interfaces/FirebaseCertification'

export const getFirebaseCategories = (firebaseCertification?: FirebaseCertification): string[] =>
  firebaseCertification?.category
    .split(',')
    .map((category) => category.trim())
    .filter((category) => category.length > 0) ?? []
