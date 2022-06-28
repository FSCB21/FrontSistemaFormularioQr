/* Archivo principal del codigo Js donde se desplegan todos los componentes y se integran al codigo html */

/**
 * El Front del Proyecto fue creado a base de una plantilla para react
 * 
 * Esta plantilla se puebe encontrar en el siguiente enlace:
 * ?LINK PLANTILLA: https://www.primefaces.org/sakai-react/#/
 * La cual se basa de la siguiente libreria de componentes
 * ?LINK PLANTILLA: https://www.primefaces.org/primereact/
 * Toda la informacion de como se usan estas plantillas se encuentran en las direcciones de enlace
 * 
 * !Aparte el proyecto es netamente react en su version 17.0.1
 * El proyecto cuenta con un apartado de services el cual realiza consultas via axios al api
 * El api es donde se maneja la informacion
 * 
 * El Front esta dividido en 3 partes: Servicios, Paginas, Componentes
 * 
 * Los archivos Css se encuentran en la carpeta public
 * 
 * Para ejecutar el proyecto es necesario descargar las librerias para esto usar el comando
 * * npm i
 * 
 * Para ejecutarlo en fase de desarrollo ejecutar el siguiente comando
 * * npm start
 * 
 * Para pasar el proyecto a un archivo reconosido por cualquier servidor es necesario ejecutar el siguiente comando
 * * npm run build
 * 
 */

//Libreria importada por defecto por la plantilla de estilos
import 'react-app-polyfill/ie11';

//Importamos react para decir que este es un componente de react
import React from 'react';

//Importamos la libreria de reactDom para realizar el proceso de incersion de componentes en el archivo html
import ReactDOM from 'react-dom';

//Importamos nuestro componente app, componente en el cual estan desencadenados todos nuestros componentes
import App from './App';

//Importamos el componente de hashRouter para poder acceder a nuestros archivos de la carpeta public de manera sencilla, aparte de facilitar el desplazamiento
import { HashRouter } from 'react-router-dom'

//Importamos el componente que nos ayuda a generar un scroll a la parte superior del sistema cada que ingresamos a una secicond e la pagina
import ScrollToTop from './ScrollToTop';

//Importamos locale de primeract para gestionar el idioma de la plantilla y el formato que debe tener las fechas
import { addLocale, locale } from 'primereact/api';

//La libreria react-cookie nos ayuda para realizar un manejo sencillo de las cokkies en el sistema
//Importamos el componente de cookies de manera general para hacer usode este en todo el proyecto
import { CookiesProvider } from 'react-cookie';

//Importamos la configuracion basica de axios, este archivo contiene el manejo de errores y el manejo de token del api
import './service/AxiosConfig'

//Con el metodo de addLocale cambiamos la configuracion local de react definimos un nuevo idioma como "es"
//Este nuevo elemento local tendra como primer dia de la semana el 1 que es domingo
//Los nombres largos de los dias
//Los nombres cortos de los dias
//Las letras que representan cada dia
//Los nombres de los meses
//los nombres cortos de los meses
//Como se dice hoy
//Y el aprtado de borrar
addLocale('es', {
    firstDayOfWeek: 1,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Borrar'
});
//Definimos que el local del sistema sera el elemento creado anteriormente
locale('es');

//Usamos el elemento reactDom para renderisar todos nuestros componentes react en el archivo de html
ReactDOM.render(
    //Nuestro contenedor principal sera el hashRouter el cual define un "#" en la ruta del sistema
    <HashRouter>
        {/* El siguiente COmponente sera el del manejo de cookies ya que estas se manejaran de manera global en el sistema */}
        <CookiesProvider>
            {/* El siguiente componente sera el que permite el scroll a la parte de arriba cada vez que se accede a una pagina */}
            <ScrollToTop>
                {/* Y por ultimo El archivo sentral de nuestros componentes, de aqui se desprenden una estructura de componentes definida */}
                <App/>
            </ScrollToTop>
        </CookiesProvider>
    </HashRouter>,
    //Definimos en que parte se van a implementar los componentes de react
    //En este caso accedemos al id de un elemento donde sea "root"
    document.getElementById('root')
);