import classNames from 'classnames'
import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Paginator } from 'primereact/paginator'
import { Ripple } from 'primereact/ripple'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { OverlayPanel } from 'primereact/overlaypanel'
import { SelectButton } from 'primereact/selectbutton'
import React, { useEffect, useState, useRef } from 'react'
import UsuarioService from '../service/UsuarioService'
import LoadPage from '../components/LoadPage'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import '../components/usuario/usuario.css'
import LugarRegistroService from '../service/LugarRegistroService'
import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'
import ReporteUsuarios from '../components/usuario/ReporteUsuarios'
import LugarRegistro from '../components/usuario/LugarRegistro'
import { BreadCrumb } from 'primereact/breadcrumb'
import { confirmDialog } from 'primereact/confirmdialog';
//icons
import { FiTrash } from 'react-icons/fi'

const Usuarios = () => {

    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [customFirst, setCustomFirst] = useState(0);
    const [pageInputTooltip, setPageInputTooltip] = useState('Presiona la tecla "Enter" para ir a esta página.');
    const [usuarios, setUsuarios] = useState([])
    const [customRows, setCustomRows] = useState(50);
    const [loadData, setLoadData] = useState(0)
    const [totalRecords, setTotalRecords] = useState(0)

    let today = new Date()
    const toast = useRef(null);

    const op = useRef(null);
    const opCalendar = useRef(null);

    useEffect(() => {
        const usuarioService = new UsuarioService()
        setLoading(true)

        if(dataFilteredCalendar){
          usuarioService.getAllByRangeDate(dataFilteredCalendar.fechaInicioValue,dataFilteredCalendar.fechaFinValue,dataFilteredCalendar.calendarOption,currentPage-1,customRows, verEstadoCodigoOption).then(res=>{
            setUsuarios(res.data.rows)
            setTotalRecords(res.data.totalItems)
            setLoading(false)
          })
        }else if(dataFiltered){
          usuarioService.getAllFiltered(dataFiltered.fieldOption,dataFiltered.valueOption,dataFiltered.filterOption,currentPage-1,customRows, verEstadoCodigoOption).then(res => {
            setUsuarios(res.data.rows)
            setTotalRecords(res.data.totalItems)
            setLoading(false)
          });
        }else{
          usuarioService.getAll(currentPage-1,customRows, verEstadoCodigoOption).then(res => {
            setUsuarios(res.data.rows)
            setTotalRecords(res.data.totalItems)
            setLoading(false)
        });
        }

      return () => {
      }
    },[loadData]); //eslint-disable-line

    //Lugar Servicio
    const [lugaresRegistro, setLugaresRegistro] = useState([])

    useEffect(() => {
      const lugarRegistroService = new LugarRegistroService()
      lugarRegistroService.getAllActives().then(res=>{
        setLugaresRegistro(res.data)
      })
      return () => {}
    }, [])
    

    const onPageInputKeyDown = (event, options) => {
      if (event.key === 'Enter') {
          const page = parseInt(currentPage);
          if(!/^[0-9]+/.test(page))
            setPageInputTooltip(`El valor debe ser un número positivo.`);
          else if (page < 0 || page > options.totalPages) 
              setPageInputTooltip(`El valor debe estar entre 1 y ${options.totalPages}.`);
          else {
              const first = currentPage ? options.rows * (page - 1) : 0;
              setCustomFirst(first);
              setPageInputTooltip('Presiona la tecla "Enter" para ir a esta página.');
              setLoadData(loadData+1)
          }
      }
  }
    const onCustomPageChange = (event) => {
      setCustomFirst(event.first);
      setCustomRows(event.rows);
      setCurrentPage(event.page + 1);
      setLoadData(loadData+1)
    }

    const onPageInputChange = (event) => {
      setCurrentPage(event.target.value);
    }

    const [verEstadoCodigoOption, setVerEstadoCodigoOption] = useState(null)

    const optionsVerEstadoCOdigo = [
      {label:'Todo', icon:'pi pi-bars', value:null},
      {label:'Canjeados', icon:'pi pi-check-circle', value:'1'},
      {label:'Sin Canjear', icon:'pi pi-times-circle', value:'0'},
    ]

    const templateVerEstadoCodigo = (e) =>{
      return <>
        <span className='hidden md:block'>{e.label}</span>
        <i className={e.icon + ' ml-2'}/>
      </>
    }

    const template1 = {
      layout: 'PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport',
      'PrevPageLink': (options) => {
          return (<>
              {dataFiltered &&
                <Button icon="pi pi-filter-slash" onClick={deleteFilter} style={{border:"none"}} className='p-button-outlined p-button-rounded inline-flex my-3 mx-3'/>
              }
              {!dataFiltered &&
              <Button icon="pi pi-filter" onClick={(e) => op.current.toggle(e)} style={{border:"none"}} className='p-button-outlined p-button-rounded p-button-secondary inline-flex my-3 mx-3'/>
            }
            
              <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
                  <span className="p-3"><i className='pi pi-angle-left'/></span>
                  <Ripple />
              </button>
          </>)
      },
      'NextPageLink': (options) => {
          return (
              <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
                  <span className="p-3"><i className='pi pi-angle-right'/></span>
                  <Ripple />
              </button>
          )
      },
      'PageLinks': (options) => {
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

  const [ filterOption, setFilterOption ] = useState("eq")
  const [ fieldOption, setFieldOption ] = useState(null)
  const [ valueOption, setValueOption ] = useState('')

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
  const [dataFiltered, setDataFiltered] = useState(null)

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

  const [ dataFilteredCalendar, setDataFilteredCalendar ] = useState(null)

  const [ calendarOption, setCalendarOption ] = useState(null)
  const [ fechaInicioValue, setFechaInicioValue ] = useState(null)
  const [ fechaFinValue, setFechaFinValue ] = useState(null)

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
    return <SelectButton value={verEstadoCodigoOption} options={optionsVerEstadoCOdigo} optionValue='value' onChange={(e) => {setVerEstadoCodigoOption(e.value); setLoadData(loadData+1)}} itemTemplate={templateVerEstadoCodigo} optionLabel="value" />
  }

  //Reportes
  const [ displayGenerarReporte, setDisplayGenerarReporte ] = useState(false)
   
  //Lugares Registro
  const [ displayGestionarLugaresRegistro, setDisplayGestionarLugaresRegistro ] = useState(false)

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