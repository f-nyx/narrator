import {homeController} from "../config/ApplicationContext"
import {Express} from "express"

export default function initRoutes(app: Express) {
    app.get("/", homeController.index)
}
