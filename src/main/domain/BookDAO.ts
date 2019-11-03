import Book from "./model/Book"
import BookModel from "./persistence/BookModel"
import TransactionManager from "../support/persistence/TransactionManager"

export default class BookDAO {

    constructor(private readonly transactionManager: TransactionManager) { }

    async saveOrUpdate(book: Book): Promise<Book> {
        await BookModel.saveOrUpdate(book)
        return book
    }

    async findById(id: string): Promise<Book> {
        let bookModel = await BookModel
            .query(this.transactionManager.current())
            .findById(id)
            .joinEager("author")
            .first()
        return Book.from(bookModel.toJSON())
    }
}
