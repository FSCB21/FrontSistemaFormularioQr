/* Archivo que contiene los metodos de consulta al api en su respectia seccion de cumpleaños */

//Importamos la libreria que nos permite realizar consultas via http o https
import axios from "axios"

//Definimos una constante que tendra el resultado de concatenar la variable de entorno API con "/birthday"
const API = process.env.REACT_APP_API + '/birthday'

//Creacmos la clase que contiene todos los metodos de consulta al api
class CumpleañosService  {

    //Metodo de obtener las personas que cumplen años dependiendo el día
    //Solicitamos como parametro la fecha de la cual se quiere sacar el día de las persnas que cumplen años
    getByDay(fecha){
        //Hacemos la consulta al api via get, recurriamos al metodo de get-by-day, y pasamos como parametros de consulta la fecha que se envia en los parametros 
        return axios.get(`${API}/get-by-day?fecha=${fecha}`)
    }

    //Metodo que obtiene las personas que cumplen años en un determinado mes
    //Para esto se solicita una fecha como prametro
    getByMonth(fecha){
        //Realizamos la consulta al api,exactamente al metodo de obtener por mes
        //Pasamos como parametros de consulta la fecha que fue solicitada antes
        return axios.get(`${API}/get-by-month?fecha=${fecha}`)
    }

    //Metodo que obtiene las personas que cumplen años en un determinado rango de fechas en especifico
    //Como parametros de funcion se solicita la fecha de inicio y la fecha de fin
    getByRange(fecha_inicio,fecha_fin){
        //Realizamos la consulta via get al api, al metodo de get-by-range
        //Pasamos como parametros de consulta las fechas de la funcion
        return axios.get(`${API}/get-by-range?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`)
    }

    //Metodo que consulta las personas que cumplen años en u determinado rango de fechas, pero filtra por edad
    //Se pasan los mismos parametros de la funcion anterior pero agregando 2 de mas, en este caso edad de inicio y edad de fin
    getByRangeFilterAge(fecha_inicio,fecha_fin,edad_inicio,edad_fin){
        //Realizamos la consulta al api mediante el metodo get, donde definimos que queremos acceder al metodo de get-range-filter-age
        //Pasamos como parametros de consulta las fechas y las edades que se solicitan como parametros en la funcion
        return axios.get(`${API}/get-range-filter-age?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}&edad_inicio=${edad_inicio}&edad_fin=${edad_fin}`)
    }

    //Metodo que consulta las personas que cumplen años en un determinado rango de fechas, pero filtra segun el/los lugar/es de registro
    //SOlicita como parametros las fechas de filtrado de rango y el/los lugar del que se quieren filtrar
    getByRangeFilterLugar(fecha_inicio, fecha_fin, lugares){
        //Realizamos la consulta al api pero en este caso se usa el metodo post
        //Pasamos como parametros de consulta las fechas de inicio y fin
        //Y en el cuerpo de la consulta enviamos los lugares por los cuales se quiere filtrar
        return axios.post(`${API}/get-range-filter-lugar?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`, {lugares} )
    }

    //Metodo que realiza la consulta de las personas que cumplen años en un determinado rango de fechas, pero en este caso las ordena segun un determinado valor
    //Como parametros se solicitan la fecha de inicio, la fecha de fin... el campo por el cual se quiere ordenar y el tipo de orden
    getByRangeChangeOrder(fecha_inicio,fecha_fin, campo, tipo_orden){
        //Realizamos la consulta al api via get, exactamente a la funcion de obtener por rango pero cambiando el orden
        //Enviamos los parametros de funcion como prametros de consulta
        return axios.get(`${API}/get-range-change-order?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}&campo=${campo}&tipo_orden=${tipo_orden}`)
    }
}

//Exportamos la clase para que esta sea usada en otra seccion del codigo
export default CumpleañosService