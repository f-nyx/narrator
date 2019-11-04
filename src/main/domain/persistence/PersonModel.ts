import * as mongoose from "mongoose"
import {Document, Schema} from "mongoose"
import Person from "../model/Person"

export const PersonSchema = new Schema({
    _id: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
})

interface PersonModel extends Document {
    firstName: string
    lastName: string
}

export default Object.assign(mongoose.model<PersonModel>("Person", PersonSchema), {
    new(person: Person) {
        return Object.assign({}, person, {
            _id: person.id
        })
    }
})
