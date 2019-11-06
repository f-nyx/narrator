import CreateBookRequest from "./api/CreateBookRequest"
import Person from "../domain/model/Person"
import Book from "../domain/model/Book"
import PersonDAO from "../domain/PersonDAO"
import BookDAO from "../domain/BookDAO"
import {Params, Service} from "@feathersjs/feathers"

/** Controller to manage books.
 */
export default class BookController {

    constructor(
        readonly personDAO: PersonDAO,
        readonly bookDAO: BookDAO
    ) {}

    async remove(id: string) {
        return await this.bookDAO.remove(id)
    }

    async find(params: Params) {
        return await this.bookDAO.listAll(params.query.authorId)
    }

    async create(request: CreateBookRequest): Promise<Book> {
        let author: Person = await this.personDAO.findById(request.authorId)
        return await this.bookDAO.saveOrUpdate(Book.new(request.title, author))
    }
}
