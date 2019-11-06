import {bookDAO, personDAO} from "../config/ApplicationContext"
import CreateBookRequest from "./api/CreateBookRequest"
import Person from "../domain/model/Person"
import Book from "../domain/model/Book"

/** Controller to manage books.
 */
export default class BookController {
    async find() {
        return await bookDAO.listAll()
    }

    async create(request: CreateBookRequest) {
        let author: Person = await personDAO.findById(request.authorId)
        return await bookDAO.saveOrUpdate(Book.new(request.title, author))
    }
}
