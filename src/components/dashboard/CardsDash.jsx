import React, {useEffect, useState} from 'react'

import DashBoardDataService from '../../service/DashBoardDataService'
import ViewsCounterService from '../../service/ViewsCounterService'
import { Divider } from 'primereact/divider';
import { Skeleton } from 'primereact/skeleton';
import { Button } from 'primereact/button';
import { useHistory } from 'react-router-dom';
import { Link } from "react-scroll";
import RetornarNombreMes from '../../helpers/RetornarNombreMes'

import './StylesDash.css'

//iconos
import { FaSms, FaRegFolderOpen, FaEye } from 'react-icons/fa';
import { GiBalloonDog } from 'react-icons/gi';

const CardsDash = () => {

    const history = useHistory()

    const [dataCartas, setDataCartas] = useState({cantidadCumpleañeros:{}})
    const [dataCartaCounter, setDataCartaCounter] = useState({})
    const [reload, setReload] = useState(0)

    useEffect(() => {
        setLoading(true)
        const dashBoardDataService = new DashBoardDataService()
        dashBoardDataService.getDataCartas().then(res=>{
                setDataCartas(res.data)
                const viewsCounterService = new ViewsCounterService()
                viewsCounterService.getPageVisits('FormRegister').then(res2=>{
                    let viewsCounter = {}
                    viewsCounter.totalViews = res2.data.access_counter
                    viewsCounter.percentViews = Math.trunc(res.data.cantidadTotal*100/res2.data.access_counter)
                    setDataCartaCounter(viewsCounter)
                    setLoading(false)
                })
            })

      return () => {
        
      }
    }, [reload]) //eslint-disable-line

    const reloadData = () =>{
        setReload(reload+1)
    }

    const [loading, setLoading] = useState(false)

  return (<>
        <Divider align='right' type="dashed" style={{background:'transparent'}}>
            <Button className='text-sm p-1 p-button-outlined' onClick={reloadData} icon='pi pi-refresh' label='Actualizar Información'/>
        </Divider>
        <div className="col-12 lg:col-6 xl:col-3">
            <Link
            to="graficaMensual"
            spy={true}
            smooth={'easeInCubic'}
            duration={800}
            >
                <div className="card mb-0 hoverCard cursor-pointer">
                    {!loading && <>
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Total De Visitas</span>
                                <div className="text-900 font-medium text-xl">{dataCartaCounter.totalViews}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                                <FaEye className="pi pi-comment text-orange-500 text-2xl"/>
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">{dataCartaCounter.percentViews}% </span>
                        <span className="text-500">Personas Registradas</span>
                    </>}
                    {loading && <>
                            <Skeleton className="mb-2 w-8"></Skeleton>
                            <Skeleton className="mb-2 w-5"></Skeleton>
                            <Skeleton height="2rem" className='w-10'></Skeleton>
                    </>}
                </div>
            </Link>
        </div>
        <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0 hoverCard cursor-pointer" onClick={()=>history.push('/dash/registros')}>
                {!loading && <>
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total De Registros</span>
                            <div className="text-900 font-medium text-xl">{dataCartas.cantidadTotal}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                            <FaRegFolderOpen className="pi pi-comment text-blue-500 text-2xl"/>
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{dataCartas.cantidadCanjeado} </span>
                    <span className="text-500">Canjeados</span>
                </>}
                {loading && <>
                    <Skeleton className="mb-2 w-8"></Skeleton>
                    <Skeleton className="mb-2 w-5"></Skeleton>
                    <Skeleton height="2rem" className='w-10'></Skeleton>
                </>}
            </div>
        </div>
        <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0 hoverCard cursor-pointer" onClick={()=>history.push('/dash/cumpleaños')}>
                {!loading && <>
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Cumpleaños {RetornarNombreMes(new Date().getMonth()+1)}</span>
                            <div className="text-900 font-medium text-xl">{dataCartas.cantidadCumpleañeros.mensual}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                            <GiBalloonDog className="pi pi-comment text-cyan-500 text-2xl"/>
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{dataCartas.cantidadCumpleañeros.diario} </span>
                    <span className="text-500">Personas hoy</span>
                </>}
                {loading && <>
                        <Skeleton className="mb-2 w-8"></Skeleton>
                        <Skeleton height="2rem" className='w-10'></Skeleton>
                </>}

            </div>
        </div>
        <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0 hoverCard">
                {!loading && <>
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Contactos</span>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                            <FaSms className="pi pi-comment text-purple-500 text-2xl"/>
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">Generar Campañas</span>
                </>}
                {loading && <>
                        <Skeleton className="mb-2 w-8"></Skeleton>
                        <Skeleton height="2rem" className='w-10'></Skeleton>
                </>}
            </div>
        </div>
</>)
}

export default CardsDash