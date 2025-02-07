import { Request, Response, NextFunction, RequestHandler } from 'express'
import core from 'express-serve-static-core'
export const wrapAsyncRequestHandler = <P = core.ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = any>(
  functionRequestHandler: RequestHandler<P, ResBody, ReqBody, ReqQuery>
) => {
  return async (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response, next: NextFunction) => {
    try {
      await functionRequestHandler(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
