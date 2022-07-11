/* Archivo que contiene la seccion de filtros del modulo de reportes */

//Importamos los ganchos y el componente de react
import React, { useState, useEffect } from 'react'

//Importamos componentes de estilado de prime react
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { SelectButton } from 'primereact/selectbutton';

//Importamos el servicio de consultas al api
import LugarRegistroService from '../../service/LugarRegistroService';

//Metodo que se encarga de renderizar el componente
const FilterComponent = (params) => {

    let today = new Date()
    
    //Gancho que almacena el campo a filtrar
    const [ campoSeleccionado, setCampoSeleccionado ] = useState({val:''})
    //Gancho que almacena todas las ciudades de registro
    const [lugaresRegistro, setLugaresRegistro] = useState([])
    //Gancho que almacena el valor del campo a filtrar
    const [valueOption, setValueOption] = useState('')
    //Gancho que almacena un valor secundario del campo a filtrar
    const [valueOption2, setValueOption2] = useState('')

    //Arreglo de las opciones disponibles en el selector desplegable
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

    //Arreglo que contiene las opciones para el selector de estado de codigo
    const optionsState = [
        {label:'Canjeado', value:1},
        {label:'Sin Canjear', value:0},
    ]

    //Estructura del item selector de mes
    const monthNavigatorTemplate=(e)=> {
        return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} style={{ lineHeight: 1 }} />;
    }
    
    //Estructura del item selector de año
      const yearNavigatorTemplate=(e)=> {
        return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} className="p-ml-2" style={{ lineHeight: 1 }} />;
      }    

    //Función que obtiene los lugares de registro de la base de datos cada que se renderiza el componente
    useEffect(() => {
        lugarRegistroService.getAll().then(res=>{
            setLugaresRegistro(res.data)
        })
    
      return () => {
        
      }
    }, []) // eslint-disable-line
    

    const lugarRegistroService = new LugarRegistroService()
    
    //Metodo que establece el valor del campo seleccionado a su respectivo gancho
    const onCampoChange = (e) =>{
        setValueOption('')
        setCampoSeleccionado(e.value)
    }

    //Gancho que guarda la opcion del filtro, en el parametro de filtros general
    const SaveOption = () =>{
        if((campoSeleccionado.type!==4 && (valueOption || valueOption===0)) || (campoSeleccionado.type===4 && valueOption && valueOption2)){
            let condiciones = []
            condiciones.push({campo:campoSeleccionado.val, valor:valueOption, tipo:campoSeleccionado.type, valor2:valueOption2})
            params.setCondicionesFilter([...params.condicionesFilter,...condiciones])
            setCampoSeleccionado({val:''})
            setValueOption('')
            setValueOption2('')
        }else
            params.toast.current.show({severity:'error', summary: 'FXA Te Informa', detail: 'No pueden existir campos vacios', life: 3000});
    }

    //Gancho que borra un filtro del filtro general segun el id enviado por parametros
    const DeleteOption = (id) =>{
        let condiciones = [...params.condicionesFilter]
        condiciones.splice(id,1)
        params.setCondicionesFilter(condiciones)
    }

    //Etiquetas de retorno del componente
  return (
    <div className='mt-4'>
        <div className='grid'>
            {/* Campos para la creacion de un nuevo filtro */}
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
            {campoSeleccionado.val!=='fecha_nacimiento' && campoSeleccionado.val!=='createdAt' && campoSeleccionado.val!=='estado_codigo' && <>
                <div className="col-12 md:col-2 text-center">
                    <span className='text-base'>Contiene</span>
                </div>
                <div className="col-12 md:col-4">
                    <span className="p-float-label">
                        {campoSeleccionado.val!=='lugar_registro' && campoSeleccionado.val!=='estado_codigo'  && 
                            <InputText disabled={campoSeleccionado?false:true} className='w-full' value={valueOption} onChange={(e) => setValueOption(e.target.value)} />
                        }
                        {campoSeleccionado.val==='lugar_registro'&&
                            <Dropdown className='w-full BorderFormNewUser' value={valueOption} options={lugaresRegistro} onChange={e=>setValueOption(e.value)} optionLabel='nombre_lugar_registro' filter filterBy="nombre_lugar_registro"
                            emptyMessage="No se encontraron resultados" emptyFilterMessage="No se encontraron resultados" />
                        }
                        <label>Valor:</label>
                    </span>
                </div>
            </>}
            {campoSeleccionado.val==='estado_codigo' && <>
                <div className="col-12 md:col-2 text-center">
                    <span className='text-base'>Estado</span>
                </div>
                <SelectButton className='col-12 md:col-4 flex' value={valueOption} options={optionsState} onChange={(e) => setValueOption(e.value)} />
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

        {/* Listado de filtros anteriores */}
        {
            params.condicionesFilter.map((el,id)=>{
                return <div className='grid mt-4' key={id}>
                    <div className="col-12 md:col-1">
                        <Button icon="pi pi-times" onClick={()=>DeleteOption(id)} className="mb-2"></Button>
                    </div>
                    <div className="col-12 md:col-4">
                        <span className="p-float-label">
                        <InputText disabled={true} value={el.campo} className='w-full' />
                            <label>Campo:</label>
                        </span>
                    </div>
                    {el.tipo!==4 && <>
                        <div className="col-12 md:col-2 text-center">
                            <span className='text-base'>Contiene</span>
                        </div>
                        <div className="col-12 md:col-4">
                            <span className="p-float-label">
                                <InputText disabled={true} className='w-full' value={el.valor.nombre_lugar_registro?el.valor.nombre_lugar_registro:el.valor} />
                            </span>
                        </div>
                    </>}
                    {el.tipo===4 && <>
                        <div className="col-12 md:col-3 text-center">
                            <Calendar disabled className='w-full' dateFormat="dd/mm/yy" value={el.valor}/>
                        </div>
                        <div className="col-12 md:col-3 text-center">
                            <Calendar disabled className='w-full' dateFormat="dd/mm/yy" value={el.valor2} />
                        </div>
                    </>}
                </div>
            })
        }
        
    </div>)
}

export default FilterComponent