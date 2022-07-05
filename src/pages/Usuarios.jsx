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
          //Se establece como falso el valor del ganco que renderiza el componente de carga
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

          return (
              <button type="button" className={'hidden sm:inline-flex '+options.className} onClick={options.onClick}>
                  {options.page + 1}
                  <Ripple />
              </button>
          )
      },
      'CurrentPageReport': (options) => {
          return (<div>
              <span className='hidden sm:inline-block mr-2' style={{ color: 'var(--text-color)', userSelect: 'none', textAlign: 'center' }}>
                {options.first} a {options.last} de {options.totalRecords}
              </span>
              <span className='hidden sm:inline-block'>
                ||
              </span>
              <span className="mx-3" style={{ color: 'var(--text-color)', userSelect: 'none' }}>
                  Ir a la página <InputText size="1" className="ml-1 text-center" style={{border:"none", padding:0, background:"transparent"}} value={currentPage} tooltip={pageInputTooltip}
                      onKeyDown={(e) => onPageInputKeyDown(e, options)} onChange={onPageInputChange}/>
              </span>
              de  {options.totalPages}
          </div>)
      },
      'RowsPerPageDropdown': (options) => {
        const dropdownOptions = [
            { label: 10, value: 10 },
            { label: 25, value: 25 },
            { label: 50, value: 50 },
            { label: 100, value: 100 }
        ];

        return <>
          <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} className="mr-2" />

          {dataFilteredCalendar &&
            <Button icon="pi pi-calendar" onClick={deleteFilter} style={{border:"none"}} className='p-button-outlined p-button-rounded inline-flex my-3 mx-3'/>
          }
          {!dataFilteredCalendar &&
            <Button icon="pi pi-calendar" onClick={(e) => opCalendar.current.toggle(e)} style={{border:"none"}} className='p-button-outlined p-button-rounded p-button-secondary inline-flex my-3 mx-3'/>
          }
        </>
    }
  };

  const estadoField = (data) =>{    
    if(data.codigo_descuento){
      return <span className={data.codigo_descuento.estado?'code-style code-canjeado':'code-style code-sin-canjear'}>
        {data.codigo_descuento.estado?"Canjeado":"Sin Canjear"}
      </span>  
    }
    
  }

  //Edit Row
  const textEditor = (options) => {
    return <InputText type="text" className='w-full' value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  }

  const selectEditor = (options)=>{
    return <Dropdown name='lugar_registro_fk' value={options.rowData.lugar_registro_fk} className='w-full BorderFormNewUser' options={lugaresRegistro} onChange={(e) => options.editorCallback(e.target.value)} optionLabel="nombre_lugar_registro" optionValue='id_lugar_registro' placeholder="Seleccione el campo" />
  }

  const checkEditChange = (e) =>{
    let  err1 = (e.data.nombres === e.newData.nombres)?true:false
    let  err2 = (e.data.apellidos === e.newData.apellidos)?true:false
    let  err3 = (e.data.correo_electronico === e.newData.correo_electronico)?true:false
    let  err4 = (e.data.fecha_nacimiento === e.newData.fecha_nacimiento)?true:false
    let  err5 = (e.data.lugar_registro_fk === e.newData.lugar_registro_fk)?true:false
    let  err6 = (e.data.numero_doc === e.newData.numero_doc)?true:false
    let  err = (e.data.telefono_contacto === e.newData.telefono_contacto)?true:false

    return (!err1 || !err2 || !err3 || !err4 || !err5 || !err6 || !err)?false:true
  } 

  const onRowEditComplete = (e) => {
    if(!checkEditChange(e)){
      const usuarioService = new UsuarioService()
      usuarioService.update(e.newData).then(res=>{
        setLoadData(loadData+1)
        toast.current.show({severity:'success', summary: 'FXA Te Informa', detail: res.data, life: 3000});
      }).catch(err=>{
        if(err.response.data.errors){
          toast.current.show({severity:'error', summary: `Error en campo: ${err.response.data.errors[0].param}`, detail: err.response.data.errors[0].msg, life: 3000});
        }else{
          toast.current.show({severity:'error', summary: `Fxa Te Informa`, detail: err.response.data, life: 3000});
        }

      })
    }
  }

  //Filter

  const deleteFilterData = () =>{
    setFilterOption("eq")
    setFieldOption(null)
    setValueOption('')
    setCalendarOption(null)
    setFechaInicioValue(null)
    setFechaFinValue(null)
  }

  const deleteFilter = () =>{
    setDataFiltered(null)
    setDataFilteredCalendar(null)
    setLoadData(loadData+1)
  }

  const filterOptions = [
    {name:'Igual', code:"eq"},
    {name:'Diferente', code:"ne"},
    {name:'Contiene', code:"substring"}
  ]

  const fieldOptions = [
    {name:"Nombres", value:'nombres'},
    {name:'Apellidos', value:'apellidos'}, 
    {name:'Correo',value:'correo_electronico'}, 
    {name:'Fecha Nacimiento',value:'fecha_nacimiento'}, 
    {name:'Telefono',value:'telefono_contacto'}, 
    {name:'Identificación',value:'numero_doc'}, 
    {name:'Lugar Registro',value:'lugar_registro_fk'}  
  ]

  const searchFiltered = () =>{
    setDataFiltered({filterOption,fieldOption,valueOption})
    setCurrentPage(1)
    setLoadData(loadData+1)
    op.current.hide()
  }

  //Calendar Options
  const calendarOptions = [
    {name:'Fecha Nacimiento',value:'fecha_nacimiento'}, 
    {name:'Fecha Registro',value:'createdAt'}, 
  ]

  

  const CalendarFiltered = () =>{
    setDataFilteredCalendar({calendarOption,fechaInicioValue,fechaFinValue})
    setCurrentPage(1)
    setLoadData(loadData+1)
    opCalendar.current.hide()
  }

  const monthNavigatorTemplate=(e)=> {
    return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} style={{ lineHeight: 1 }} />;
  }

  const yearNavigatorTemplate=(e)=> {
    return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} className="p-ml-2" style={{ lineHeight: 1 }} />;
  }

  const LeftContents = () =>{
    return <SelectButton value={verEstadoCodigoOption} options={optionsVerEstadoCodigo} optionValue='value' onChange={(e) => {setVerEstadoCodigoOption(e.value); setLoadData(loadData+1)}} itemTemplate={templateVerEstadoCodigo} optionLabel="value" />
  }



  const RightContents = () =>{
    return <>
      <Button className='mx-3 p-button-outlined' onClick={()=>setDisplayGenerarReporte(true)} tooltip='Descargar Reporte' tooltipOptions={{position:'top'}} icon='pi pi-download'/>
      <Button className='p-button-outlined' onClick={()=>setDisplayGestionarLugaresRegistro(true)} tooltip='Gestionar Lugares De Registro' tooltipOptions={{position:'top'}} icon='pi pi-building'/>
    </>
  }

  const items = [
    { label: 'registros', url: '/#/dash/registros' }
  ];

  const home = { icon: 'pi pi-briefcase', url: '/#/dash' }

  const usuarioService = new UsuarioService()
  const deleteUser = id =>{
    usuarioService.delete(id).then(res=>{
        setLoadData(loadData+1)
        toast.current.show({severity:'warn', summary: 'FXA Te Informa', detail: res.data, life: 3000});
    }).catch(err=>{
      toast.current.show({severity:'error', summary: `Fxa Te Informa`, detail: err.response.data, life: 3000});
    })
  }

  const confirmDelete = (event, id) => {
    confirmDialog({
        header: 'Fxa Te Informa',
        position:'bottom',
        message: '¿Esta Seguro de borrar este registo?',
        icon: 'pi pi-info-circle',
        acceptLabel:'Seguro!',
        acceptClassName: 'p-button-danger',
        accept: ()=>deleteUser(id)
    });
  };

  const botonBorrar = (id) =>{
    return <FiTrash className='mr-2 cursor-pointer' onClick={e=>confirmDelete(e,id)}/>
  }
  return (<>

      <div className='col-12 card grid justify-content-between align-items-center mb-4 ml-1'>
          <div className='h-full flex justify-content-between align-items-cente'>    
              <h5 className='inline-block my-0 '>Registros</h5>            
              <i className='pi pi-info-circle text-purple-300 mx-3 text-2xl cursor-pointer icon-info-cumpleaños'/>
          </div>
          <BreadCrumb className='inline-block mx-4 p-1' style={{border:'none'}} model={items} home={home}/>
      </div>

      <div className='card w-full grid justify-content-center sm:justify-content-between ml-1'>
        <div className='my-2'>
          <LeftContents />
        </div>
        <div className='my-2'>
          <RightContents />
        </div>
      </div>

      {loading && 
          <div className='relative h-screen w-full justify-content-center align-items-center flex'>
              <LoadPage/>
          </div>
      }
      <Toast ref={toast} />
      

      {!loading &&
        <Card>


          <Paginator className='w-11 inline-flex' template={template1} first={customFirst} rows={customRows} totalRecords={totalRecords} onPageChange={onCustomPageChange}/>
          
          <DataTable value={usuarios} responsiveLayout="scroll" size="small" emptyMessage='Ups... No se encontro un registro para mostrar 😧'
            editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete}>
              <Column sortable field="createdAt" header="Fecha Registro"/>
              <Column sortable field="nombres" editor={(options) => textEditor(options)} header="Nombres"/>
              <Column sortable field="apellidos" editor={(options) => textEditor(options)} header="Apellidos"/>
              <Column sortable field="numero_doc" editor={(options) => textEditor(options)} header="Identificación"/>
              <Column sortable field="telefono_contacto" editor={(options) => textEditor(options)} header="Telefono"/>
              <Column sortable field="correo_electronico" editor={(options) => textEditor(options)} header="Correo"/>
              <Column sortable field="fecha_nacimiento" editor={(options) => textEditor(options)} header="Fecha Nacimiento"/>
              <Column sortable field="lugar_registro_fk"   body={e=>e.lugar_registro.nombre_lugar_registro} editor={(options) => selectEditor(options)} header="Lugar Registro"/>
              <Column sortable field="codigo_descuento.estado" body={estadoField} header="Estado Codigo"/>
              <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
              <Column body={e=>botonBorrar(e.id_usuario)}/>
          </DataTable>
        </Card>
      }
      <OverlayPanel ref={op} onHide={deleteFilterData} dismissable style={{ width: '305px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }} breakpoints={{'640px': '90vw'}}>
        <SelectButton optionLabel="name" optionValue="code" value={filterOption} options={filterOptions} onChange={(e) => setFilterOption(e.value)}/>
        <Dropdown value={fieldOption} className='w-full BorderFormNewUser my-3' options={fieldOptions} onChange={e=>setFieldOption(e.value)} optionLabel="name" placeholder="Seleccione el campo" />
        {fieldOption !== 'lugar_registro_fk' && <>
          <InputText value={valueOption} placeholder='Escriba el valor' className='w-full' onChange={(e) => setValueOption(e.target.value)} />
        </>}
        {fieldOption === 'lugar_registro_fk' && <>
          <Dropdown placeholder='Seleccione el valor' className='w-full BorderFormNewUser' optionLabel='nombre_lugar_registro' optionValue='id_lugar_registro' options={lugaresRegistro} value={valueOption} onChange={e=>setValueOption(e.value)}/>
        </>}
        <Button label='Filtrar' onClick={searchFiltered} className='w-full BorderFormNewUser mt-3' disabled={(filterOption&&fieldOption&&valueOption)?false:true}/>
      </OverlayPanel>
      <OverlayPanel ref={opCalendar} onHide={deleteFilterData} dismissable style={{ width: '305px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }} breakpoints={{'640px': '90vw'}}>
        <Dropdown value={calendarOption} className='w-full BorderFormNewUser' options={calendarOptions} onChange={e=>setCalendarOption(e.value)} optionLabel="name" placeholder="Seleccione el campo" />
        <Calendar placeholder='Fecha Inicio' className='w-full my-3' dateFormat="dd/mm/yy" name="fecha_nacimiento" yearRange={`${today.getFullYear()-200}:${today.getFullYear()}`} id="fecha_nacimiento" value={fechaInicioValue} onChange={e=>setFechaInicioValue(e.value)}  monthNavigator yearNavigator style={{ borderRadius: "100%" }}
          monthNavigatorTemplate={monthNavigatorTemplate} yearNavigatorTemplate={yearNavigatorTemplate} />
        <Calendar placeholder='Fecha Fin' className='w-full' dateFormat="dd/mm/yy" name="fecha_nacimiento" yearRange={`${today.getFullYear()-200}:${today.getFullYear()}`} id="fecha_nacimiento" value={fechaFinValue} onChange={e=>setFechaFinValue(e.value)}  monthNavigator yearNavigator style={{ borderRadius: "100%" }}
          monthNavigatorTemplate={monthNavigatorTemplate} yearNavigatorTemplate={yearNavigatorTemplate} />
        <Button label='Filtrar' onClick={CalendarFiltered} className='w-full BorderFormNewUser mt-3' disabled={(calendarOption&&fechaInicioValue&&fechaFinValue)?false:true}/>
      </OverlayPanel>

      <Dialog header="Generar Reporte" visible={displayGenerarReporte} className="w-11 md:w-8 xl:w-5" onHide={() => setDisplayGenerarReporte(false)}>
        <ReporteUsuarios/>
      </Dialog>

      <Dialog header="Gestionar Lugares Registro" visible={displayGestionarLugaresRegistro} className="w-11 md:w-9 xl:w-6" onHide={() => setDisplayGestionarLugaresRegistro(false)}>
        <LugarRegistro/>
      </Dialog>
  </>)
}

export default Usuarios