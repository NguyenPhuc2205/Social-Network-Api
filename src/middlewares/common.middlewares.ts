import { Request, Response, NextFunction } from 'express'
type FilterKeys<T> = Array<keyof T>
export const filterMiddleware = <T>(filterKeys: FilterKeys<T>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const filteredData = filterKeys.reduce((acc, currentKey) => {
      if (req.body[currentKey]) acc[currentKey] = req.body[currentKey]
      return acc
    }, {} as Partial<T>) //Record<keyof T, any>
    req.body = filteredData //assign new object with suitable key and value
    next()
  }
}

//type newType = Partial<oldType> => newType have optional props
