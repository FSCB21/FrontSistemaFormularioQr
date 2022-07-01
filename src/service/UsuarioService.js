/* Archivo que contiene los metodos de consulta externa/obtencion de la informacion en este caso de la gestion de usuarios */

//Importamos axios para realizar consultas de manera sencilla
import axios from "axios"

//Declaramos el api el cual como valor tendra el contenido de la variale de entorno llamada "API" agregandole la ruta de usuario
const API = process.env.REACT_APP_API + '/usuario'

//Creamos la clase de usaurio service la cual contendra los respectivos metodos 
class UsuarioService  {

    //Definimos el metodo getAll el cual nos traera todos los registros que se encuentran en la base de datos, segunlos parametros que se le establezcan
    //Solicitamos como parametros la pagina, el tamaño de pagina y si se requiere un estado de codigo
    getAll(page, size, state_cod){
        //Retornamos el valor de resultado de usar axios con el metodo get consultando la ruta de api
        //Pasamos como parametros de consulta:
        //La pagina: el número de la pagina desde donde se desean consultar los registros
        //El tamaño: El número de registros por pagina
        //El estado de codigo: Si se desea o no que filtre por estado codigo de descuento

        //Esto retornara un arreglo de filas, aparte del número de pagina y el total de registros
        return axios.get(`${API}?page=${page}&size=${size}&state_cod=${state_cod?state_cod:''}`)
    }

    //Definimos el metodo getAllFiltered el cual traera todos los registros pero condicionando segun se necesite
    //Como parametros solicitamos el atributo, el valor, y el metodo de comparacion aparte de los mismos parametros anteriores
    //El atributo:Campo por el cual se va a realizar el filtrado
    //El valor:Campo con el que se debe coincidir el valor filtrado
    //El metodo es la forma en la que se va a validar el atributo... es igual? es diferente? contiene?
    getAllFiltered(atribute, value, method, page, size, state_cod){
        //Retornamos el valor de resultado que nos da axios ejecutando un metodo via get, en este caso la ruta tiene filtered-users
        //Pasamos los valores anteriormente definidos por el query de la peticion
        return axios.get(`${API}/filtered-users?atribute=${atribute}&value=${value}&method=${method}&page=${page}&size=${size}&state_cod=${state_cod?state_cod:''}`)
    }

    //Definimos el metodo getAllByRangeDate el cual traera todos los registros pero condicionando por rango de fecha
    //Como parametros solicitamos la fecha inicio, la fecha fin y el campo de comparacion aparte de los mismos parametros anteriores
    //La fecha de inicio: fecha inicial a buscar lo respectivos registros
    //La fecha fin: fecha final a buscar los registros
    //El campo hace referencia al campo a consultar las 2 fechas establecidas anteriormente
    getAllByRangeDate(fechaInicio, fechaFin, campo, page, size, state_cod){
        //Retornamos el valor de resultado de la consulta via get a la ruta del PI en este caso agregando filter-by-date-range
        //Como argumentos de consulta enviamos los parametros establecidos en la funcion anterior mente
        return axios.get(`${API}/filter-by-date-range?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&campo=${campo}&page=${page}&size=${size}&state_cod=${state_cod?state_cod:''}`)
    }

    //Definimos el metodo para actualizar la informacion de un determinado usuario
    //Como paramertos requerimos la data del usaurio el cual se va a actualizar
    update(data){
        //Ejecutamos el metodo put que se encuentra en la ruta API con ruta update
        //Como parametros de consulta enviamos el id del usaurio que esta en el data
        //Como cuerpo de consulta enviamos la data que fue pasada como parametros en el metodo
        return axios.put(`${API}/update?id_usuario=${data.id_usuario}`,data)
    }

    //Definimos el metodo para borrar de manera permanente un registro
    //Como parametros requerimos el id del usaurio a eliminar
    delete(id){
        //Retornamos el resultado de ejecutar el metodo delete de la ruta API
        //Se pasan como argumentos de consulta el id que se solicito como parametro
        return axios.delete(`${API}/delete?id_usuario=${id}`)
    }
}

//Exportamos por defecto la clase que fue recientemente creada
export default UsuarioService