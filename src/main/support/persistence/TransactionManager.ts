import {createNamespace, Namespace} from "cls-hooked"

import {Transaction} from "knex"
import {dataSource} from "../../config/ApplicationContext"

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

    /** Contains the transaction providers for active async contexts. */
    private readonly transactions: Namespace = createNamespace(NS_NAME)

    /** Returns the active transaction for the current async context.
     * @return a promise to the active transaction.
     */
    current(): Transaction<any, any> {
        if (this.hasTransaction) {
            return this.transactions.get(CURRENT_TRANSACTION)
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
    async beginTransaction(callback: () => void) {
        await this.transactions.runPromise(async () => {
            if (!this.hasTransaction) {
                let transactionProvider = dataSource.transactionProvider()
                let trx = await transactionProvider()
                this.transactions.set(CURRENT_TRANSACTION, trx)
            }
            return callback()
        })
    }

    /** Commits the current transaction. Once committed, the transaction is no longer valid.
     */
    commit() {
        let trx = this.current()
        trx.commit()
        this.transactions.set(CURRENT_TRANSACTION, null)
    }

    /** Rollbacks the current transaction.
     */
    rollback() {
        let trx = this.current()
        trx.rollback()
        this.transactions.set(CURRENT_TRANSACTION, null)
    }
}
