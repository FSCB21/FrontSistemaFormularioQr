/* Archivo que contiene los metodos de consulta al api, en este caso de lugar de registro */

//Importamos la libreria de axios la cual nos permite realizar consultas http o https usando diferentes metodos
import axios from "axios"

//Definimos API como el resultado de concatenar la variable de entorno api, con la adicion de "/lugar-registro", esto para definir una ruta por defecto de consulta en una constante
const API = process.env.REACT_APP_API + '/lugar-registro'

//Definimos la clase que tendra los metodos de consulta al api
class LugarRegistroService  {

    //Metodo que dara como resultado, el valor de retorno de la consulta a la ruta de api definida anterior mente en su metodo de state-true
    //Este valor de retorno son los lugares de registro que se encuentran activados para ser istos en el formulario
    getAllActives(){
        return axios.get(`${API}/state-true`)
    }

    //Metodo que da como resultado el valor de retoeno de la consulta al api en su metodo por defecto
    //Esto significa que retornara todas las ciudades esten activas o no
    getAll(){
        return axios.get(API)
    }

    //Metodo que creara un nuevo registro en la base de datos, en la seccion de lugar de registro
    //Para esto solicitamos como parametro la data del registro
    create(data){
        //Llamamos axios con el metodo de post, la ruta del api en la seccion de create
        //Y pasamos como argumento de cuerpo de la consulta toda la data que se solicito en los parametros
        return axios.post(`${API}/create`, data)
    }

    //Metodo que actualizara un registro en la base de datos, esto mediente el id de registro
    //Para esto solicitamos el objeto data como parametros
    //Definimos como parametro de consulta el id lugar de registro como el id que llega en el data
    //Pasamos el resto del objeto data por el cuerpo de la consulta
    //Tambien cabe aclarar que se usa el metodo put para realizar esta accion1
    update(data){
        return axios.put(`${API}/update?id_lugar_registro=${data.id_lugar_registro}`, data)
    }

    //Metodo que inhabilitara de la vista de formulario un determinado registro mediante el id de este
    //Para esto se solicita como parametros de funcion el id, para despues pasarlo como parametro de consulta
    disable(id){
        return axios.put(`${API}/disable?id_lugar_registro=${id}`)
    }
    
    //Metodo que habilitara en la vista de formulario un determinado registro que se encuentre deshabilitado mediante el id de este
    //Para esto se solicita como parametros de funcion el id, para despues pasarlo como parametro de consulta
    enable(id){
        return axios.put(`${API}/enable?id_lugar_registro=${id}`)
    }

}

//Exportamos la clase por defecto para que esta pueda ser usada en las demas partes del codigo
export default LugarRegistroService