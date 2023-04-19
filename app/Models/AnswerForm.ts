import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Answer from './Answer'

export default class AnswerForm extends BaseModel {
  @column({ isPrimary: true }) public id: number
  @column() public idAnswer: number
  @column() public idForm: number

  @hasMany(() => Answer,{
    localKey : 'idAnswer',
    foreignKey : 'id'
  })
  public answers : HasMany<typeof Answer>
}
