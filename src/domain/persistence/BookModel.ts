import * as Knex from "knex"
import Entity from "../../support/persistence/BaseEntity"
import BaseModel from "../../support/persistence/BaseModel"
import Book from "../model/Book"
import PersonModel from "./PersonModel"

/** Represents the book data model.
 */
export default class BookModel extends BaseModel {

    protected static create(entity: Entity): object {
        let book: Book = entity as Book
        return {
            id: book.id,
            title: book.title,
            author_id: book.author.id
        }
    }

    static get tableName(): string {
        return "books"
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["id", "title", "author_id"],
            properties: {
                id: { type: "string", length: 36 },
                title: { type: "string", minLength: 1, maxLength: 255 },
                author_id: { type: "string" }
            }
        }
    }

    static get relationMappings() {
        return {
            author: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: PersonModel,
                join: {
                    from: "books.author_id",
                    to: "persons.id"
                }
            }
        }
    }

    protected static async createTable(knex: Knex): Promise<any> {
        await knex.schema.createTable(this.tableName, table => {
            table.string("id", 36).primary()
            table.string("title").notNullable()
            table.string("author_id", 36)
                .notNullable()
                .references("persons.id")
        })
    }
}
