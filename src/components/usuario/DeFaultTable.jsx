import classNames from 'classnames'
import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Paginator } from 'primereact/paginator'
import { Ripple } from 'primereact/ripple'
import { Dropdown } from 'primereact/dropdown'
import { Toast } from 'primereact/toast'
import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState, useRef } from 'react'
import UsuarioService from '../../service/UsuarioService'
import LoadPage from '../LoadPage'

import './usuario.css'
import LugarRegistroService from '../../service/LugarRegistroService'

const DefaultTable = (params) => {

    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [customFirst, setCustomFirst] = useState(0);
    const [pageInputTooltip, setPageInputTooltip] = useState('Presiona la tecla "Enter" para ir a esta página.');
    const [usuarios, setUsuarios] = useState([])
    const [customRows, setCustomRows] = useState(50);
    const [loadData, setLoadData] = useState(0)
    const [totalRecords, setTotalRecords] = useState(0)

    const toast = useRef(null);

    useEffect(() => {
        const usuarioService = new UsuarioService()
        setLoading(true)
        usuarioService.getByStateCode(params.stateCode,currentPage-1,customRows).then(res => {
            setUsuarios(res.data.rows)
            setTotalRecords(res.data.totalItems)
            setLoading(false)
        });

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

    const template1 = {
      layout: 'PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport',
      'PrevPageLink': (options) => {
          return (<>
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
            { label: 50, value: 50 },
            { label: 100, value: 100 },
            { label: 250, value: 250 },
            { label: 500, value: 500 }
        ];

        return <>
          <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} className="mr-2" />
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
        }

      })
    }
  }
  
  return (<>
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
              <Column sortable field="nombres" editor={(options) => textEditor(options)} header="Nombres"/>
              <Column sortable field="apellidos" editor={(options) => textEditor(options)} header="Apellidos"/>
              <Column sortable field="numero_doc" editor={(options) => textEditor(options)} header="Identificación"/>
              <Column sortable field="telefono_contacto" editor={(options) => textEditor(options)} header="Telefono"/>
              <Column sortable field="correo_electronico" editor={(options) => textEditor(options)} header="Correo"/>
              <Column sortable field="fecha_nacimiento" editor={(options) => textEditor(options)} header="Fecha Nacimiento"/>
              <Column sortable field="lugar_registro_fk"   body={e=>e.lugar_registro.nombre_lugar_registro} editor={(options) => selectEditor(options)} header="Lugar Registro"/>
              <Column sortable field="codigo_descuento.estado" body={estadoField} header="Estado Codigo"/>
              <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
          </DataTable>
        </Card>
      }
  </>)
}

export default DefaultTable