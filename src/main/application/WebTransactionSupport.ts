import {NextFunction, Request, Response} from "express"
import {transactionManager} from "../config/ApplicationContext"
import * as debugFactory from "debug"

const debug = debugFactory("transactions")

/** Request handler wrapper that opens a transaction for each request.
 *
 * It uses the {TransactionManager} to begin a transaction. If there is any error processing the request,
 * it rollbacks the transaction, otherwise the transaction is committed.
 */
export default function withTransaction(callback: Function): (Request, Response, NextFunction) => any {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            return transactionManager.beginTransaction(async function () {
                try {
                    debug("transaction successfully acquired")
                    await callback(req, res)
                    await transactionManager.commit()
                    debug("transaction successfully committed")
                    next()
                } catch (cause) {
                    debug("exception found, rolling back transaction")
                    await transactionManager.rollback()
                    debug("transaction rollback succeeded")
                    next(cause)
                }
            })
        } catch (cause) {
            debug("error starting transaction", cause)
            next(cause)
        }
    }
}
