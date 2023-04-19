import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Answerforms extends BaseSchema {
  protected tableName = 'answer_forms'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('id_form').references('forms.id').onDelete('CASCADE').notNullable()
      table.integer('id_answer').references('answers.id').onDelete('CASCADE').notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
