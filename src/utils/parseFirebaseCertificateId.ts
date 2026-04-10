import type { FirebaseCertificate } from '../interfaces/FirebaseCertificate'
import type { ParsedFirebaseCertificateId } from '../interfaces/ParsedFirebaseCertificateId'
import type { WithId } from '../types/WithId'

export const parseFirebaseCertificateId = (
  firebaseCertificate: WithId<FirebaseCertificate>,
): ParsedFirebaseCertificateId => {
  const id = firebaseCertificate.id.toUpperCase().replaceAll('_', '-')
  const matches = id.match(/^(\S+)-\d{4}-\d{2}-\d{2}-(\S+)$/)
  const [, issuer, name] = matches ?? []
  if (!issuer || !name) {
    throw new Error(`Invalid certificate ID format: ${firebaseCertificate.id}`)
  }
  return { issuer, name }
}
