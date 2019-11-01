import {NextFunction, Request, Response} from "express"
import {transactionManager} from "../config/ApplicationContext"

/** Middleware that opens a transaction for each request.
 *
 * It uses the {TransactionManager} to begin a transaction. If there is any error processing the request,
 * it rollbacks the transaction, otherwise the transaction is committed.
 */
export default class TransactionMiddleware {
    static install(): (Request, Response, NextFunction) => any {
        return (req: Request, res: Response, next: NextFunction) =>
            transactionManager.beginTransaction(async function() {
                try {
                    next()
                    await transactionManager.commit()
                } catch(cause) {
                    await transactionManager.rollback()
                    throw cause
                }
            })
    }
}
