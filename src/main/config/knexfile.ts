import * as knex from 'knex'
import * as path from 'path'

export const database = {
    client: "mysql2",
    connection: {
        host: "localhost",
        user: "narrator",
        password: "narrator123",
        database: "narrator"
    },
    pool: {
        min: 1,
        max: 5
    },
    migrations: {
        directory: path.resolve("./src/db/migrations"),
        loadExtensions: [".ts"],
        extension: "ts"
    }
} as knex.Config
