/* Archivo que contiene la configuracion basica de axios */

/**
 * Importamos axios...
 * Axios es la libreria que nos permite hacer consultas al api via https
 * Axios permite realizar consultas via GET, POST, PUT, DELETE... los cuales son los metodos que recibe el api rest
 * Para esto primero se llama a axios, despues el metodo como funcion... paso a seguir se define la ruta a la que se le va a hacer la solicitud, en el siguiente campo va el cuerpo de la solicitud, y por ultimo las configuraciones de este
 * ? axios.get('https://ejemploconsulta.com/api/login', {usuario: "admin", password: "ejemplo"})
 */
import axios from "axios";

//En la siguiente linea de codigo se define que en todas las consultas que se hagan a axios se va a enviar el token que se encuentra en el localStorage
axios.defaults.headers.common['token-login'] = localStorage.getItem('token-login')

//Se define una variable para evitar que salga el mismo mensaje de error varias veces
let evitar = 0

//Llmamos un interceptador de axios en este caso para antes de realizar la peticion
axios.interceptors.response.use(config=>{
    //En la siguiente linea de codigo se define que en todas las consultas que se hagan a axios se va a enviar el token que se encuentra en el localStorage
    axios.defaults.headers.common['token-login'] = localStorage.getItem('token-login')
    //Retonamos la configuracion
    return config;

    //En caso de error
  }, err=> {
    //Si el error llega a tener un estado de 401 o 408 y la variable de evitar es igual a 0
    if ((err.response.status === 401 || err.response.status === 408) && evitar === 0) {
      //Va a remover el toquen de acceso
      localStorage.removeItem('token')
      //Va a mostrar el porque del error
      alert(err.response.data.error)
      //Va a redirigir a la ventana de login
      window.location.href = '/#/login';
      //Va a recargar la pagina
      window.location.reload()
      //Va a declarar la variable de evitar como 1
      evitar = 1
    }
    //Retorna la promesa evitando el error
    return Promise.reject(err)
  });