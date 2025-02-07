import { ObjectId } from 'mongodb'
type RefreshTokenType = {
  _id?: ObjectId
  user_id: ObjectId
  token: string
  created_at?: Date
}

/**
 *
 */
export default class RefreshToken {
  _id: ObjectId
  user_id: object
  token: string
  created_at: Date

  /**
   *
   * @param refreshToken
   */
  constructor(refreshToken: RefreshTokenType) {
    const date = new Date()
    this._id = refreshToken._id || new ObjectId()
    this.user_id = refreshToken.user_id
    this.token = refreshToken.token
    this.created_at = refreshToken.created_at || date
  }
}
