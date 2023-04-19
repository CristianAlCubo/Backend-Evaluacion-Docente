import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Answer from './Answer'
import Option from './Option'

export default class Question extends BaseModel {
  @column({ isPrimary: true }) public id : number
  @column() public question : string

  @hasMany(() => Answer,{
    localKey:'id',
    foreignKey:'questionId'
  })
  public answers : HasMany<typeof Answer>

}
