/** This file contains all application components.
 * It exports each individual component so they can be used from other components.
 */

import BookDAO from "../domain/BookDAO"
import PersonDAO from "../domain/PersonDAO"
import TransactionManager from "../support/persistence/TransactionManager"
import DataSource from "./DataSource"
import {database} from "./knexfile"

export const bookDAO = new BookDAO()
export const personDAO = new PersonDAO()
export const dataSource = new DataSource(database)
export const transactionManager = new TransactionManager()
