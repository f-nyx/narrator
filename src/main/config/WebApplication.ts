import * as path from "path"
import initRoutes from "../application/Routes"
import * as debugFactory from "debug"
import feathersExpress from "@feathersjs/express"
import feathers from "@feathersjs/feathers"
import "@feathersjs/transport-commons"
import * as express from "express"
import * as cors from "cors"

const debug = debugFactory("web")

export default class WebApplication {

    private readonly app = feathersExpress(feathers())

    configure() {
        debug("configuring web application")
        this.app.use("/static", express.static(path.join(__dirname, "../../web/public")))
        this.app.use(express.json())
        this.app.options("*", cors())
        this.app.use(cors())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.configure(feathersExpress.rest())
        this.app.use(feathersExpress.errorHandler())
        debug("initializing routes")
        initRoutes(this.app)
    }

    start() {
        debug("staring web application")
        this.app.listen(9000)
    }
}
