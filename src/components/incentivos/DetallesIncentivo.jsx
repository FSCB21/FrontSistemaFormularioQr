import React, { useEffect, useState } from 'react'
import RetornarColorSegunPorcentaje from '../../helpers/RetornarColorSegunPorcentaje'
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import LoadPage from '../LoadPage';
import { InputText } from 'primereact/inputtext';
import { confirmPopup } from 'primereact/confirmpopup';
import { confirmDialog } from 'primereact/confirmdialog';
import IncentivosService from '../../service/IncentivosService';
const DetallesIncentivo = (params) => {


    let porcentajeGeneral = parseInt(params.dataDetallesIncentivo.info.total_registros*100)/parseInt(params.dataDetallesIncentivo.info.meta_incentivo)

    const [globalFIlterDetallesIncentivo, setGlobalFIlterDetallesIncentivo] = useState("")

    const [dataDetallesIncentivo, setDataDetallesIncentivo] = useState([])



    useEffect(() =>{
        OrdenarMenorAMayor(params.dataDetallesIncentivo.data, estadoOrden)
    }, [params.dataDetallesIncentivo.data]);//eslint-disable-line

    const onGlobalFilterKeyDown = event =>{
        if(event.key === 'Enter'){
            let filteredDataDetallesIncentivo = params.dataDetallesIncentivo.data.filter(el => {
                let nombreLugar = el.nombre_lugar_registro.toUpperCase()
                return nombreLugar.includes(globalFIlterDetallesIncentivo.toUpperCase())
            })

            OrdenarMenorAMayor(filteredDataDetallesIncentivo, estadoOrden)
        }
    }

    const [estadoOrden, setEstadoOrden] = useState(1)

    const OrdenarMenorAMayor = (data, orden) =>{
        let arregloOrdenado = data.sort((a,b)=>{
            let n1 = parseInt(a.total_registros*100)/parseInt(a.meta_a_cumplir)
            let n2 = parseInt(b.total_registros*100)/parseInt(b.meta_a_cumplir)

            if(orden === 1)
                return n1 - n2
            else if(orden === 2)
                return n2 - n1
            
            return n1 - n2
        })
        setEstadoOrden(orden)
        setDataDetallesIncentivo([...arregloOrdenado])
    }

    const [filtroCumplimiento, setFiltroCumplimiento] = useState(null)

    const FiltrarPorCumplimiento = estado =>{
        let DataFiltradaPorEstadoCumplimiento = params.dataDetallesIncentivo.data.filter(el => {
            let i = parseInt(el.total_registros*100)/parseInt(el.meta_a_cumplir)

            if(estado === 1)
                return i >= 100
            else if(estado === 2)
                return i < 100

            return 1
        })

        OrdenarMenorAMayor(DataFiltradaPorEstadoCumplimiento, estadoOrden)
    
        setFiltroCumplimiento(estado)
    }

    const ToggleEdit = (id, state) =>{
        let data = [...dataDetallesIncentivo]
        data[id].editActive = state?true:false
        setDataDetallesIncentivo(data)
    }

    const changeMetaItem = (id, e)=>{
        let data = [...dataDetallesIncentivo]
        data[id].new_meta_a_cumplir = e.target.value
        setDataDetallesIncentivo([...data])
    }

    const incentivoService = new IncentivosService()
    const ComfirmEdit = (el, id) =>{

        if(!el.new_meta_a_cumplir){
            params.toast.current.show({severity:'error', summary: 'FXA Te Informa', detail: 'La meta a cumplir no puede estar vacia', life: 3000});
        }else{
            let dataUpdate = {
                "lugar_registro_fk": el.id_lugar_registro,
                "incentivo_general_fk": params.dataDetallesIncentivo.info.id_incentivo_general,
                "meta_a_cumplir": el.new_meta_a_cumplir
            }
            incentivoService.updateIncentivoLugar(dataUpdate).then(res=>{
                params.toast.current.show({severity:'success', summary: 'FXA Te Informa', detail: res.data, life: 3000});
                params.showDetallesIncentivo(params.dataDetallesIncentivo.info)
                ToggleEdit(id, false)
            })
        }

        
    }

    const AbrirVentanaConfirmacion = (event, funcion) => {
        confirmPopup({
            target: event.currentTarget,
            message: '¿Está seguro de realizar esta acción?',
            icon: 'pi pi-exclamation-triangle',
            accept: funcion,
            acceptLabel:'Continuar'
            
        });
    };

    const BorrarIncentivoGeneral = () =>{
        incentivoService.delete(params.dataDetallesIncentivo.info.id_incentivo_general).then(res=>{
            params.toast.current.show({severity:'warn', summary: 'FXA Te Informa', detail: res.data, life: 3000});
            params.reloadPageChangeValue()
            params.setDisplayDetallesIncentivo(false)
        })
    }

    const AbrirVentanaConfirmacionBorrarIncentivo = () => {
        confirmDialog({
            message: '¿Está seguro de eliminar esta meta de incentivo a nivel general?',
            header: 'Borrar Incentivo General',
            position:'bottom',
            icon: 'pi pi-exclamation-triangle',
            accept:BorrarIncentivoGeneral,
            acceptLabel:'Continuar'
        });
    };

    const BorrarLugarIncentivo = (el) =>{
        let data = {
            "lugar_registro_fk": el.id_lugar_registro,
            "incentivo_general_fk": params.dataDetallesIncentivo.info.id_incentivo_general
        }
        incentivoService.deleteLugarIncentivo(data).then(res=>{
            params.toast.current.show({severity:'warn', summary: 'FXA Te Informa', detail: res.data, life: 3000});
            params.showDetallesIncentivo(params.dataDetallesIncentivo.info)
            params.reloadPageChangeValue()
        })
        
    }

  return (
    
    <div>
        {params.loading && <>
                <div className='relative w-full justify-content-center align-items-center flex'>
                    <LoadPage />
                </div>
        </>}

        {!params.loading && <>
            <h6>{params.dataDetallesIncentivo.info.descripcion}</h6>

            <div className='mt-2 font-medium'>Porcentaje General</div>
            <div className="mt-1 text-600">{params.dataDetallesIncentivo.info.total_registros} registros de {params.dataDetallesIncentivo.info.meta_incentivo}</div>
            <div className="grid">
                <div className="mt-2 md:mt-0 flex align-items-center col-12 sm:col-6 md:col-7 ">
                    <div className="surface-300 border-round overflow-hidden w-10" style={{height: '11px'}}>
                        <div className={`bg-${RetornarColorSegunPorcentaje(porcentajeGeneral)} h-full`} style={{width: `${porcentajeGeneral}%`}}/>
                    </div>
                    <span className={`text-${RetornarColorSegunPorcentaje(porcentajeGeneral)} ml-3 font-medium`}>%{Math.trunc(porcentajeGeneral)}</span>
                </div>
                <div className='col-12 sm:col-6 md:col-5 justify-content-center sm:justify-content-start grid'>
                    <Button className='p-button-text p-button-warning' onClick={()=>{params.setDisplayEditarIncentivo(true);params.setDisplayDetallesIncentivo(false)}}  icon='pi pi-pencil'/>
                    <Button className='p-button-text p-button-danger' onClick={AbrirVentanaConfirmacionBorrarIncentivo} icon='pi pi-trash'/>
                </div>
            </div>

            <div className="grid mt-2">
                <div className='col-12 sm:col-6'>
                    Fecha Inicio: 
                    <span className='text-purple-700 font-medium mx-2'>{params.dataDetallesIncentivo.info.fecha_inicio}</span>
                </div>
                <div className='col-12 sm:col-6'>
                    Fecha Corte: 
                    <span className='text-purple-700 font-medium mx-2'>{params.dataDetallesIncentivo.info.fecha_corte}</span>
                </div>
            </div>

            <div className='grid'>
                <Divider />
                <h6 className='col-12'>Opciones De Filtrado:</h6>
                <span className="p-input-icon-left col-12 sm:col-5">
                    <i className="pi pi-search" />
                    <InputText className='w-full' onKeyDown={e=> onGlobalFilterKeyDown(e)} value={globalFIlterDetallesIncentivo} onChange={(e) => setGlobalFIlterDetallesIncentivo(e.target.value)} placeholder="Buscar" />
                </span>
                <div className="col-6 sm:col-3 flex justify-content-center">
                    <Button className={estadoOrden===1?'p-button-primary p-button-text':'p-button-secondary p-button-text'} icon='pi pi-sort-numeric-down' onClick={()=>OrdenarMenorAMayor(dataDetallesIncentivo, 1)}/>
                    <Button className={estadoOrden===2?'p-button-primary p-button-text':'p-button-secondary p-button-text'} icon='pi pi-sort-numeric-down-alt' onClick={()=>OrdenarMenorAMayor(dataDetallesIncentivo, 2)}/>
                </div>
                <div className='col-6 sm:col-3 flex justify-content-center'>
                    <Button className={filtroCumplimiento===1?'p-button-primary p-button-text':'p-button-secondary p-button-text'} icon='pi pi-check-circle' onClick={()=>filtroCumplimiento===1?FiltrarPorCumplimiento(0):FiltrarPorCumplimiento(1)}/>
                    <Button className={filtroCumplimiento===2?'p-button-primary p-button-text':'p-button-secondary p-button-text'} icon='pi pi-times-circle' onClick={()=>filtroCumplimiento===2?FiltrarPorCumplimiento(0):FiltrarPorCumplimiento(2)}/>
                </div>
            </div>

            {
                dataDetallesIncentivo.map((el,id)=>{
                    
                    let porcentajes = parseInt(el.total_registros*100)/parseInt(el.meta_a_cumplir)
                    return <div key={id}>
                            <Divider />
                            <div className='grid aling-items-between mt-3'>
                                <div className='col-12 sm:col-5 sm:col-7'>
                                    <span className="text-900 font-medium mr-2 mb-1 md:mb-0">{el.nombre_lugar_registro}</span>
                                    <div className="mt-1 text-600">

                                        {el.total_registros} registros de 
                                        {el.editActive
                                            ?<>
                                                <InputText className='w-6 sm:w-4 mx-2' value={dataDetallesIncentivo[id].new_meta_a_cumplir} onChange={e=>changeMetaItem(id, e)}/>
                                            </>
                                            :" "+el.meta_a_cumplir
                                        }
                                    
                                    </div>
                                </div>
                            </div>
                            <div className='grid'>
                                <div className="mt-2 md:mt-0 flex align-items-center col-12 sm:col-6 md:col-7 ">
                                    <div className="surface-300 border-round overflow-hidden w-10" style={{height: '11px'}}>
                                        <div className={`bg-${RetornarColorSegunPorcentaje(porcentajes)} h-full`} style={{width: `${porcentajes}%`}}/>
                                    </div>
                                    <span className={`text-${RetornarColorSegunPorcentaje(porcentajes)} ml-3 font-medium`}>%{Math.trunc(porcentajes)}</span>
                                </div>
                                {el.editActive
                                    ?<div className='col-12 sm:col-6 md:col-5 justify-content-center sm:justify-content-start grid'>
                                        <Button className='p-button-text p-button-success' onClick={e=>AbrirVentanaConfirmacion(e, ()=>ComfirmEdit(el, id))}  icon='pi pi-check-circle'/>
                                        <Button className='p-button-text p-button-danger' onClick={()=>ToggleEdit(id, false)} icon='pi pi-times-circle'/>
                                    </div>
                                    :<div className='col-12 sm:col-6 md:col-5 justify-content-center sm:justify-content-start grid'>
                                        <Button className='p-button-text p-button-warning' tooltip='Editar' tooltipOptions={{position:'top'}} onClick={()=>ToggleEdit(id, el, true)}  icon='pi pi-pencil'/>
                                        <Button className='p-button-text p-button-danger' tooltip='Eliminar' tooltipOptions={{position:'top'}} onClick={e=>AbrirVentanaConfirmacion(e, ()=>BorrarLugarIncentivo(el))} icon='pi pi-trash'/>
                                    </div>
                                }
                            </div>
                    </div>
                })
            }
            {!dataDetallesIncentivo[0] && <>
                No se han encontrado resultados 🙁
            </>}
        </>}
    </div>
  )
}

export default DetallesIncentivo