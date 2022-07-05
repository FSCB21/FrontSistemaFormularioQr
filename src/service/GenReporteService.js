/* Archivo que contendra el respectivo metodo de consulta al api para la generacion de reportes */

//Importamos la libreria que permite realizar consultas a medios externos al proyecto
import axios from "axios"

//Declaramos la constante de api en este caso llama la variable de entrono y le cancatena el acceso al metodo de generar reporte
const API = process.env.REACT_APP_API + '/gen-reporte'

//Creamos la clase que contendra los metodos respectivos de generar reporte
class GenReporteService  {

    //Definimos el metodo que nos ayudara a consultar el apien su metodo de generar reporte
    //Como parametros de metodo solicitamos la data para filtrar la consulta
    genReporte(data){
        //Usamos axios en su metodo de get, como ruta definimos el api y como cuerpo enviamos la data
        return axios.post(API,data)
    }

}

//Exportamos la clase para hacer uso de esta en otra seccion del codigo 
export default GenReporteService