import {dataSource, transactionManager} from "../../main/config/ApplicationContext"
import {database} from "../../main/config/database"

before(async function() {
    await dataSource.initialize(database)
})
after(async function() {
    await dataSource.destroy()
})

/** Runs a test within a transaction.
 *
 * It initializes the data source, starts a transactions, and finally rollbacks
 * the transaction and shut downs the data source.
 *
 * @param callback Test implementation.
 */
export const runInTransaction = function<T>(callback: () => Promise<T>): (Function) => any {
    return (done) => {
        transactionManager.beginTransaction(async function() {
            try {
                await callback()
                done()
            } catch(cause) {
                console.error(cause)
                done(cause)
            } finally {
                await transactionManager.rollback()
            }
        })
    }
}
