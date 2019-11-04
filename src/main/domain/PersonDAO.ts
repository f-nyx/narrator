import Person from "./model/Person"
import PersonModel from "./persistence/PersonModel"
import TransactionManager from "../support/persistence/TransactionManager"

export default class PersonDAO {

    constructor(private readonly transactionManager: TransactionManager) { }

    async saveOrUpdate(person: Person): Promise<Person> {
        let personModel = await PersonModel.findOneAndUpdate({
            _id: person.id
        }, PersonModel.new(person), {
            upsert: true,
            new: true
        })

        return Person.from(personModel)
    }

    async findById(id: string): Promise<Person> {
        let personModel = await PersonModel.findById(id)
        return Person.from(personModel)
    }
}
