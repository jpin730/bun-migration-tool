import { connect, disconnect } from 'mongoose'
import { config } from '../consts/config'
import type { FirebaseCertification } from '../interfaces/FirebaseCertification'
import { MongoDBCategoryModel, type MongoDBCategory } from '../models/MongoDBCategoryModel'
import { getFirebaseCategories } from '../utils/getFirebaseCategories'

export class MongoDBService {
  private categoriesSet = new Set<string>()

  async connect(): Promise<void> {
    await connect(config.mongoDB.uri)
    console.log('Connected to MongoDB')
    await this.loadCategories()
    console.log('Categories loaded into memory')
    console.log(this.categoriesSet)
  }

  async disconnect(): Promise<void> {
    await disconnect()
    console.log('Disconnected from MongoDB')
  }

  async getAllCategories(): Promise<MongoDBCategory[]> {
    return MongoDBCategoryModel.find()
  }

  async insertCategories(firebaseCertification?: FirebaseCertification): Promise<void> {
    const firebaseCategories = getFirebaseCategories(firebaseCertification)
    if (firebaseCategories.length === 0) {
      return
    }

    const mongoDBCategories: MongoDBCategory[] = firebaseCategories
      .filter((name) => !this.categoriesSet.has(name))
      .map((name) => ({ name }))

    if (mongoDBCategories.length === 0) {
      return
    }

    await MongoDBCategoryModel.insertMany(mongoDBCategories)
    this.addCategoriesToSet(mongoDBCategories)
  }

  private addCategoriesToSet(categories: MongoDBCategory[]): void {
    categories.forEach((category) => this.categoriesSet.add(category.name))
  }

  private async loadCategories(): Promise<void> {
    const categories = await this.getAllCategories()
    this.addCategoriesToSet(categories)
  }
}
