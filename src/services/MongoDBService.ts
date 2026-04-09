import { connect, disconnect } from 'mongoose'
import { config } from '../consts/config'
import {
  MongoDBCertificateCategoryModel,
  type MongoDBCertificateCategory,
} from '../models/MongoDBCertificateCategoryModel'
import { MongoDBCertificateIssuerModel } from '../models/MongoDBCertificateIssuerModel'

export class MongoDBService {
  private readonly certificateCategoriesSet = new Set<string>()
  private readonly certificateIssuersSet = new Set<string>()

  async connect(): Promise<void> {
    const connection = await connect(config.mongoDB.uri)
    await connection.syncIndexes()
    console.info('Connected to MongoDB')
    await this.loadCertificateCategories()
    await this.loadIssuers()
    console.info('MongoDBService initialized')
  }

  async disconnect(): Promise<void> {
    await disconnect()
    console.info('Disconnected from MongoDB')
  }

  // Certificate Categories Operations

  async getAllCertificateCategories(): Promise<MongoDBCertificateCategory[]> {
    return MongoDBCertificateCategoryModel.find()
  }

  async insertCertificateCategories(firebaseCertificates: string[]): Promise<void> {
    if (firebaseCertificates.length === 0) {
      return
    }
    const mongoDBCategories: MongoDBCertificateCategory[] = firebaseCertificates
      .filter((name) => !this.certificateCategoriesSet.has(name))
      .map((name) => ({ name }))
    if (mongoDBCategories.length === 0) {
      return
    }
    await MongoDBCertificateCategoryModel.insertMany(mongoDBCategories)
    mongoDBCategories.forEach((category) => this.certificateCategoriesSet.add(category.name))
  }

  private async loadCertificateCategories(): Promise<void> {
    const categories = await this.getAllCertificateCategories()
    categories.forEach((category) => this.certificateCategoriesSet.add(category.name))
  }

  // Certificate Issuers Operations

  async getAllCertificateIssuers(): Promise<string[]> {
    return MongoDBCertificateIssuerModel.find()
  }

  async insertCertificateIssuers(name: string): Promise<void> {
    if (this.certificateIssuersSet.has(name)) {
      return
    }
    await MongoDBCertificateIssuerModel.insertOne({ name })
    this.certificateIssuersSet.add(name)
  }

  private async loadIssuers(): Promise<void> {
    const issuers = await this.getAllCertificateIssuers()
    issuers.forEach((issuer) => this.certificateIssuersSet.add(issuer))
  }
}
