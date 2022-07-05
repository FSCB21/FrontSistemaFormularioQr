/* Archivo que contiene los metodos de consulta al api, en este caso relacionados con el formulario principal */

//Importamos la libreria que permite realizar consultas a medios externos al sistema
import axios from "axios"

//Definimos una constante la cual sera el resultado de concatenar la variable de entorno de api con "/form"
const API = process.env.REACT_APP_API + '/form'

//Definimos la clase contendra todos los metodos de consulta
class FormService  {

    //Definimos el metodo que se encargara de llamar al api en su metodo de crear un nuevo regisro de usuario
    //Para esto requerimos que se pase como parametro la data del usuario
    newUser(data){
        //Retornamos el valor de axios con su metodo post, pasando como parametro de consulta el api en su meodo reg
        //Como cuerpo de la solicitud pasamos el parametro antes requerido en la funcion
        return axios.post(`${API}/reg`, data)
    }

    //Definimos un metodo el cual reenviara el mensaje al suaurio en dado caso que este no le haya llegado con el metodo de creacion
    //Como parametros solicitamos el numero del telefono del usuario
    errSendSms(num_tel){
        //Retornamos axios con su metodo post, pasando como ruta el valor de api y agregamos el metodo de error al enviar mensaje
        //Como objeto del cuerpo de consulta definimos el númeo de telefono y le ponemos como valor el numero que llega como parametro en la funcion
        return axios.post(`${API}/err-send-sms`, {telefono_contacto:num_tel})
    }

    //Definimos un metodo el cual hara el cambio de número de celular al usuario, para despues enviarle el mensaje de texto a ese nuevo número
    changeNumber(data){
        //retornamos axios con su metodo post, haciendo consulta a su metodo de err-change-number le pasamos como cuerpo de consulta la data que se solicita en los parametros de la funcion
        return axios.post(`${API}/err-change-number`, data)
    }

}

//Expostamos la clase por defecto para hacer uso de esta en cualquier parte del codigo donde sea requerida
export default FormService