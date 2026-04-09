import { FirebaseService } from './services/FirebaseService'
import { MongoDBService } from './services/MongoDBService'

const firebaseService = new FirebaseService()
const mongoDBService = new MongoDBService()

await mongoDBService.connect()

const firebaseCertificates = await firebaseService.getCertificates()
await mongoDBService.insertCertificateCategories(firebaseCertificates.at(0))

await mongoDBService.disconnect()

process.exit(0)
