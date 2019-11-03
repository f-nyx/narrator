import {homeController} from "../config/ApplicationContext"
import {Express} from "express"
import withTransaction from "./WebTransactionSupport"

export default function initRoutes(app: Express) {
    app.get("/", withTransaction(homeController.index))
}
