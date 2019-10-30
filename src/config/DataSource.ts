import {Config} from "knex"
import * as Knex from "knex"
import {Model} from "objection"
import BookModel from "../domain/persistence/BookModel"
import PersonModel from "../domain/persistence/PersonModel"

/** Manages the data source lifecycle.
 */
export default class DataSource {

    private readonly createTableFunctions: Array<Function> = [
        PersonModel.createTableIfRequired.bind(PersonModel),
        BookModel.createTableIfRequired.bind(BookModel)
    ]

    private knex: Knex

    /** Creates a new data source and sets the connection configuration.
     * @param config Knex configuration.
     */
    constructor(private readonly config: Config) { }

    /** Initializes Knex, Objective, and create missing tables from
     * application models.
     */
    async initialize() {
        this.knex = Knex(this.config)
        Model.knex(this.knex)

        for (let createTableIfRequired of this.createTableFunctions) {
            await createTableIfRequired()
        }
    }

    /** Shut downs data source.
     */
    async destroy() {
        await this.knex.destroy()
    }
}
