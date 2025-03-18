export abstract class BaseService<T> {
  abstract create(data: Partial<T>): Promise<T>
  abstract findById(id: string): Promise<T | null>
  abstract update(id: string, data: Partial<T>): Promise<T | null>
  abstract delete(id: string): Promise<boolean>
}
