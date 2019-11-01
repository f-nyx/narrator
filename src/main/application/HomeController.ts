import {Request, Response} from "express"

export default class HomeController {
    index(
        req: Request,
        res: Response
    ) {
        res.send("hello")
    }
}
