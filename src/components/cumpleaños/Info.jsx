/* Archivo para la creacion del contenido para el icono de info en la seccion de Informacion*/

//Importacion de componentes necesarios
import React from 'react'
import { Divider } from 'primereact/divider';

//Funcion para ingresar el contenido y segmentarlo dentro de la ventana modal de la informacion de uso del componente
const Info = () => {
  return (
    <>
      <h4 className='text-purple-600'>Información:</h4>
      <div>Sección del sistema que te permitira obtener los usuarios registrados segun su fecha de cumpleaños.</div>
      <Divider align="left" type="dashed">
        <b>Descargar Información</b>
      </Divider>
      <div>Esta sección te permite descargar un informe en excel de los usuarios que estas visualizando, para esto simplemente dar clic en el boton de descargar datos.</div>
      <Divider align="left" type="dashed">
        <b>Cambiar Fecha</b>
      </Divider>
      <div>Para obtener otra fecha da clic en el boton de cambiar fecha y selecciona el día que se quiere visualizar despues da clic en "Consultar". Si se quiere visualizar segun un determinado rango de fecha se requiere elegir fecha inicio y fecha fin(se sombreará el rango) y despues dar clic en "Consultar"</div>
      <Divider align="left" type="dashed">
        <b>Hoy</b>
      </Divider>
      <div>Botón que consulta las personas que cumplen el día de hoy, es eficaz cuando consultas otra fecha y quieres volver a visualizar que personas cumplen hoy.</div>
    </>
  )
}

export default Info