import BaseSchema from '@ioc:Adonis/Lucid/Schema'
const bcryptjs = require('bcryptjs')

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('first_name',50).notNullable()
      table.string('second_name',50)
      table.string('surname',50).notNullable()
      table.string('second_sur_name',50)
      table.integer('document_type_id').unsigned().references('document_types.id').onDelete('CASCADE')
      table.string('document_number').unique().notNullable()
      table.string('email',100).unique().notNullable()
      table.string('password').notNullable()
      table.integer('rol_id').unsigned().references('roles.id').onDelete('CASCADE')
      table.string('phone',50)
    })

    this.defer(async (db) => {
      await db.table(this.tableName).insert([
        {first_name:'mock',second_name:'mock',surname:'mock',second_sur_name:'mock',document_type_id:1,document_number:'1',email:'admin@mail.com',password:bcryptjs.hashSync('password',bcryptjs.genSaltSync()),rol_id:1,phone:'mock'},
        {first_name:'mock',second_name:'mock',surname:'mock',second_sur_name:'mock',document_type_id:1,document_number:'2',email:'student@mail.com',password:bcryptjs.hashSync('password',bcryptjs.genSaltSync()),rol_id:2,phone:'mock1'},
        {first_name:'mock',second_name:'mock',surname:'mock',second_sur_name:'mock',document_type_id:1,document_number:'3',email:'teacher@mail.com',password:bcryptjs.hashSync('password',bcryptjs.genSaltSync()),rol_id:3,phone:'mock2'}
      ])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
