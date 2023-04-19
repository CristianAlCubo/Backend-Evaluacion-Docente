import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'

export default class AuthJwt {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const authorizationHeader = ctx.request.header('Authorization')

    if(authorizationHeader == undefined){
      return ctx.response.status(401).send({
        mensaje: "Falta el token de autorización",
        estado: 401,
      })
    }
    try{
      let token = authorizationHeader.split(' ')[1]
      jwt.verify(token, Env.get('JWT_SECRET_KEY'), (error)=>{
        if(error){
          switch(error.message){
            case 'jwt expired':
              throw new Error("Token expirado");
            case 'jwt malformed':
              throw new Error("Token inválido");
          }
        }
    })
    await next()
    }catch(error){ 
      ctx.response.status(401).send({"message":`${error}`})
    }
  }
}
