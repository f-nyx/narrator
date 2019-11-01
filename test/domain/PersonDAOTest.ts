import * as assert from "assert"
import {personDAO} from "../../src/config/ApplicationContext"
import Person from "../../src/domain/model/Person"
import {runInTransaction} from "../support/TestTransactionSupport"

describe("PersonDAO", function() {
    describe("#saveOrUpdate()", function() {
        it("should create a person", runInTransaction(async function() {
            let author: Person = Person.new("Douglas", "Adams")

            await personDAO.saveOrUpdate(author)
            let savedPerson: Person = await personDAO.findById(author.id)

            assert.deepEqual(savedPerson, author)
        }))
    })
})
