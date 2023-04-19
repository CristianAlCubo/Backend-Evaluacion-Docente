import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Question from 'App/Models/Question'
import Answer from 'App/Models/Answer'
import Database from '@ioc:Adonis/Lucid/Database'

export default class QuestionsController {

    public async createQuestion({request, response} : HttpContextContract){
        try {
            const {question, options} = request.all()
            const myQuestion = new Question()
            if(!question || !options){
                throw new Error("Campos vacios")
            }else{
                myQuestion.question = question
                await myQuestion.save()
                for (const option_ of options) {
                    let myOption = new Answer()
                    myOption.answer = option_.opcion
                    const lastQuestionId = (await (Question.query().max('id')))[0]['max']
                    myOption.questionId = lastQuestionId
                    myOption.save()
                }
            }
            response.status(200)
            response.json({"state":true,"message":"Pregunta creada exitosamente"})
        } catch (error) {
            response.status(500)
            response.json({"state":false,"message":"Error al crear la pregunta","error":error.message})
        }
    }

    public async getQuestions({response} : HttpContextContract){
        try{
            const questions = await Question.all()
            response.status(200)
            response.json({
                "state":true,
                "questions":questions
            })
        }catch(error){
            response.status(500)
            response.json({
                "state": false,
                "message": "Error al listar las preguntas",
                "error":error.message
            })
        }
    }

    public async getQuestionOptions({response,params} : HttpContextContract){
        try {
            const options = await Database.from('answers').select('id','answer as option').where('question_id',params.id)
            response.status(200)
            response.json({
                "state":true,
                "message":"Listado de opciones",
                "options":options
            })
        } catch (error) {
            response.status(500)
            response.json({
                "state": false,
                "message": "Error al obtener el listado de opciones",
                "error":error.message
            })
        }
    }

    public async updateQuestion({request,response,params} : HttpContextContract){
        try {
            const {question} = request.all()
            const id = params.id
            const myQuestion = await Question.findOrFail(id)
            if(!myQuestion){
                throw new Error(`La pregunta con ID ${id} no existe.`)
            }
            myQuestion.question = question
            await myQuestion.save()
            response.status(200)
            response.json({
                "state": true,
                "message": "Pregunta Editada con exito"
            })
        } catch (error) {
            response.status(500)
            response.json({
                "state": false,
                "message": "Error al editar la pregunta",
                "error":error.message
            })
        }
    }

    public async updateAnswer({request,response,params} : HttpContextContract){
        try {
            const {opcion} = request.all()
            const id = params.id
            const myAnswer = await Answer.findOrFail(id)
            if(!myAnswer){
                throw new Error(`La pregunta con ID ${id} no existe.`)
            }
            myAnswer.answer = opcion
            await myAnswer.save()
            response.status(200)
            response.json({
                "state": true,
                "message": "Opcion Editada con exito"
            })
        } catch (error) {
            response.status(500)
            response.json({
                "state": false,
                "message": "Error al editar la opcion",
                "error":error.message
            })
        }
    }

    public async deleteQuestion({response,params} : HttpContextContract){
        try {
            const id = params.id
            const question = await Question.findOrFail(id)
            await question.delete()
            response.status(200)
            response.json({
                "state": true,
                "message": "Pregunta Eliminada con exito"
            })
        } catch (error) {
            response.status(500)
            response.json({
                "state": false,
                "message": "Error al eliminar la pregunta",
                "error":error.message
            })
        }
    }
}
