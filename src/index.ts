import { FirebaseService } from './services/FirebaseService'

const firebaseService = new FirebaseService()

const firebaseCertifications = await firebaseService.getCertifications()

console.table(firebaseCertifications)
