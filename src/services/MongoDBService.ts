import { connect, disconnect } from 'mongoose'
import { config } from '../consts/config'
import type { FirebaseCertificate } from '../interfaces/FirebaseCertificate'
import {
  MongoDBCertificateCategoryModel,
  type MongoDBCertificateCategory,
} from '../models/MongoDBCertificateCategoryModel'
import { getFirebaseCertificateCategories } from '../utils/getFirebaseCertificateCategories'

export class MongoDBService {
  private categoriesSet = new Set<string>()

  async connect(): Promise<void> {
    const connection = await connect(config.mongoDB.uri)
    await connection.syncIndexes()
    console.info('Connected to MongoDB')
    await this.loadCategories()
    console.info('MongoDBService initialized')
  }

  async disconnect(): Promise<void> {
    await disconnect()
    console.info('Disconnected from MongoDB')
  }

  async getAllCertificateCategories(): Promise<MongoDBCertificateCategory[]> {
    return MongoDBCertificateCategoryModel.find()
  }

  async insertCertificateCategories(firebaseCertificates?: FirebaseCertificate): Promise<void> {
    const firebaseCategories = getFirebaseCertificateCategories(firebaseCertificates)
    if (firebaseCategories.length === 0) {
      return
    }

    const mongoDBCategories: MongoDBCertificateCategory[] = firebaseCategories
      .filter((name) => !this.categoriesSet.has(name))
      .map((name) => ({ name }))

    if (mongoDBCategories.length === 0) {
      return
    }

    await MongoDBCertificateCategoryModel.insertMany(mongoDBCategories)
    this.addCategoriesToSet(mongoDBCategories)
  }

  private addCategoriesToSet(categories: MongoDBCertificateCategory[]): void {
    categories.forEach((category) => this.categoriesSet.add(category.name))
  }

  private async loadCategories(): Promise<void> {
    const categories = await this.getAllCertificateCategories()
    this.addCategoriesToSet(categories)
  }
}
