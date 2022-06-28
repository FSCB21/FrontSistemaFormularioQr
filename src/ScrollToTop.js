/* Este archivo contiene el cmoponente que se encarga de que cada vez que se acceda a una pagina se haga un scroll a la parte superior de esta */

//Importamos un gancho de react, en este caso useEffect para ejecutar una funcion cada que se recarga el componente
import { useEffect } from 'react';

//Importamos los metodos de react router dom para el analisis de la ruta
import { useLocation, withRouter } from 'react-router-dom';

//Definimos nuestro metodo, llamamos las propiedades
const ScrollToTop = (props) => {

    //Definimos location como el resultado de la funcion de use location para que detecte cada que se cambia la ruta
    let location = useLocation();

    //Usamos el gancho useEffect, pasando callback de lo que queremos que se realice cada que se ejecute el gancho
    useEffect(() => {
        window.scrollTo(0, 0)
    //Pasamos un arreglo de los objetos que queremos que analise para que cuando estos cambien el gancho ejecute un proceso
    }, [location]);

    //Retornamos el objeto hijo que pasa por las props
    return props.children;
}

//Importamos por defecto el metodo whitRouter pasando como argumento la funcion antes creada
export default withRouter(ScrollToTop);
