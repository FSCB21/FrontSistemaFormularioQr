/* Archivo que almacena el contenido principal del modulo de logueo al sistema */

//Importamos react para definir que lo que se encuentra en este archivo es un componente de react
//Importamos los ganchos de react que se van a usar en el archivo
//Importamos useEffect como el gancho que ejecuta un determinado grupo de lineas de codigo cada que se renderiza el componente
//Importamos useState como el gancho que almacena variables de estado que cambian de manera dinamica en el codigo
//Importamos useRef para crear una referencia a determinados elementos del archivo
import React, { useEffect, useState, useRef } from 'react'

//Importamos la libreria que permite realizar consultas via http o https
import axios from 'axios'

//Importamos clasNames para cambiar las clases de los objetos de manera dinamica
import classNames from 'classnames'

//Importamos la libreria de formik la cual facilita la validacion de formulario
import { useFormik } from 'formik'

//Importamos Button de primereact
//Este elemento es un boton el cual se le pueden asignar estilos de manera rapida
import { Button } from 'primereact/button'
//Importamos el objeto InputText
//Este objeto permite escribir en un cuadro de texto los valores que se requieran
import { InputText } from 'primereact/inputtext'
//Importamos el elemento Toast de primereact
//Este elemento es una alerta que aparece en la pantalla 
import { Toast } from 'primereact/toast'

//Importamos el objeto de useHistory para avanzar o retroceder entre rutas 
import { useHistory } from 'react-router-dom'

//Importamos el componente de ventana de carga
import LoadPage from '../components/LoadPage'

//Importamos la clase de servicio de credenciales, la cual contiene todos los metodos de gestion de la informacion de consulta al api
import CredencialService from '../service/CredencialService'

//Importamos la funcion de validacion que verifica que los campos ingresados coincidan con un minimo
import validationLogin from '../validations/validationLogin'

//Definimos el componente de logueo, donde estaran las etiquetas y funciones de este
const LoginPage = () => {

    //Creamos un nuevo objeto de la clase de CredencialService
    const credencialService = new CredencialService()

    //Se define una constante que tendra la referencia a la etiqueta de toast
    const toast = useRef(null);

    //definimos history como un nuevo objeto de useHistory
    //history tiene varios metodos utiles como el pusheo a la ruta, el cual es el metodo por el cual importamos history
    const history = useHistory()

     //Creamos un gancho de estado para la ventana de carga, por defecto este gancho tiene un valor de false
    const [loading, setLoading] = useState(false)

    //Usamos el gancho de useEffect para ejecutar una determinada seccion de acciones cada que se renderice el componente
    useEffect(() => {
        //Decimos que cada que se renderice este componente va a borrar el toquen de acceso del localStorage
        localStorage.removeItem('token-login')
        //Retornamos para evitar errores de renderizacion
      return () => {}
    }, [])

    //definimos formik como el valor de retorno de la funcion de useFormik, donde se envian como parametros la configuracion basica de campos validacion y ejecucion del formulario
    const formik = useFormik({
        //Como primer valor se definen los valores iniciales del formulario
        initialValues: {
            nombre_usuario: '',
            contraseña: ''
        },
        //Despues se definen los metodos de validacion, usamos la funcion para evitar extender el codigo, de esta manera la validacion va a estar en un archivo y el funcionamiento o la ejecucion en otro
        validate: (data) => validationLogin(data),
        //Por ultimo se define el metodo que se ejecuta si la validacion no retorna ningun error 
        onSubmit: (data) => {
            //Se activara el componente de carga, al cambiar a verdadero el gancho de carga
            setLoading(true)
            //Se ejecutara el metodo de login del servicio de credencial
            credencialService.login(data).then(res=>{
                //Si la respuesta es positiva
                //Definira en el almacenamiento local del navegador el token de logueo
                localStorage.setItem('token-login', res.data)
                //Tambien se definen como headers por defecto el token-login
                axios.defaults.headers.common['token-login'] = res.data
                //Y redireccionara a la seccion de dashboard
                history.push('/dash/')
            }).catch(err=>{
                //En caso de error va a borrar los valores del formulario
                formik.resetForm()
                //Envia alerta de error, mostrando el error
                toast.current.show({severity:'error', summary: 'FXA Te Informa', detail: err.response.data, life: 3000});

            //Como paso final, establecera el componente de carga como falso
            }).finally(()=>setLoading(false))
        }
    })

    //Metodo que valida si un determinado campo tiene error de validacion
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    
    //Metodo que obiene el mensaje de error segun el parametro enviado en el metodo
    const getFormErrorMessage = (name) => {
        //Si la validacion de error es verdadera (Hay un error)
        //Va a retornar en una etiqueta el mensaje de error que se establecio en las validaciones 
        return isFormFieldValid(name) && <small className="p-error mb-2 block">{formik.errors[name]}</small>;
    };

    
    //Componente de retorno de la pagina de logueo
  return (<>
    {/* Etiqueta de mensajes la cual solo con definirla se puede hacer usod e todos los metodos que esta dispone */}
    <Toast ref={toast} />

    {/* En dado caso que el gancho de carga este en verdadero va a renderizar las siguientes lineas de codigo */}
    {loading && 
        //Contenedor de la seccion de carga, ocupa toda la pantalla y alinea los items al centro
        <div className='relative h-screen w-full justify-content-center align-items-center flex'>
            {/* Renderiza el componente de carga */}
            <LoadPage/>
        </div>
    }
    {/* En dado caso que el gancho de carga este en falso va a renderizar las siguientes lineas de codigo */}
    {!loading &&
        //Contenedor principal del Formulario de logueo al sistema, tiene estilo de ocupar toda la pantalla y centrar el contenido
        //Tambien contiene el estilo de cuerpo de formulario y se le asigna la imagen de fondo
        <div className={'flex w-full h-screen justify-content-center align-items-center bodyForm bodyForm-image-4'}>
            {/* Definimos un contenedor con estilado de carta y le definimos una opacidad para que se vea un poco el fondo */}
            <div className="surface-card p-4 shadow-2 border-round w-10 sm:w-8 md:w-6 lg:w-4" style={{opacity:'0.9'}}>
                {/* Contenedor que almacena el encabezado del Formulario de logueo al sistema */}
                <div className="text-center mb-5">
                    {/* Imagen del logo para el header del formulario de logueo */}
                    <img src="images/logo-principal.svg" alt="hyper" height="50" className="mb-3" />
                    {/* Titulo del header del formulario, se le da estilado de texto grande */}
                    <div className="text-900 text-2xl font-medium mb-3">¡Bienvenido De Nuevo!</div>
                </div>

                {/* Etiqueta de formulario que indica cual es el metodo a ejecutar al momento de enviar el formulario */}
                <form onSubmit={formik.handleSubmit}>
                    {/* Etiqueta que contiene la descripcion del input, se le da estilado para mejor visualizacion */}
                    {/* Sele agrega en la clase el metodo classnames para que al momento de que el campo asignado no sea valido este cambie de manera dinamica a un estilado de error */}
                    <label htmlFor="nombre_usuario" className={"block font-medium mb-2 mt-3 mx-3 " + classNames({ 'p-error': isFormFieldValid('nombre_usuario') })}>Usuario</label>
                    {/* Llamamos el objeto de InputText para la captura de datos de usuario */}
                    {/**
                     * se le define como valor el objeto formik en su seccion de valores y en el atributo de nombre_usuario
                     * al momento de cambiar se usa el metodo de formik.handlechenge y para que este metodo funcione correctamente el input debe tener un id o name
                     * se le da el estilado de bordes redondos y se le adjunta classnames para que al momento de que el campo no sea valido se ponga de manera dinamica el estilo de error
                     */}
                    <InputText value={formik.values.nombre_usuario} onChange={formik.handleChange} 
                        id="nombre_usuario" type="text" className={'BorderFormNewUser w-full '+ classNames({ 'p-invalid': isFormFieldValid("nombre_usuario") })} />
                    {/* Por ultimo se usa el metodo de obtener mensaje de error, donde se pasa como argumento el nombre del campo que se esta validando */}
                    {getFormErrorMessage('nombre_usuario')}

                    {/* Etiqueta que contiene la descripcion del input, se le da estilado para mejor visualizacion */}
                    {/* Sele agrega en la clase el metodo classnames para que al momento de que el campo asignado no sea valido este cambie de manera dinamica a un estilado de error */}
                    <label htmlFor="contraseña" className={"block font-medium mb-2 mt-3 mx-3 " + classNames({ 'p-error': isFormFieldValid('contraseña') })}>Contraseña</label>
                    {/* Llamamos el objeto de InputText para la captura de datos de usuario */}
                    {/**
                     * se le define como valor el objeto formik en su seccion de valores y en el atributo de constraseña
                     * al momento de cambiar se usa el metodo de formik.handlechenge y para que este metodo funcione correctamente el input debe tener un id o name
                     * se le da el estilado de bordes redondos y se le adjunta classnames para que al momento de que el campo no sea valido se ponga de manera dinamica el estilo de error
                     * Como tipo de input de define que es una contraseña para que este no sea visible al usuario
                     */}
                    <InputText value={formik.values.contraseña} onChange={formik.handleChange} 
                        id="contraseña" type="password" className={'BorderFormNewUser w-full '+classNames({ 'p-invalid': isFormFieldValid("contraseña") })} />
                    {/* Por ultimo se usa el metodo de obtener mensaje de error, donde se pasa como argumento el nombre del campo que se esta validando */}
                    {getFormErrorMessage('contraseña')}

                    {/* Llamamos la etiqueta de boton donde se dice que es un boton de envio, se le pone clase de borde redondo */}
                    <Button label="Iniciar Sesion" type='submit' className="w-full BorderFormNewUser mt-4" />

                </form>
            </div>
        </div>
    }
</>)
}

//Exportamos el componente para usarlo en la seccion de App.js
export default LoginPage