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
    const [layoutMode, setLayoutMode] = useState(cookies.layautModeCookie?cookies.layautModeCookie:'static');

    //Definimos un gancho que contendra el color del fondo, se envia como argumento si esta definida la cookie con el mismo nombre, en caso de que esta no este definida enviara por defecto "light"
    const [layoutColorMode, setLayoutColorMode] = useState(cookies.layautColorModeCookie?cookies.layautColorModeCookie:'light')

    //Creamos el gancho donde definimos el estilo del input, pasamos como valor inicial "outlined"
    const [inputStyle, setInputStyle] = useState('outlined');

    //Creamos el gancho de ripple donde le pasamos como valor inicial true
    const [ripple, setRipple] = useState(true);

    //Creamos el gancho que nos indica si el menu esta o no inactivo
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);

    //Importamos el gancho que indica si el menu esta activo o no, pero cuando este es overlay
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);

    //
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);

    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);


    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    }

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value)
    }

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode)
        setCookie('layautModeCookie', mode, {path:'/'})
    }

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode)
        setCookie('layautColorModeCookie', mode, {path:'/'})
    }

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    }

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            }
            else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        }
        else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    }

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }
    const isDesktop = () => {
        return window.innerWidth >= 992;
    }

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

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
        
        <div className={wrapperClass} onClick={onWrapperClick}>

            <Route exact path="/"><FormNewUser/></Route>
            <Route path="/login"><LoginPage/></Route>
            <Route path="/dash">
                <AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode}
                    mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} />

                <div className="layout-sidebar" onClick={onSidebarClick}>
                    <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
                </div>

                <div className="layout-main-container">
                    <div className="layout-main">
                        <Route path="/dash/" exact render={() => <Dashboard  colorMode={layoutColorMode}/>} />
                        <Route path="/dash/registros/" exact ><Usuarios/></Route>
                        <Route path="/dash/cumpleaños" exact ><Cumpleaños/></Route>
                    </div>

                    <AppFooter layoutColorMode={layoutColorMode} />
                </div>

            </Route>

            <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
                layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />

            <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
                <div className="layout-mask p-component-overlay"></div>
            </CSSTransition>

        </div>
    );

}

export default App;
