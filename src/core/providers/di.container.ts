
import { Container } from 'inversify';
import { DI_TYPES } from './di.types';
import { WinstonLogger } from '~/infrastructure/loggers/winston.log';

export const createDIContainer = (): Container => {
    const container = new Container({
        defaultScope: "Singleton",
    })

    container.bind(DI_TYPES.Logger).to(WinstonLogger).inSingletonScope()

    return container
}
