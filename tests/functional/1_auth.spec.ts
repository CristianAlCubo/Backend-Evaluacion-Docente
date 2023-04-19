import { test } from '@japa/runner'
import { getToken } from './getToken'

test.group('Authentication and Authorization tests...',()=>{
    test('Should give error when trying to access to protected endpoint without authentication', async ({ client }) => {
        const response = await client.get('api/v1/user/getUsers')
        response.assertStatus(401)
        response.body().assert?.isObject()
        response.assert?.containsSubset(response.body(),{"mensaje":"Falta el token de autorización","estado":401})
    })

    test('Should give error when trying to access to protected endpoint with an expired token', async ({ client, assert }) => {
        const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjc4NzQ1NDU4LCJleHAiOjE2Nzg3NDU1Nzh9.AKgJs2DXxzqCb52kZwyY4PGozdTPRvOYUYfuYpfcW8Q'
        try{
            await client.get('api/v1/user/getUsers').header('Authorization',`Bearer ${expiredToken}`)
        }catch(error){
            assert.isObject(JSON.parse(error))
        }
    })

    test('Should give error when trying to access to protected endpoint with an invalid token', async ({ client, assert }) => {
        const invalidToken = 'a#32!sdjkf1_21'
        const response = await client.get('api/v1/user/getUsers').header('Authorization',`Bearer ${invalidToken}`)
        response.assertStatus(401)
        assert.containsSubset(response.body(),{"message": 'Error: Token inválido'})
    })

    test('Should give error when trying to access to only-admin endpoint with a non-admin token', async ({ client, assert }) => {
        const nonAdminToken = await getToken(2) // Obtener token de un usuario con rol 'estudiante'
        const response = await client.get('api/v1/user/getUsers').header('Authorization',`Bearer ${nonAdminToken}`)
        response.assertStatus(401)
        assert.containsSubset(response.body(),{"message": 'No tiene permisos para acceder a esta ruta'})
    })
})
