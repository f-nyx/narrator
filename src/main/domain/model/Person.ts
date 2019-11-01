import Entity from "../../support/persistence/BaseEntity"
import * as uuid from "uuid/v4"

/** Represents a person in the library.
 *
 * A person could be either a fictional or a real person.
 */
export default class Person implements Entity {

    /** Initializes a new person.
     * @param id Unique identifier.
     * @param firstName Person's first name.
     * @param lastName Person's last name.
     */
    private constructor(
        readonly id: string,
        readonly firstName: string,
        readonly lastName: string
    ) { }

    /** Creates a person from a plain object.
     * @param entity Entity in form of plain object.
     * @return the new created person.
     */
    static from(entity: object): Person {
        return new Person(entity["id"], entity["firstName"], entity["lastName"])
    }

    /** Creates a new person.
     * @param firstName Person's first name.
     * @param lastName Person's last name.
     * @return the new created person.
     */
    static new(
        firstName: string,
        lastName: string
    ): Person {
        return new Person(uuid(), firstName, lastName)
    }
}
