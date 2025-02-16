import express, { RequestHandler } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorsHandler } from './middlewares/error.middlewares'
import { ErrorRequestHandler } from 'express-serve-static-core'

const app = express()
const port = 3000

app.use(morgan('dev'))
app.use(helmet())
app.use(compression() as RequestHandler)

/**
 * Middlewar parses resquest body from 'json' type to 'javascript object'
 */
app.use(express.json())

/**
 * Middlewar handles global errors
 * Calls `defaultErrorsHandler` function if error is not caught by other middlewares or routes
 */
app.use(defaultErrorsHandler)

/**
 * Mount users routes under '/users' path
 */
app.use('/users', usersRouter)

/**
 * Initialize database connection
 * Logs any connection errors to console
 */
databaseService.connect().catch(console.dir)

/**
 * Start server & listen for incoming requests
 */
app.listen(port, () => {
  console.log('Server is running on port 3000')
})

