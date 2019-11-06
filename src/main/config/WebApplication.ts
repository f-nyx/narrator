import * as path from "path"
import initRoutes from "../application/Routes"
import * as debugFactory from "debug"
import feathers from "@feathersjs/feathers"
import "@feathersjs/transport-commons"
import * as express from "express"
import feathersExpress from "@feathersjs/express"

const debug = debugFactory("web")

export default class WebApplication {

    private readonly app = feathersExpress(feathers())

    configure() {
        debug("configuring web application")
        this.app.use("/static", express.static(path.join(__dirname, "../../web/public")))
        this.app.use(express.json())
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
