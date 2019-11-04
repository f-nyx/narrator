import * as mongoose from "mongoose"
import {ClientSession} from "mongoose"
import * as debugFactory from "debug"
import DataSourceConfig from "./DataSourceConfig"

const debug = debugFactory("dataSource")

/** Manages the data source lifecycle.
 */
export default class DataSource {

    /** Creates a new data source and sets the connection configuration.
     * @param config Knex configuration.
     */
    constructor(protected readonly config: DataSourceConfig) { }

    /** Initializes Knex, Objective, and create missing tables from
     * application models.
     */
    async initialize(config?: DataSourceConfig) {
        debug("initializing mongoose")
        let resolvedConfig = config || this.config
        await mongoose.connect(resolvedConfig.url, {
            useNewUrlParser: true,
            user: config.user,
            pass: config.password,
            keepAlive: true,
            autoReconnect: true
        })
    }

    /** Shut downs data source.
     */
    async destroy() {
        debug("destroying data source")
        await mongoose.connection.close()
    }

    /** Begins a transaction and returns the transaction object.
     * @return a promise to the transaction object.
     */
    async beginTransaction(): Promise<ClientSession> {
        let session = await mongoose.startSession()
        session.startTransaction()
        return session
    }
}
