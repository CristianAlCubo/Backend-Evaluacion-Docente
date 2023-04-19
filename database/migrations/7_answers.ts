import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Answers extends BaseSchema {
  protected tableName = 'answers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('answer')
      table.integer('question_id').unsigned().references('questions.id').onDelete('CASCADE')
    })

    this.defer(async (db) => {
      await db.table(this.tableName).insert([
        {'answer':'Nunca','question_id':1},
        {'answer':'Casi nunca','question_id':1},
        {'answer':'A veces','question_id':1},
        {'answer':'Casi siempre','question_id':1},
        {'answer':'Siempre','question_id':1}
      ])
    })
  }


  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
