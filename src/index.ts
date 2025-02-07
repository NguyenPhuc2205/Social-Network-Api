import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorsHandler } from './middlewares/error.middlewares'
import { EmailRequestBody, sendingEmail } from './utils/email'

const app = express()
const port = 3000

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

import { Request, Response } from 'express'
import core from 'express-serve-static-core'
app.post('/email/send', (req: Request<core.ParamsDictionary, any, EmailRequestBody>, res) => {
  sendingEmail(req, res)
})
