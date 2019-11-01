import {homeController, webApplication} from "../config/ApplicationContext"

export default function initRoutes() {
    webApplication.app.get("/", homeController.index)
}
