import { CloudinaryService } from './services/CloudinaryService'
import { FirebaseService } from './services/FirebaseService'
import { MongoDBService } from './services/MongoDBService'

const firebaseService = new FirebaseService()
const mongoDBService = new MongoDBService()
const cloudinaryService = new CloudinaryService()

await mongoDBService.connect()

const firebaseCertificates = await firebaseService.getCertificates()

const certificate = firebaseCertificates.at(0)
if (certificate) {
  await mongoDBService.insertCertificateCategories(certificate)
  await cloudinaryService.uploadImage(certificate.image)
}
await mongoDBService.disconnect()

process.exit(0)
