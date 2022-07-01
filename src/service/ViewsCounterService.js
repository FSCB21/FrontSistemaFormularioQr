/* Archivo que contiene los metodos de consulta externa/obtencion de la informacion en este caso del contador de visitas */

//Importamos axios el cual nos sirve para hacer consultas via http o https segun se requiera
import axios from "axios"

//Definimos la constante API la cual sera el resultado de concatenar la variable de entorno del api con el metodo a consultar
const API = process.env.REACT_APP_API + '/visit-counter'

//Creamos una clase la cual va a tener los metodos de consulta
class ViewsCounterService  {

    //Metodo que obtendra la cantidad de personas que han accedido a una determinada pagina
    //Se pasa como parametro el nombre de la pagina
    getPageVisits(page){
        //Se va a retornar el resultado de la funcion de axios
        //Axios realiza una peticion get, a la ruta de API que se definio antes, donde accede a el metodo de get-visits
        //Pasa como parametros el nombre de pagina que se paso como parametro en la funcion
        //Esto retornara un objeto con el total de visitas que tiene la pagina que fue enviada
        return axios.get(`${API}/get-visits?page=${page}`)
    }

    //Metodo que aumentara en 1 el valor de una determinada pagina
    //Se pasa como parametro el nombre de la pagina
    newPageVisit(page){
        //Retornamos el resultado de la funcion de axios
        //Axios realiza una peticion get a new-visitit enviando como variable en la consulta el nombre de la pagina donde se realizo la visita
        return axios.get(`${API}/new-visit?page=${page}`)
    }

}

//Exportamos la clase para usarla en los demas componentes
export default ViewsCounterService