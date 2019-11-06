/** This file contains all application components.
 * It exports each individual component so they can be used from other components.
 */

import HomeController from "../application/HomeController"
import BookDAO from "../domain/BookDAO"
import PersonDAO from "../domain/PersonDAO"
import TransactionManager from "../support/persistence/TransactionManager"
import DataSource from "./DataSource"
import {database} from "./database"
import WebApplication from "./WebApplication"
import BookController from "../application/BookController"
import AuthorController from "../application/AuthorController"

// Data access
export const dataSource = new DataSource(database)
export const transactionManager = new TransactionManager(dataSource)
export const bookDAO = new BookDAO()
export const personDAO = new PersonDAO()

// Application layer
export const homeController = new HomeController()
export const bookController = new BookController(personDAO, bookDAO)
export const authorController = new AuthorController(personDAO)
export const webApplication = new WebApplication()
