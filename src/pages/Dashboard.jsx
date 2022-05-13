import React from 'react'
import CardsDash from '../components/dashboard/CardsDash'
import GraficaLineal from '../components/dashboard/GraficaLineal'

const Dashboard = (params) => {

    

  return (
    <div className='grid'>
        <CardsDash/>
        

        <GraficaLineal colorMode={params.colorMode}/>

    </div>
  )
}

export default Dashboard