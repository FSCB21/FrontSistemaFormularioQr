/* Archivo que contiene el componente de la barra superior del sistema */

//Importamos react para decir que este archivo contendra componentes react
//Importamos el gancho de useState
import React, { useState }  from 'react';

//Importamos el elemento link de react-router-dom, para redireccionar a una ruta en especifico
import { Link } from 'react-router-dom';

//Importamos classnames el cual es un metodo que nos permite gestionar las clases segun variables
import classNames from 'classnames';

//Importamos el elemento button de primereact, componente de estilos de boton
import { Button } from 'primereact/button';
//Importamos el elemento dialog de react el cual es una ventana modal personalizable
import { Dialog } from 'primereact/dialog';

//Importamos los iconos de la libreria de react-icons la cual es una libreria que maneja iconos como sifueran componentes de react
//icons
//Icono de usaurio con escudo
import { FaUserShield } from 'react-icons/fa'
//Icono de puerta abierta con flecha
import { ImExit } from 'react-icons/im'

//Importamos el objeto de useHistory para avanzar o retroceder entre rutas 
import { useHistory } from 'react-router-dom';

//Importamos el Componente de configuracion de credenciales, para hacer uso de este en el componente de este archivo
import ConfigCredentials from './components/topBar/ConfigCredentials';

//Creamos y exportamos el componente que va a contener todo lo relacionado con la barra superior de la aplicacion
export const AppTopbar = (props) => {

    //definimos history como un nuevo objeto de useHistory
    //history tiene varios metodos utiles como el pusheo a la ruta, el cual es el metodo por el cual importamos history
    const history = new useHistory()

    //Con la ayuda de use state creamos un gancho, el cual nos sirve para mostrar cambios de informacion instantanea.
    //El primer campo definido es el nombre del parametro y como se va apoder acceder a la informacion del gancho
    //El segundo parametro es el metodo por el cual se va a poder cambiar la informacion del gancho
    //En este caso definimos un gancho el cual varia entre verdadero y falso, para mostrar la ventana modal de configuracion de credenciales
    //Como valor inicial tiene false
    const [ displayConfigCredentials, setDisplayConfigCredentials] = useState(false)

    //El return es el contenido del componente, donde en terminos de html estan todas las etiquetas
    return (
        //Esta etiquete es la etiqueta fundamental/central de nuestro componente la cual almacena otras etiquetas

        //En este caso usamos un div como etiqueta central, y como estilado usamos un estilado de la plantilla por defecto
        <div className="layout-topbar">
            {/*
             * Usamos link para que cuando se le de clic a esta seccion, se redireccione a la pagina de inicio 
             * Esto se establece en el campo 'to="/"' donde al decir '/' nos referimos a la carpeta base del proyecto o el index del formulario
             * 
             * Le ponemos el estiladon de plantilla en logo 
             */}
            <Link to="/dash" className="layout-topbar-logo">
                {/* Agregamos la imagen del logo que se envuentra en la ruta principal */}
                <img src={'images/logo-principal.svg'} alt="logo"/>
                {/* Agregamos un span donde le cambiamos el estilo del texto y agregamos un margen izquierdo */}
                <span className='ml-2 text-lg'>by</span>
                {/* Agregamos un span con el texto */}
                <span>Fuxia</span>
            </Link>

             {/*
              * Llamamos la etiqueta de boton donde le asignamos: 
              * Estilo de boton de link
              * Estilo de boton de layout
              * 
              * Al darle clic al boton va a llamar la funcion de onToggleMenuClick que pasa por las props (props=propiedades)
              */}
            <Button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                {/* Dentro de este boton agregamos un icono de barras para que sea mas interactivo el esconder el menu lateral izquierdo */}
                <i className="pi pi-bars"/>
            </Button>

            {/**
             * Llamamos a la etiqueta de boton deonde le asignamos:
             * Estilado de link
             * Estilado de layout menu button
             * 
             * Al darle clic se ejecutara el metodo de onMobileTopbarMenuClick El cual muestra las opciones de configuracion y salir, en dispositivos que no tienen una pantalla muy grande 
             */}
            <Button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                {/* Dentro del boton agregamos un icono de e puntos vertical mente alineados para la facil comprencion de este boton*/}
                <i className="pi pi-ellipsis-v" />
            </Button>

            {/**
             * Creamos una lista la cual contendra los botones de configuracion y salida del sistema, para que se vea bien se le da el siguiente estilado:
             * Top bar menu y flex cuando la pantalla tenga un amplio espacio horizontal
             * Y en dado caso que no sea una pantalla amplia horizontal mente hablando estos desapareceran y se convertiran en menu vertical
             */}
            <ul className={classNames("layout-topbar-menu lg:flex origin-top", {'layout-topbar-menu-mobile-active': props.mobileTopbarMenuActive })}>
                {/* Elemento de la lista */}
                <li>
                    {/**
                     * Etiqueta button que contiene la accion de abrir el modal
                     * Como estilo se le definio:
                     * Boton tipo link
                     * Tipo de boton topbar
                     * 
                     * Se le agrego un tooltip para el facil entendimiento de lo que hace el boton, este item se le denomino que aparecera en la parte superior
                     * 
                     * Y al darle clic al boton ejecutara la funcion setDisplayConfigCredentials(true) la cual cambia el valor del gancho y la combierte en verdaddero, esto hara que se muestre el componente de configuracion de credenciales en una ventana modal
                     */}
                    <Button tooltip='Gestionar Contraseñas' tooltipOptions={{position:'top'}} className="p-link layout-topbar-button" onClick={() => setDisplayConfigCredentials(true)}>
                        {/* Se le agrega el icono del usuario con el escudo, y se le pone de estilado el tamaño del texto en 2xl y una margen horizontal */}
                        <FaUserShield className='text-2xl mx-2'/>
                        {/* Se agrega el texto que aparecera al momento de abrir el menu en vista de pantalla pequeña */}
                        <span>Gestionar Contraseñas</span>
                    </Button>
                </li>
                {/* Elemento de la lista */}
                <li>
                    {/**
                     * Etiqueta de boton que contiene la accion de cerrar la sesion
                     * Como estilos de boton se definio:
                     * Boton tipo link
                     * Tipo de boton topbar
                     * 
                     * Se le agrego un tooltip para el facil entendimiento de lo que hace el boton, este item se le denomino que aparecera en la parte superior
                     * 
                     * Al darle clic este ejecutara la siguiente accion "()=>history.push("/login")" la cual usa el metodo push de history para cambiar la ruta superior y redireccionar a una direccion establecida
                     */}
                    <Button tooltip='Salir' tooltipOptions={{position:'bottom'}} className="p-link layout-topbar-button"onClick={()=>history.push("/login")}>
                        {/* Se agrega el icono de puerta con flecha de salida, con el estilado de tamaño de texto 2xl y margen horizontal */}
                        <ImExit className='text-2xl mx-2'/>
                        {/* Se agrega el texto que aparecera al momento de abrir el menu en vista de pantalla pequeña */}
                        <span>Salir</span>
                    </Button>
                </li>
            </ul>

            {/**
             * Etiqueta de ventana modal que contiene el componente de configuracion de credenciales
             * Contiene el siguiente estilado:
             * tamaño de 11 (este tamaño se vasa en una escala de porcentajes donde el 12 es el 100% del tamaño del componente)
             * En dado caso que la pantalla sea sm (pantalla de celular) el tamaño sera de 8
             * En dado caso que la pantalla sea md (pantalla de celular) el tamaño sera de 6
             * En dado caso que la pantalla sea xl (pantalla de celular) el tamaño sera de 4
             * 
             * El parametro de visible corresponde a en que momento este se debe mostrar, llamamos el valor del gancho denominado anteriormente, si este valor es false no se mostrara pero cuando este valor cambie a true la ventana modal aparecera automaticamente y asi pasa al revez (de true a false y de false a true)
             * 
             * Cuando este se esconda o al momento de dar clic en la "X" va a ejecutar "() => setDisplayConfigCredentials(false)" el cual establece el valor del gancho como false
             */}
            <Dialog header="Gestionar Contraseñas" visible={displayConfigCredentials} className="w-11 sm:w-8 md:w-6 xl:w-4" onHide={() => setDisplayConfigCredentials(false)}>
                {/* Llamamos el componente de ConfigCredentials el cual contiene todo su respectivo codigo */}
                <ConfigCredentials/>
            </Dialog>

        </div>
    );
}
