import Book from "./model/Book"
import BookModel from "./persistence/BookModel"

export default class BookDAO {

    async saveOrUpdate(book: Book): Promise<Book> {
        await BookModel.saveOrUpdate(book)
        return book
    }

    async findById(id: string): Promise<Book> {
        let bookModel = await BookModel
            .query()
            .findById(id)
            .joinEager("author")
            .first()
        return Book.from(bookModel.toJSON())
    }
}
