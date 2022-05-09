import React, { useState } from 'react'

import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import LugarRegistroService from '../../service/LugarRegistroService';
import { Calendar } from 'primereact/calendar';

const FilterComponent = (params) => {

    let today = new Date()
    const [ campoSeleccionado, setCampoSeleccionado ] = useState({val:''})

    const dataDropDown = [
        {label:'Nombres', val:'nombres', type:1},
        {label:'Apellidos', val:'apellidos', type:1},
        {label:'Correo Electronico', val:'correo_electronico', type:1},
        {label:'Fecha Nacimiento', val:'fecha_nacimiento', type:4},
        {label:'Telefono Contacto', val:'telefono_contacto', type:1},
        {label:'Número Identificación', val:'numero_doc', type:1},
        {label:'Fecha Registro', val:'createdAt', type:4},
        {label:'Lugar Registro', val:'lugar_registro', type:2},
        {label:'Estado Código', val:'estado_codigo', type:3},
    ]

    const monthNavigatorTemplate=(e)=> {
        return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} style={{ lineHeight: 1 }} />;
      }
    
      const yearNavigatorTemplate=(e)=> {
        return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} className="p-ml-2" style={{ lineHeight: 1 }} />;
      }    

    const [lugaresRegistro, setLugaresRegistro] = useState([])
    const [valueOption, setValueOption] = useState('')
    const [valueOption2, setValueOption2] = useState('')

    const lugarRegistroService = new LugarRegistroService()
    const onCampoChange = (e) =>{
        setValueOption('')
        setCampoSeleccionado(e.value)
        console.log(e.value)
        if(e.value.val==='lugar_registro'){
            lugarRegistroService.getAll().then(res=>{
                setLugaresRegistro(res.data)
            })
        }
    }

    const SaveOption = () =>{
        let condiciones = []
        condiciones.push({campo:campoSeleccionado.val, valor:valueOption, tipo:campoSeleccionado.type})
       /*  params.setCondiciones() */
       console.log(condiciones)
    }

  return (
    <div className='mt-4'>
        <div className='grid'>
            <div className="col-12 md:col-1">
                <Button icon="pi pi-plus" onClick={SaveOption} className="mb-2"></Button>
            </div>
            <div className="col-12 md:col-4">
                <span className="p-float-label">
                    <Dropdown value={campoSeleccionado} className='w-full BorderFormNewUser' options={dataDropDown} onChange={onCampoChange} optionLabel="label" filter filterBy={'label'}
                    emptyMessage="No se encontraron resultados" emptyFilterMessage="No se encontraron resultados" />
                    <label>Campo:</label>
                </span>
            </div>
            {campoSeleccionado.val!=='fecha_nacimiento' && campoSeleccionado.val!=='createdAt' && <>
                <div className="col-12 md:col-2 text-center">
                    <span className='text-base'>Contiene</span>
                </div>
                <div className="col-12 md:col-4">
                    <span className="p-float-label">
                        {campoSeleccionado.val!=='lugar_registro' && 
                            <InputText disabled={campoSeleccionado?false:true} value={valueOption} onChange={(e) => setValueOption(e.target.value)} />
                        }
                        {campoSeleccionado.val==='lugar_registro'&&
                            <Dropdown className='w-full BorderFormNewUser' value={valueOption} options={lugaresRegistro} onChange={e=>setValueOption(e.value)} optionLabel='nombre_lugar_registro' filter filterBy="nombre_lugar_registro"
                            emptyMessage="No se encontraron resultados" emptyFilterMessage="No se encontraron resultados" />
                        }
                        <label>Valor:</label>
                    </span>
                </div>
            </>}
            {(campoSeleccionado.val==='fecha_nacimiento' || campoSeleccionado.val==='createdAt') && <>
                <div className="col-12 md:col-3 text-center">
                    <Calendar placeholder='Fecha Inicio' className='w-full' dateFormat="dd/mm/yy" yearRange={`${today.getFullYear()-100}:${today.getFullYear()}`} value={valueOption} onChange={e=>setValueOption(e.value)}  monthNavigator yearNavigator style={{ borderRadius: "100%" }}
                    monthNavigatorTemplate={monthNavigatorTemplate} yearNavigatorTemplate={yearNavigatorTemplate} />
                </div>
                <div className="col-12 md:col-3 text-center">
                    <Calendar placeholder='Fecha Fin' className='w-full' dateFormat="dd/mm/yy" yearRange={`${today.getFullYear()-100}:${today.getFullYear()}`} value={valueOption2} onChange={e=>setValueOption2(e.value)}  monthNavigator yearNavigator style={{ borderRadius: "100%" }}
                    monthNavigatorTemplate={monthNavigatorTemplate} yearNavigatorTemplate={yearNavigatorTemplate} />
                </div>
            </>}
        </div>
    </div>)
}

export default FilterComponent