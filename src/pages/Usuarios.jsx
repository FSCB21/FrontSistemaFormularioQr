/* Archivo que contiene el contenido principal del modulo de usuario */

//Importamos react para definir que lo que se encuentra en este archivo es un componente de react
//Importamos los ganchos de react que se van a usar en el archivo
//Importamos useEffect como el gancho que ejecuta un determinado grupo de lineas de codigo cada que se renderiza el componente
//Importamos useState como el gancho que almacena variables de estado que cambian de manera dinamica en el codigo
//Importamos useRef para crear una referencia a determinados elementos del archivo
import React, { useEffect, useState, useRef } from 'react'

//Importamos clasNames para cambiar las clases de los objetos de manera dinamica
import classNames from 'classnames'

//Importamos el elemento Card de primereact
//Card es un contenedor estilizado con bordes redondo y color de plantilla
import { Card } from 'primereact/card'
//Importamos el elemento column
//El cual es cada una de las columnas de la tabla
import { Column } from 'primereact/column'
//Importamos el objeto de DataTable de primereact
//DataTable sirve para organizar la informacion en tablas con una determinada estructura
import { DataTable } from 'primereact/datatable'
//Importamos el objeto de Paginator de prmereact
//Este elemento permite desplazarce de pagina de registros, aparte de poder cambiar cuantos registros se quieren ver en simultaneo
import { Paginator } from 'primereact/paginator'
//Importamos el objeto ripple
import { Ripple } from 'primereact/ripple'
//Importamos el objeto Dropdow de prime react
//Este elemento permite elegir entre varias opciones de valres establecidas en el item de optios
import { Dropdown } from 'primereact/dropdown'
//Importamos el objeto InputText
//Este objeto permite escribir en un cuadro de texto los valores que se requieran
import { InputText } from 'primereact/inputtext'
//Importamos el objetoOverlayPanel
//Este objeto es una ventana pequeña que emerge de la seccion a la cual se le da clic
import { OverlayPanel } from 'primereact/overlaypanel'
//Importamos el selectButton de primereact
//Este elemento es un boton el cual se le puede cambiar el valor que tiene activado por otro
import { SelectButton } from 'primereact/selectbutton'
//Importamos Button de primereact
//Este elemento es un boton el cual se le pueden asignar estilos de manera rapida
import { Button } from 'primereact/button'
//Importamos el objeto Calendar de primereact
//Este elemento es un estilo de input para calendario y selecion de fechas 
import { Calendar } from 'primereact/calendar'
//Importamos el elemento Toast de primereact
//Este elemento es una alerta que aparece en la pantalla 
import { Toast } from 'primereact/toast'
//Importamos el elemento de Dialog
//Este elemento es una etiqueta que facilita el uso de ventana modal/popUp
import { Dialog } from 'primereact/dialog'
//Importamos el elemento BreadCrumb
//El cual crea un menu de miga de pan que indica el desplazamiento en la pagina
import { BreadCrumb } from 'primereact/breadcrumb'
//Importamos el elemento confirmDialog
//Etiqueta que facilita la creacion de un displñay de confirmacion de usuario
import { confirmDialog } from 'primereact/confirmdialog';

//Importamos la clase de servicio de usuarios, la cual contiene todos los metodos de gestion de la informacion de consulta al api
import UsuarioService from '../service/UsuarioService'
//Importamos la calse de servicio de lugares de registro, la cual contiene todos los metos de consulta al api
import LugarRegistroService from '../service/LugarRegistroService'

//Importamos el componente de ventana de carga
import LoadPage from '../components/LoadPage'

//Importamos la hoja de estilos para css
import '../components/usuario/usuario.css'

//Importamos el componente de reporte de usuarios, para usarlo en una seccion de este archivo
import ReporteUsuarios from '../components/usuario/ReporteUsuarios'
//Importamos el componente de lugar de registro para usarlo en otra seccion de este archivo
import LugarRegistro from '../components/usuario/LugarRegistro'

//icons
//Importamos el icono de basura de react-icons
import { FiTrash } from 'react-icons/fi'

//Definimos el componente de usuario, donde estaran las etiquetas y funciones de este
const Usuarios = () => {

    //Creamos un gancho de estado para la ventana de carga, por defecto este gancho tiene un valor de false
    const [loading, setLoading] = useState(false)
    //Creamos un gancho de estado para la pagina actual el cual va a tener como valor inicial "1"
    const [currentPage, setCurrentPage] = useState(1);
    //Indica cual es el primer item de la lista, como valor inicial se define el "0"
    const [customFirst, setCustomFirst] = useState(0);
    //Gancho de estado el cual indica cual va a ser el texto del tooltip de seleccionar una pagina a la cual ir
    //Como valor inicial ponemos un  texto
    const [pageInputTooltip, setPageInputTooltip] = useState('Presiona la tecla "Enter" para ir a esta página.');
    //Gancho que concerbara el valor de los registros de usuarios, para que estos sean mostrados en directo en la tabla, como valor inicial se define un objeto vacio 
    const [usuarios, setUsuarios] = useState([])
    //Gancho que almacenara la cantidad de registros que se desean ver al momento, como valor inicial se establece que se desean visualizar 50 registros
    const [customRows, setCustomRows] = useState(50);
    //Gancho que es usado para renderizar el componente de manera manual cuando este cambie, su valor inicial es 0 y para cada vez que se requiera renderizar sera incrementar en +1 este valor
    const [loadData, setLoadData] = useState(0)
    //Campo que almacena la cantidad total de registros y segun esto muestra un valor en la tabla
    const [totalRecords, setTotalRecords] = useState(0)
    //Gancho que almacena todos los posibles valores de lugar de registro
    const [lugaresRegistro, setLugaresRegistro] = useState([])
    //Gancho que almacena cual es el estado de codigo que se desea visualizar, por defecto este estado es vacio
    const [verEstadoCodigoOption, setVerEstadoCodigoOption] = useState(null)
    //Gancho que almacena la opcion de filtro para la consulta de filtro, por defecto este valor es "eq" osea "="
    const [ filterOption, setFilterOption ] = useState("eq")
    //Gancho que almacena el valor del campo al que se quiere realizar la comparacion al momento de filtrar, su valor inicial es vacio
    const [ fieldOption, setFieldOption ] = useState(null)
    //Gancho que almacena el valor a comparar al momento de filtrar, su valor inicial es vacio
    const [ valueOption, setValueOption ] = useState('')
    //Gancho que almacena el valor para realizar la busqueda por filtro
    const [dataFiltered, setDataFiltered] = useState(null)
    //Gancho que almacena el valor para realizar la busqueda por filtro de rango de fechas
    const [ dataFilteredCalendar, setDataFilteredCalendar ] = useState(null)
    //Gancho que almacena el campo por el cual se requiere hacer la validacion de filtro por rango de fechas
    const [ calendarOption, setCalendarOption ] = useState(null)
    //Gancho que almacena la fehca inicio en el filtro por rango de fechas
    const [ fechaInicioValue, setFechaInicioValue ] = useState(null)
    //Gancho que almacena la fehca fin en el filtro por rango de fechas
    const [ fechaFinValue, setFechaFinValue ] = useState(null)
    //Gancho que almacena la visivilidad de la ventana modal de Reportes
    const [ displayGenerarReporte, setDisplayGenerarReporte ] = useState(false)
    //Gancho que almacena la visivilidad de la ventana modal de Lugares Registro
    const [ displayGestionarLugaresRegistro, setDisplayGestionarLugaresRegistro ] = useState(false)

    //Se define una variable que contiene la fecha actual mediante el metodo de new Date()
    let today = new Date()

    //Se define una constante que tendra la referencia a la etiqueta de toast
    const toast = useRef(null);
    //Se define una constante que tendra la referemcia a la etiqueta del overlay panel
    const op = useRef(null);
    //Se define una referencia al overlay panel del calendario
    const opCalendar = useRef(null);

    //Usamos el gancho de useEffect para ejecutar una determinada seccion de acciones cada que se renderice el componente
    useEffect(() => {
      //Definimos una constante denominada usuarioService la cual contendra una nueva instancia a la clase de UsuarioService
      const usuarioService = new UsuarioService()

      //Definimos como verdadero el valor del gancho que esta relacionado con el componente de carga
      setLoading(true)

      //En dado caso que este definido algun valor en dataFilteredCalendar va a ejecutar el siguiente fragmento de codigo
      if(dataFilteredCalendar){
        //De la instancia de la clase de usuarioService use el metodo de obtener todos por un rango de fecha
        //Va a enviar como argumentos de funcion la fecha de inicio, la fecha de fin, asi como la opcion a la cual se le quiere aplicar el filtrado por fecha
        //Enviamos tambien como parametros de consulta la pagina actual,el total de filas que se quieren ver y si se desea el estado del codigo
        usuarioService.getAllByRangeDate(dataFilteredCalendar.fechaInicioValue,dataFilteredCalendar.fechaFinValue,dataFilteredCalendar.calendarOption,currentPage-1,customRows, verEstadoCodigoOption).then(res=>{
          //Del resultado de esta consulta establecemos los registros de usuario que se quieren mostrar en la pagina
          setUsuarios(res.data.rows)
          //Establecemos el total de registros, como el objeto totalIems que fue dado como respuesta en la consulta
          setTotalRecords(res.data.totalItems)
          //Se establece como falso el valor del gancho que renderiza el componente de carga
          setLoading(false)
        })
      
      //Si no esta definido algun valor en el filtro por fechas
      //Si hay algun valor definido en el campo de dataFiltered
      }else if(dataFiltered){
        //Ejecutara el metodo de obtener todos los datos pero en este caso filtrando
        //enviara como primer parametro el campo a comparar, como segundo parametro enviara el valor y como tercero se enviara el metodo de busqueda ("a=b","a!=b", "a like '%b%'")
        usuarioService.getAllFiltered(dataFiltered.fieldOption,dataFiltered.valueOption,dataFiltered.filterOption,currentPage-1,customRows, verEstadoCodigoOption).then(res => {
          //Del resultado de realizar esta consulta va a establecer el gancho de registros como el valor de las filas que este retorne
          setUsuarios(res.data.rows)
          //Tambien va a cambiar el gancho de totalItems con el valor que resulta de la consulta anterior
          setTotalRecords(res.data.totalItems)
          //Despues establecera el gancho de carga a falso
          setLoading(false)
        });
      
      //Si ninguna de las condiciones se cumplen
      }else{
        //Se llama la clase de usuario service de la cual se usa el metodo getAll
        //Este metodo traera todos los registros de usaurios sin mayor filtro que el estado de codigo
        //Como argumentos de funcion enviamos la pagina actual y le restamos en 1, tambien embiamos la cantidad de filas que se quieren mostrar, y por ultimo si es que se requiere se envia el estado del codigo
        usuarioService.getAll(currentPage-1,customRows, verEstadoCodigoOption).then(res => {
          //Del resultado de la consulta se va a establecer el gancho de usuarios
          setUsuarios(res.data.rows)
          //Tambien se va a establecer el total de registros que hay en la base de datos
          setTotalRecords(res.data.totalItems)
          //Establecemos la variable de cargackmo falsa
          setLoading(false)
      });
      }

      //Retornamos para evitar errores de renderizacion
      return () => {}

      //Para ejecutar estas lineas de codigo sin tener que renderizar el componente
    },[loadData]); //eslint-disable-line

    //Usamos el gancho de useEffect para ejecutar una determinada seccion de acciones cada que se renderice el componente
    useEffect(() => {
      //Creamos un nuevo objeto de la clase de LugarRegistroService para acceder a los metodos de esta clase
      const lugarRegistroService = new LugarRegistroService()
      //Ejecutamos el metodo de getAllCtives del objeto lugarRegistroService el cual traera todos los lugares de registro que se encuentren activos
      lugarRegistroService.getAllActives().then(res=>{
        //del resultado de la funcion anterior vamos a camviar el valor del gancho de lugares de registro
        setLugaresRegistro(res.data)
      })

      //Retornamos para evitar errores de renderizacion
      return () => {}
    }, [])
    
    //Definimos una nueva constante la cual va a ejecutar una determinada accion cuando detecte que se deja de escribir en un determinado input
    const onPageInputKeyDown = (event, options) => {
      //Si la tecla precionada es "Enter"
      if (event.key === 'Enter') {
          //Va a definir una constante como pagina y le va a asignar el valor del gancho de la pagina actual
          const page = parseInt(currentPage);

          //si esta pagina tiene elementos que no correspondan a los números del 1 al 9
          if(!/^[0-9]+/.test(page))
            //El tooltip del input mostrara el siguiente mensaje
            setPageInputTooltip(`El valor debe ser un número positivo.`);
          //Si no, si la pagina es menor a 0 o la pagina es mayor a el posible total de paginas
          else if (page <= 0 || page > options.totalPages) 
              //El tooltip del input va a retornar mensaje de que las opciones deben estar entre 1 y el total de las paginas
              setPageInputTooltip(`El valor debe estar entre 1 y ${options.totalPages}.`);
          //Si no
          else {
              //Se define una constante de primero la cual tendra como valor... si current page esta definido, retornara options.rows * la pagina menos 1. sino retorna 0
              const first = currentPage ? options.rows * (page - 1) : 0;
              //El valor del gancho de primero se le establece como primero
              setCustomFirst(first);
              //Se cambia el valor del input a el valor de inicio
              setPageInputTooltip('Presiona la tecla "Enter" para ir a esta página.');
              //Se recarga la informacion despues de haber cambiado los ganchos anteriores, esto para que vuelva a buscar en el api pero con otros parametros
              setLoadData(loadData+1)
          }
      }
    }

    //Se define un nuevo metodo el cual se encarga de cambiar el valor de las filas que se desean ver
    const onCustomPageChange = (event) => {
      //Se cambia el primero de la lista como el primero que se envia por el elemento
      setCustomFirst(event.first);
      //Se cambia el valor de las filas a el que es elejido por el usuario
      setCustomRows(event.rows);
      //Se cambia el valor de la pagina actual por el valor que se envia en el elemento mas 1
      setCurrentPage(event.page + 1);
      //Se renderiza el componente para que los cambios se vean al momento 
      setLoadData(loadData+1)
    }

    //Se define una funcion que leera cuando se cambie el valor en el input de la pagina a la que se quiere acceder 
    const onPageInputChange = (event) => {
      //Establecemos la current page como el valor del evento
      setCurrentPage(event.target.value);
    }

    //Establecemos las opciones de boton para ver o no filtrando por estado de codigo
    const optionsVerEstadoCodigo = [
      //Indicamos la estructura del objeto, donde:
      //label: Es el texto que aparece en el boton
      //Icon: Es el icono que acompaña al texto
      //Value: es el valor que establece al cambiar 
      {label:'Todo', icon:'pi pi-bars', value:null},
      {label:'Canjeados', icon:'pi pi-check-circle', value:'1'},
      {label:'Sin Canjear', icon:'pi pi-times-circle', value:'0'},
    ]

    //Definimos un componente de etiqueta el cual recive unos parametros y segun estos muestra un contenido
    const templateVerEstadoCodigo = (e) =>{
      //Valor de retorno del componente es una etiqueta general vacia
      return <>
        {/* Un span para el texto el cual como clases de estilado tiene que se esconde y cuando el tamaño de la pantalla sea mayor a una media este se va a mostrar */}
        {/* Como texto del span vamos a obtener el label del objeto */}
        <span className='hidden md:block'>{e.label}</span>

        {/* Etiqueta de icono y como nombre de clase se envia el icono del elemento */}
        <i className={e.icon + ' ml-2'}/>
      </>
    }

    //Definimos una etiqueta la cual tendra el orden de los elementos de usuario
    const template1 = {
      //Como objetos que requerimos enviamos que queremos las flechas de avanzada, y los pagesLinks, tambien se dice que se requiere un dropdown para seleccionar cuantas lineas de registros se quieren ver, y por ultimo un reporte del total de paginas
      layout: 'PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport',
      //Configuracion del boton de pagina anterior
      'PrevPageLink': (options) => {
          //En vez de la configuracion normal, retornara la siguiente configuracion
          return (<>
              {/* Si dataFiltered tiene algun valor va a mostrar las siguientes etiquetas */}
              {dataFiltered &&
                //Boton el cual quita el filtro en dado caso que haya un filtro establecido
                //Para esto tiene designado el metodo deleteFilter al momento de dar clic
                //Como estilos del boton se dice que sea un boton sin relleno, un boton redondo, y con margen en X y Y
                //Tambien se le quitan los estilos de borde
                <Button icon="pi pi-filter-slash" onClick={deleteFilter} style={{border:"none"}} className='p-button-outlined p-button-rounded inline-flex my-3 mx-3'/>
              }
              {/* Si dataFiltered No tiene algun valor va a mostrar el siguiente bloque de codigo */}
              {!dataFiltered &&
                //Boton que abre el modal para agregar el filtro
                //Para esto tiene designado el metodo op.current.toggle al momento de dar clic
                //Como estilos del boton se dice que sea un boton sin relleno, un boton redondo, y con margen en X y Y... tambien tiene un color gris
                //Tambien se le quitan los estilos de borde
                <Button icon="pi pi-filter" onClick={(e) => op.current.toggle(e)} style={{border:"none"}} className='p-button-outlined p-button-rounded p-button-secondary inline-flex my-3 mx-3'/>
              }

              {/* Boton de flechita para cambiar la pagina, el cual esta deshabilitado si no hay opciones de ir a la pagina anterior */}
              <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
                  {/* Declaramos el icono de flecha */}
                  <span className="p-3"><i className='pi pi-angle-left'/></span>
                  {/* Agregamos animacion de ripple */}
                  <Ripple />
              </button>
          </>)
      },
      //Configuracion del boton de pagina siguiente
      'NextPageLink': (options) => {
          return (
              //Boton de flechita para cambiar la pagina, el cual esta deshabilitado si no hay opciones de ir a la pagina siguiente
              <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
                  {/* Declaramos el icono de flecha */}
                  <span className="p-3"><i className='pi pi-angle-right'/></span>
                  {/* Agregamos animacion de ripple */}
                  <Ripple />
              </button>
          )
      },
      //Configuracion de los links de pagina
      'PageLinks': (options) => {
          //Metodo validador de si se esta viendo la primera pagina o la pagina final para deshabilitar el funcionamiento de las flechas
          if ((options.view.startPage === options.page && options.view.startPage !== 0) || (options.view.endPage === options.page && options.page + 1 !== options.totalPages)) {
              const className = classNames(options.className, { 'p-disabled': true });

              return <span className={'hidden sm:inline-flex '+className} style={{ userSelect: 'none' }}>...</span>;
          }

          //Bloque de codigo que retorna en la seccion de pageLinks
          return (
              //Boton que cuando se da click ejecuta el metodo por defecto de onclick de las opciones
              <button type="button" className={'hidden sm:inline-flex '+options.className} onClick={options.onClick}>
                  {/* Como contenido del boton va a mostrar el número de la pagina mas 1 */}
                  {options.page + 1}
                  {/* Agregamos animacion de ripple */}
                  <Ripple />
              </button>
          )
      },
      //Cambiamos la configuracion que tiene por defecto el currentPageReport
      'CurrentPageReport': (options) => {
          //Decimos que este ahora va a retornar el siguiente componente
          return (<div>
              {/* Primero vamos a mostrar cuantos resgistros se estan mostrando y cuales */}
              {/* Decimos que esta dentro de un span, este span de clase tiene que se oculta y se muestra cuando la pantalla supera las medidas de sm(small) */}
              <span className='hidden sm:inline-block mr-2' style={{ color: 'var(--text-color)', userSelect: 'none', textAlign: 'center' }}>
                {options.first} a {options.last} de {options.totalRecords}
              </span>
              {/* Este contenedor tendra un separador para distinguir entre el cambio de pagina y el reconteo de pagina */}
              {/* Esta dentro ed un Span, este span tiene como estilos que se esconde y se muestra cuando el tamaño de la pantalla supera las medidadas definidas de sm(small) */}
              <span className='hidden sm:inline-block'>
                ||
              </span>
              {/* El siguiente contenedor mostrara el input en el cual se puede elegir a que pagina se desea ir de una manera mas dinamica */}
              {/* Este contenedor es una etiqueta espan con estilado de margen */}
              <span className="mx-3" style={{ color: 'var(--text-color)', userSelect: 'none' }}>
                  {/* Dentro del texto de ir a pagina agregamos el input el cual como metodo de escucha tiene definido que cuando se deje de escribir ejecutara la funcion onPageInputKeyDown */}
                  Ir a la página <InputText size="1" className="ml-1 text-center" style={{border:"none", padding:0, background:"transparent"}} value={currentPage} tooltip={pageInputTooltip}
                      onKeyDown={(e) => onPageInputKeyDown(e, options)} onChange={onPageInputChange}/>
              </span>
              {/* Mostramos el total de paginas a las cuales se puede ir */}
              de  {options.totalPages}
          </div>)
      },
      //Cambiamos el valor que se muestra por defecto en la seccion de RowsPerPaeDropdown
      'RowsPerPageDropdown': (options) => {
        //Definimos las opciones de la cantidad de registros que se desean ver en la tabla
        const dropdownOptions = [
            { label: 10, value: 10 },
            { label: 25, value: 25 },
            { label: 50, value: 50 },
            { label: 100, value: 100 }
        ];

        //Componente de retorno
        return <>
          {/* Llamamos un dropdown el cual como opciones tendra las que se declararon antes, y como valor tendra el valor que llega por defecto en las opciones */}
          {/* Cuando se cambie el valor de este dropdown se va a actualizar la cantidad de registros que se visualizan por pagina */}
          <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} className="mr-2" />

          {/* Si esta definido el objeto de dataFilteredCalendar va a mostrar el siguiente bloque de codigo*/}
          {dataFilteredCalendar &&
            //Va a mostrar un boton con icono de calendario y estilos de color rosado
            //Al dar clic en este boton borrara los filtros relacionados con el calendario, esto mediante el metodo de deleteFilter
            <Button icon="pi pi-calendar" onClick={deleteFilter} style={{border:"none"}} className='p-button-outlined p-button-rounded inline-flex my-3 mx-3'/>
          }
          {/* Si no esta definido el objeto de dataFilteredCalendar mostrara el siguiente contenido de codigo */}
          {!dataFilteredCalendar &&
            //Va a mostrar un boton con un icono de calendario en color gris
            //Al dar click en este boton abrira el dialogo para filtrar por fechas
            <Button icon="pi pi-calendar" onClick={(e) => opCalendar.current.toggle(e)} style={{border:"none"}} className='p-button-outlined p-button-rounded p-button-secondary inline-flex my-3 mx-3'/>
          }
        </>
    }
  };

  //Contenedor de estilo del estado de codigo en la datatable
  const estadoField = (data) =>{    
    //Si esta definido un codigo de descuento
    if(data.codigo_descuento){
      //Retorne el siguiente contenido
      //Una etiqueta Span que dependiendo del estado del codigo muestra un determinado color y clase
      return <span className={data.codigo_descuento.estado?'code-style code-canjeado':'code-style code-sin-canjear'}>
        {/* Como contenido de texto de la etiqueta, se define que si el codigo es verdadero mostrara "Canjeado" y si es falso mostrara "Sin Canjear" */}
        {data.codigo_descuento.estado?"Canjeado":"Sin Canjear"}
      </span>  
    }
    
  }

  //Componente que se activa cuando en la datatable un campo permite la edicion, y el usuario da clic en activar modo edicion
  const textEditor = (options) => {
    //Retorna un imputText el cual de estilos tiene tamaño del 100%
    //El valor de este input se pasa por las opciones del campo y al momento de cambiar el valor se cambia en estas mismas opciones pasandose como nuevo parametro
    return <InputText type="text" className='w-full' value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  }

  //Componente que se activa cuando en la datatable un campo permite la edicion pero en este caso es un valor de seleccion.
  const selectEditor = (options)=>{
    //Retorna un Dropdown el cual como opciones tiene los lugares de registro posibles/acivos
    //Como valor accede al valor de la llave foranea de lugar registro, al momento de cambiar el valor va a establecer un nuevo valor en las opciones de edicion
    return <Dropdown name='lugar_registro_fk' value={options.rowData.lugar_registro_fk} className='w-full BorderFormNewUser' options={lugaresRegistro} onChange={(e) => options.editorCallback(e.target.value)} optionLabel="nombre_lugar_registro" optionValue='id_lugar_registro' placeholder="Seleccione el campo" />
  }

  //Metodo validador que verifica si al momento de realizar la actualizacion si hubo algun cambio en el contenido del registro
  const checkEditChange = (e) =>{
    //Si nombres en su data original es igual a nombres al momento de actualizar, defina err1 como true
    let  err1 = (e.data.nombres === e.newData.nombres)?true:false
    //Si apellidos en su data original es igual a apellidos al momento de actualizar, defina err2 como true
    let  err2 = (e.data.apellidos === e.newData.apellidos)?true:false
    //Si correo_electronico en su data original es igual a correo_electronico al momento de actualizar, defina err3 como true
    let  err3 = (e.data.correo_electronico === e.newData.correo_electronico)?true:false
    //Si fecha_nacimiento en su data original es igual a fecha_nacimiento al momento de actualizar, defina err4 como true
    let  err4 = (e.data.fecha_nacimiento === e.newData.fecha_nacimiento)?true:false
    //Si lugar_registro_fk en su data original es igual a lugar_registro_fk al momento de actualizar, defina err5 como true
    let  err5 = (e.data.lugar_registro_fk === e.newData.lugar_registro_fk)?true:false
    //Si numero_doc en su data original es igual a numero_doc al momento de actualizar, defina err6 como true
    let  err6 = (e.data.numero_doc === e.newData.numero_doc)?true:false
    //Si telefono_contacto en su data original es igual a telefono_contacto al momento de actualizar, defina err como true
    let  err = (e.data.telefono_contacto === e.newData.telefono_contacto)?true:false

    //Validamos que alguna de las variables de funcion que se definieron anterior mente tengan un valor de falso
    //Si ninguna de las variables esta en falso, la funcion retornara verdadero
    //Pero si al menos 1 de las variables es falsa, la funcion retornara falso
    return (!err1 || !err2 || !err3 || !err4 || !err5 || !err6 || !err)?false:true
  } 

  //Funcion que se ejecuta al momento de que el usuario confirma que quiere realizar la actualizacion de la informacion
  //Esta funcion se encarga de ejecutar el metodo de actualizar un registro... o si no hubo ningun cambio en la informacion de notificarlo
  const onRowEditComplete = (e) => {
    //Lo primero que hace la funcion es validar que almenos si se haya cambiado un valor de informacion
    if(!checkEditChange(e)){
      //Si se cambioun valor va a definir usuarioService como un nuevo objeto de la calse de UsuarioService
      const usuarioService = new UsuarioService()
      //Con el objeto anterior va a ejecutar el metodo de actualizar un registro, donde pasa como parametros la nueva data de registro
      usuarioService.update(e.newData).then(res=>{
        //Una vez haya alguna respuesta a este metodo
        //Va a recargar la informacion, esto se hace cambiando el valor del gancho de recarga
        setLoadData(loadData+1)
        //Mostrara un mensaje emerjente el cual tiene estilo de correcto, con mensaje que retorna el api
        toast.current.show({severity:'success', summary: 'FXA Te Informa', detail: res.data, life: 3000});
        //En dado caso de que haya algun error
      }).catch(err=>{
        //Si es un arreglo de errores
        if(err.response.data.errors){
          //Mostrara el primero de estos errores, informando en que campo y cual es el motivo del error
          toast.current.show({severity:'error', summary: `Error en campo: ${err.response.data.errors[0].param}`, detail: err.response.data.errors[0].msg, life: 3000});
        }else{
          //Si no es un arreglo, mostrara el error que surgio
          toast.current.show({severity:'error', summary: `Fxa Te Informa`, detail: err.response.data, life: 3000});
        }

      })
    }
  }

  //Metodo que borra la configuracion de filtros, para cuando se cierra el dialogo 
  const deleteFilterData = () =>{
    //Establece que la opcion de filtro es "eq"
    setFilterOption("eq")
    //Establece como nulo la opcion de comparacion
    setFieldOption(null)
    //Establece el valor como vacio
    setValueOption('')
    //Establece la ocion del calendario como nula
    setCalendarOption(null)
    //Establece la fecha de inicio como nula
    setFechaInicioValue(null)
    //Establece la fecha fin como nula
    setFechaFinValue(null)
  }

  //Metodo que borra el filtro realizado en la consulta por filtros
  const deleteFilter = () =>{
    //Establece como nulo el filtro que pudo estar en el gancho de dataFiltered
    setDataFiltered(null)
    //Establece como nulo el filtro que pudo estar en el gancho de dataFilteredCalendar
    setDataFilteredCalendar(null)
    //Recarga el componente
    setLoadData(loadData+1)
  }

  //Opciones del desplegable de filtro
  const filterOptions = [
    //Name es el campo que observa el usuario, en cambio code es el campo que lee el sistema y es pasado al api
    {name:'Igual', code:"eq"},
    {name:'Diferente', code:"ne"},
    {name:'Contiene', code:"substring"}
  ]

  //Opciones de campos para realizar la validacion de filtro
  const fieldOptions = [
    //Name es el texto mostrado en el componente, value es el campo que se le envia al api
    {name:"Nombres", value:'nombres'},
    {name:'Apellidos', value:'apellidos'}, 
    {name:'Correo',value:'correo_electronico'}, 
    {name:'Fecha Nacimiento',value:'fecha_nacimiento'}, 
    {name:'Telefono',value:'telefono_contacto'}, 
    {name:'Identificación',value:'numero_doc'}, 
    {name:'Lugar Registro',value:'lugar_registro_fk'}  
  ]

  //Metodo que realiza el respectivo filtro de la informacion por campo valor
  const searchFiltered = () =>{
    //Definimos el campo de filtro, con los valores de filtro definidos anterior mente
    setDataFiltered({filterOption,fieldOption,valueOption})
    //Establece como nulo el filtro que pudo estar en el gancho de dataFilteredCalendar
    setDataFilteredCalendar(null)
    //Establecemos que la pagina actual ahora va a ser la pagina 1
    setCurrentPage(1)
    //Renderizamos el componente
    setLoadData(loadData+1)
    //Escondemos la ventana de dialogo que recientemente fue abierta
    op.current.hide()
  }

  //Opciones para el selector del filtro de calendario
  const calendarOptions = [
    //Name es el campo que observa el usuario, en cambio value es el campo que lee el sistema y es pasado al api
    {name:'Fecha Nacimiento',value:'fecha_nacimiento'}, 
    {name:'Fecha Registro',value:'createdAt'}, 
  ]

  //Metodo que realiza el respectivo filtro de la informacion por rango de fechas en los campos que lo permiten
  const CalendarFiltered = () =>{
    //Definimos el campo de filtro, con los valores de filtro definidos anterior mente en el formulario de la ventana de dialogo
    setDataFilteredCalendar({calendarOption,fechaInicioValue,fechaFinValue})
    //Establecemos que la pagina actual ahora va a ser la pagina 1
    setCurrentPage(1)
    //Establece como nulo el filtro que pudo estar en el gancho de dataFiltered
    setDataFiltered(null)
    //Renderizamos el componente
    setLoadData(loadData+1)
    //Escondemos la ventana de dialogo que recientemente fue abierta
    opCalendar.current.hide()
  }

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

  //Componente que renderiza los items que se encuentran al lado izquierdo en el menu de pagina
  const LeftContents = () =>{
    //Retorna un boton seleccionable donde el valor es el del gancho de estado codigo
    //Las opciones de este boton selecionable son las que se definieron con anterioridad
    //Cuando se le cambia el valor al boton este boton no solo cambia el valor del gancho de ver estado codigo, si no que tambien renderiza el componente para que solo muestre los registros segun el estado de codigo
    return <SelectButton value={verEstadoCodigoOption} options={optionsVerEstadoCodigo} optionValue='value' onChange={(e) => {setVerEstadoCodigoOption(e.value); setLoadData(loadData+1)}} itemTemplate={templateVerEstadoCodigo} optionLabel="value" />
  }

  //Componente que renderiza los items que se encuentran al lado derecho del menu de pagina
  const RightContents = () =>{
    return <>
      {/**
       * Boton con icono de flecha hacia abajo haciendo referencia a descarga
       * Como clases de estilado tiene que el boton esta sin relleno
       * Se dice que al dar clic en el boton va a establecer como verdadero el valor del gancho de displayGenerarReporte, esto hara que se abra una ventana modal con los campos para generar un reporte en excel
       * Tambien se indica que este boton tiene un tooltip que da mas informacion sobre lo que hace el boton, este tooltip se ubica en la parte de arriba del boton al pasar el cursor por encima
       */}
      <Button className='mx-3 p-button-outlined' onClick={()=>setDisplayGenerarReporte(true)} tooltip='Descargar Reporte' tooltipOptions={{position:'top'}} icon='pi pi-download'/>
       {/**
       * Boton con icono de edificio haciendo referencia a lugares de rgistro
       * Como clases de estilado tiene que el boton esta sin relleno
       * Se dice que al dar clic en el boton va a establecer como verdadero el valor del gancho de displayGestionarLugaresRegistro, esto hara que se abra una ventana modal con los campos para gestionar toda la informacion relacionada con los lugares de registro
       * Tambien se indica que este boton tiene un tooltip que da mas informacion sobre lo que hace el boton, este tooltip se ubica en la parte de arriba del boton al pasar el cursor por encima
       */}
      <Button className='p-button-outlined' onClick={()=>setDisplayGestionarLugaresRegistro(true)} tooltip='Gestionar Lugares De Registro' tooltipOptions={{position:'top'}} icon='pi pi-building'/>
    </>
  }

  //Arreglo con la estructura de objetos para el menu de miga de pan
  const items = [
    //label es el texto que se muestra en el menu de miga de pan
    //url es la redireccion que se desea hacer  al dar clic en este
    { label: 'registros', url: '/#/dash/registros' }
  ];

  //Objeto con la estructura del item principal del menu de miga de pan
  //Se define el icono que quiere que se muestre en este caso un icono de maletin
  //Se define la url de redireccion que se quiere dar al momento de dar clic en este
  const home = { icon: 'pi pi-briefcase', url: '/#/dash' }

  //Metodo que borra el registro de un usuario  mediante el id del mismo
  const deleteUser = id =>{
    //Se declara un nuevo objeto de la clase de UsuarioService
    const usuarioService = new UsuarioService()
    //Se ejecuta el metdo de borrar pasando como argumentos el id que fue solicitado en el metodo
    usuarioService.delete(id).then(res=>{
        //Despues de que el api responda renderizara el componente
        setLoadData(loadData+1)
        //Para despues mostrar una alerta donde menciona que se borro el registro de manera adecuada
        toast.current.show({severity:'warn', summary: 'FXA Te Informa', detail: res.data, life: 3000});

        //En dado caso de que falle
    }).catch(err=>{
      //Mostrara alerta de error mostrando error que retorna el api
      toast.current.show({severity:'error', summary: `Fxa Te Informa`, detail: err.response.data, life: 3000});
    })
  }

  //Metodo que confirma si el usuario verdaderamente quiere borrar un registro
  const confirmDelete = (_event, id) => {
    //Se ejecuta la funcion de dialogo de confirmacion
    confirmDialog({
        //Como titulo del dialogo
        header: 'Fxa Te Informa',
        //La posicion en la que va a aparecer el dialogo
        position:'bottom',
        //El contenido del dialogo
        message: '¿Esta Seguro de borrar este registo?',
        //Un icono para el dialogo
        icon: 'pi pi-info-circle',
        //Texto del boton de aceptar
        acceptLabel:'Seguro!',
        //Color/estilado del boton de aceptar
        acceptClassName: 'p-button-danger',
        //Si se da clic en aceptar va a ejecutar el metodo de borrar usuario pasando el id como argumento a la funcion
        accept: ()=>deleteUser(id)
        //Si se da clic en no o cerrar, no hara nada y cerrara el dialogo de confirmacion
    });
  };

  //Boton de borrar que aparece en cada registro al final de la tabla
  const botonBorrar = (id) =>{
    //Retorna un icono de papelera que al dar clic en este ejecuta el metodo de confirmacion de borrar el registro, y envia el id como segundo argumento
    return <FiTrash className='mr-2 cursor-pointer' onClick={e=>confirmDelete(e,id)}/>
  }

  //Componente de retorno de la pagina de usuario
  return (<>

      {/* EL primer contenedor que aparece es el contenedor de encabezado principal */}
      {/* Como estilos del componente se dice que el tamaño es del 100% que tiene estilos de carta y que aline sus items del interior dejando espacio entre ellos */}
      <div className='col-12 card grid justify-content-between align-items-center mb-4 ml-1'>
          {/* Un sub-componente el cual como estilo tiene ancho en 100% y alineacion de items dejando un espacio entre ellos */}
          <div className='h-full flex justify-content-between'>
            {/* Titulo que indica en que seccion de la pagina se encuentra el usuario */}
            <h5 className='inline-block my-0 '>Registros</h5>            
            {/* Icono que al dar clic en el aparece informacion de como usar el modulo */}
            <i className='pi pi-info-circle text-purple-300 mx-3 text-2xl cursor-pointer icon-info-cumpleaños'/>
          </div>
          {/* El otro componente es un menu de miga de pan el cual cntiene los items antes establecidos, y de misma manera el home */}
          <BreadCrumb className='inline-block mx-4 p-1' style={{border:'none'}} model={items} home={home}/>
      </div>

      {/* El segundo contenedor es el que almacena los botones de busqueda por estado del codigo, y botones de descarga y gestion de lugares de registro */}
      {/* Como estilado tiene, estilo de carta... alineado de contenido centrado y cuando es superior a una pantalla de sm, alinea dejando un espacio */}
      <div className='card w-full grid justify-content-center sm:justify-content-between ml-1'>
        <div className='my-2'>
          {/* Importamos el componente de leftContens */}
          <LeftContents />
        </div>
        <div className='my-2'>
          {/* Importamos el componente de RightContens */}
          <RightContents />
        </div>
      </div>

      {/* En dado caso que el gancho de carga este en verdadero va a renderizar las siguientes lineas de codigo */}
      {loading && 
          //Contenedor que centra el componente interno
          <div className='relative h-screen w-full justify-content-center align-items-center flex'>
              {/* Conponente de animacion de carga */}
              <LoadPage/>
          </div>
      }

      {/* Etiqueta de mensajes la cual solo con definirla se puede hacer usod e todos los metodos que esta dispone */}
      <Toast ref={toast} />
      
      {/* En dado caso que el gancho de carga este en falso va a renderizar las siguientes lineas de codigo */}
      {!loading &&
        //Una carta como el componente principal
        <Card>

          {/* Usamos el elemento Paginator de react y le asignamos todas los objetos que fueron creados para este mismo */}
          {/**
           * Como templeate que es la configuracion del contenido agregamos la constante template
           * En el elemento de primero agregamos el customFirst
           * En las filas agregamos las customRows
           * Para el total agregamos totalRecords que guarda el total de registros
           * Y como metodo de cambiar de pagina agregamos el metodo personalizado
           */}
          <Paginator className='w-11 inline-flex' template={template1} first={customFirst} rows={customRows} totalRecords={totalRecords} onPageChange={onCustomPageChange}/>
          
          {/* El componente de datatable es el que organiza la informacion de los registros para mostrarla en una tabla */}
          {/**
           * Como valor de tabla se envia el gancho de usuarios
           * Definimos que el modo de respuesta cuando el componente se exceda en tamaño, va a ser de scroll lateral
           * Definimos que el tamaño de las filas va a ser tamaño pequeño
           * Se dice que en dado caso que no haya algun valor en usuarios retornara mensaje de que no se encontraron registros
           * Definimos que el modo de edicion es de fila y que el metodo a ejecutar cuando este se confirme es el de onRowEditComplete
           */}
          <DataTable value={usuarios} responsiveLayout="scroll" size="small" emptyMessage='Ups... No se encontro un registro para mostrar 😧'
            editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete}>
              {/* Etiqueta column la cual establece que el campo a mostrar es una columna */}
              {/* Indicamos que a la columna se le puede cambiar el orden de mayor a menor y viceversa */}
              {/**
               * Establecemos cual es el campo del cual se saca la informacion...
               * esto buscara en cada objeto del arreglo de usuarios y obtendra el valor del campo que coincide con el nombre
               * EJ:
               * Registro: {
               *  id: 1
               *  nombres:Pepito
               *  createdAt: 07/07/2022
               * }
               * 
               * De este elemento la consulta de la columna donde field es "createdAt" retornara "07/07/2022"
               * 
               */}
               {/* Y con el header indocamos el titulo que deseamos que tenga la consulta */}
              <Column sortable field="createdAt" header="Fecha Registro"/>
              {/* El parametro de editor es el que se actiav al dar clic en el icono del lapiz, esto hace que un campo de solo lectura pase a ser un campo editable, y para que los cambios se vean efectuados se pasan las funciones de valor y cambio por las opciones como parametro */}
              <Column sortable field="nombres" editor={(options) => textEditor(options)} header="Nombres"/>
              <Column sortable field="apellidos" editor={(options) => textEditor(options)} header="Apellidos"/>
              <Column sortable field="numero_doc" editor={(options) => textEditor(options)} header="Identificación"/>
              <Column sortable field="telefono_contacto" editor={(options) => textEditor(options)} header="Telefono"/>
              <Column sortable field="correo_electronico" editor={(options) => textEditor(options)} header="Correo"/>
              <Column sortable field="fecha_nacimiento" editor={(options) => textEditor(options)} header="Fecha Nacimiento"/>
              {/* El parametro body cambia el valor de lectura por defecto a la renderizacion de e.lugar_registro_nombre */}
              <Column sortable field="lugar_registro_fk" body={e=>e.lugar_registro.nombre_lugar_registro} editor={(options) => selectEditor(options)} header="Lugar Registro"/>
              <Column sortable field="codigo_descuento.estado" body={estadoField} header="Estado Codigo"/>
              {/* El parametro rowEditor es para decir que este sera la columna donde va a estar el boton que habilita la edicion en la fila */}
              <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} />
              {/* Columna que renderiza el boton de enviar, y para cada boton define un id diferente */}
              <Column body={e=>botonBorrar(e.id_usuario)}/>
          </DataTable>
        </Card>
      }

      {/* Llamamos el objeto de overlayPanel para abrir una pequeña ventana de dialogo */}
      {/**
       * Le agregamos la referencia a op, para hacer uso de esta en el codigo mas arriba
       * Establecemos un metodo que se ejecutara cuando la ventana de dialogo se cierre
       * Al decir dimissable decimos que queremos que se muestre el icono de cerrar ventana de dialogo
       * le ponemos estilos para darle volumen a la ventana de dialogo
       * Y por ultimo definimos puntos de quiebre para cambiar el tamaño de la ventata de dialogo cuando la pantalla supere esa medida establecida
       */}
      <OverlayPanel ref={op} onHide={deleteFilterData} dismissable style={{ width: '305px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }} breakpoints={{'640px': '90vw'}}>
        {/* Dentro de la ventana de dialogo agregamos un el elemento de SelectButton, el cual es un componente que permite elejir entre varias opciones de manera dinamica */}
        {/**
         * Le indicamos que el texto a mostrar es el valor del item que en el objeto tenga nombre de name
         * Le indicamos que el valor al realizar el cambio es el valor del item que en el objeto se llama code
         * El valor del boton es el gancho de filter option
         * Las opciones de boton que tienen la estructura nombrada anterior mente son los valores del arreglo de filterOptions
         * Se dice que al realizar el cambio de valores va a cambiar el valor del gancho de filterOption a el valor elejido por el usuario
         */}
        <SelectButton optionLabel="name" optionValue="code" value={filterOption} options={filterOptions} onChange={(e) => setFilterOption(e.value)}/>

        {/* Se llama la etiqueta de dropdown para crear un selector desplegable */}
        {/**
         * Como valor se le define el gancho de fieldOption
         * se le pone la clase para que se redondeen los bordes
         * como opciones de selector desplegable se le asignan los valores de fieldOptions
         * Se dice que al momento de cambiar el valor, va a cambiar el valor del gancho
         * tambien se dice que el texto que se muestra por opcion es el que valor del parametro que se llama label 
         */}
        <Dropdown value={fieldOption} className='w-full BorderFormNewUser my-3' options={fieldOptions} onChange={e=>setFieldOption(e.value)} optionLabel="name" placeholder="Seleccione el campo" />
        
        {/* Si el valor de fieldOption no es lugar_registro_fk el sistema va a renderizar las siguientes lineas de codigo */}
        {fieldOption !== 'lugar_registro_fk' && 
          //Va a renderizar un input
          //El cual va a tener como valor el valor del gancho de valueOption
          //Va a tener un placeholder y una clase de tamaño de 100%
          //Tambien se dice que al realizar el cambio en este componente se va a cambiar el valor del gancho de valueOption
          <InputText value={valueOption} placeholder='Escriba el valor' className='w-full' onChange={(e) => setValueOption(e.target.value)} />
        }

        {/* Si el valor de fieldOption es exactamente igual a lugar_registro_fk el sistema va a renderizar las siguientes lineas de codigo */}
        {fieldOption === 'lugar_registro_fk' && 
          //Va a renderizar un selector desplegable
          //Va a tener un place holder que indica que puede elegir el valor y calse de tamaño completo y redondeo de bordes
          //Indica que el texto que ve el usuario al momento de elejir es el valor del parametro que se llama "nombre_lugar_registro"
          //Indica que el valor de el campo al momento de este ser seleccionado es el valor del parametro que se llama "id_lugar_registro"
          //Indicamos las opciones de eleccion, las cuales son el gancho de los lugares de registro que se consultan al momento de renderizar el componente
          //Indicamos que el valor del dopdown es el valor del gancho denominado valueOption
          //Tambien indicamos que al momento de elejir otra opcion se va a cambiar el valor del gancho valueOption
          <Dropdown placeholder='Seleccione el valor' className='w-full BorderFormNewUser' optionLabel='nombre_lugar_registro' optionValue='id_lugar_registro' options={lugaresRegistro} value={valueOption} onChange={e=>setValueOption(e.value)}/>
        }

        {/* Llamamos un boton el cual realizara la accion de filtrar segun los parametros establecidos anterior mente */}
        {/**
         * Como texto del boton ponemos filtrar
         * decimos que al momento de dar clic ejecutara la funcion de serchFiltered, la cual realiza el metodo de filtrado y renderiza el componente
         * indicamos que el boton estara deshabilitado hasta que todos los campos del formulario tengan un valor 
         */}
        <Button label='Filtrar' onClick={searchFiltered} className='w-full BorderFormNewUser mt-3' disabled={(filterOption&&fieldOption&&valueOption)?false:true}/>
      </OverlayPanel>

      {/* Llamamos el objeto de overlayPanel para abrir una pequeña ventana de dialogo */}
      {/**
       * Le agregamos la referencia a opCalendar, para hacer uso de esta en el codigo mas arriba
       * Establecemos un metodo que se ejecutara cuando la ventana de dialogo se cierre, esto para borrar la informacion que se haya digitado en el formulario
       * Al decir dimissable decimos que queremos que se muestre el icono de cerrar ventana de dialogo
       * le ponemos estilos para darle volumen a la ventana de dialogo
       * Y por ultimo definimos puntos de quiebre para cambiar el tamaño de la ventata de dialogo cuando la pantalla supere esa medida establecida
       */}
      <OverlayPanel ref={opCalendar} onHide={deleteFilterData} dismissable style={{ width: '305px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }} breakpoints={{'640px': '90vw'}}>
        {/* Se llama la etiqueta de dropdown para crear un selector desplegable */}
        {/**
         * Como valor se le define el gancho de calendarOption
         * se le pone la clase para que se redondeen los bordes
         * como opciones de selector desplegable se le asignan los valores de calendarOptions
         * Se dice que al momento de cambiar el valor, va a cambiar el valor del gancho
         * tambien se dice que el texto que se muestra por opcion es el que valor del parametro que se llama name 
         */}
        <Dropdown value={calendarOption} className='w-full BorderFormNewUser' options={calendarOptions} onChange={e=>setCalendarOption(e.value)} optionLabel="name" placeholder="Seleccione el campo" />

        {/* Calendar es un objeto que permite el manejo de fechas de manera facil y dinamica para el usuario */}
        {/**
         * En este caso llamamos un calendario para elegir la fecha de incio en la cual se va a realizar el filtro por rango de fechas
         * establecemos un placeholder para que se entienda un poco la funcion de este input
         * establecemos cual queremos que sea el formato en el cual se va a mostrar, decimos que se quiere que el formato sea dia-mes-año
         * Establecemos el minimo y maximo de años que puede mostrar el calendario
         * Despues definimos el gancho al cual el calendario va a tener referencia del valor
         * Despues decimos que cuando el elemento cambie se va a cambiar el valor del gancho
         * Despues decimos que queremos el navegador de mes y año
         * Para al final asignarle los componentes que renderizara para mes y para año
         */}
        <Calendar placeholder='Fecha Inicio' className='w-full my-3' dateFormat="dd/mm/yy" yearRange={`${today.getFullYear()-200}:${today.getFullYear()}`} value={fechaInicioValue} onChange={e=>setFechaInicioValue(e.value)}  monthNavigator yearNavigator style={{ borderRadius: "100%" }}
          monthNavigatorTemplate={monthNavigatorTemplate} yearNavigatorTemplate={yearNavigatorTemplate} />
        
        {/* Calendar es un objeto que permite el manejo de fechas de manera facil y dinamica para el usuario */}
        {/**
         * En este caso llamamos un calendario para elegir la fecha de fin en la cual se va a realizar el filtro por rango de fechas
         * establecemos un placeholder para que se entienda un poco la funcion de este input
         * establecemos cual queremos que sea el formato en el cual se va a mostrar, decimos que se quiere que el formato sea dia-mes-año
         * Establecemos el minimo y maximo de años que puede mostrar el calendario
         * Despues definimos el gancho al cual el calendario va a tener referencia del valor
         * Despues decimos que cuando el elemento cambie se va a cambiar el valor del gancho
         * Despues decimos que queremos el navegador de mes y año
         * Para al final asignarle los componentes que renderizara para mes y para año
         */}
        <Calendar placeholder='Fecha Fin' className='w-full' dateFormat="dd/mm/yy" yearRange={`${today.getFullYear()-200}:${today.getFullYear()}`} value={fechaFinValue} onChange={e=>setFechaFinValue(e.value)}  monthNavigator yearNavigator style={{ borderRadius: "100%" }}
          monthNavigatorTemplate={monthNavigatorTemplate} yearNavigatorTemplate={yearNavigatorTemplate} />
        
        {/* Llamamos un boton el cual realizara la accion de filtrar por rango segun los parametros establecidos anterior mente */}
        {/**
         * Como texto del boton ponemos filtrar
         * decimos que al momento de dar clic ejecutara la funcion de CalendarFiltered, la cual realiza el metodo de filtrado por rango de fechas y renderiza el componente
         * indicamos que el boton estara deshabilitado hasta que todos los campos del formulario tengan un valor 
         */}
        <Button label='Filtrar' onClick={CalendarFiltered} className='w-full BorderFormNewUser mt-3' disabled={(calendarOption&&fechaInicioValue&&fechaFinValue)?false:true}/>
      </OverlayPanel>

      {/* Llamamos a dialog el cual abrira una ventana emergente o modal, cuando el gancho de visibilidad de este este en verdadero */}
      {/**
       * Como titulo del dialog establecemos Generar Reporte
       * Le anclamos el gancho de displayGenerarReporte a la visibilidad, esto para que cuando este gancho tenga valor de verdadero el dialogo se mostrara
       * Y declaramos metodo que realiza cuando se da clic en cerrar
       */}
      <Dialog header="Generar Reporte" visible={displayGenerarReporte} className="w-11 md:w-8 xl:w-5" onHide={() => setDisplayGenerarReporte(false)}>
        {/* Llamamos el componente de Reporte de usuarios para que todo su contenido se muestre dentro de la ventana modal */}
        <ReporteUsuarios/>
      </Dialog>

      {/* Llamamos a dialog el cual abrira una ventana emergente o modal, cuando el gancho de visibilidad de este este en verdadero */}
      {/**
       * Como titulo del dialog establecemos Gestionar Lugares Registro
       * Le anclamos el gancho de displayGestionarLugaresRegistro a la visibilidad, esto para que cuando este gancho tenga valor de verdadero el dialogo se mostrara
       * Y declaramos metodo que realiza cuando se da clic en cerrar
       */}
      <Dialog header="Gestionar Lugares Registro" visible={displayGestionarLugaresRegistro} className="w-11 md:w-9 xl:w-6" onHide={() => setDisplayGestionarLugaresRegistro(false)}>
        {/* Llamamos el componente de lugar de registro para que todo su contenido se muestre dentro de la ventana modal */}
        <LugarRegistro/>
      </Dialog>
  </>)
}

//Exportamos el componente para usarlo en la seccion de App.js
export default Usuarios