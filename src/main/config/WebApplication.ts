import * as express from "express"
import {Express} from "express"
import * as path from "path"
import initRoutes from "../application/Routes"
import * as debugFactory from "debug"

const debug = debugFactory("web")

export default class WebApplication {

    private readonly app: Express = express()

    configure() {
        debug("configuring web application")
        this.app.use("/static", express.static(path.join(__dirname, "../../web/public")))
        debug("initializing routes")
        initRoutes(this.app)
    }

    start() {
        debug("staring web application")
        this.app.listen(9000)
    }
}
