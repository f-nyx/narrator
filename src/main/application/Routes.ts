import {bookController, bookDAO, homeController} from "../config/ApplicationContext"
import withTransaction from "./WebTransactionSupport"

export default function initRoutes(app) {
    app.get("/", withTransaction(homeController.index))
    app.use("/books", bookController)
    // TODO where services should be initialized?
    app.use("bookDAO", bookDAO)
}
