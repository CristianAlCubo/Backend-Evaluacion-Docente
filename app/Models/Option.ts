import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Question from './Question'

export default class Option extends BaseModel {
  @column({ isPrimary: true }) public id: number
  @column() public option: string
  @column() public questionId: number

  @belongsTo(() => Question,{
    localKey:'questionId',
    foreignKey:'id'
  })
  public question : BelongsTo<typeof Question>
}
