import * as Knex from "knex"
import {Config} from "knex"
import * as debugFactory from "debug"
import {Model, transaction, Transaction} from "objection"
import BookModel from "../domain/persistence/BookModel"
import PersonModel from "../domain/persistence/PersonModel"

const debug = debugFactory("dataSource")

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
    constructor(protected readonly config: Config) { }

    /** Initializes Knex, Objective, and create missing tables from
     * application models.
     */
    async initialize(config?: Config) {
        debug("initializing knex")
        this.knex = Knex(config || this.config)
        Model.knex(this.knex)

        debug("creating tables if required")

        for (let createTableIfRequired of this.createTableFunctions) {
            await createTableIfRequired()
        }
    }

    /** Shut downs data source.
     */
    async destroy() {
        debug("destroying data source")
        await this.knex.destroy()
    }

    /** Begins a transaction and returns the transaction object.
     * @return a promise to the transaction object.
     */
    async beginTransaction(): Promise<Transaction> {
        return await transaction.start(this.knex)
    }
}
