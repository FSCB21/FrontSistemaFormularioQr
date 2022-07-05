/* Archivo que contiene el metodo de consulta al api referente al acceso del sistema */

//Importamos la libreria que permite realizar consultas via http o https
import axios from "axios"

//Definimos el api como el resultado de concatenar la variable de entorno con el string "/credencial"
const API = process.env.REACT_APP_API + '/credencial'

//Definimos la clase que contendr< todos los metodos de consulta al api
class CredencialService  {

    //Metodo que retorna el token de acceso para el uso del api
    //Se solicitan como parametros de funcion la data, la cual contendra el usuario y contraseña de acceso al sistema
    login(data){
        //Realizamos la consulta en este caso via post al metodo "/login"
        //Pasamos por el cuerpo de la solicitud la data que fue antes enviada en la funcion
        return axios.post(`${API}/login`, data)
    }


}

//Exportamos la clase para que esta sea suada en otra seccion del codigo
export default CredencialService