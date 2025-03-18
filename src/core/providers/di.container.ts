import { Container } from 'inversify'
import TYPES from './di.types'
import UserService from '~/modules/users/services/user.service'
import UserRepository from '~/modules/users/repositories/user.repository'
import UserController from '~/modules/users/presentation/http/user.controller'

const container = new Container()

container.bind<UserService>(TYPES.UserService).to(UserService)
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository)
container.bind<UserController>(TYPES.UserController).to(UserController)

export { container }
