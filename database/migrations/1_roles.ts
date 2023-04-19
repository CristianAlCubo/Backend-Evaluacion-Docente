import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Roles extends BaseSchema {
  protected tableName = 'roles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name')
      
      this.defer(async (db) => {
        await db.table(this.tableName).insert([
          {id:1,name:"admin"},
          {id:2,name:"student"},
          {id:3,name:"teacher"}
        ])
      })

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
