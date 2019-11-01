import {ColumnNameMappers, compose, Model, snakeCaseMappers} from "objection"
import * as guid from "objection-guid"
import {transactionManager} from "../../config/ApplicationContext"
import Entity from "./BaseEntity"

const Plugins = compose([
    guid()
])

/** This model adds support to initialize the model's table.
 *
 * Models in the application must extend this class in order to initialize
 * the underlying table at application startup.
 *
 * @see DataSource
 */
export default class BaseModel extends Plugins(Model) {

    /** It uses the snake case convention for column names.
     */
    static get columnNameMappers(): ColumnNameMappers {
        return snakeCaseMappers()
    }

    /** Only reads and inserts mapped fields.
     */
    static get pickJsonSchemaProperties(): boolean {
        return true
    }

    /** Creates the table related to this model only if it does not exist.
     */
    static async createTableIfRequired() {
        let exists = await this.knex().schema.hasTable(this.tableName)

        if (!exists) {
            await this.createTable(this.knex())
        }
    }

    /** Template method that must be implemented by sublcasses in order
     * to create the table related to this model. It should assume the table
     * does not exist.
     *
     * @param knex Knex instance.
     */
    protected static async createTable(knex) { }

    /** Updates this model with an existing entity data.
     * @param entity Entity that contains the data to update.
     * @return the updated entity.
     */
    protected update(entity: Entity): BaseModel {
        return this
    }

    /** Creates a new data model from an entity.
     * @param entity Entity to retrieve data from.
     * @return a valid model.
     */
    protected static create(entity: Entity): object {
        return {}
    }

    /** Saves or updates an entity.
     *
     * It looks for the entity and if it does exist, the model is updated with the
     * entity data. Otherwise, the entity is created.
     *
     * @param entity Entity to save or update.
     * @return the processed entity.
     */
    static async saveOrUpdate<T extends Entity>(entity: T): Promise<T> {
        let trx = await transactionManager.current()
        let existingEntity: BaseModel = await this.query(trx)
            .findById(entity.id)
            .first()

        if (existingEntity) {
            await this.query(trx).update(existingEntity.update(entity))
        } else {
            await this.query(trx).insert(this.create(entity))
        }

        return entity
    }
}
