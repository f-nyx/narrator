/** Request to create new books.
 */
export default interface CreateBookRequest {
    readonly title: string
    readonly authorId: string
}
