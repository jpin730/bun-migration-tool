import { initializeApp } from 'firebase/app'
import {
  collection,
  documentId,
  Firestore,
  getDocsFromServer,
  getFirestore,
  orderBy,
  query,
} from 'firebase/firestore'
import { config } from '../consts/config'
import type { FirebaseCertificate } from '../interfaces/FirebaseCertificate'
import type { WithId } from '../types/WithId'

export class FirebaseService {
  private readonly db: Firestore
  private readonly projectId = config.firebase.projectId
  private readonly collections = {
    certifications: 'certifications',
  } as const

  constructor() {
    this.db = getFirestore(
      initializeApp({
        projectId: this.projectId,
      }),
    )
  }

  async getCertificates(): Promise<WithId<FirebaseCertificate>[]> {
    const q = query(collection(this.db, this.collections.certifications), orderBy(documentId()))
    const querySnapshot = await getDocsFromServer(q)
    return querySnapshot.docs.map((doc) => {
      const id = doc.id
      const data = doc.data() as FirebaseCertificate
      return { id, ...data }
    })
  }
}
