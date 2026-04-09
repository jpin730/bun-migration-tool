import { CloudinaryService } from './services/CloudinaryService'
import { FirebaseService } from './services/FirebaseService'
import { MongoDBService } from './services/MongoDBService'
import { getFirebaseCertificateCategories } from './utils/getFirebaseCertificateCategories'
import { parseFirebaseCertificateId } from './utils/parseFirebaseCertificateId'

const firebaseService = new FirebaseService()
const mongoDBService = new MongoDBService()
const cloudinaryService = new CloudinaryService()

await mongoDBService.connect()

const firebaseCertificates = await firebaseService.getCertificates()

const certificate = firebaseCertificates.at(0)
if (certificate) {
  const firebaseCategories = getFirebaseCertificateCategories(certificate)
  const { issuer } = parseFirebaseCertificateId(certificate)

  await Promise.all([
    mongoDBService.insertCertificateCategories(firebaseCategories),
    mongoDBService.insertCertificateIssuers(issuer),
  ])

  await cloudinaryService.uploadImage(certificate.image)
}
await mongoDBService.disconnect()

process.exit(0)
