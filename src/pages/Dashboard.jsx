import React, {useEffect, useState} from 'react'
import GraficaLineal from '../components/dashboard/GraficaLineal'
import DashBoardDataService from '../service/DashBoardDataService'

const Dashboard = (params) => {

    const [dataCartas, setDataCartas] = useState({})

    useEffect(() => {
      const dashBoardDataService = new DashBoardDataService()
      dashBoardDataService.getDataCartas().then(res=>{
        setDataCartas(res.data)
      })
      return () => {
        
      }
    }, [])
    

  return (
    <div className='grid'>
        <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">Total De Registros</span>
                        <div className="text-900 font-medium text-xl">{dataCartas.cantidadTotal}</div>
                    </div>
                    <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                        <i className="pi pi-tags text-blue-500 text-xl"/>
                    </div>
                </div>
                <span className="text-green-500 font-medium">{dataCartas.cantidadCanjeado} </span>
                <span className="text-500">Canjeados</span>
            </div>
        </div>
        <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">Total De Visitas</span>
                        <div className="text-900 font-medium text-xl">"Muchas"</div>
                    </div>
                    <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                        <i className="pi pi-map-marker text-orange-500 text-xl"/>
                    </div>
                </div>
                <span className="text-green-500 font-medium">67% </span>
                <span className="text-500">Personas Registradas</span>
            </div>
        </div>
        <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">Usuarios</span>
                        <div className="text-900 font-medium text-md">Ir</div>
                    </div>
                    <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                        <i className="pi pi-inbox text-cyan-500 text-xl"/>
                    </div>
                </div>
                <span className="text-green-500 font-medium">Sección Perfil de usuarios</span>
            </div>
        </div>
        <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">Contactos</span>
                        <div className="text-900 font-medium text-md">Ir allí</div>
                    </div>
                    <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                        <i className="pi pi-comment text-purple-500 text-xl"/>
                    </div>
                </div>
                <span className="text-green-500 font-medium"></span>
                <span className="text-500">Generar Campañas</span>
            </div>
        </div>

        <GraficaLineal colorMode={params.colorMode}/>

    </div>
  )
}

export default Dashboard