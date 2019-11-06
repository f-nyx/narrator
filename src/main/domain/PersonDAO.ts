import Person from "./model/Person"
import PersonModel from "./persistence/PersonModel"

export default class PersonDAO {

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

    async listAll(): Promise<Array<Person>> {
        let people = await PersonModel
            .find()

        return people.map(personModel =>
            Person.from(personModel)
        )
    }
}
