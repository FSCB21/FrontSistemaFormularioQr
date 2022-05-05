import React, { useRef, useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toast } from 'primereact/toast'
import LoadPage from '../components/LoadPage'
import LugarRegistroService from '../service/LugarRegistroService'
import { InputText } from 'primereact/inputtext'

const LugarRegistro = () => {

    const toast = useRef(null);
    const [loading, setLoading] = useState(false)
    const [lugaresRegistro, setLugaresRegistro] = useState([])

    useEffect(() => {
        setLoading(true)
      const lugarRegistroService = new LugarRegistroService()
      lugarRegistroService.getAll().then(res=>{
          setLugaresRegistro(res.data)
          console.log(res.data)
          setLoading(false)
      })
    
      return () => {
        
      }
    }, [])
    
    const estadoField = (data) =>{    
        
        return <span className={data.estado?'code-style code-canjeado':'code-style code-sin-canjear'}>
        {data.estado?"Activo":"Inactivo"}
        </span>  
        
    }

    const textEditor = (options) => {
        return <InputText type="text" className='w-full' value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
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
        <DataTable paginator rows={10} rowsPerPageOptions={[10,20,50, 'all']} paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" currentPageReportTemplate="De {first} a {last} de un total de {totalRecords}"
            value={lugaresRegistro} responsiveLayout="scroll" size="small" emptyMessage='Ups... No se encontro un registro para mostrar 😧'
            editMode="row" dataKey="id"/*  onRowEditComplete={onRowEditComplete} */>
                <Column sortable field="nombre_lugar_registro" editor={(options) => textEditor(options)} header="Lugar Registro"/>
                <Column sortable field="estado" body={estadoField} header="Estado"/>
                <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
        </DataTable>
      </Card>
    }
</>
  )
}

export default LugarRegistro