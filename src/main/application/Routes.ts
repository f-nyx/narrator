import {authorController, bookController, homeController} from "../config/ApplicationContext"
import withTransaction from "./WebTransactionSupport"

export default function initRoutes(app) {
    app.get("/", withTransaction(homeController.index))
    app.use("/books", bookController)
    app.use("/authors", authorController)
}
