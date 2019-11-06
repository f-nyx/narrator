import Book from "./model/Book"
import BookModel from "./persistence/BookModel"
import {Service} from "feathers-mongoose"

export default class BookDAO extends Service {

    constructor() {
        super({
            Model: BookModel
        })
    }

    async create(book: Book): Promise<Book> {
        return await this.saveOrUpdate(book)
    }

    async update(
        id: string,
        book: Book
    ): Promise<Book> {
        return await this.saveOrUpdate(book)
    }

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

    async listAll(): Promise<Array<Book>> {
        let books = await BookModel
            .find()
            .populate("author")

        return books.map(bookModel =>
            Book.from(bookModel)
        )
    }
}
