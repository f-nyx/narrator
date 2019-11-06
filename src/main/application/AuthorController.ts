import Person from "../domain/model/Person"
import CreateAuthorRequest from "./api/CreateAuthorRequest"
import PersonDAO from "../domain/PersonDAO"

/** Controller to manage authors.
 */
export default class AuthorController {

    constructor(
        readonly personDAO: PersonDAO
    ) {
    }

    async find() {
        return await this.personDAO.listAll()
    }

    async create(request: CreateAuthorRequest) {
        return await this.personDAO.saveOrUpdate(Person.new(
            request.firstName, request.lastName
        ))
    }
}
