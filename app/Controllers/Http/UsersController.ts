import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
const bcryptjs = require('bcryptjs')

export default class UsersController {
    public async register({request, response}: HttpContextContract){
        try{
            const {firstName, secondName, surname, secondSurname, documentTypeId, documentNumber, rolId, email, password, phone} = request.all();
            const salt = bcryptjs.genSaltSync();
            const user = new User();
            user.firstName = firstName;
            user.secondName = secondName;
            user.surname = surname;
            user.secondSurName = secondSurname;
            user.documentTypeId = documentTypeId;
            user.documentNumber = documentNumber;
            user.rolId = rolId;
            user.email = email;
            user.password = bcryptjs.hashSync( password, salt );
            user.phone = phone
            await user.save();
            response.status(200)
            return{
                "state":true, 
                "message":"Usuario creado correctamente",
                "id":(await (User.query().max('id')))[0]['max']
            }
        }catch(error){
            response.status(500)
            // Verificar si se ha violado una restriccion de la base de datos. Ej: Valores duplicados
            if(error.constraint){
              response.json({
                "state":false,
                "message":"Fallo en la creación del usuario",
                "error": this.handleConstraintError(error.constraint)
              })
            }
        }
    }

    public async login({request, response}: HttpContextContract){
        const email = request.input('email');
        const password = request.input('password');
        try {
          //consultar si existe usuario con ese email
          const user = (await User.query().where('email', email).preload('rol'))[0]
          const invalidUserResponse = {"state":false,"message":"contraseña o email invalido"}
          if(!user){
            return response.status(400).json(invalidUserResponse)
          }
          //Validar si la contraseña ingresada es igual a la del usaurio  
          const validPassword = bcryptjs.compareSync( password, user.password );
          if ( !validPassword ) {
            return response.status(400).json(invalidUserResponse)
          }

          //Crear token con el id del usuario
          const payload ={
            'id': user.id,
          }
          const token:string = this.generateToken(payload);
    
          response.status(200).json({
            token,
            "state":true,
            "id":user.id,
            "name":this.getUserFullname(user),
            "role": user.rol.name,
            "message": "Ingreso exitoso"})
        } catch (error) {
          response.status(500)
          response.json({"message": "Error al intentar iniciar sesión."});
          return error
        }
    }

    public async getAllUsers({response} : HttpContextContract){
      try{
        const users = await User.query().where('rol_id',2).select('first_name','second_name','surname','second_sur_name','document_type_id','document_number','email','phone')
        response.status(200)
        return {
          state: true,
          message: "Listado de estudiantes",
          users: users
        }
      }catch(error){
        response.status(500)
        return {
          "state":false,
          "message":"Error al consultar el listado de estudiantes",
          "error":error
        }
      }
    }

    public async getUserById({response, params} : HttpContextContract){
      const user = (await User.query().where('id',params.id).select('first_name','second_name','surname','second_sur_name','document_type_id','document_number','email','phone'))[0]
      if(user){
        response.status(200)
        return user
      }else{
        response.status(404)
        return {
          "state":false,
          "message":"Error al consultar el detalle del usuario",
          "error":`El usuario con ID: '${params.id}' no existe.`
        }
      }
    }

    public async updateUser({response,request,params} : HttpContextContract){
      try {
        const {firstName, secondName, surname, secondSurName, documentTypeId, documentNumber, rolId, email, password, phone} = request.all();
        const id = params.id
        const user = (await User.query().where('id',id))[0]
        if(user){
          const salt = bcryptjs.genSaltSync();
          // Usar 'merge' para actualizar SOLAMENTE las propiedades que se envien por el request. Las propiedades no
          // enviadas en la petición no serán alteradas.
          await user?.merge({
            firstName: firstName,
            secondName: secondName,
            surname: surname,
            secondSurName: secondSurName,
            documentTypeId: documentTypeId,
            documentNumber: documentNumber,
            rolId: rolId,
            email: email,
            password: password ? bcryptjs.hashSync( password, salt) : undefined,
            phone: phone
          }).save()
          response.status(200)
          return{
            "state":true,
            "message":"Actualización realizada con exito"
          }
        }else{
          response.status(404)
          return{
            "state": false,
            "message":'Error al actualizar',
            "error":`El usuario con id: ${id} no se encuentra registrado.`
          }
        }

      } catch (error) {
        if(error.toString().split(' ')[2] == ".update()"){
          response.status(200)
          return{"message":"No hubo nada que actualizar. La operación terminó con exito."}
        }

        response.status(500)
        if(error.constraint){
          response.json({
            "state":false,
            "message":"Error al actualizar",
            "error":this.handleConstraintError(error.constraint)
          })
        }
        return {
          "message":"Error al actualizar",
          "error":"Error en el lado del servidor."
        }
      }
    }

    private generateToken(payload: any):string{
      const opciones = {
        expiresIn: "15 mins"
      }
      return jwt.sign(payload, Env.get('JWT_SECRET_KEY'), opciones)    
    }

    private handleConstraintError(constraint:string){
      let errorMsg
      switch (constraint) {
        case 'users_document_number_unique':
          errorMsg = 'El número de documento del usuario ya se encuentra registrado.'
          break;
        case 'users_email_unique':
          errorMsg = 'El email del usuario ya se encuentra registrado.'
          break;
        case 'users_phone_unique':
          errorMsg = 'El número de telefono del usuario ya se encuentra registrado.'
          break;
        default:
          errorMsg = "Error al crear el usuario. Se ha violado una restricción de la base de datos."
          break;
      }
      return errorMsg
    }

    private getUserFullname(user: User) : string{
      return `${user.firstName?user.firstName+" ":""}${user.secondName?user.secondName+" ":""}${user.surname?user.surname+" ":""}${user.secondSurName?user.secondSurName+" ":""}`
    }
}
