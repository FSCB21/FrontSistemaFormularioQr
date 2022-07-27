/* Archivo que contiene el componente de configuracion ubicado en el lateral derecho de la pagina */

//Importamos react para que detecte que es un componente de react
//Importamos el gancho de useCallback
//El gancho de useEffect el cual es aquel que se ejecuta cuando se inicia el componente
//El gancho de useRef para crear una referencia de un componente
//Y el gancho de useState para crear un estado y cambiarlo dependiendo de como se necesite
import React, { useCallback, useEffect, useRef, useState } from 'react';

//Importamos classname para una gestion de las clases de manera dinamica
import classNames from 'classnames';

//Importamos radioButton de react el cual es un componente que facilita el estilado de los radio buton (selectores en los formularios)
import { RadioButton } from 'primereact/radiobutton';

//Importamos el componente Button de react el cual facilita el estilado y uso de los botones
import {Button} from "primereact/button";

//Importamos el componente Route del react router dom, el cual renderizara los componentes si la ruta pertenece a una opcion en especifico
import { Route } from 'react-router-dom';

//Importamos el metodo de useCookies el cual nos permite realizar el manejo de las cookies en el componente
import { useCookies } from 'react-cookie';

//Exportamos el componente de appConfig 
export const AppConfig = (props) => {

    //Definimos las galletas que vamos a usar en el componente, como si fuera un gancho de estado, donde cookies es el valor y el set para cambiar el valor
    //Indicamos que en el componente solo se van a usar las cookies de scale y theme
    const [cookies, setCookie] = useCookies(['scaleCookie','themeCookie']);

    //Indicamos un nuevo gancho de estado donde establecemos si el menu esta activo o no, en este caso se deja por defecto que el menu esta inactivo
    const [active, setActive] = useState(false);

    //Indicamos un nuevo gancho en este caso para la escala del sitio (tamaño)
    //Si existe una cookie que almacene la escala va a definir esta escala como la que esta en la galleta... si no hay una cookie definida por defecto sera 14
    const [scale, setScale] = useState(cookies.scaleCookie?parseInt(cookies.scaleCookie):14);

    //Se definen las posibles escalas del sistema donde 11 es la mas alejada hasta 17 que es la ams cercana
    const [scales] = useState([11,12,13,14,15,16,17]);

    //Indicamos un nuevo gancho de estado para indicar cual es el tema de css que se esta aplicando
    //Si existe una galleta con este valor tomara ese valor, si no tomara el valor de lara-light-indigo por defecto
    const [theme, setTheme] = useState(cookies.themeCookie?cookies.themeCookie:'lara-light-indigo');

    //Creamos config como una referencia
    const config = useRef(null);

    //Creamos outsideClickListener como una referencia
    let outsideClickListener = useRef(null);

    //Metodo creado por la plantilla
    const unbindOutsideClickListener = useCallback(() => {
        if (outsideClickListener.current) {
            document.removeEventListener('click', outsideClickListener.current);
            outsideClickListener.current = null;
        }
    }, []);

    //Metodo creado en la plantilla
    const hideConfigurator = useCallback((event) => {
        setActive(false);
        unbindOutsideClickListener();
        event.preventDefault();
    }, [unbindOutsideClickListener]);

    //Metodo creado por la plantilla el cual cierra el menu de configuracion cuando se da clic por fuera de este
    const bindOutsideClickListener = useCallback(() => {
        if (!outsideClickListener.current) {
            outsideClickListener.current = (event) => {
                if (active && isOutsideClicked(event)) {
                    hideConfigurator(event);
                }
            };
            document.addEventListener('click', outsideClickListener.current);
        }
    }, [active, hideConfigurator]);


    //Gancho use effect que habre o cierra el menu segun el estado de este
    useEffect(() => {
        if (active) {
            bindOutsideClickListener()
        }
        else {
            unbindOutsideClickListener()
        }
    }, [active, bindOutsideClickListener, unbindOutsideClickListener]);

    //Metodo creado por la plantilla que valida el correcto funcionamiento del menu lateral derecho
    const isOutsideClicked = (event) => {
        return !(config.current.isSameNode(event.target) || config.current.contains(event.target));
    }

    //Metodo que cambia la escala del archivo a una escala inferior
    const decrementScale = () => {
        //Definimos i como una funcion que retorna un valor en menos 1 al parametro que es ingresado
        let i = (prevState) => --prevState
        //Definimos la cookie de escala como el retorno de la funcion i pasando el valor del gancho de escala, y definimos para que rutas este estara disponible... decimos que estara en todas las rutas
        setCookie('scaleCookie', i(scale), {path: '/', sameSite:'lax'})
        //Cambiamos el valor del gancho como uno menos del valor actual
        setScale((prevState) => --prevState);
    }

    const incrementScale = () => {
        //Definimos i como una funcion que retorna un valor en mas 1 al parametro que es ingresado
        let i = (prevState) => ++prevState
        //Definimos la cookie de escala como el retorno de la funcion i pasando el valor del gancho de escala, y definimos para que rutas este estara disponible... decimos que estara en todas las rutas
        setCookie('scaleCookie', i(scale), {path: '/',  sameSite:'lax'})
        //Cambiamos el valor del gancho como uno mas del valor actual
        setScale((prevState) => ++prevState);
    }

    //Cada que se renderice el componente o cambie el valor del gancho "scale" va a definir el tamaño de la letra como el valor de scale + "px" 
    useEffect(() => {
        document.documentElement.style.fontSize = scale + 'px';
    }, [scale])

    //Definimos una funcion que cambia el estado del menu
    const toggleConfigurator = (event) => {
        setActive(prevState => !prevState);
    }

    //Metodo de plantilla para la configuracion de la clase
    const configClassName = classNames('layout-config', {
        'layout-config-active': active
    })

    //Metodo creado por la plantilla para que funcione correctamente el cambio de estilo
    const replaceLink = useCallback((linkElement, href, callback) => {
        if (isIE()) {
            linkElement.setAttribute('href', href);

            if (callback) {
                callback();
            }
        }
        else {
            const id = linkElement.getAttribute('id');
            const cloneLinkElement = linkElement.cloneNode(true);

            cloneLinkElement.setAttribute('href', href);
            cloneLinkElement.setAttribute('id', id + '-clone');

            linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

            cloneLinkElement.addEventListener('load', () => {
                linkElement.remove();
                cloneLinkElement.setAttribute('id', id);

                if (callback) {
                    callback();
                }
            });
        }
    },[])

    //Usamos el gancho de useEffect para actualizar el tema segun el tema establecido
    useEffect(() => {
        //obtenemos el tema actual de la etiqueta que contiene el id "theme-link"
        let themeElement = document.getElementById('theme-link');
        //Creamos una referencia al nuevo tema para remplazar el actual
        const themeHref = 'assets/themes/' + theme + '/theme.css';
        //Ejecutamos la funcion de remplaceLink envaindo el elemento y el link del tema
        replaceLink(themeElement, themeHref);
    },[theme,replaceLink])

    //Metodo de la plantilla
    const isIE = () => {
        return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent)
    }

    //Metodo que sirve para cambiar el tema actual segun los parametros enviados
    //Recive el objeto, el tema y el esquema
    const changeTheme = (e, theme, scheme) => {
        //Cambiamos el esquema de color de fondo
        props.onColorModeChange(scheme);
        //Cambiamos el valor del gancho theme 
        setTheme(theme);
        //Cambiamos el valor de la cookie de thema, con el thema que se pasa en los parametros
        setCookie('themeCookie', theme, {path:'/',  sameSite:'lax'})
    }

    return (
        //Esta etiquete es la etiqueta fundamental/central de nuestro componente la cual almacena otras etiquetas

        //En este caso es un div que confiene una referencia a config, con lo cual se puede abrir cuando este se defina que aparesca
        //De classnames enviamos el metodo establecido antes
        //Y le definimos un id para obtenerlo en los metodos del documento
        <div ref={config} className={configClassName} id={"layout-config"}>
            {/* Definimos que cuando la ruta sea dash van a mostrarse los siguientes componentes */}
            <Route path="/dash">
                {/* Creamos el boton que nos va a permitir abrir el menu, cuando se le de clic va a ejecutar el metodo toggleConfigurator que abre o cierra el menu dependiendo */}
                <button className="layout-config-button p-link" id="layout-config-button" onClick={toggleConfigurator}>
                    {/* Agregamos el icono al boton, en este caso se agrega un boton de engranaje */}
                    <i className="pi pi-cog"></i>
                </button>

                {/**
                 * Boton que permite cerrar el menu lateral derecho
                 * 
                 * Se le pone el estilado de boton rojo, estilo redondo, y estilo de texto
                 * Cuando se le da clic ejecuta el metodo hideConfigurator que cierra el menu
                 */}
                <Button className="p-button-danger layout-config-close p-button-rounded p-button-text" icon="pi pi-times" onClick={hideConfigurator}/>

                {/* Creamos el div que contendra todos los elementos de configuracion, le ponemos de estilo layout-config-content */}
                <div className="layout-config-content">
                    {/* Creamos un titulo y le definimos un margen superior de 0 */}
                    <h5 className="mt-0">Tamaño Items</h5>
                    
                    {/* Componente que contendra la configuracion de escala del sistema */}
                    <div className="config-scale">
                        {/* Boton que ejecuta el metodo de reducir la escala del sistema, tiene un icono de "-" se deshabilita cuando la escala tiene el valor del primer elemento del arreglo de escalas*/}
                        <Button icon="pi pi-minus" onClick={decrementScale} className="p-button-text" disabled={scale === scales[0]} />
                        {
                            //Mapeamos el elemento de escalas para crear un fragmento de codigo por cada elemento que exista
                            scales.map((item) => {
                                //Retornamos el icono de escala con el valor de escala y clases de activo
                                return <i className={classNames('pi pi-circle-on', {'scale-active': item === scale})} key={item}/>
                            })
                        }
                        {/* Boton que ejecuta el metodo de ampliar la escala del sistema, tiene un icono de "+" se deshabilita cuando la escala tiene el valor del ultimo elemento del arreglo de escalas*/}
                        <Button icon="pi pi-plus" onClick={incrementScale} className="p-button-text" disabled={scale === scales[scales.length - 1]} />
                    </div>

                    {/* Definimos el titulo */}
                    <h5>Tipo Menu</h5>
                    {/* Etiqueta contenedora con la clase de grupo de formulario en linea */}
                    <div className="p-formgroup-inline">
                        {/* Etiqueta contenedora del campo radioButton */}
                        <div className="field-radiobutton">
                            {/**
                             * Importamos el componente de radioButton
                             * Donde le declaramos que el valor de este es static
                             * 
                             * Al momento de cambiar el valor se ejecutara el metodo onLayoutModeChange que se pasa por las propiedades donde pasamos el valor del componente
                             * Para que este este checkeado tiene que coincidir el valor de layautmode que se pasa por las propiedades con "static"
                             */}
                            <RadioButton inputId="static" name="layoutMode" value="static" onChange={(e) => props.onLayoutModeChange(e.value)} checked={props.layoutMode === 'static'} />
                            {/* Etiqueta label que hace referencia al componente anterior */}
                            <label htmlFor="static">Estatico</label>
                        </div>
                        {/* Etiqueta contenedora del campo radioButton */}
                        <div className="field-radiobutton">
                            {/**
                             * Importamos el componente de radioButton
                             * Donde le declaramos que el valor de este es overlay
                             * 
                             * Al momento de cambiar el valor se ejecutara el metodo onLayoutModeChange que se pasa por las propiedades donde pasamos el valor del componente
                             * Para que este este checkeado tiene que coincidir el valor de layautmode que se pasa por las propiedades con "overlay"
                             */}
                            <RadioButton inputId="overlay" name="layoutMode" value="overlay" onChange={(e) => props.onLayoutModeChange(e.value)} checked={props.layoutMode === 'overlay'} />
                            {/* Etiqueta label que hace referencia al componente anterior */}
                            <label htmlFor="overlay">Oculto</label>
                        </div>
                    </div>
                    
                    {/* Definimos el titulo */}
                    <h5>Estilo Pagina</h5>
                    {/* Se crea un componente que contiene estilo de grid */}
                    <div className="grid free-themes">

                        {/* Se define una nueva etiqueta div con tamaño de 3 (este tamaño es de porcentajes donde el 12 es el 100%), decimos que centre el componente */}
                        <div className="col-3 text-center">
                            {/* Creamos un boton el cual sera el encargado de ejecutar la funcion que cambia el tema y el fondo */}
                            <button className="p-link" onClick={(e) => changeTheme(e, 'lara-light-indigo', 'light')}>
                                {/* Creamos un componente el cual tendra el color del fondo en este caso un color variable de prime-react */}
                                <div className='p-1 pb-2' style={{background: "var(--bluegray-50)", borderRadius: "10px"}}>
                                    {/* Agregamos la imagen de logo principal */}
                                    <img src='images/logo-principal.svg' alt="Lara Light Indigo"/>
                                </div>
                            </button>
                        </div>

                        {/* Se define una nueva etiqueta div con tamaño de 3 (este tamaño es de porcentajes donde el 12 es el 100%), decimos que centre el componente */}
                        <div className="col-3 text-center">
                            {/* Creamos un boton el cual sera el encargado de ejecutar la funcion que cambia el tema y el fondo */}
                            <button className="p-link" onClick={(e) => changeTheme(e, 'lara-light-blue', 'light')}>
                                {/* Importamos la imagen de fondo para entender cual es el tema que se va a aplicar */}
                                <img src="assets/layout/images/themes/lara-light-blue.png" alt="Lara Light Blue"/>
                            </button>
                        </div>

                        {/* Se define una nueva etiqueta div con tamaño de 3 (este tamaño es de porcentajes donde el 12 es el 100%), decimos que centre el componente */}
                        <div className="col-3 text-center">
                            {/* Creamos un boton el cual sera el encargado de ejecutar la funcion que cambia el tema y el fondo */}
                            <button className="p-link" onClick={(e) => changeTheme(e, 'lara-light-purple', 'light')}>
                                {/* Importamos la imagen de fondo para entender cual es el tema que se va a aplicar */}
                                <img src="assets/layout/images/themes/lara-light-purple.png" alt="Lara Light Purple"/>
                            </button>
                        </div>

                        {/* Se define una nueva etiqueta div con tamaño de 3 (este tamaño es de porcentajes donde el 12 es el 100%), decimos que centre el componente */}
                        <div className="col-3 text-center">
                            {/* Creamos un boton el cual sera el encargado de ejecutar la funcion que cambia el tema y el fondo */}
                            <button className="p-link" onClick={(e) => changeTheme(e, 'lara-light-teal', 'light')}>
                                {/* Importamos la imagen de fondo para entender cual es el tema que se va a aplicar */}
                                <img src="assets/layout/images/themes/lara-light-teal.png" alt="Lara Light Teal"/>
                            </button>
                        </div>

                        {/* Se define una nueva etiqueta div con tamaño de 3 (este tamaño es de porcentajes donde el 12 es el 100%), decimos que centre el componente */}
                        <div className="col-3 text-center">
                            {/* Creamos un boton el cual sera el encargado de ejecutar la funcion que cambia el tema y el fondo */}
                            <button className="p-link" onClick={(e) => changeTheme(e, 'lara-dark-indigo', 'dark')}>
                                {/* Creamos un componente el cual tendra el color del fondo en este caso un color variable de prime-react */}
                                <div className='p-1 pb-2' style={{background: "var(--bluegray-900)", borderRadius: "10px"}}>
                                    {/* Agregamos la imagen de logo principal */}
                                    <img src="images/logo-principal.svg" alt="Lara Dark Indigo"/>
                                </div>
                            </button>
                        </div>

                        {/* Se define una nueva etiqueta div con tamaño de 3 (este tamaño es de porcentajes donde el 12 es el 100%), decimos que centre el componente */}
                        <div className="col-3 text-center">
                            {/* Creamos un boton el cual sera el encargado de ejecutar la funcion que cambia el tema y el fondo */}
                            <button className="p-link" onClick={(e) => changeTheme(e, 'lara-dark-blue', 'dark')}>
                                {/* Importamos la imagen de fondo para entender cual es el tema que se va a aplicar */}
                                <img src="assets/layout/images/themes/lara-dark-blue.png" alt="Lara Dark Blue"/>
                            </button>
                        </div>

                        {/* Se define una nueva etiqueta div con tamaño de 3 (este tamaño es de porcentajes donde el 12 es el 100%), decimos que centre el componente */}
                        <div className="col-3 text-center">
                            {/* Creamos un boton el cual sera el encargado de ejecutar la funcion que cambia el tema y el fondo */}
                            <button className="p-link" onClick={(e) => changeTheme(e, 'lara-dark-purple', 'dark')}>
                                {/* Importamos la imagen de fondo para entender cual es el tema que se va a aplicar */}
                                <img src="assets/layout/images/themes/lara-dark-purple.png" alt="Lara Dark Purple"/>
                            </button>
                        </div>

                        {/* Se define una nueva etiqueta div con tamaño de 3 (este tamaño es de porcentajes donde el 12 es el 100%), decimos que centre el componente */}
                        <div className="col-3 text-center">
                            {/* Creamos un boton el cual sera el encargado de ejecutar la funcion que cambia el tema y el fondo */}
                            <button className="p-link" onClick={(e) => changeTheme(e, 'lara-dark-teal', 'dark')}>
                                {/* Importamos la imagen de fondo para entender cual es el tema que se va a aplicar */}
                                <img src="assets/layout/images/themes/lara-dark-teal.png" alt="Lara Dark Teal"/>
                            </button>
                        </div>
                    </div>
                </div>
            </Route>
        </div>
    );
}
