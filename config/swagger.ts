import { SwaggerConfig } from '@ioc:Adonis/Addons/Swagger'

export default {
	uiEnabled: true, //disable or enable swaggerUi route
	uiUrl: 'docs', // url path to swaggerUI
	specEnabled: true, //disable or enable swagger.json route
	specUrl: '/swagger.json',

	middleware: [], // middlewares array, for protect your swagger docs and spec endpoints

	options: {
		definition: {
			openapi: '3.0.0',
			info: {
				title: 'Evaluación docente',
				version: '1.0.0',
				description: "Aplicación de backend para gestionar la evaluación de docentes de un plantel educativo. Esta API se encuentra protegida mediante JWT. Para todos los endpoints, excepto el login, es necesario un Token. Existen 3 tipos de Token: Admin, para usuarios admin. Student, para usuarios estudiantes. Autorización, que hace referencia a cualquiera de los dos tokens anteriores. Para ingresar con un usuario admin use el corre 'admin@mail.com' y para un usuario student 'student@mail.com'. Ambas cuentas usan la contraseña 'password'"
			}
		},

		apis: [
			'app/**/*.ts',
			'docs/**/*.yml',
			'start/routes.ts'
		],
		basePath: '/'
	},
	mode: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'RUNTIME',
  specFilePath: 'docs/swagger.json'
} as SwaggerConfig
