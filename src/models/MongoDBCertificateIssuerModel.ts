import { Schema, model, type InferSchemaType } from 'mongoose'
import { MongoDBModelName } from '../enums/MongoDBModelName'
import type { WithId } from '../types/WithId'

const certificateIssuerSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
})

export type MongoDBCertificateIssuer = InferSchemaType<typeof certificateIssuerSchema>

certificateIssuerSchema.set('toJSON', {
  transform: (_, ret): WithId<MongoDBCertificateIssuer> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, __v, ...rest } = ret
    const id = _id.toString()
    return { id, ...rest }
  },
})

export const MongoDBCertificateIssuerModel = model(
  MongoDBModelName.CertificateIssuer,
  certificateIssuerSchema,
  'certificate_issuers',
)
