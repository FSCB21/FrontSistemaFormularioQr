/* Archivo que contiene los metodos de consulta al api en este caso del modulo del dashboard */

//Importamos la libreria que permite realizar consultas a sistemas externos al mismo
import axios from "axios"

//Definimos la constante API como el resultado de concatenar la variable de entorno api con "/data-dash"
const API = process.env.REACT_APP_API + '/data-dash'

//Definimos la clase que contendra todos los metodos de consulta
class DashBoardDataService  {

    //Metodo que permite la obtencion de la informacion basica de las cartas del dashboard
    getDataCartas(){
        return axios.get(`${API}/get-data-cards`)
    }

    //Metodo que permite la obtencion de la informacion del total mensual por lugar de registro
    //Recibe como parametros un objeto denominado data
    getDataMensualLugarRegistro(data){
        //Realiza la consulta al api con el metodo de obtener y contar por lugar de registro
        //Se pasan como parametros de consulta la fecha de inicio, la fecha de fin y el id del lugar de registro al que se desea consultar
        return axios.get(`${API}/get-data-count-lugar-registro?fecha_inicio=${data.fecha_inicio}&fecha_fin=${data.fecha_fin}&id_lugar_registro=${data.id_lugar_registro?data.id_lugar_registro:''}`)
    }

    //Metodo que obtiene todas las edades de los usuarios que estan registrados y el promedio de edades
    getDataEdades(){
        return axios.get(`${API}/get-data-age`)
    }

}

//Exportamos la clase por defecto apra que esta sea usada en otra seccion del codigo
export default DashBoardDataService