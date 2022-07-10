/*Este archivo es para realizar la animacion para recargar la pagina*/

//Importa componente o libreria react
import React from 'react'

//Funcion para el diseño y animacion de simulador de carga
const LoadPage = () => {
  return (
    <div>
      <p className='text-4xl text-center'><img src="images/logo-principal.svg" alt="" className='w-4 tracking-in-contract' /></p>
      <p className='tracking-in-contract text-center text-xl'>Cargando...</p>
    </div>
  )
}

export default LoadPage