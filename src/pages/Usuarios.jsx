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

const Usuarios = () => {

    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [customFirst, setCustomFirst] = useState(0);
    const [pageInputTooltip, setPageInputTooltip] = useState('Presiona la tecla "Enter" para ir a esta página.');
    const [usuarios, setUsuarios] = useState([])
    const [customRows, setCustomRows] = useState(50);
    const [loadData, setLoadData] = useState(0)
    const [totalRecords, setTotalRecords] = useState(0)



    const op = useRef(null);

    useEffect(() => {
        const usuarioService = new UsuarioService()
        setLoading(true)

        if(!dataFiltered){
          usuarioService.getAll(currentPage-1,customRows).then(res => {
              setUsuarios(res.data.rows)
              setTotalRecords(res.data.totalItems)
              setLoading(false)
          });
        }else{
          usuarioService.getAllFiltered(dataFiltered.fieldOption,dataFiltered.valueOption,dataFiltered.filterOption,currentPage-1,customRows).then(res => {
            setUsuarios(res.data.rows)
            setTotalRecords(res.data.totalItems)
            setLoading(false)
          });
        }

      return () => {
      }
    },[loadData]); //eslint-disable-line

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
      return <>
        {data.codigo_descuento.estado?"Canjeado":"Sin Canjear"}
      </>  
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
  }

  const deleteFilter = () =>{
    setDataFiltered(null)
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

  return (<>
      {loading && 
          <div className='relative h-screen w-full justify-content-center align-items-center flex'>
              <LoadPage/>
          </div>
      }
      {!loading &&
        <Card>
          <Paginator className='w-11 inline-flex' template={template1} first={customFirst} rows={customRows} totalRecords={totalRecords} onPageChange={onCustomPageChange}/>
          <DataTable value={usuarios} responsiveLayout="scroll" size="small">
              <Column sortable field="nombres"  header="Nombres"></Column>
              <Column sortable field="apellidos" header="Apellidos"></Column>
              <Column sortable field="numero_doc" header="Identificación"></Column>
              <Column sortable field="telefono_contacto" header="Telefono"></Column>
              <Column sortable field="correo_electronico" header="Correo"></Column>
              <Column sortable field="fecha_nacimiento" header="Fecha Nacimiento"></Column>
              <Column sortable field="lugar_registro.nombre_lugar_registro" header="Lugar Registro"></Column>
              <Column sortable field="codigo_descuento.estado" body={estadoField} header="Estado Codigo"></Column>
          </DataTable>
        </Card>
      }
      <OverlayPanel ref={op} onHide={deleteFilterData} dismissable style={{ width: '305px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }} breakpoints={{'640px': '90vw'}}>
        <SelectButton optionLabel="name" optionValue="code" value={filterOption} options={filterOptions} onChange={(e) => setFilterOption(e.value)}/>
        <Dropdown value={fieldOption} className='w-full mt-4 BorderFormNewUser' options={fieldOptions} onChange={e=>setFieldOption(e.value)} optionLabel="name" placeholder="Seleccione el campo" />
        <InputText value={valueOption} placeholder='Escriba el valor' className='w-full mt-4' onChange={(e) => setValueOption(e.target.value)} />
        <Button label='Filtrar' onClick={searchFiltered} className='w-full mt-4 BorderFormNewUser' disabled={(filterOption&&fieldOption&&valueOption)?false:true}/>
      </OverlayPanel>
  </>)
}

export default Usuarios