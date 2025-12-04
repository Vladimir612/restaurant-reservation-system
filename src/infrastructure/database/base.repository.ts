import { Model, Document, FilterQuery, Types } from 'mongoose';

export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return new this.model(data).save();
  }

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async findManyByIds(ids: (string | Types.ObjectId)[]): Promise<T[]> {
    const objectIds = ids.map((id) =>
      typeof id === 'string' ? new Types.ObjectId(id) : id,
    );

    return this.model.find({ _id: { $in: objectIds } }).exec();
  }

  async findManyByFilter(
    filter: FilterQuery<T>,
    selectFields?: string,
  ): Promise<T[]> {
    return this.model
      .find(filter)
      .select(selectFields ?? '')
      .exec();
  }

  async count(filter: FilterQuery<T> = {} as FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
}
