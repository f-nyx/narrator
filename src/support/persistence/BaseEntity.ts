/** Represents a database entity.
 */
import {Model} from "objection"

export default interface Entity {
    /** Entity id. */
    readonly id: string
}
