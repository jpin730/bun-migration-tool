import { Types } from 'mongoose'
import type { FirebaseCertificate } from './interfaces/FirebaseCertificate'
import { CloudinaryService } from './services/CloudinaryService'
import { FirebaseService } from './services/FirebaseService'
import { MongoDBService } from './services/MongoDBService'
import type { WithId } from './types/WithId'
import { getFirebaseCertificateCategories } from './utils/getFirebaseCertificateCategories'
import { parseFirebaseCertificateId } from './utils/parseFirebaseCertificateId'

const firebaseService = new FirebaseService()
const mongoDBService = new MongoDBService()
const cloudinaryService = new CloudinaryService()

await mongoDBService.connect()

const firebaseCertificates = await firebaseService.getCertificates()

const firebaseCertificatesCount = firebaseCertificates.length

const migrateCertificate = async (certificate: WithId<FirebaseCertificate>): Promise<void> => {
  const firebaseCategories = getFirebaseCertificateCategories(certificate)
  const { issuer, name } = parseFirebaseCertificateId(certificate)

  const [insertedCategories, insertedIssuer, uploadedImage] = await Promise.all([
    mongoDBService.insertCertificateCategories(firebaseCategories),
    mongoDBService.insertCertificateIssuers(issuer),
    cloudinaryService.uploadImage(certificate.image),
  ])

  await mongoDBService.insertCertificate({
    name,
    legacyId: certificate.id,
    image: uploadedImage.optimizedUrl,
    issuedAt: new Date(certificate.date),
    categories: insertedCategories.map((c) => new Types.ObjectId(c.id)),
    issuer: new Types.ObjectId(insertedIssuer.id),
  })
}

for (let i = 0; i < firebaseCertificatesCount; i++) {
  const certificate = firebaseCertificates.at(i)!
  console.info(`Processing ${i + 1}/${firebaseCertificatesCount}`)
  if (mongoDBService.existsCertificate(certificate.id)) {
    continue
  }

  try {
    await migrateCertificate(certificate)
  } catch (error) {
    console.info('Error:', error)
  }
}

await mongoDBService.disconnect()

const cleanupCloudinary = async (): Promise<void> => {
  const mongoDBImagePublicIds = mongoDBService.getCertificateImagePublicIds()
  const cloudinaryImages = await cloudinaryService.getAllImages()
  const imagePublicIdsToDelete = cloudinaryImages
    .filter(({ public_id }) => !mongoDBImagePublicIds.includes(public_id))
    .map(({ public_id }) => public_id)

  await cloudinaryService.deleteImages(imagePublicIdsToDelete)
}

await cleanupCloudinary()

process.exit(0)
