import { Schema, model, type InferSchemaType } from 'mongoose'
import { MongoDBModelName } from '../enums/MongoDBModelName'
import type { WithId } from '../types/WithId'

const certificateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  legacyId: {
    type: String,
    unique: true,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  issuedAt: {
    type: Date,
    required: true,
  },
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: MongoDBModelName.CertificateCategory,
    },
  ],
  issuer: {
    type: Schema.Types.ObjectId,
    ref: MongoDBModelName.CertificateIssuer,
    required: true,
    cast: true,
  },
})

export type MongoDBCertificate = InferSchemaType<typeof certificateSchema>

certificateSchema.set('toJSON', {
  transform: (_, ret): WithId<MongoDBCertificate> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, __v, ...rest } = ret
    const id = _id.toString()
    return { id, ...rest }
  },
})

export const MongoDBCertificateModel = model(
  MongoDBModelName.Certificate,
  certificateSchema,
  'certificates',
)
