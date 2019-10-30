import Person from "./model/Person"
import PersonModel from "./persistence/PersonModel"

export default class PersonDAO {

    async saveOrUpdate(person: Person): Promise<Person> {
        await PersonModel.saveOrUpdate(person)
        return person
    }

    async findById(id: string): Promise<Person> {
        let personModel = await PersonModel
            .query()
            .findById(id)
            .first()
        return Person.from(personModel.toJSON())
    }
}
