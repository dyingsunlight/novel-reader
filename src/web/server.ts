import "reflect-metadata"
import * as Express from 'express'
import Router from './router'
import PerformanceLogger from './middlewares/performer-logger'
import PreProcessing from './middlewares/pre-processing'
import AssetsHosting from './middlewares/assets-hosting'

const app = Express()


PreProcessing.setup(app)
PerformanceLogger.setup(app)
Router.setup(app)
AssetsHosting.setup(app)

app.listen(process.env['SERVER_PORT'] || 10009);

console.log(process.env['SERVER_READY_IDENTIFIER'] || '')

console.log('Server Ready!')
