import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react'
import IncentivosService from '../../service/IncentivosService';
import LoadPage from '../LoadPage';

const IncentivosPlaneados = (params) => {

    const [incentivosPlaneados, setIncentivosPlaneados] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        let arregloOrdenado = params.dataIncentivos.sort((a, b) => new Date(a.fecha_inicio).getTime() > new Date(b.fecha_inicio).getTime())
        setIncentivosPlaneados(arregloOrdenado)
        return () => {
        };
    }, [params.dataIncentivos]);

    const [displayDetallesIncentivoPlanteado, setDisplayDetallesIncentivoPlanteado] = useState(false)

    const [selectIncentivoPlaneado, setDelectIncentivoPlaneado] = useState({info:''})

    const incentivoService = new IncentivosService()
    const mostrarDetallesIncentivoSeleccionado = (el) =>{
        setLoading(true)
        setDisplayDetallesIncentivoPlanteado(true)
        incentivoService.getAllByIdIncentivoGeneral(el.id_incentivo_general).then(res=>{
            setDelectIncentivoPlaneado({info:el, data:res.data})
            setDataDetallesIncentivo(res.data)
            setLoading(false)
        })
    }

    const [globalFIlterDetallesIncentivo, setGlobalFIlterDetallesIncentivo] = useState("")

    const [dataDetallesIncentivo, setDataDetallesIncentivo] = useState([])

    const onGlobalFilterKeyDown = event =>{
        if(event.key === 'Enter'){
            let filteredDataDetallesIncentivo = selectIncentivoPlaneado.data.filter(el => {
                let nombreLugar = el.nombre_lugar_registro.toUpperCase()
                return nombreLugar.includes(globalFIlterDetallesIncentivo.toUpperCase())
            })

            setDataDetallesIncentivo([...filteredDataDetallesIncentivo])
        }
    }

    const changeMetaItem = (id, e)=>{
        let data = [...dataDetallesIncentivo]
        data[id].new_meta_a_cumplir = e.target.value
        setDataDetallesIncentivo([...data])
    }

    const ToggleEdit = (id, state) =>{
        let data = [...dataDetallesIncentivo]
        data[id].editActive = state?true:false
        setDataDetallesIncentivo(data)
    }

    const ComfirmEdit = (el, id) =>{

        if(!el.new_meta_a_cumplir){
            params.toast.current.show({severity:'error', summary: 'FXA Te Informa', detail: 'La meta a cumplir no puede estar vacia', life: 3000});
        }else{
            let dataUpdate = {
                "lugar_registro_fk": el.id_lugar_registro,
                "incentivo_general_fk": selectIncentivoPlaneado.info.id_incentivo_general,
                "meta_a_cumplir": el.new_meta_a_cumplir
            }
            incentivoService.updateIncentivoLugar(dataUpdate).then(res=>{
                params.toast.current.show({severity:'success', summary: 'FXA Te Informa', detail: res.data, life: 3000});
                mostrarDetallesIncentivoSeleccionado(selectIncentivoPlaneado.info)
                ToggleEdit(id, false)
            })
        }
  
    }

    const BorrarLugarIncentivo = (el) =>{
        let data = {
            "lugar_registro_fk": el.id_lugar_registro,
            "incentivo_general_fk": selectIncentivoPlaneado.info.id_incentivo_general
        }
        incentivoService.deleteLugarIncentivo(data).then(res=>{
            params.toast.current.show({severity:'warn', summary: 'FXA Te Informa', detail: res.data, life: 3000});
            mostrarDetallesIncentivoSeleccionado(selectIncentivoPlaneado.info)
        })
        
    }

  return (
    <>
        <div className="grid w-12">
            {
                incentivosPlaneados.map((el, id)=>{
                    return <div key={id} className='col-12 xl:col-6 pt-2'>
                        <div className='card'>
                            <span className="text-900 font-medium mr-2 mb-1 md:mb-0">{el.titulo}</span>

                            <div className="mt-1 text-600" style={{textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden"}}>{el.descripcion?el.descripcion:'No existe una descripción 😯'}</div>

                            <div className='my-2'><span className="text-900 mr-2 mb-1 md:mb-0">Meta a cumplir: </span><span className='text-pink-600 '>{el.meta_incentivo} registros</span></div>

                            <div className='grid aling-items-between '>
                                <div className='col-5 sm:col-7'>
                                    <div className="mt-1 text-800">
                                        Desde: <span className='text-purple-600 font-bold'>{el.fecha_inicio}</span>
                                    </div>
                                </div>
                                <div className='col-7 sm:col-5 mt-1'>
                                    <div className="mt-1 text-800 ">
                                        Hasta: <span className='text-purple-600 font-bold'>{el.fecha_corte}</span>
                                    </div>
                                </div>
                            </div>

                            <div className='grid justify-content-center'>
                                <Button className='p-button-text p-button-info' onClick={()=>mostrarDetallesIncentivoSeleccionado(el)}  icon='pi pi-eye'/>
                                <Button className='p-button-text p-button-danger' onClick={()=>params.AbrirVentanaConfirmacionBorrarIncentivo(el.id_incentivo_general)} icon='pi pi-trash'/>
                            </div>
                        </div>
                    
                </div>
                })
            }
        </div>
{
        <Dialog header={!selectIncentivoPlaneado.info.titulo?'Incentivo Planeado':selectIncentivoPlaneado.info.titulo} visible={displayDetallesIncentivoPlanteado} className="w-11 md:w-7 xl:w-5" onHide={() => setDisplayDetallesIncentivoPlanteado(false)}>

            {loading && <>
                <div className='relative w-full justify-content-center align-items-center flex'>
                    <LoadPage />
                </div>
            </>}
            {!loading && <>

                <h6>{selectIncentivoPlaneado.info.descripcion?selectIncentivoPlaneado.info.descripcion:'No existe una descripción 😯'}</h6>

                <div className="grid">

                    <div className='col-12 sm:col-6 md:col-5'>
                        <div className='mt-2 font-medium'>Informacion General</div>
                        <div className='my-2'><span className="text-900 mr-2 mb-1 md:mb-0">Meta a cumplir: </span><span className='text-pink-600 '>{selectIncentivoPlaneado.info.meta_incentivo} registros</span></div>
                    </div>

                    <div className='col-12 sm:col-6 md:col-5 sm:justify-content-center justify-content-start grid'>
                        <Button className='p-button-text p-button-danger' onClick={()=>params.AbrirVentanaConfirmacionBorrarIncentivo(selectIncentivoPlaneado.info.id_incentivo_general)} icon='pi pi-trash'/>
                    </div>
                </div>

                <div className="grid mt-2">
                    <div className='col-12 sm:col-6'>
                        Fecha Inicio: 
                        <span className='text-purple-700 font-medium mx-2'>{selectIncentivoPlaneado.info.fecha_inicio}</span>
                    </div>
                    <div className='col-12 sm:col-6'>
                        Fecha Corte: 
                        <span className='text-purple-700 font-medium mx-2'>{selectIncentivoPlaneado.info.fecha_corte}</span>
                    </div>
                </div>

                <div className='grid'>
                    <Divider />
                    <span className="p-input-icon-left col-12 sm:col-5">
                        <i className="pi pi-search" />
                        <InputText className='w-full' onKeyDown={e=> onGlobalFilterKeyDown(e)} value={globalFIlterDetallesIncentivo} onChange={(e) => setGlobalFIlterDetallesIncentivo(e.target.value)} placeholder="Buscar" />
                    </span>
                </div>

                {
                    dataDetallesIncentivo.map((el, id)=>{
                        return <div key={id}>
                            <Divider/>
                            <div className='mt-2 font-medium'>{el.nombre_lugar_registro}</div>
                            Resgistros A Cumplir
                            {el.editActive
                                ?<>
                                    <InputText className='w-6 sm:w-4 mx-2' value={dataDetallesIncentivo[id].new_meta_a_cumplir} onChange={e=>changeMetaItem(id, e)}/>
                                </>
                                :" "+el.meta_a_cumplir
                            }
                            {el.editActive
                                ?<div className='col-12 sm:col-6 md:col-5 justify-content-center sm:justify-content-start grid'>
                                    <Button className='p-button-text p-button-success' onClick={()=>ComfirmEdit(el, id)}  icon='pi pi-check-circle'/>
                                    <Button className='p-button-text p-button-danger' onClick={()=>ToggleEdit(id, false)} icon='pi pi-times-circle'/>
                                </div>
                                :<div className='col-12 sm:col-6 md:col-5 justify-content-center sm:justify-content-start grid'>
                                    <Button className='p-button-text p-button-warning' tooltip='Editar' tooltipOptions={{position:'top'}} onClick={()=>ToggleEdit(id, el, true)}  icon='pi pi-pencil'/>
                                    <Button className='p-button-text p-button-danger' tooltip='Eliminar' tooltipOptions={{position:'top'}} onClick={()=>BorrarLugarIncentivo(el)} icon='pi pi-trash'/>
                                </div>
                            }
                        </div>
                    })   
                }
            </>}
        </Dialog>}
    </>
  )
}

export default IncentivosPlaneados