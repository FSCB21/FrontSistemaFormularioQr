import React from 'react'
import CardsDash from '../components/dashboard/CardsDash'
import GraficaDeDonaEdades from '../components/dashboard/GraficaDeDonaEdades'
import GraficaLineal from '../components/dashboard/GraficaLineal'

const Dashboard = (params) => {

    

  return (
    <div className='grid'>
        <CardsDash/>
        

        <GraficaLineal colorMode={params.colorMode}/>

        <GraficaDeDonaEdades />

    </div>
  )
}

export default Dashboard