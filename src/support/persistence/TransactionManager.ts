import {createNamespace} from "cls-hooked"
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
    private readonly transactionsProviders = createNamespace(NS_NAME)

    /** Returns the active transaction for the current async context.
     * @return a promise to the active transaction.
     */
    async current(): Promise<Transaction<any, any>> {
        if (this.hasTransaction) {
            let transactionProvider = this.transactionsProviders.get(CURRENT_TRANSACTION)
            return await transactionProvider()
        } else {
            throw new Error("No active transaction in context")
        }
    }

    /** Determines whether there is an active transaction or not.
     * @return true if there's an active transaction, false otherwise.
     */
    get hasTransaction(): boolean {
        if (this.transactionsProviders && this.transactionsProviders.active) {
            return this.transactionsProviders.get(CURRENT_TRANSACTION) != undefined
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
        this.transactionsProviders.run(() => {
            if (!this.hasTransaction) {
                let transactionProvider = dataSource.transactionProvider()
                this.transactionsProviders.set(CURRENT_TRANSACTION, transactionProvider)
            }
            return callback()
        })
    }

    /** Commits the current transaction. Once committed, the transaction is no longer valid.
     */
    async commit() {
        let trx = await this.current()
        trx.commit()
        this.transactionsProviders.set(CURRENT_TRANSACTION, null)
    }

    /** Rollbacks the current transaction.
     */
    async rollback() {
        let trx = await this.current()
        trx.rollback()
        this.transactionsProviders.set(CURRENT_TRANSACTION, null)
    }
}
