/* Archivo que almacena el contenido principal del modulo de Formulario nuevo registro */

//Importamos react para definir que lo que se encuentra en este archivo es un componente de react
//Importamos los ganchos de react que se van a usar en el archivo
//Importamos useEffect como el gancho que ejecuta un determinado grupo de lineas de codigo cada que se renderiza el componente
//Importamos useState como el gancho que almacena variables de estado que cambian de manera dinamica en el codigo
//Importamos useRef para crear una referencia a determinados elementos del archivo
import React, { useRef, useState, useEffect } from 'react';

//Importamos la libreria de formik la cual facilita la validacion de formulario
import { useFormik } from 'formik';

//Importamos el objeto InputText
//Este objeto permite escribir en un cuadro de texto los valores que se requieran
import { InputText } from 'primereact/inputtext';
//Importamos Button de primereact
//Este elemento es un boton el cual se le pueden asignar estilos de manera rapida
import { Button } from 'primereact/button';
//Importamos el objeto Calendar de primereact
//Este elemento es un estilo de input para calendario y selecion de fechas 
import { Calendar } from 'primereact/calendar';
//Importamos el elemento Checkbox de primereact
//Este objeto es el tipico cuadro de confirmacion de usuario
import { Checkbox } from 'primereact/checkbox';
//Importamos el objeto Dropdow de prime react
//Este elemento permite elegir entre varias opciones de valres establecidas en el item de optios
import { Dropdown } from 'primereact/dropdown';
//Importamos el elemento de Dialog
//Este elemento es una etiqueta que facilita el uso de ventana modal/popUp
import { Dialog } from 'primereact/dialog';
//Importamos el elemento Toast de primereact
//Este elemento es una alerta que aparece en la pantalla 
import { Toast } from 'primereact/toast';
//Importamos el elemento Card de primereact
//Card es un contenedor estilizado con bordes redondo y color de plantilla
import { Card } from 'primereact/card';
//Importamos clasNames para cambiar las clases de los objetos de manera dinamica
import { classNames } from 'primereact/utils';

//Importamos la funcion de validacion que verifica que los campos ingresados coincidan con un minimo
import validationRegUser from '../validations/validationRegUser';

//Componente que contiene la etiqueta de seleccion de lugar de registro (se hizo en otro comonente para evitar tener codigo de más)
import SelectLugarRegistro from '../components/formNewUser/SelectLugarRegistro';
//Componente que contiene toda la informacion relacionada con los terminos y condiciones de uso del sistema
import Terms from '../components/formNewUser/Terms';
//Importamos el componente de contenido de la ventana emergente que se abre al enviar el formulario
import DialogCodeSend from '../components/formNewUser/DialogCodeSend';

//Importamos la clase de servicio de usuarios, la cual contiene todos los metodos de gestion de la informacion de consulta al api
import FormService from '../service/FormService';

//Importamos el componente que facilita la creacion de input para lo que es un número de telefono
import PhoneInput from 'react-phone-number-input'
//Importamos los estilos del componente que facilita el manejo de input de npumero telefonico 
import 'react-phone-number-input/style.css'

//Importamos las clases de estilado para el componente 
import "../components/formNewUser/stylesForm.css"

//Importamos el componente de ventana de carga
import LoadPage from '../components/LoadPage';

//Importamos el servicio de consulta al api, pero en este caso de consulta a la seccion del contador de visitas
import ViewsCounterService from '../service/ViewsCounterService';

//Componente de retorno de la pagina de formulario
const FormNewUser = () => {

    //Se define una variable que contiene la fecha actual mediante el metodo de new Date()
    let today = new Date()

    //Se define una constante que tendra la referencia a la etiqueta de toast
    const toast = useRef(null);

    //Creamos un nuevo objeto de la clase de FormService
    const formService = new FormService()

    //Gancho que almacena la visivilidad de la ventana modal de terminos y condiciones
    const [displayBasic, setDisplayBasic] = useState(false);
    //Gancho que almacena la visivilidad de la ventana modal que se muestra al moemnto de llenar el fomulario correctamente y dar en enviar
    const [displaySendSms, setDisplaySendSms] = useState(false);
    //Creamos un gancho de estado para la ventana de carga, por defecto este gancho tiene un valor de false
    const [loading, setLoading] = useState(false)
    //Creamos un gancho que almacenara el valor de la opcion al momento elegir el dominio de correo electronico 
    const [optionEmail, setOptionEmail] = useState("gmail.com")

    //Usamos el gancho de useEffect para ejecutar una determinada seccion de acciones cada que se renderice el componente
    useEffect(() => {
        //Definimos un nuevo objeto de la calse de ViewsCounterService, para acceder a las funciones que esta clase tiene asignadas
        const viewsCounterService = new ViewsCounterService()
        //De la instancia de la clase ejecutamos el metodo de newPageVIsit, donde se le incrementa en 1 el contador de visitas de la pagina enviada como argumento, en este caso 'FormRegister'
        viewsCounterService.newPageVisit('FormRegister').then()
        //Retornamos para evitar errores de renderizacion
        return () => {
        }
    }, [])

    //definimos formik como el valor de retorno de la funcion de useFormik, donde se envian como parametros la configuracion basica de campos validacion y ejecucion del formulario
    const formik = useFormik({
         //Como primer valor se definen los valores iniciales del formulario
        initialValues: {
            nombres: '',
            apellidos: '',
            correo_el: '',
            fecha_nacimiento: false,
            telefono_contacto:'',
            numero_doc:'',
            lugar_registro_fk:'',
            accept: false, 
            accept2: false, 
            dominio_correo:'gmail.com'
        },
        //Despues se definen los metodos de validacion, usamos la funcion para evitar extender el codigo, de esta manera la validacion va a estar en un archivo y el funcionamiento o la ejecucion en otro
        validate: (data) => validationRegUser(data),
        //Por ultimo se define el metodo que se ejecuta si la validacion no retorna ningun error 
        onSubmit: (data) => {
            //Primero concatenamos la direccionde correo con un "@" y despues le adjuntamos el dominio
            data.correo_electronico = `${data.correo_el}@${data.dominio_correo}`

            //Definimos como verdadero el valor del gancho que esta relacionado con el componente de carga
            setLoading(true)

            //Del servicio de formulario vamos a usar el metodo de nuevo usaurio, pasando como argumento la data del formulario que fue validada antes
            formService.newUser(data).then(res=>{
                //Al momento de dar respuesta se va a validar que no haya algun error
                //Si en la data de la respuesta se encuentra definido un arreglo de errores
                if(res.data.errors){
                    //Se establece como falso el valor del gancho que renderiza el componente de carga
                    setLoading(false)
                    //se va a recorrer cada una de las pocisiones del arreglo 
                    res.data.errors.forEach(el => {
                        //Se va a mostrar mensaje de error con el contenido de error del arreglo
                        toast.current.show({severity:'error', summary: 'FXA Te Informa', detail: el.msg, life: 3000});
                    });
                //Si no, si se encuentra solamente definido un error
                }else if(res.data.error){
                    //Se establece como falso el valor del gancho que renderiza el componente de carga
                    setLoading(false)
                    //Se va a mostrar mensaje de error indicando cual es el error al momento de enviar el formulario
                    toast.current.show({severity:'error', summary: 'FXA Te Informa', detail: res.data.error, life: 3000});
                    
                }else{
                    //Se establece como falso el valor del gancho que renderiza el componente de carga
                    setLoading(false)
                    //Se establece como verdadero el valor del gancho que muestra el mensaje de que se ha creado el registro y que se envia el codigo de descuento en unos instantes
                    setDisplaySendSms(true)
                    //Se va a mostrar mensaje de exito informando que el registro se a creado con exito
                    toast.current.show({severity:'success', summary: 'FXA Te Informa', detail: res.data.message, life: 3000});
                }
                   
            })
            
        }
    });

    //Metodo que valida si un determinado campo tiene error de validacion
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    
    //Metodo que obiene el mensaje de error segun el parametro enviado en el metodo
    const getFormErrorMessage = (name) => {
        //Si la validacion de error es verdadera (Hay un error)
        //Va a retornar en una etiqueta el mensaje de error que se establecio en las validaciones 
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    //Componente que renderiza un estilado para el selector de mes en el calendario
    const monthNavigatorTemplate=(e)=> {
        //Retorna un dropdown el cual el valor y los metodos se pasan por defecto en las propiedades del objeto
        return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} style={{ lineHeight: 1 }} />;
    }

    //Componente que renderiza un estilado para el selecetor de año en el calendario
    const yearNavigatorTemplate=(e)=> {
        //Para organizar los años desde al actual hasta el menor

        //Se declara el elemento que contendra los elementos organizados
        let array = []
        //Se hace un bucle forEach a las opciones del elemento, se declara el el y el id
        //El parametro "_el" tiene una raya al piso ya que este no se usa en la funcion
        e.options.forEach((_el,id) => {
            //Para cada uno de los items del arreglo va a pushear en el arreglo donde el tamaño corresponda al id +1 
            array.push(e.options[e.options.length - (id+1)])
        });

        //Retorna un elemento dropdown el cual como opciones tiene el arreglo que fue creado recientemente
        return <Dropdown value={e.value} options={array} onChange={(event) => e.onChange(event.originalEvent, event.value)} className="p-ml-2" style={{ lineHeight: 1 }} />;
    }

    //Metodo que establece el valor del núemro de telefono en los valores del formulario
    const setNumero =(e)=>{
        //Si existe "e"
        //Va a validar que e tenga un tamaño superior a 4 caracteres
        //Si no es asi va a establecer el valor de e como vacio
        if(e)
            (!e.length>4) ? e = "" :
        
        //Despues va a establecer el valor del telefono de contacto como el valor de e si este esta definido, si no lo definira como vacio
        formik.setValues({
            ...formik.values,
            telefono_contacto:e?e:""
        })
    }

    //Definimos un arreglo con las opciones de correos comunes para que estas aparescan en el campo seleccionable de dominio
    const optionsEmails = [
        "gmail.com",
        "outlook.com",
        "hotmail.com",
        "otro"
    ]

    //metodo que se encarga de cambiar el valor del dominio
    const changeOptionEmail = e =>{
        //primero cambiara el valor del gancho de opcion de dominio
        setOptionEmail(e.value)
        //Despues se ejecuta el metodo de cambio de valor en el formik y se pasa todo el elemento para que este haga el cambio segun el name del elemento
        formik.handleChange(e)
        //Si el valor de el dominio seleccionado es otro, va aestablecer el valor de dominio de correo como vacio
        if(e.value === "otro")
            formik.setValues({...formik.values, dominio_correo:''})
    }

    //Componente de retorno de la pagina de Formulario de nuevo registro
    return (
        //Contenedor principal del Formulario de logueo al sistema, tiene estilo de ocupar toda la pantalla y centrar el contenido
        //Tambien contiene el estilo de cuerpo de formulario y se le asigna la imagen de fondo
        <div className={'relative w-full justify-content-center align-items-center flex bodyForm bodyForm-image-4'}>

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
                //Contenedor del formulario de nuevo registro
                //Como clases de estilado se dice que ekl tamaño del formulario es de 10 de 12 (80% mas o menos)
                //Y cuando la pantalla supera las escalas de xl
                <div className='w-10 xl:w-5'>
                    {/* Contenedor del encabezado del formulario, contiene el logo y un breve texto de familiarizacion */}
                    <div className="flex w-full justify-content-center align-items-center flex-column my-4">
                        {/* Imagen del logo para el header del formulario de nuevo registro */}
                        <img src="images/logo-principal.svg" alt="" className='w-4'/>
                        {/* Texto breve con estilo de color rosado oscuro y la letra en negrilla */}
                        <p className='text-pink-800 font-bold'>Bienvenid@ A Nuestra Familia Fuxia!</p>
                    </div>

                    {/* Una carta como el componente principal del formulario de nuevo registro, como clase se le redondean mas los bordes */}
                    <Card className='cardForm mb-6 BorderFormNewUser'>
                        {/* texto que informa sobre el uso del formulario y para que se usa este */}
                        <p className='text-center mx-3 my-0 text-pink-600 font-medium'>Recuerda llenar todos los campos de manera adecuada para obtener tu codigo de descuento de FXA</p>

                        {/* Etiqueta de formulario que indica cual es el metodo a ejecutar al momento de enviar el formulario, tiene un estilado de celdas para facilitar la organizacion de cada campo */}
                        <form onSubmit={formik.handleSubmit} className="grid">

                            {/* Cada campo tiene una estructura de un contenedor general donde dentro de este estan el input y el mensaje de error */}
                            {/* Se dice que este campo tiene un tamaño del 100% pero cuando el tamaño supera el tamaño sm de pantalla va a tener un tamaño del 50% del componente */}
                            <div className="col-12 sm:col-6 mt-6">
                                {/* Contenedor que da el estilo de label flotante, para esto se usa la clase de p-float-label */}
                                <span className="p-float-label">
                                    {/* Se define el inputText de prime react el cual ya viene con un estilo predefinido */}
                                    {/**
                                     * Se le define un id y in nombre para que formik lo tome automaticamente
                                     * como valor se le define el valor del objeto con nombre similar de la propiedad de values de formik
                                     * Al momento de cambiar el valor en el input va a ejecutar el metodo de formik que escucha el cambio y cambia el valor segun el name o id
                                     * Decimos que de clases va a tener la clase de bordes redondos y tamaño maximo
                                     * En las clases tambien se le agrega el metodo que detecta cuando un campo tiene un error en las validaciones y le pone al input un estilo de error
                                     */}
                                    <InputText id="nombres" name="nombres" value={formik.values.nombres} onChange={formik.handleChange} autoFocus className={'BorderFormNewUser w-full '+classNames({ 'p-invalid': isFormFieldValid("nombres") })} />
                                    {/* Se define el label del input anterior */}
                                    {/* Se le define la clase de validacion y cambio a error de manera dinamica */}
                                    <label htmlFor="nombres" className={classNames({ 'p-error': isFormFieldValid("nombres") })}>Nombres*</label>
                                </span>
                                {/* Se llama el metodo que retorna el mensaje de error en dado caso que la validacion del campo que se pasa como argumento falle */}
                                {getFormErrorMessage("nombres")}
                            </div>

                            {/* Cada campo tiene una estructura de un contenedor general donde dentro de este estan el input y el mensaje de error */}
                            {/* Se dice que este campo tiene un tamaño del 100% pero cuando el tamaño supera el tamaño sm de pantalla va a tener un tamaño del 50% del componente */}
                            <div className="col-12 sm:col-6 mt-6">
                                {/* Contenedor que da el estilo de label flotante, para esto se usa la clase de p-float-label */}
                                <span className="p-float-label">
                                    {/* Se define el inputText de prime react el cual ya viene con un estilo predefinido */}
                                    {/**
                                     * Se le define un id y in nombre para que formik lo tome automaticamente
                                     * como valor se le define el valor del objeto con nombre similar de la propiedad de values de formik
                                     * Al momento de cambiar el valor en el input va a ejecutar el metodo de formik que escucha el cambio y cambia el valor segun el name o id
                                     * Decimos que de clases va a tener la clase de bordes redondos y tamaño maximo
                                     * En las clases tambien se le agrega el metodo que detecta cuando un campo tiene un error en las validaciones y le pone al input un estilo de error
                                     */}
                                    <InputText id="apellidos" name="apellidos" value={formik.values.apellidos} onChange={formik.handleChange} className={'BorderFormNewUser w-full '+classNames({ 'p-invalid': isFormFieldValid("apellidos") })} />
                                    {/* Se define el label del input anterior */}
                                    {/* Se le define la clase de validacion y cambio a error de manera dinamica */}
                                    <label htmlFor="apellidos" className={classNames({ 'p-error': isFormFieldValid("apellidos") })}>Apellidos*</label>
                                </span>
                                {/* Se llama el metodo que retorna el mensaje de error en dado caso que la validacion del campo que se pasa como argumento falle */}
                                {getFormErrorMessage("apellidos")}
                            </div>
                            
                            {/* Como el campo de correo es un campo compuesto de 2 input se usa una etiqueta de agrupacion */}
                            {/* Se define la etiqueta y se ole da de tamaño el 100% */}
                            <div className="col-12 mt-4 grid">
                                {/* Se asigna la etiqueta contenedora general y se le asigna la clase de agrupacion */}
                                <div className="col-12 p-inputgroup">
                                    {/* Se define el primer contenedor donde esta el input de la direccion de correo, se le asigna la clase de estilo del label flotante */}
                                    <span className="p-float-label w-full ">
                                        {/* Elemento input el cual va a recivir la informacion de la direccion de correo del usuario */}
                                        {/**
                                         * Se define un estilado donde los bordes izquierdos son los que estan bordeados
                                         * se le asigna el name y el id para distinguir el campo en el formulario
                                         * como valor se le define el valor del objeto con nombre similar de la propiedad de values de formik
                                         * Al momento de cambiar el valor en el input va a ejecutar el metodo de formik que escucha el cambio y cambia el valor segun el name o id
                                         * Decimos que de clases va a tener tamaño maximo
                                         * En las clases tambien se le agrega el metodo que detecta cuando un campo tiene un error en las validaciones y le pone al input un estilo de error
                                         */}
                                        <InputText id="correo_el" style={{borderRadius: '100px 0 0 100px'}} name="correo_el" value={formik.values.correo_el} onChange={formik.handleChange} className={'w-full '+classNames({ 'p-invalid': isFormFieldValid('correo_el') })} />
                                        {/* Se define el label del input anterior */}
                                        {/* Se le define la clase de validacion y cambio a error de manera dinamica */}
                                        <label htmlFor="correo_el" className={classNames({ 'p-error': isFormFieldValid('correo_el') })}>Correo*</label>
                                    </span>

                                    {/* como efecto visual y de comprension de usuario se agrega un "@" para dividir la direccion del domingo */}
                                    <span className="p-inputgroup-addon">@</span>

                                    {/* Se define el ultimo contenedor donde esta el input del dominio de correo, se le asigna la clase de estilo mail-container */}
                                    <span className="p-inputgroup-addon w-12 sm:w-7 mail-container" style={{borderRadius: '0 100px 100px 0'}}>
                                        {/* Se dice que si el gancho de opcionEmail, es diferente de "otro" va a renderizar las siguintes lineas de codigo */}
                                        {optionEmail !== 'otro' &&
                                            //Etiqueta dropdown para un selector desplegable de en este caso las opciones mas comunes de dominio de correo
                                            /**
                                             * Como opciones se le pasa el arreglo de opciones de direcciones comunes
                                             * se le define un nombre y un id para el uso de este con formik
                                             * Se dice que al momento de cambiar el valor, va a cambiar el valor del gancho
                                             * como estilo se define que se quiere que los bordes derechos esten redondeados
                                             * como valor se le define el valor del objeto con nombre similar de la propiedad de values de formik
                                             */
                                            <Dropdown options={optionsEmails} name='dominio_correo' onChange={changeOptionEmail} style={{borderRadius: '0 100px 100px 0'}} value={formik.values.dominio_correo} className='mail-container'/>
                                        }

                                        {/* Se dice que  si el gancho de opcion de correo es igual a "otro", va a renderizar las siguientes lineas de codigo */}
                                        {optionEmail === 'otro' && 
                                            // Se define el primer contenedor donde esta el input del dominio de correo, se le asigna la clase de estilo del label flotante
                                            <span className="p-float-label w-full ">
                                                {/* Elemento input el cual va a recivir la informacion del dominio de correo del usuario */}
                                                {/**
                                                 * Se define un estilado donde los bordes derechos son los que estan bordeados
                                                 * se le asigna el name y el id para distinguir el campo en el formulario
                                                 * como valor se le define el valor del objeto con nombre similar de la propiedad de values de formik
                                                 * Al momento de cambiar el valor en el input va a ejecutar el metodo de formik que escucha el cambio y cambia el valor segun el name o id
                                                 * Decimos que de clases va a tener tamaño maximo
                                                 * En las clases tambien se le agrega el metodo que detecta cuando un campo tiene un error en las validaciones y le pone al input un estilo de error
                                                 */}
                                                <InputText style={{borderRadius: '0 100px 100px 0'}} name="dominio_correo" value={formik.values.dominio_correo} onChange={formik.handleChange} className={'w-full '+classNames({ 'p-invalid': isFormFieldValid('dominio_correo') })} />
                                                {/* Se define el label del input anterior */}
                                                {/* Se le define la clase de validacion y cambio a error de manera dinamica */}
                                                <label className={classNames({ 'p-error': isFormFieldValid('dominio_correo') })}>Dominio*</label>
                                            </span>
                                        }
                                    </span>
                                    
                                    {/* Se dice que  si el gancho de opcion de correo es igual a "otro", va a renderizar la siguiente linea de codigo */}
                                    {/* Un icono de "X" el cual al dar clic, va a establecer el gancho de emailOption como el de por defecto, tambien se cambia en el formik como "gmail.com" */}
                                    {optionEmail === 'otro' && <i className='pi pi-times ml-2 my-3' onClick={()=>{setOptionEmail('gmail.com');formik.setValues({...formik.values, dominio_correo:'gmail.com'})}}/>}
                                </div>

                                {/* Etiqueta contenedora del mensaje de error en este caso tiene tamaño de la mitad del componente esto para que quepan los 2 mensajes de error en una sola fila */}
                                <div className="col-6">
                                    {/* Se llama el metodo que retorna el mensaje de error en dado caso que la validacion del campo que se pasa como argumento falle */}
                                    {getFormErrorMessage('correo_el')}
                                </div>
                                {/* Etiqueta contenedora del mensaje de error en este caso tiene tamaño de la mitad del componente esto para que quepan los 2 mensajes de error en una sola fila */}
                                <div className="col-6">
                                    {/* Se llama el metodo que retorna el mensaje de error en dado caso que la validacion del campo que se pasa como argumento falle */}
                                    {getFormErrorMessage('dominio_correo')}
                                </div>
                            </div>

                            {/* Cada campo tiene una estructura de un contenedor general donde dentro de este estan el input y el mensaje de error */}
                            {/* Se dice que este campo tiene un tamaño del 100% pero cuando el tamaño supera el tamaño sm de pantalla va a tener un tamaño del 50% del componente */}
                            <div className="col-12 sm:col-6 mt-4">
                                {/* Contenedor que da el estilo de label flotante, para esto se usa la clase de p-float-label */}
                                <span className="p-float-label">
                                    {/* Se define el inputText de prime react el cual ya viene con un estilo predefinido */}
                                    {/**
                                     * Se le define un id y in nombre para que formik lo tome automaticamente
                                     * como valor se le define el valor del objeto con nombre similar de la propiedad de values de formik
                                     * Al momento de cambiar el valor en el input va a ejecutar el metodo de formik que escucha el cambio y cambia el valor segun el name o id
                                     * Decimos que de clases va a tener la clase de bordes redondos y tamaño maximo
                                     * En las clases tambien se le agrega el metodo que detecta cuando un campo tiene un error en las validaciones y le pone al input un estilo de error
                                     */}
                                    <InputText id="numero_doc" type={'number'} name="numero_doc" value={formik.values.numero_doc} onChange={formik.handleChange} className={'BorderFormNewUser w-full '+classNames({ 'p-invalid': isFormFieldValid("numero_doc") })} />
                                    {/* Se define el label del input anterior */}
                                    {/* Se le define la clase de validacion y cambio a error de manera dinamica */}
                                    <label htmlFor="numero_doc" className={classNames({ 'p-error': isFormFieldValid("numero_doc") })}>Número Documento*</label>
                                </span>
                                {/* Se llama el metodo que retorna el mensaje de error en dado caso que la validacion del campo que se pasa como argumento falle */}
                                {getFormErrorMessage("numero_doc")}
                            </div>

                            {/* Cada campo tiene una estructura de un contenedor general donde dentro de este estan el input y el mensaje de error */}
                            {/* Se dice que este campo tiene un tamaño del 100% pero cuando el tamaño supera el tamaño sm de pantalla va a tener un tamaño del 50% del componente */}
                            <div className="col-12 sm:col-6 mt-4">
                                {/* Contenedor que da el estilo de label flotante, para esto se usa la clase de p-float-label */}
                                <span className="p-float-label">
                                    {/* Se define el input de tipo calendario el cual ya viene con estilo predefinido de la plantilla */}
                                    {/**
                                     * establecemos cual queremos que sea el formato en el cual se va a mostrar, decimos que se quiere que el formato sea dia-mes-año
                                     * Establecemos el minimo y maximo de años que puede mostrar el calendario
                                     * le damos un name y un id para que formik haga la relacion automaticamente
                                     * como valor se le define el valor del objeto con nombre similar de la propiedad de values de formik
                                     * Al momento de cambiar el valor en el input va a ejecutar el metodo de formik que escucha el cambio y cambia el valor segun el name o id
                                     * Despues decimos que queremos el navegador de mes y año
                                     * Tambien le indicamos que quere mos que solo se lea y no se pueda editar de manera manual
                                     * Para al final asignarle los componentes que renderizara para mes y para año
                                     */}
                                    <Calendar dateFormat="dd/mm/yy" name="fecha_nacimiento" yearRange={`${today.getFullYear()-80}:${today.getFullYear()-14}`} id="fecha_nacimiento" value={formik.values.fecha_nacimiento} onChange={formik.handleChange}  monthNavigator yearNavigator style={{ borderRadius: "100%" }} className={'w-full  '+classNames({ 'p-invalid': isFormFieldValid('fecha_nacimiento') })}
                                        readOnlyInput monthNavigatorTemplate={monthNavigatorTemplate} yearNavigatorTemplate={yearNavigatorTemplate} />
                                    {/* Se define el label del input anterior */}
                                    {/* Se le define la clase de validacion y cambio a error de manera dinamica */}
                                    <label htmlFor="fecha_nacimiento"  className={classNames({ 'p-error': isFormFieldValid('fecha_nacimiento') })}>Fecha Nacimiento</label>
                                </span>
                                {/* Se llama el metodo que retorna el mensaje de error en dado caso que la validacion del campo que se pasa como argumento falle */}
                                {getFormErrorMessage('fecha_nacimiento')}
                            </div>
                            
                            {/* Cada campo tiene una estructura de un contenedor general donde dentro de este estan el input y el mensaje de error */}
                            {/* Se dice que este campo tiene un tamaño del 100% */}
                            <div className="col-12 mt-4">
                                {/* Contenedor que da el estilo de label flotante, para esto se usa la clase de p-float-label */}
                                <span className="p-float-label p-input-icon-right w-full ">
                                    {/* Importamos el componente de SelectLugarRegistro el cual es un selector que ahorra lineas de codigo que llenarian este espacio */}
                                    {/**
                                     * Se dice que al momento de cambiar el valor, va a cambiar el valor del gancho
                                     * como estilo se define que se quiere que los bordes derechos esten redondeados
                                     * como valor se le define el valor del objeto con nombre similar de la propiedad de values de formik
                                    */}
                                    <SelectLugarRegistro value={formik.values.lugar_registro_fk} onChange={formik.handleChange}  className={'BorderFormNewUser w-full '+classNames({ 'p-invalid': isFormFieldValid('lugar_registro_fk') })}/>
                                    {/* Se define el label del input anterior */}
                                    {/* Se le define la clase de validacion y cambio a error de manera dinamica */}
                                    <label htmlFor="lugar_registro_fk" className={classNames({ 'p-error': isFormFieldValid('lugar_registro_fk') })}>Lugar Registro*</label>
                                </span>
                                {/* Se llama el metodo que retorna el mensaje de error en dado caso que la validacion del campo que se pasa como argumento falle */}
                                {getFormErrorMessage('lugar_registro_fk')}
                            </div>

                            {/* Cada campo tiene una estructura de un contenedor general donde dentro de este estan el input y el mensaje de error */}
                            {/* Se dice que este campo tiene un tamaño del 100% */}
                            <div className="col-12">
                                {/* Se define el label del input a continuacion */}
                                {/* Se le define la clase de validacion y cambio a error de manera dinamica */}
                                <label htmlFor="telefono_contacto" className={"mx-3 "+classNames({ 'p-error': isFormFieldValid('telefono_contacto') })}>Número Contacto*</label>
                                {/* Usamos la etiqueta de phoneInput para declarar el input que recive el telefono */}
                                {/**
                                 * Como parametros para que esta etiqueta funcione correctamente se pasa
                                 * le damos un name y un id para que formik haga la relacion automaticamente
                                 * Decimos que de clases va a tener la clase de bordes redondos y tamaño maximo
                                 * Indicamos que el pais que se va a mostrar por defecto en el internacional es Colombia ("CO")
                                 * como valor se le define el valor del objeto con nombre similar de la propiedad de values de formik
                                 * al momento de cambiar el valor del input se va a ejecutar el metodo setNumero
                                 * Establecemos que los paises de posible seleccion son Colombia (CO), Ecuador (EC) y Estados Unidos (US)
                                 */}
                                <PhoneInput
                                    id="telefono_contacto" 
                                    className={"BorderFormNewUser mt-2 p-inputtext p-component "+classNames({ 'p-invalid': isFormFieldValid('telefono_contacto') })}
                                    name="telefono_contacto"
                                    defaultCountry="CO"
                                    value={formik.values.telefono_contacto}
                                    onChange={setNumero}
                                    countries={['CO', 'EC', 'US']}
                                    />
                                {/* Se llama el metodo que retorna el mensaje de error en dado caso que la validacion del campo que se pasa como argumento falle */}
                                {getFormErrorMessage('telefono_contacto')}
                            </div>

                            {/* Contenedor del campo que muestra si se aceptan las politicas del sistema, decimos que eltamaño es del 100% del contenedor */}
                            <div className="field-checkbox col-12 mt-3">
                                {/* Llamamos el elemento checkBox para crear una casilla de verificacion */}
                                {/**
                                 * Definimos el id y el name para el uso de formik
                                 * Definimos el valor que debe tener para que este este en verdadero
                                 * Definimos que se debe hacer cuando el valor cambie, en este caso ejecutara el metodo de formik
                                 * Se le define la clase de validacion y cambio a error de manera dinamica 
                                 */}
                                <Checkbox inputId="accept" name="accept" checked={formik.values.accept} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('accept') })} />
                                {/* Se define el label del Checkbox anterior */}
                                {/* Se le define la clase de validacion y cambio a error de manera dinamica */}
                                <label htmlFor="accept" className={"text-sm "+classNames({ 'p-error': isFormFieldValid('accept') })}>Acepto los <span className='p-link text-blue-500' onClick={()=>setDisplayBasic(true)}>terminos y condiciones</span> de uso del sistema, así como sus politicas de manejo de datos.*</label>
                            </div>

                            {/* Contenedor del campo que muestra si se aceptan las politicas del sistema, decimos que eltamaño es del 100% del contenedor */}
                            <div className="field-checkbox col-12 mt-3">
                                {/* Llamamos el elemento checkBox para crear una casilla de verificacion */}
                                {/**
                                 * Definimos el id y el name para el uso de formik
                                 * Definimos el valor que debe tener para que este este en verdadero
                                 * Definimos que se debe hacer cuando el valor cambie, en este caso ejecutara el metodo de formik
                                 * Se le define la clase de validacion y cambio a error de manera dinamica 
                                 */}
                                <Checkbox inputId="accept2" name="accept2" checked={formik.values.accept2} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('accept2') })} />
                                {/* Se define el label del Checkbox anterior */}
                                {/* Se le define la clase de validacion y cambio a error de manera dinamica */}
                                <label htmlFor="accept2" className={"text-sm "+classNames({ 'p-error': isFormFieldValid('accept2') })}>Acepto que FXA me envie mensajes vía sms o email informando de promociones, descuentos y otra información que será suministrada unica y exclusivamente por FXA.*</label>
                            </div>

                            {/* Contenedor del boton, el cual tiene estilo de tamaño del 100% y centrado de elementos */}
                            <div className="col-12 flex justify-content-center align-items-center">
                                {/* Boton el cual se encarga de enviar el formulario, tiene texto de scriptibo y como clases el borde redondo */}
                                <Button type="submit" label="Generar Codigo" className='BorderFormNewUser'/>
                            </div>

                        </form>
                    </Card>
                </div>
            }

            {/* Llamamos a dialog el cual abrira una ventana emergente o modal, cuando el gancho de visibilidad de este este en verdadero */}
            {/**
             * Definimos que este componente no tiene icono de cerrar
             * Le anclamos el gancho de displaySendSms a la visibilidad, esto para que cuando este gancho tenga valor de verdadero el dialogo se mostrara
             * Y declaramos metodo que realiza cuando se da clic en cerrar en este caso establecera su gancho como falso y restablecera el formulario
             */}
            <Dialog closable={false} visible={displaySendSms} className="w-11 md:w-8 xl:w-5" onHide={() => {setDisplaySendSms(false);formik.resetForm()}}>
                {/* Componente de codigo enviado con exito, se le pasan como parametros el número de telefono y la funcion de cerrar dialogo */}
                <DialogCodeSend telefono_contacto={formik.values.telefono_contacto} closeDialog={() => {setDisplaySendSms(false);formik.resetForm()}} toast={toast}/>
            </Dialog>

            {/* Llamamos a dialog el cual abrira una ventana emergente o modal, cuando el gancho de visibilidad de este este en verdadero */}
            {/**
             * Como titulo del dialog establecemos Términos Y Condiciones
             * Le anclamos el gancho de displayBasic a la visibilidad, esto para que cuando este gancho tenga valor de verdadero el dialogo se mostrara
             * Y declaramos metodo que realiza cuando se da clic en cerrar
             */}
            <Dialog header="Términos Y Condiciones" visible={displayBasic} className="w-11 md:w-8 xl:w-5" onHide={() => setDisplayBasic(false)}>
                {/* Se llama al componente de terminos y condiciones */}
                <Terms/>
            </Dialog>
        </div>
    );
}

//Exportamos el componente para usarlo en la seccion de App.js
export default FormNewUser