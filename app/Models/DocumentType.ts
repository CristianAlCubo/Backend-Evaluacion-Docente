import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class DocumentType extends BaseModel {
  @column({ isPrimary: true }) public id: number
  @column() public name : string
}
