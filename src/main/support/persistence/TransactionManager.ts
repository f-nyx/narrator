import {createNamespace, Namespace} from "cls-hooked"
import {Transaction} from "knex"
import * as debugFactory from "debug"
import * as uuid from "uuid/v4"
import DataSource from "../../config/DataSource"

const debug = debugFactory("transactions")

const NS_NAME: string = "TransactionManager::transactions"
const CURRENT_TRANSACTION: string = "TransactionManager::currentTransaction"

/** The transaction manager allows to start transactions in asynchronous contexts.
 *
 * #beginTransaction takes a callback and initializes the transaction for subsequent
 * calls in the asynchronous call stack.
 *
 * The caller must invoke #commit() or #rollback in order to end the transaction.
 */
export default class TransactionManager {

    constructor(private readonly dataSource: DataSource) { }

    /** Contains the transaction providers for active async contexts. */
    private readonly transactions: Namespace = createNamespace(NS_NAME)

    /** Returns the active transaction for the current async context.
     * @return a promise to the active transaction.
     */
    current(): Transaction<any, any> {
        if (this.hasTransaction) {
            let wrapper = this.transactions.get(CURRENT_TRANSACTION)
            debug("using transaction ", wrapper.id)
            return wrapper.trx
        } else {
            throw new Error("No active transaction in context")
        }
    }

    /** Determines whether there is an active transaction or not.
     * @return true if there's an active transaction, false otherwise.
     */
    get hasTransaction(): boolean {
        if (this.transactions && this.transactions.active) {
            return this.transactions.get(CURRENT_TRANSACTION) != undefined
        } else {
            return false
        }
    }

    /** Begins a transaction and binds all subsequent calls within the callback to
     * this asynchronous context.
     *
     * @param callback Callback to invoke once the transaction is created.
     */
    beginTransaction(callback: () => void) {
        this.transactions.run(async () => {
            if (!this.hasTransaction) {
                let id = uuid()
                debug("no transaction found, creating transaction with id ", id)

                let trx = await this.dataSource.beginTransaction()

                this.transactions.set(CURRENT_TRANSACTION, {
                    id: id,
                    trx: trx
                })
            }
            return callback()
        })
    }

    /** Commits the current transaction. Once committed, the transaction is no longer valid.
     */
    commit() {
        let trx = this.current()
        trx.commit()
        this.transactions.set(CURRENT_TRANSACTION, undefined)
    }

    /** Rollbacks the current transaction.
     */
    rollback() {
        let trx = this.current()
        trx.rollback()
        this.transactions.set(CURRENT_TRANSACTION, undefined)
    }
}
