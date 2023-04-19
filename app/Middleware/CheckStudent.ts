import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import jwt from 'jsonwebtoken'

export default class CheckStudent {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const authorizationHeader = ctx.request.header('authorization')  

    try{
      if(authorizationHeader != undefined){
        let token = authorizationHeader.split(' ')[1]
        const {id} = this.decodePayload(token)
        const usuario : User = (await User.query().where('id',id).preload('rol'))[0]
  
        if(usuario.rol.name != "student"){
          return ctx.response.status(401).json({
            "message": 'No tiene permisos para acceder a esta ruta'
          })
        }
        await next()
      }
    }catch(error){            
      console.log(error);
      ctx.response.status(400).json({"message": "Error en el servidor"})
    }    
  }

  private decodePayload(token : string){
    const payload = jwt.verify(token, Env.get("JWT_SECRET_KEY"), {complete: true}).payload
    return payload
  }
}
