/* Archivo que almacena el contenido principal del dashboard */

//Importamos react para definir que lo que se encuentra en este archivo es un componente de react
import React from 'react'

//Importamos el componente de cartas de dashboard
import CardsDash from '../components/dashboard/CardsDash'

//Importamos el componente de grafica de edades
import GraficaDeDonaEdades from '../components/dashboard/GraficaDeDonaEdades'

//Importamos el componente de cantidad de registros por mes
import GraficaLineal from '../components/dashboard/GraficaLineal'

//Componente de retorno de la pagina de dashboard
//obtenemos los parametros que son enviados en la etiqueta
const Dashboard = (params) => {

  //Componente de retorno de la pagina de Formulario de nuevo registro
  return (
    //Establecemos la etiqueta general que contiene los componentes a renderizar en la pagina de dashboard
    <div className='grid'>

        {/* Llamamos el componente de cartas */}
        <CardsDash/>
        
        {/* Llamamos el componente de Grafica de registros por mes, pasamos como argumento el modo de color que se para en las propiedades */}
        <GraficaLineal colorMode={params.colorMode}/>

        {/* Llamamos el componente de grafica de edades */}
        <GraficaDeDonaEdades />

    </div>
  )
}

//Exportamos el componente para usarlo en la seccion de App.js
export default Dashboard