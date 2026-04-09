import { Types } from 'mongoose'
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

  const [insertedCategories, insertedIssuer, uploadedImage] = await Promise.all([
    mongoDBService.insertCertificateCategories(firebaseCategories),
    mongoDBService.insertCertificateIssuers(issuer),
    cloudinaryService.uploadImage(certificate.image),
  ])

  await mongoDBService.insertCertificate({
    name: certificate.category,
    legacyId: certificate.id,
    image: uploadedImage.optimizedUrl,
    issuedAt: new Date(certificate.date),
    categories: insertedCategories.map((c) => new Types.ObjectId(c.id)),
    issuer: new Types.ObjectId(insertedIssuer.id),
  })
}

await mongoDBService.disconnect()

const mongoDBImagePublicIds = mongoDBService.getCertificateImagePublicIds()
const cloudinaryImages = await cloudinaryService.getAllImages()
const imagePublicIdsToDelete = cloudinaryImages
  .filter(({ public_id }) => !mongoDBImagePublicIds.includes(public_id))
  .map(({ public_id }) => public_id)

await cloudinaryService.deleteImages(imagePublicIdsToDelete)

process.exit(0)
