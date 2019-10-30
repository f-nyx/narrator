import Entity from "../../support/persistence/BaseEntity"
import Person from "./Person"
import * as uuid from "uuid/v4"

/** Represents a book in the library.
 *
 * Books contains the required information to create the interaction
 * between characters in target networks.
 */
export default class Book implements Entity {

    /** Initializes a new book.
     * @param id Unique identifier.
     * @param title Book title.
     * @param author Existing author.
     */
    private constructor(
        readonly id: string,
        readonly title: string,
        readonly author: Person
    ) { }

    /** Creates a book from a plain object.
     * @param entity Entity in form of plain object.
     * @return the new created book.
     */
    static from(entity: object): Book {
        return new Book(entity["id"], entity["title"], entity["author"])
    }

    /** Creates a new book.
     * @param title Book title.
     * @param author Book author, it must exist.
     * @return the new created book.
     */
    static new(
        title: string,
        author: Person
    ): Book {
        return new Book(uuid(), title, author)
    }
}
