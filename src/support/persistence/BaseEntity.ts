/** Represents a database entity.
 * Domain entities must implement this interface.
 */
export default interface Entity {
    /** Entity id. */
    readonly id: string
}
