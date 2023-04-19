import { test } from '@japa/runner'
import User from 'App/Models/User'
import { getToken } from './getToken'

test.group('User CRUD tests...',()=>{
    test('Should list all users...', async ({ client }) => {
        const token = await getToken(1) // Obtener token de un usuario con rol 'admin'
        const response = await client.get('api/v1/user/getUsers').header('Authorization',`Bearer ${token}`)
        response.assertStatus(200)
        response.assert?.properties(response.body(),['state','message','users'])
    })
    
    test('Should list user by id...', async ({ client }) => {
        const token = await getToken(1) // Obtener token de un usuario con rol 'admin'
        const response = await client.get('api/v1/user/getUser/1').header('Authorization',`Bearer ${token}`)
        response.assertStatus(200)
        response.body().assert?.isObject()
    })
    
    test('Should give error when listing user by non-existent id...', async ({ client }) => {
        const nonExistingId = '1213213'
        const token = await getToken(1) // Obtener token de un usuario con rol 'admin'
        const response = await client.get('api/v1/user/getUser/'+nonExistingId).header('Authorization',`Bearer ${token}`)
        response.assertStatus(404)
        response.body().assert?.isObject()
        response.assert?.containsSubset(response.body(),{"error": `El usuario con ID: '${nonExistingId}' no existe.`})
    })
    
    test('Sould create new user...', async ({ client }) => {
        const token = await getToken(1) // Obtener token de un usuario con rol 'admin'
        const response = await client.post('api/v1/user/create').header('Authorization',`Bearer ${token}`).json({
            "firstName":"carlos",
            "secondName":"santana",
            "surname":"sinpermisos",
            "secondSurname":"gutierrez",
            "documentTypeId":1,
            "documentNumber":"1234567890123",
            "rolId":2,
            "email":"student2@mail.com",
            "password":"password",
            "phone":"323 323 32 321"
        })
        response.assertStatus(200)
        response.assertBody({
            'id':(await (User.query().max('id')))[0]['max'],
            'state':true,
            'message':'Usuario creado correctamente'
        })
    })
    
    test('Should give error when creating new user with already registered document number...', async ({ client, assert }) => {
        const token = await getToken(1) // Obtener token de un usuario con rol 'admin'
        await client.post('api/v1/user/create').header('Authorization',`Bearer ${token}`).json({
            "firstName":"carlos",
            "secondName":"santana",
            "surname":"sinpermisos",
            "secondSurname":"gutierrez",
            "documentTypeId":1,
            "documentNumber":"009",
            "rolId":2,
            "email":"student10@mail.com",
            "password":"password",
            "phone":"323 323 32 3212"
        })
        try{
            await client.post('api/v1/user').header('Authorization',`Bearer ${token}`).json({
                "firstName":"carlos",
                "secondName":"santana",
                "surname":"sinpermisos",
                "secondSurname":"gutierrez",
                "documentTypeId":1,
                "documentNumber":"009",
                "rolId":2,
                "email":"student332@mail.com",
                "password":"password",
                "phone":"323 323 32 32132032"
            })
        }catch(error){
            assert.isObject(JSON.parse(error))
        }
    })
    
    test('Should give error when creating new user with already registered email...', async ({ client, assert }) => {
        const token = await getToken(1) // Obtener token de un usuario con rol 'admin'
        await client.post('api/v1/user/create').header('Authorization',`Bearer ${token}`).json({
            "firstName":"carlos",
            "secondName":"santana",
            "surname":"sinpermisos",
            "secondSurname":"gutierrez",
            "documentTypeId":1,
            "documentNumber":"009232",
            "rolId":2,
            "email":"student100@mail.com",
            "password":"password",
            "phone":"323 323 32 321221"
        })
        try{
            await client.post('api/v1/user/create').header('Authorization',`Bearer ${token}`).json({
                "firstName":"carlos",
                "secondName":"santana",
                "surname":"sinpermisos",
                "secondSurname":"gutierrez",
                "documentTypeId":1,
                "documentNumber":"0090",
                "rolId":2,
                "email":"student100@mail.com",
                "password":"password",
                "phone":"323 323 32 321320322"
            })
        }catch(error){
            assert.isObject(JSON.parse(error))
        }
    })
    
    test('Should give error when creating new user with already registered phone...', async ({ client, assert }) => {
        const token = await getToken(1) // Obtener token de un usuario con rol 'admin'
        await client.post('api/v1/user/create').header('Authorization',`Bearer ${token}`).json({
            "firstName":"carlos",
            "secondName":"santana",
            "surname":"sinpermisos",
            "secondSurname":"gutierrez",
            "documentTypeId":1,
            "documentNumber":"0092",
            "rolId":2,
            "email":"student1002@mail.com",
            "password":"password",
            "phone":"000"
        })
        try{
            await client.post('api/v1/user/create').header('Authorization',`Bearer ${token}`).json({
                "firstName":"carlos",
                "secondName":"santana",
                "surname":"sinpermisos",
                "secondSurname":"gutierrez",
                "documentTypeId":1,
                "documentNumber":"00901",
                "rolId":2,
                "email":"student1004@mail.com",
                "password":"password",
                "phone":"000"
            })
        }catch(error){
            assert.isObject(JSON.parse(error))
        }
    })
    
    
    test('Should give error when login with non-existent email...', async ({ client }) => {
        const response = await client.post('api/v1/login').json({
            "email":"thisemaildoesntexist@mail.com",
            "password":"password"
        })
        response.assertStatus(400)
        response.body().assert?.isObject()
        response.assertBody(
            {"state":false,"message":"contraseña o email invalido"}
        )
    })
    
    test('Should give error when login with wrong password...', async ({ client }) => {
        const response = await client.post('api/v1/login').json({
            "email":"admin@mail.com",
            "password":"incorrectpassword"
        })
        response.assertStatus(400)
        response.body().assert?.isObject()
        response.assertBody(
            {"state":false,"message":"contraseña o email invalido"}
        )
    })
    
    test('Should be able to give generic server-side error messages when trying to login...', async ({ client, assert }) => {
        try {
            await client.post('api/v1/login').json({
                "password":""
            })
        } catch (error) {
            assert.isObject(JSON.parse(error))
        }
    })
    
    test('Should login when valid credentials are given...', async ({ client }) => {
        const response = await client.post('api/v1/login').json({
            "email":"admin@mail.com",
            "password":"password"
        })
        response.assertStatus(200)
        response.body().assert?.isObject()
        response.assert?.properties(response.body(),['state','token','id','name','role','message'])
    })
    
    test('Should update user data when valid data is given...', async ({ client }) => {
        const token = await getToken(1) // Obtener token de un usuario con rol 'admin'
        // Creamos usuario que será usado para testear el método de actualización
        const res = await client.post('api/v1/user/create').header('Authorization',`Bearer ${token}`).json({
            "firstName":"pedro",
            "secondName":"a ser",
            "surname":"actualizado",
            "secondSurname":"gutierrez",
            "documentTypeId":1,
            "documentNumber":"10102",
            "rolId":2,
            "email":"pedro@mail.com",
            "password":"password",
            "phone":"0001121"
        })
        const response = await client.put('api/v1/user/update/'+res.body().id).header('Authorization',`Bearer ${token}`).json({
            "surname":"apellido actualizado",
            "phone":"00101023123"
        })
        response.assertStatus(200)
        response.body().assert?.isObject()
        response.assert?.containsSubset(response.body(),{"state":true, "message": "Actualización realizada con exito"})
    })
    
    test('Should give error when trying to update non-existing user...', async ({ client }) => {
        const token = await getToken(1) // Obtener token de un usuario con rol 'admin'
        const nonExistingId = '1231241'
        const response = await client.put('api/v1/user/update/'+nonExistingId).header('Authorization',`Bearer ${token}`).json({
            "surname":"apellido actualizado",
            "phone":"312131414"
        })
        response.assertStatus(404)
        response.body().assert?.isObject()
        response.assert?.containsSubset(response.body(),{"error": `El usuario con id: ${nonExistingId } no se encuentra registrado.`,"message":"Error al actualizar"})
    })
    
    test('Should inform when trying to update user with the same data stored in BD...', async ({ client }) => {
        const token = await getToken(1) // Obtener token de un usuario con rol 'admin'
        const id = '1231241'
        // Creamos usuario que será usado para testear el método de actualización
        const res = await client.post('api/v1/user/create').header('Authorization',`Bearer ${token}`).json({
                "firstName":"pedro",
                "secondName":"a ser",
                "surname":"actualizado",
                "secondSurname":"gutierrez",
                "documentTypeId":1,
                "documentNumber":'32132',
                "rolId":2,
                "email":"pedro2@mail.com",
                "password":"password",
                "phone":"2101121"
        })
        const response = await client.put('api/v1/user/update/'+res.body().id).header('Authorization',`Bearer ${token}`).json({
            "firstname":"pedro"
        })
        response.assertStatus(200)
        response.body().assert?.isObject()
        response.assert?.containsSubset(response.body(),{"message": "No hubo nada que actualizar. La operación terminó con exito."})
    })
    
    test('Should give error when trying to update user document with already registered in BD document...', async ({ client, assert }) => {
        const token = await getToken(1) // Obtener token de un usuario con rol 'admin'
        const alreadyRegisteredDocument = '2'
        let response
        try{
            response = await client.put('api/v1/user/update/1').header('Authorization',`Bearer ${token}`).json({
                "documentNumber":alreadyRegisteredDocument,
            })
        }catch(error){
            assert.isObject(JSON.parse(error))
            assert.containsSubset(JSON.parse(error),{'error':'El número de documento del usuario ya se encuentra registrado.'})
        }
    })
})