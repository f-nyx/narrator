import * as assert from "assert"
import {bookDAO, personDAO} from "../../src/config/ApplicationContext"
import Book from "../../src/domain/model/Book"
import Person from "../../src/domain/model/Person"
import {runInTransaction} from "../support/TestTransactionSupport"

describe("BookDAO", function() {
    describe("#saveOrUpdate()", function() {
        it("should create a new book", runInTransaction(async function() {
            let author: Person = Person.new("Douglas", "Adams")
            let book: Book = Book.new("The Hitchhiker's Guide to the Galaxy", author)

            await personDAO.saveOrUpdate(author)
            await bookDAO.saveOrUpdate(book)
            let savedBook: Book = await bookDAO.findById(book.id)

            assert.deepEqual(savedBook, book)
        }))

        it("should update an existing book", runInTransaction(async function() {
            let author: Person = Person.new("Douglas", "Adams")
            let book: Book = Book.new("The Hitchhiker's Guide to the Galax", author)

            await personDAO.saveOrUpdate(author)
            await bookDAO.saveOrUpdate(book)
            let savedBook: Book = await bookDAO.findById(book.id)
            assert.deepEqual(savedBook, book)

            let updatedBook: Book = book.updateTitle("The Hitchhiker's Guide to the Galaxy")
            await bookDAO.saveOrUpdate(updatedBook)
            let savedBook2 = await bookDAO.findById(book.id)
            assert.deepEqual(savedBook2, updatedBook)
        }))
    })
})
