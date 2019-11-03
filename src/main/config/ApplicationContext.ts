/** This file contains all application components.
 * It exports each individual component so they can be used from other components.
 */

import HomeController from "../application/HomeController"
import BookDAO from "../domain/BookDAO"
import PersonDAO from "../domain/PersonDAO"
import TransactionManager from "../support/persistence/TransactionManager"
import DataSource from "./DataSource"
import {database} from "./knexfile"
import WebApplication from "./WebApplication"

// Data access
export const dataSource = new DataSource(database)
export const transactionManager = new TransactionManager(dataSource)
export const bookDAO = new BookDAO(transactionManager)
export const personDAO = new PersonDAO(transactionManager)

// Application layer
export const homeController = new HomeController()
export const webApplication = new WebApplication()
