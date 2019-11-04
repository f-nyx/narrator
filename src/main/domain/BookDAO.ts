import Book from "./model/Book"
import BookModel from "./persistence/BookModel"
import TransactionManager from "../support/persistence/TransactionManager"

export default class BookDAO {

    constructor(private readonly transactionManager: TransactionManager) { }

    async saveOrUpdate(book: Book): Promise<Book> {
        let bookModel = await BookModel.findOneAndUpdate({
            _id: book.id
        }, BookModel.new(book), {
            upsert: true,
            new: true
        }).populate("author")

        return Book.from(bookModel)
    }

    async findById(id: string): Promise<Book> {
        let bookModel = await BookModel
            .findById(id)
            .populate("author")
        return Book.from(bookModel)
    }
}
