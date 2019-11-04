import Book from "../model/Book"
import * as mongoose from "mongoose"
import {Document, Schema} from "mongoose"
import Person from "../model/Person"

export const BookSchema = new Schema({
    _id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, ref: "Person" }
})

interface BookModel extends Document {
    title: string
    author: Person
}

/** Represents the book data model.
 */
export default Object.assign(mongoose.model<BookModel>("Book", BookSchema), {
    new(book: Book) {
        return Object.assign({}, book, {
            _id: book.id,
            author: book.author.id
        })
    }
})

