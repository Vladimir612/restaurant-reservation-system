import { Model, Document, FilterQuery, ClientSession, Types } from 'mongoose';

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

  async findManyByFilter(filter: FilterQuery<T>, selectFields?: string) {
    return this.model
      .find(filter)
      .select(selectFields ?? '')
      .exec();
  }

  async count(filter: FilterQuery<T> = {} as FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  // Transaction helpers
  createOne(data: Partial<T>, session: ClientSession) {
    return this.model.create([data], { session });
  }

  insertMany(data: Partial<T>[], session: ClientSession) {
    return this.model.insertMany(data, { session });
  }

  updateOne(filter: FilterQuery<T>, data: Partial<T>, session: ClientSession) {
    return this.model.updateOne(filter, data, { session });
  }

  async deleteOne(filter: FilterQuery<T>, session: ClientSession) {
    return this.model.deleteOne(filter).session(session);
  }
}
