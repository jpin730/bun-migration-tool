import { connect, disconnect } from 'mongoose'
import { config } from '../consts/config'
import {
  MongoDBCertificateCategoryModel,
  type MongoDBCertificateCategory,
} from '../models/MongoDBCertificateCategoryModel'
import {
  MongoDBCertificateIssuerModel,
  type MongoDBCertificateIssuer,
} from '../models/MongoDBCertificateIssuerModel'
import { MongoDBCertificateModel, type MongoDBCertificate } from '../models/MongoDBCertificateModel'
import type { WithId } from '../types/WithId'

export class MongoDBService {
  private readonly certificateCategoriesMap = new Map<string, WithId<MongoDBCertificateCategory>>()
  private readonly certificateIssuersMap = new Map<string, WithId<MongoDBCertificateIssuer>>()
  private readonly certificatesMap = new Map<string, WithId<MongoDBCertificate>>()

  async connect(): Promise<void> {
    const connection = await connect(config.mongoDB.uri)
    await connection.syncIndexes()
    console.info('Connected to MongoDB')
    await this.loadCertificateCategories()
    await this.loadCertificateIssuers()
    await this.loadCertificates()
    console.info('MongoDBService initialized')
  }

  async disconnect(): Promise<void> {
    await disconnect()
    console.info('Disconnected from MongoDB')
  }

  // Certificate Categories Operations

  async getAllCertificateCategories(): Promise<WithId<MongoDBCertificateCategory>[]> {
    const categories = await MongoDBCertificateCategoryModel.find()
    return categories.map((c) => c.toJSON() as unknown as WithId<MongoDBCertificateCategory>)
  }

  async insertCertificateCategories(
    firebaseCertificates: string[],
  ): Promise<WithId<MongoDBCertificateCategory>[]> {
    if (firebaseCertificates.length === 0) {
      return []
    }
    const existingCategories: WithId<MongoDBCertificateCategory>[] = []
    const categoryNamesToInsert: string[] = []
    firebaseCertificates.forEach((name) =>
      this.certificateCategoriesMap.has(name)
        ? existingCategories.push(this.certificateCategoriesMap.get(name)!)
        : categoryNamesToInsert.push(name),
    )
    if (categoryNamesToInsert.length === 0) {
      return existingCategories
    }
    const insertedCategories =
      await MongoDBCertificateCategoryModel.insertMany(categoryNamesToInsert)
    insertedCategories.forEach((c) => {
      const category = c.toJSON() as unknown as WithId<MongoDBCertificateCategory>
      this.certificateCategoriesMap.set(category.name, category)
      existingCategories.push(category)
    })
    return existingCategories
  }

  private async loadCertificateCategories(): Promise<void> {
    const categories = await this.getAllCertificateCategories()
    categories.forEach((c) => this.certificateCategoriesMap.set(c.name, c))
  }

  // Certificate Issuers Operations

  async getAllCertificateIssuers(): Promise<WithId<MongoDBCertificateIssuer>[]> {
    const issuers = await MongoDBCertificateIssuerModel.find()
    return issuers.map((issuer) => issuer.toJSON() as unknown as WithId<MongoDBCertificateIssuer>)
  }

  async insertCertificateIssuers(name: string): Promise<WithId<MongoDBCertificateIssuer>> {
    if (this.certificateIssuersMap.has(name)) {
      return this.certificateIssuersMap.get(name)!
    }
    const insertedIssuer = await MongoDBCertificateIssuerModel.insertOne({ name })
    const issuer = insertedIssuer.toJSON() as unknown as WithId<MongoDBCertificateIssuer>
    this.certificateIssuersMap.set(issuer.name, issuer)
    return issuer
  }

  private async loadCertificateIssuers(): Promise<void> {
    const issuers = await this.getAllCertificateIssuers()
    issuers.forEach((i) => this.certificateIssuersMap.set(i.name, i))
  }

  // Certificates Operations

  async getAllCertificates(): Promise<WithId<MongoDBCertificate>[]> {
    const certificates = await MongoDBCertificateModel.find()
    return certificates.map((c) => c.toJSON() as unknown as WithId<MongoDBCertificate>)
  }

  async insertCertificate(certificate: MongoDBCertificate): Promise<boolean> {
    if (this.certificatesMap.has(certificate.legacyId)) {
      return false
    }

    const insertedCertificate = await MongoDBCertificateModel.insertOne(certificate)
    const cert = insertedCertificate.toJSON() as unknown as WithId<MongoDBCertificate>
    this.certificatesMap.set(cert.legacyId, cert)
    return true
  }

  private async loadCertificates(): Promise<void> {
    const certificates = await this.getAllCertificates()
    certificates.forEach((c) => this.certificatesMap.set(c.legacyId, c))
  }
}
