import { Schema, model, type InferSchemaType } from 'mongoose'
import type { WithId } from '../types/WithId'

const certificateCategorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
})

export type MongoDBCertificateCategory = InferSchemaType<typeof certificateCategorySchema>

certificateCategorySchema.set('toJSON', {
  transform: (_, ret): WithId<MongoDBCertificateCategory> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, __v, ...rest } = ret
    const id = _id.toString()
    return { id, ...rest }
  },
})

export const MongoDBCertificateCategoryModel = model(
  'CertificateCategory',
  certificateCategorySchema,
  'certificate_categories',
)
