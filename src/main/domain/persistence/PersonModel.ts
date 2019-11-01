import * as Knex from "knex"
import Entity from "../../support/persistence/BaseEntity"
import BaseModel from "../../support/persistence/BaseModel"
import Person from "../model/Person"

/** Represents a person data model.
 */
export default class PersonModel extends BaseModel {

    protected static create(entity: Entity): object {
        let person: Person = entity as Person
        return {
            id: person.id,
            firstName: person.firstName,
            lastName: person.lastName
        }
    }

    static get tableName(): string {
        return "persons"
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["id", "firstName", "lastName"],
            properties: {
                id: { type: "string", length: 36 },
                firstName: { type: "string", minLength: 1, maxLength: 255 },
                lastName: { type: "string", minLength: 1, maxLength: 255 }
            }
        }
    }

    protected static async createTable(knex: Knex): Promise<any> {
        await knex.schema.createTable(this.tableName, table => {
            table.string("id", 36).primary()
            table.string("first_name").notNullable()
            table.string("last_name").notNullable()
        })
    }
}
