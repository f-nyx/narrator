import {NextFunction, Request, Response} from "express"
import {transactionManager} from "../config/ApplicationContext"
import * as debugFactory from "debug"

const debug = debugFactory("transactions")

/** Middleware that opens a transaction for each request.
 *
 * It uses the {TransactionManager} to begin a transaction. If there is any error processing the request,
 * it rollbacks the transaction, otherwise the transaction is committed.
 */
export default class TransactionMiddleware {
    static install(): (Request, Response, NextFunction) => any {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await transactionManager.beginTransaction(function () {
                    try {
                        debug("transaction successfully acquired")
                        next()
                        transactionManager.commit()
                        debug("transaction successfully committed")
                    } catch (cause) {
                        debug("exception found, rolling back transaction")
                        transactionManager.rollback()
                        debug("transaction rollback succeeded")
                    }
                })
            } catch (cause) {
                debug("error starting transaction", cause)
                res.status(500).send(cause.message)
            }
        }
    }
}
