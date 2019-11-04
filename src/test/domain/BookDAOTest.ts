import * as assert from "assert"
import {bookDAO, personDAO} from "../../main/config/ApplicationContext"
import Book from "../../main/domain/model/Book"
import Person from "../../main/domain/model/Person"
import {runInTransaction} from "../support/TestTransactionSupport"

describe("BookDAO", function() {
    describe("#saveOrUpdate()", function() {
        it("should create a new book", runInTransaction(async function() {
            let author: Person = await personDAO.saveOrUpdate(Person.new("Douglas", "Adams"))
            let book: Book = await bookDAO.saveOrUpdate(Book.new("The Hitchhiker's Guide to the Galaxy", author))
            let savedBook: Book = await bookDAO.findById(book.id)

            assert.deepEqual(savedBook, book)
        }))

        it("should update an existing book", runInTransaction(async function() {
            let author: Person = await personDAO.saveOrUpdate(Person.new("Douglas", "Adams"))
            let book: Book = await bookDAO.saveOrUpdate(Book.new("The Hitchhiker's Guide to the Galax", author))
            let savedBook: Book = await bookDAO.findById(book.id)
            assert.deepEqual(savedBook, book)

            let updatedBook: Book = await bookDAO.saveOrUpdate(
                book.updateTitle("The Hitchhiker's Guide to the Galaxy")
            )

            let savedBook2 = await bookDAO.findById(book.id)
            assert.deepEqual(savedBook2, updatedBook)
        }))
    })
})
