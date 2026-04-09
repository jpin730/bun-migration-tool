import { Schema, model, type InferSchemaType } from 'mongoose'
import type { WithId } from '../types/WithId'

const categorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
})

export type MongoDBCategory = InferSchemaType<typeof categorySchema>

categorySchema.set('toJSON', {
  transform: (_, ret): WithId<MongoDBCategory> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, __v, ...rest } = ret
    const id = _id.toString()
    return { id, ...rest }
  },
})

export const MongoDBCategoryModel = model('Category', categorySchema)
