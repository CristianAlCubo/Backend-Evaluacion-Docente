import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Answer from 'App/Models/Answer'
import AnswerForm from 'App/Models/AnswerForm'
import Form from 'App/Models/Form'
import Question from 'App/Models/Question'

export default class FormsController {
    public async createForm({request,response} : HttpContextContract){
        try{
            const {userId, answers} = request.all()
            if(!userId || !answers){
                throw new Error("Campos vacios")
            }
            const form = new Form()
            form.userId = userId
            await form.save()
            for (const answer of answers) {
                const answerForm = new AnswerForm()
                answerForm.idAnswer = answer
                answerForm.idForm = (await (Form.query().max('id')))[0]['max']
                await answerForm.save()
            }
            response.status(200)
            return {
                "state":true,
                "message":"Respuestas almacenadas con exito"
            }
        }catch(error){
            response.status(500)
            response.json({
                "state": false,
                "message": "Error al almacenar las respuestas",
                "error":error.message
            })
        }
    }

    public async getForm({response} : HttpContextContract){
        try {
            const form : Question[] = await Question.query().preload('answers',sql => {
                sql.select('id','answer')
            })
            response.status(200)
            return {
                "state":true,
                "questions":form
            }
        } catch (error) {
            response.status(500)
            response.json({
                "state": false,
                "message": "Error al obtener el listado",
                "error":error.message
            })
        }
    }

    public async getAnswers({response,params}: HttpContextContract){
        try {
            let idsForm = await Form.query().select('id').where('user_id',params.id_teacher)
            let forms : object[] = []
            for (const form of idsForm) {
                let formAnswers : object[] = []
                const answers = await AnswerForm.query().where('id_form',form.id).preload('answers',aquery => {
                    aquery.preload('question')
                })
                for (const answer of answers) {
                    formAnswers.push({
                        "question":answer.answers[0].question.question,
                        "answer":answer.answers[0].answer
                    })
                }
                forms.push(formAnswers)
            }

            response.status(200)
            response.json({
                "state":true,
                "answers": forms
            })
        } catch (error) {
            response.status(500)
            response.json({
                "state": false,
                "message": "Error al obtener el listado",
                "error":error.message
            })
        }
    }
}
