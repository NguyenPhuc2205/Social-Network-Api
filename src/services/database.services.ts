import { Collection, Db, MongoClient, ServerApiVersion } from 'mongodb'
import 'dotenv/config'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { config } from 'dotenv'
import Follower from '~/models/schemas/Follower.schema'

config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.m05l3dg.mongodb.net/?retryWrites=true&w=majority&appName=twitter`

/**
 *
 */
class DatabaseService {
  private static instance: DatabaseService | null = null
  private static lock = new Object()
  private client: MongoClient
  private db: Db

  /**
   *
   */
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }
  /**
   *
   */
  async connect() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await this.client.connect()
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error)
      throw error
    }
  }
  /**
   *
   */
  async disconnect() {
    try {
      await this.client.close()
      console.log('Disconnected from MongoDB!')
    } catch (error) {
      console.error('Failed to disconnect from MongoDB:', error)
      throw error
    }
  }
  /**
   *
   */
  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }
  /**
   *
   */
  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }
  /**
   *
   */
  get followers(): Collection<Follower> {
    return this.db.collection(process.env.DB_FOLLOWERS_COLLECTION as string)
  }
}
const databaseService = new DatabaseService()
export default databaseService
