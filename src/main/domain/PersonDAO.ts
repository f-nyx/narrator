import Person from "./model/Person"
import PersonModel from "./persistence/PersonModel"
import TransactionManager from "../support/persistence/TransactionManager"

export default class PersonDAO {

    constructor(private readonly transactionManager: TransactionManager) { }

    async saveOrUpdate(person: Person): Promise<Person> {
        await PersonModel.saveOrUpdate(person)
        return person
    }

    async findById(id: string): Promise<Person> {
        let personModel = await PersonModel
            .query(this.transactionManager.current())
            .findById(id)
            .first()
        return Person.from(personModel.toJSON())
    }
}
