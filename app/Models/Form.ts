import { BaseModel, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Answer from './Answer'
import User from './User'

export default class Form extends BaseModel {
  @column({ isPrimary: true }) public id: number
  @column() public userId : number

  @hasOne(() => User,{
    localKey:'userId',
    foreignKey:'id'
  })
  public teacher : HasOne<typeof User>

  @hasMany(() => Answer,{
    localKey:'id',
    foreignKey:'evaluationId'
  })
  public answers : HasMany<typeof Answer>
}
