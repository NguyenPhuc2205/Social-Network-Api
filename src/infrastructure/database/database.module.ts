import { Container } from 'inversify'
import { BindingCallback, DI_TYPES } from '~/core/providers'
import { DatabaseConnection } from '~/infrastructure/database/database.connection'
import { DatabaseService } from '~/infrastructure/database/database.services'

export const bindDatabaseModule: BindingCallback = (container: Container): void => {
  container.bind(DI_TYPES.IDatabaseConnection).to(DatabaseConnection).inSingletonScope()

  // Wrapper to access collection, not contains state => Singleton
  container.bind(DI_TYPES.IDatabaseService).to(DatabaseService).inSingletonScope()
}
