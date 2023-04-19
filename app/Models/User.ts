import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import DocumentType from './DocumentType'

export default class User extends BaseModel {
  @column({ isPrimary: true }) public id: number
  @column() public firstName : string
  @column() public secondName : string
  @column() public surname : string
  @column() public secondSurName : string
  @column() public documentTypeId : number
  @column() public documentNumber : number
  @column() public email : string
  @column() public password : string
  @column() public rolId : number
  @column() public phone : string

  @hasOne(() => DocumentType,{
    localKey:"documentTypeId",
    foreignKey:"id"
  })
  public documentType : HasOne<typeof DocumentType>

  @hasOne(() => Role, {
    localKey: "rolId",
    foreignKey: "id"
  })
  public rol : HasOne<typeof Role>
}
