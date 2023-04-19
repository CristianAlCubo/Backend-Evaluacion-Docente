import { test } from '@japa/runner'
import Question from 'App/Models/Question'
import { getToken } from './getToken'

test.group('Form CRUD tests...',()=>{
    test('Should create form when valid data is given...',async ({ client, assert }) => {
        const token_admin = await getToken(2) // Obtener token de un usuario con rol 'student'
        const response = await client.post('api/v1/form/postanswers').header('Authorization',`Bearer ${token_admin}`).json(        {
            "userId":"3",
            "answers":[1]
        })
        response.assertStatus(200)
        assert.properties(response.body(),['state','message'])
    })

    test('Should handle errors when trying to create form...',async ({ client, assert }) => {   
        try{
            const token_admin = await getToken(2) // Obtener token de un usuario con rol 'student'
            const response = await client.post('api/v1/form/postanswers').header('Authorization',`Bearer ${token_admin}`).json({})
            response.assertStatus(500)
        }catch(error){console.log("Error handled")}
    })

    test('Should list all form\' questions with their respective options',async ({ client, assert }) => {
        try{
            const token_admin = await getToken(1) // Obtener token de un usuario con rol 'admin'
            await client.post('api/v1/questions/create').header('Authorization',`Bearer ${token_admin}`).json({
                "question": "¿que dia es hoy?",
                "options": [
                    'lunes',
                    'martes',
                    'miercoles',
                    'jueves'
                ]
            })
            const token = await getToken(2) // Obtener token de un usuario con rol 'estudiante'
            const response = await client.get('api/v1/form/getQuestions').header('Authorization',`Bearer ${token}`)
            response.assertStatus(200)
            assert.isObject(response.body())
            assert.properties(response.body(),['state','questions'])
        }catch(error){
            console.log(error)
            const err = JSON.parse(error)
            assert.isObject(err)
            assert.properties(err,['state','message','error'])
        }
    })

    test('Should list all form\'s answers for a teacher id',async ({ client, assert }) => {
        try{
            const token = await getToken(2) // Obtener token de un usuario con rol 'estudiante'
            const response = await client.get('api/v1/form/getAnswers/3').header('Authorization',`Bearer ${token}`)
            response.assertStatus(200)
            assert.isObject(response.body())
            assert.properties(response.body(),['state','answers'])
            assert.isArray(response.body().answers)
        }catch(error){
            console.log(error)
            const err = JSON.parse(error)
            assert.isObject(err)
            assert.properties(err,['state','message','error'])
        }
    })
})
