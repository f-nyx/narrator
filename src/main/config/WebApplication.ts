import {Express} from "express"
import * as express from "express"
import * as path from "path"
import TransactionMiddleware from "../application/TransactionMiddleware"
import initRoutes from "../application/Routes"

export default class WebApplication {
    readonly app: Express = express()

    configure() {
        this.app.use("/static", express.static(path.join(__dirname, "../../web/public")))
        this.app.use(TransactionMiddleware.install())

        initRoutes()
    }

    start() {
        this.app.listen(9000)
    }
}
