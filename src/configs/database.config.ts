import { config } from 'dotenv'
import process from 'process'

config()

/**
 *
 */
export class DatabaseConfig {
  private static instance: DatabaseConfig | null = null

  /**
   *
   */
  private constructor() {}

  /**
   *
   */
  public static getInstance(): DatabaseConfig {
    if (this.instance == null) {
      this.instance = new DatabaseConfig()
    }
    return this.instance
  }

  /**
   *
   */
  public get dbName(): string {
    return process.env.DB_NAME || ''
  }

  /**
   *
   */
  public get mongodbURI() {
    return process.env.MONGODB_URI || 'mongodb://localhost:27017'
  }

  /**
   *
   */
  public get databaseName() {
    return process.env.DB_NAME || ''
  }
}

const databaseConfig = DatabaseConfig.getInstance()
console.log(databaseConfig.mongodbURI)
