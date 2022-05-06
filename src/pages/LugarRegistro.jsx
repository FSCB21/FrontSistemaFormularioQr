import React, { useRef, useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toast } from 'primereact/toast'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { FilterMatchMode } from 'primereact/api';
import LoadPage from '../components/LoadPage'
import LugarRegistroService from '../service/LugarRegistroService'
import { OverlayPanel } from 'primereact/overlaypanel'
import classNames from 'classnames'
import { useFormik } from 'formik'
import validationLugarRegistro from '../validations/validationLugarRegistro'

const LugarRegistro = () => {

    const op = useRef(null);
    const toast = useRef(null);
    const [loading, setLoading] = useState(false)
    const [lugaresRegistro, setLugaresRegistro] = useState([])
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState(null);
    const [ loadData, setLoadData] = useState(0)

    useEffect(() => {
      setLoading(true)
      const lugarRegistroService = new LugarRegistroService()
      lugarRegistroService.getAll().then(res=>{
          setLugaresRegistro(res.data)
          setLoading(false)
      })
      initFilters()
      return () => {
        
      }
    }, [loadData]) //eslint-disable-line
    
    const formik = useFormik({
      initialValues: {
          nombre_lugar_registro: '',
      },
      validate: (data) => validationLugarRegistro(data),
      onSubmit: (data) => {
          const lugarRegistroService = new LugarRegistroService()
          lugarRegistroService.create(data).then(res=>{
            setLoadData(loadData+1)
            op.current.hide()
            toast.current.show({severity:'success', summary: 'FXA Te Informa', detail: res.data, life: 3000});
          }).catch(err=>{
            toast.current.show({severity:'error', summary: 'FXA Te Informa', detail: 'Ya existe un campo con este nombre', life: 3000});
          })
      }
  });


    const estadoField = (data) =>{    
        
        return <span className={data.estado?'code-style code-canjeado':'code-style code-sin-canjear'}>
        {data.estado?"Activo":"Inactivo"}
        </span>  
        
    }

    const textEditor = (options) => {
        return <InputText type="text" className='w-full' value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    }

    const onRowEditComplete = (e) =>{
      const lugarRegistroService = new LugarRegistroService()
      if(!(e.data.nombre_lugar_registro === e.newData.nombre_lugar_registro)){
        lugarRegistroService.update(e.newData).then(res=>{
          setLoadData(loadData+1)
          toast.current.show({severity:'success', summary: 'FXA Te Informa', detail: res.data, life: 3000});
        }).catch(err=>{
          if(err.response.data.errors)
            toast.current.show({severity:'error', summary: `Error en campo: ${err.response.data.errors[0].param}`, detail: err.response.data.errors[0].msg, life: 3000});
          else
            toast.current.show({severity:'error', summary: 'FXA Te Informa', detail: 'Ya existe un campo con este nombre', life: 3000});
        })

        
      }
    }
    const initFilters = () => {
      setFilters({
          'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
          });
      setGlobalFilterValue('');
  }

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;

    let _filters = { ...filters };
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  }

  const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    
  const getFormErrorMessage = (name) => {
      return isFormFieldValid(name) && <small className="p-error mb-2 block">{formik.errors[name]}</small>;
  };

  const header = () => {
    return (
        <div className="grid">
            <div className='col-12 xl:col-9 lg:col-8 md:col-8 sm:col-7'>
              <Button id='nuevoRegistroButton' onClick={(e) => op.current.toggle(e)} tooltip={'Nuevo Registro'} className="p-button-rounded p-button-outlined inline-flex" icon='pi pi-plus' label='Nuevo'/>
            </div>
            <div className='col-12 xl:col-3 lg:col-4 md:col-4 sm:col-5'>
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search" />
                    <InputText className=' w-full' value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" />
                </span>
            </div>
        </div>
    )
  }

  const bodyChangeState = e =>{
    return <>
      {e.estado &&
        <Button icon='pi pi-ban' className='p-button-text p-button-danger' onClick={()=>disableLugarRegistro(e)} tooltip='Desactivar' tooltipOptions={{position:'top'}}/>
      }
      {!e.estado &&
        <Button icon='pi pi-check-circle' className='p-button-text p-button-success' onClick={()=>enableLugarRegistro(e)} tooltip='Activar' tooltipOptions={{position:'top'}}/>
      }
    </>
  }

  const bodyChangeStateD = e =>{
    return <>
      {e.rowData.estado &&
        <Button disabled icon='pi pi-ban' className='p-button-text p-button-danger' tooltip='Desactivar' tooltipOptions={{position:'top'}}/>
      }
      {!e.rowData.estado &&
        <Button disabled icon='pi pi-check-circle' className='p-button-text p-button-success'  tooltip='Activar' tooltipOptions={{position:'top'}}/>
      }
    </>
  }

  const lugarRegistroService = new LugarRegistroService()
  const disableLugarRegistro = (e) =>{
      lugarRegistroService.disable(e.id_lugar_registro).then(res=>{
        toast.current.show({severity:'success', summary: 'FXA Te Informa', detail: res.data, life: 3000});
        setLoadData(loadData+1)
      })
  }

  const enableLugarRegistro = (e) =>{
    lugarRegistroService.enable(e.id_lugar_registro).then(res=>{
      toast.current.show({severity:'success', summary: 'FXA Te Informa', detail: res.data, life: 3000});
      setLoadData(loadData+1)
    })
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
        <DataTable  filters={filters} paginator rows={10} rowsPerPageOptions={[10,20,50, 'all']} paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" currentPageReportTemplate="De {first} a {last} de un total de {totalRecords}"
            value={lugaresRegistro} responsiveLayout="scroll" size="small" emptyMessage='Ups... No se encontro un registro para mostrar 😧'
            editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} header={header}>
                <Column sortable field="nombre_lugar_registro" editor={(options) => textEditor(options)} header="Lugar Registro"/>
                <Column sortable field="estado" body={estadoField} header="Estado" style={{width:"10rem"}}/>
                <Column rowEditor header='Editar' headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                <Column body={bodyChangeState} header={<div className='w-full text-center'>Cambiar Estado</div>} editor={bodyChangeStateD} headerStyle={{ width: '10%', minWidth: '2rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
        </DataTable>
      </Card>
    }

    <OverlayPanel ref={op} onHide={formik.resetForm} id="overlay_panel" style={{ width: '250px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }} breakpoints={{'640px': '90vw'}}>
        <div className="col-12">
            <span className="p-float-label">
                <InputText name="nombre_lugar_registro"type="text"  className={classNames({ 'p-invalid': isFormFieldValid(`nombre_lugar_registro`) })+' w-full'}  value={formik.values.nombre_lugar_registro} onChange={formik.handleChange}></InputText> 
                <label className={classNames({ 'p-error': isFormFieldValid('nombre_lugar_registro') })}>Nombre Lugar Registro:</label>
            </span>
            <div>{getFormErrorMessage(`nombre_lugar_registro`)}</div>
        </div>
        <Button type='button' onClick={formik.handleSubmit} label='Guardar' className='mt-2 w-full'/>
    </OverlayPanel>
</>
  )
}

export default LugarRegistro