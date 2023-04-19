import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'

import Question from './Question'

export default class Answer extends BaseModel {
  @column({ isPrimary: true }) public id: number
  @column() public answer : string
  @column() public questionId : number

  @hasOne(() => Question,{
    localKey: "questionId",
    foreignKey: "id"
  })
  public question : HasOne<typeof Question>

}
