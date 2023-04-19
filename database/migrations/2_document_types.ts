import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DocumentTypes extends BaseSchema {
  protected tableName = 'document_types'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name')

      this.defer(async (db) => {
        await db.table(this.tableName).insert([
          {id:1,name:"cedula de ciudadania"},
          {id:2,name:"tarjeta de identidad"},
          {id:3,name:"cedula de extranjero"}
        ])
      })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
