/* Archivo que contiene el estilado y el primer orden de componentes en la gerarquia de componentes */

//Importamos react para que se sepa que es un componente
//Importamos el gancho de useEffect para que se ejecute una determinada linea de codigo cada que se renderiza el componente
//Importamos el gancho de useState para inicializar un valor y que este sea cambiado en directo dependiendo la accion del usuario
import React, { useState, useEffect } from 'react';


//Importamos clasnames para el mejor uso de clases en los componentes
import classNames from 'classnames';

//De router-dom importamos Route para que segun la ruta muestre un determinado grupo de componentes
import { Route } from 'react-router-dom';

//Importamos el siguiente componente que nos permite animar un componente
import { CSSTransition } from 'react-transition-group';

//Importamos la parte superior de la pagina (en este caso la pagina que se muestra despues de acceder al sistema)
import { AppTopbar } from './AppTopbar';

//Importamos el pie de la pagina (en este caso el pie de pagina que se muestra al iniciar sesion)
import { AppFooter } from './AppFooter';

//Importamos la etiqueta de menu de la aplicacion (se muestra al acceder al sistema)
//Este menu es el que permite desplpazarse entre todo el sistema, dando las secciones y retornando con una redireccion despues de dar clic en el
import { AppMenu } from './AppMenu';

//Importamos el componente de configuracion de pagina, el cual es el engranaje que aparece al lado derecho del sistema
import { AppConfig } from './AppConfig';

//Importamos primereact como objeto para cambiar configuraciones por defecto de este
import PrimeReact from 'primereact/api';

//Se importa la configuracion de estilos css de prime react
import 'primereact/resources/primereact.css';

//Importamos la configuracion de iconos de prime react
import 'primeicons/primeicons.css';

//Importamos el estilado de prime flex para que este sea usado en los componentes de la pagina
import 'primeflex/primeflex.css';

//Importamos los temas de prism
import 'prismjs/themes/prism-coy.css';

//Importamos las banderas de estilado
import './assets/demo/flags/flags.css';

//Importamos el demo de estilado
import './assets/demo/Demos.scss';

//Importamos el estilado general
import './assets/layout/layout.scss';

//Importamos las variables de estilado de app
import './App.scss';

//Importamos el componente del Formulario
import FormNewUser from './pages/FormNewUser';

//Importamos el componente de la seccion de la pagina de inicio
import LoginPage from './pages/LoginPage';

//Importamos el componente de usuarios (lugar donde se encuentran todos los registros del sistema)
import Usuarios from './pages/Usuarios';

//Importamos el componente de dashboaard
import Dashboard from './pages/Dashboard';

//Importamos el componente de la seccion de cumpleaños
import Cumpleaños from './pages/Cumpleaños';

//Importamos el gancho de useCookies para el manejo de estas en el archivo
import { useCookies } from 'react-cookie';

//Importamos el contenido del menu
import menu from './MenuConten'

//Definimos el componente principal del archivo
const App = () => {

    //Definimos el gancho de cookies donde le pasasamos como argumentos las cookies que se quieren manejar en el componente
    const [cookies, setCookie] = useCookies(['layautModeCookie', 'layautColorModeCookie']);

    //Definimos un gancho de estado como el modo de menu, decimos que si hay un modo definido en las galletas use ese modo, en caso de que no este definido use por defecto el valor de static
    const [layoutMode, setLayoutMode] = useState(cookies.layautModeCookie ? cookies.layautModeCookie : 'static');

    //Definimos un gancho que contendra el color del fondo, se envia como argumento si esta definida la cookie con el mismo nombre, en caso de que esta no este definida enviara por defecto "light"
    const [layoutColorMode, setLayoutColorMode] = useState(cookies.layautColorModeCookie ? cookies.layautColorModeCookie : 'light')

    //Creamos el gancho donde definimos el estilo del input, pasamos como valor inicial "outlined"
    const [inputStyle, setInputStyle] = useState('outlined');

    //Creamos el gancho de ripple donde le pasamos como valor inicial true
    const [ripple, setRipple] = useState(true);

    //Creamos el gancho que nos indica si el menu esta o no inactivo
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);

    //Importamos el gancho que indica si el menu esta activo o no, pero cuando este es overlay
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);

    //Llamamos el gancho que valida si el menu en modo de celular esta activo
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    //Llamamos el gancho que valida si la barra superior esta activa con el modo de celular
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);

    //Llamamos el objeto ripple de react y lo establecemos como verdadero para que se vea un efecto en los botones al momento de pulsarlos
    PrimeReact.ripple = true;

    //Definimos una variable llamda menuClick como falsa, que escuchara el momento en el que se le da click a un menu
    let menuClick = false;
    //Definimos una variable para el topbar como falsa, que escuchara el momento en el que se le da click a la barra superior
    let mobileTopbarMenuClick = false;

    //Usamos UseEffect para definir que linea de codigo queremos que se ejecute cada que se renderiza el componente
    useEffect(() => {
        //Si el valor del gancho mobileMenuActive es falso
        if (mobileMenuActive) {
            //Va a agregar una clase al cuerpo del documento, esta clase esconde el menu
            addClass(document.body, "body-overflow-hidden");
        } else {
            //Si no va a remover la clase que esconde el menu y lo va a mostrar
            removeClass(document.body, "body-overflow-hidden");
        }
        //Esta funcion no solo se ejecutara cuando se renderice el componente sino que tambien se va a ejecutar cada que el valor del gancho mobileMenuActive
    }, [mobileMenuActive]);

    //Definimos un nuevo metodo el cual cambiara el estilo del input, solicita como parametros un inputStyle que se ra el que le va a establecer como el estilo del input cada que se ejecuta la funcion
    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    }

    //Metodo que cambia si se quiere o no tener el efecto de ripple
    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value)
    }

    //Funcion que se encarga de cambiar el modo del menu lateral derecho, pide como parametros el modo
    const onLayoutModeChange = (mode) => {
        //Va a cambiar el valor del gancho de estado segun el parametro que sera enviado
        setLayoutMode(mode)
        //Establece la cookie para que almacene la opcion de estilado que configure el usuario
        setCookie('layautModeCookie', mode, { path: '/' })
    }

    //Funcion que se encambia el color de fondo en el aplicativo, solicita como parametros el mode
    const onColorModeChange = (mode) => {
        //Cambia el valor del gancho de estado segun el parametro solicitado en la funcion
        setLayoutColorMode(mode)
        //Establece una cookie que almacenara este valor para todas las rutas
        setCookie('layautColorModeCookie', mode, { path: '/' })
    }

    //Funcion que detecta cuando se da un clic afuera del menu//en el contenedor del sistema
    //Solicita como parametros un evento
    const onWrapperClick = (event) => {
        //Si no dio click en algun menu
        if (!menuClick) {
            //Va a esconder ambos menus, definiendo el valor de su gancho como false
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        //Si no dio click en el topbar del modo de celular
        if (!mobileTopbarMenuClick) {
            //Escondera este definiendo el valor de su gancho de estado como false
            setMobileTopbarMenuActive(false);
        }

        //Se establece el valor de las variables de menuClick y mobileTopbar como false
        mobileTopbarMenuClick = false;
        menuClick = false;
    }

    //Funcion que se encarga de esconder o mostrar el menu
    const onToggleMenuClick = (event) => {
        //Establece el menuClick como verdadero 
        menuClick = true;

        //Si al realizar la funcion que valida si es un escritorio esta responde como verdadero
        if (isDesktop()) {
            //Se valida si el modo del menu es overlay y si la respuesta es si
            if (layoutMode === 'overlay') {
                //Valida si es verdadero que se esta mostrando el menu de celular
                if (mobileMenuActive === true) {
                    //Define como verdadero el layout del menu
                    setOverlayMenuActive(true);
                }

                //Establece el valor contrario al valor actual de mostrar el menu
                setOverlayMenuActive((prevState) => !prevState);
                //Indica como falso el valor del menu
                setMobileMenuActive(false);
            }
            //Si no, si el menu es estatico
            else if (layoutMode === 'static') {
                //Va a definir la visibilidad del menu como el valor contrario de esta
                setStaticMenuInactive((prevState) => !prevState);
            }
        }
        //Si no es un desktop
        else {
            //Va a cambiar el estado a visible o a escondido al dar click en el boton
            setMobileMenuActive((prevState) => !prevState);
        }

        //Se previene el funcionamiento de boton
        event.preventDefault();
    }

    //Al momento de darClick encima de la sideBar
    const onSidebarClick = () => {
        //Se define menuClick como verdadero
        menuClick = true;
    }

    //Funcion que escucha cuando se da click en el topbar menu
    const onMobileTopbarMenuClick = (event) => {
        //Define como verdadero el valor de la variable de topbarMenu
        mobileTopbarMenuClick = true;

        //Define el valor contrario de mobileMenuActive
        setMobileTopbarMenuActive((prevState) => !prevState);
        //Se previene el funcionamiento de boton
        event.preventDefault();
    }

    //Al momento de dar click en el menu
    const onMobileSubTopbarMenuClick = (event) => {
        //Definira el valor como verdadero
        mobileTopbarMenuClick = true;
        //Se previene el funcionamiento de boton
        event.preventDefault();
    }

    //Al momento de darle click al item del menu
    const onMenuItemClick = (event) => {
        //Si el evento no tiene items en los items
        if (!event.item.items) {
            //Definira como falso el valor de los ganchos de menu
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }

    //Funcion que valida si el tamaño de la pantalla es de un escritorio o mas grande
    const isDesktop = () => {
        //Retorne la validacion de si el tamaño es mayor a 992px
        return window.innerWidth >= 992;
    }

    //metodo que agrega clases a los diferentes componentes, segun se solicite
    //Pasamos como parametros el elemento y la nombre de clase
    const addClass = (element, className) => {
        //Si el elemento tiene lista de clases
        if (element.classList)
            //Va a agregar la nueva clase a la estructura
            element.classList.add(className);
        else
            //Si no va a crearle una nueva clase agregandole un espacio
            element.className += ' ' + className;
    }

    //Metodo que quita la clase del elemento
    //Pasamos como parametros el elemento y la nombre de clase
    const removeClass = (element, className) => {
        //Si el elemento contiene una lista de clases
        if (element.classList)
            //Va a quitarle la clase segun el className
            element.classList.remove(className);
        else
            //Si el elemento no tiene, va a quitarle la clase de una manera rebuscada
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    //Definimos un objeto el cual tendra las clases que se definen a continuacion 
    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-theme-light': layoutColorMode === 'light'
    });

    return (
        /* Etiqueta general que contiene gran parte de el proyecto */

        //Se envia como clasname el objeto definido anterior mente
        //Al momento de dar click ejecutara la funcion de onWrapperClick
        <div className={wrapperClass} onClick={onWrapperClick}>

            {/* Etiqueta Route que muestra un determinado contenido dependiendo la ruta de la url */}
            {/* Cuando la ruta sea exactamente '/' va a renderizar el componente FormNewUser */}
            <Route exact path="/"><FormNewUser /></Route>
            {/* Cuando la ruta sea exactamente '/login' va a renderizar la pagina LoginPage */}
            <Route path="/login"><LoginPage /></Route>
            {/* Cuando la ruta sea '/dash' va a renderizar las siguientes etiquetas */}
            <Route path="/dash">
                {/* Va a renderizar el topBar de la aplicacion */}
                {/**
                 * Se le pasan como parametros las funciones y valores entes declarados
                 */}
                <AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode}
                    mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} />

                {/* Se remderizara una etiqueta div que contiene como clase 'layaut-sidebar'. Tambien se dice que al momento de dar click ejecute la funcion de onSidebarClick*/}
                <div className="layout-sidebar" onClick={onSidebarClick}>
                    {/* Se llama la etiqueta AppMenu pasandole como parametros el menu, y 2 funciones que escuchan el momento de dar click */}
                    <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
                </div>

                {/* se define una etiqueta contenedora con la clase de 'layaut-main-container' */}
                <div className="layout-main-container">
                    {/* Se define otra etiqueta con la clase 'layout-main' */}
                    <div className="layout-main">
                        {/* Segun la ruta va a renderizar los siguientes componentes */}

                        {/* Si la ruta es exactamente "/dash/" va arenderizar el componente de dashboard y va a pasar el color por las propiedades*/}
                        <Route path="/dash/" exact render={() => <Dashboard colorMode={layoutColorMode} />} />
                        {/* Si la ruta es exactamente "/dash/registros/" va a renderizar el componente de Usuarios */}
                        <Route path="/dash/registros/" exact ><Usuarios /></Route>
                        {/* Si la ruta es exactamente igual a "/dash/cumpleaños" va a reenderizar el componente de cumpleños */}
                        <Route path="/dash/cumpleaños" exact ><Cumpleaños /></Route>
                    </div>

                    {/* Se llama el componente de Footer y se le pasa el color por los parametros */}
                    <AppFooter layoutColorMode={layoutColorMode} />
                </div>

            </Route>

            {/* Va a llamar el componente de appConfig, le pasa como parametros el efeccto de ripple ademas de varias funciones que son utiles y necesarias para el funcionamiento de este */}
            <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
                layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />

            {/* Va a llamar a la etiqueta de transision pasandole parametros de tiempo de espera y demas */}
            <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
                {/* Crea una etiqueta que sera la mascara del componente, para la animacion */}
                <div className="layout-mask p-component-overlay"></div>
            </CSSTransition>

        </div>
    );

}
//Exportamos la etiqueta para usarla en el index
export default App;
