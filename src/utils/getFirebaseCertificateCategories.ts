import type { FirebaseCertificate } from '../interfaces/FirebaseCertificate'

export const getFirebaseCertificateCategories = (
  firebaseCertificate?: FirebaseCertificate,
): string[] =>
  firebaseCertificate?.category
    .split(',')
    .map((category) => category.trim())
    .filter((category) => category.length > 0) ?? []
