import { initializeApp } from 'firebase/app'
import { collection, Firestore, getDocsFromServer, getFirestore } from 'firebase/firestore'
import { config } from '../consts/config'
import type { SourceDocument } from '../interfaces/SourceDocument'
import type { WithId } from '../types/WithId'

export class SourceService {
  private readonly db: Firestore
  private readonly projectId = config.source.projectId
  private readonly collectionName = config.source.collectionName

  constructor() {
    this.db = getFirestore(
      initializeApp({
        projectId: this.projectId,
      }),
    )
  }

  async getSourceDocuments(): Promise<WithId<SourceDocument>[]> {
    const querySnapshot = await getDocsFromServer(collection(this.db, this.collectionName))
    return querySnapshot.docs.map((doc) => {
      const id = doc.id
      const data = doc.data() as SourceDocument
      return { id, ...data }
    })
  }
}
