import {dataSource} from "../../main/config/ApplicationContext"
import * as express from "express"
import {Express} from "express"
import {Http2Server} from "http2"
import withTransaction from "../../main/application/WebTransactionSupport"
import * as loadTest from "loadtest"
import {database} from "../../main/config/database"
import {createNamespace, Namespace} from "cls-hooked"

let app: Express
let server: Http2Server


describe("Express.js", function() {
    before(async function () {
        const transactions: Namespace = createNamespace("test")

        await dataSource.initialize(database)

        app = express()
        app.get("/with-transaction", withTransaction( (req, res) => {
            res.send("OK")
        }))
        app.get("/without-transaction", (req, res) => {
            res.send("OK")
        })
        app.get("/cls-hooked", (req, res) => {
            transactions.run(() => {
                transactions.set("test", "foo")
                res.send(transactions.get("foo"))
            })
        })
        server = app.listen(9009)
    })

    after(async function () {
        await dataSource.destroy()
        server.close()
    })

    it("should measure performance with transaction", function(done) {
        const options = {
            url: 'http://localhost:9009/with-transaction',
            maxRequests: 1000,
            concurrency: 5
        };
        loadTest.loadTest(options, function (error, result) {
            if (error) {
                done(error)
            }
            console.log(result)
            done()
        })
    })

    it("should measure performance without transaction", function(done) {
        const options = {
            url: 'http://localhost:9009/without-transaction',
            maxRequests: 1000,
            concurrency: 5
        };
        loadTest.loadTest(options, function (error, result) {
            if (error) {
                done(error)
            }
            console.log(result)
            done()
        })
    })
    it("should measure performance only with cls-hooked", function(done) {
        const options = {
            url: 'http://localhost:9009/cls-hooked',
            maxRequests: 1000,
            concurrency: 5
        };
        loadTest.loadTest(options, function (error, result) {
            if (error) {
                done(error)
            }
            console.log(result)
            done()
        })
    })
})
