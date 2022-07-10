/*Archivo para el contenido de la ventana de dialogo para el icono de informacion */

//Importacion de componentes o librerias necesarios
import { Divider } from 'primereact/divider'
import React from 'react'

//Funcion para condicionar la respectiva informacion dependiento la seleccion del usuario
//se realiza el llamado de los parametros definidos al momento de llamar la etiqueta
const InfoFilter = (params) => {
    return (<>
        {!params.optionFilter &&
            <>
                <h4 className='text-purple-600'>Información:</h4>
                <div>En la siguiente sección podras realizar un filtrado mas detallado de la información mostrada</div>
                <Divider align="left" type="dashed">
                    <b>Uso</b>
                </Divider>
                <div>Seleccionar una opción en el campo de al lado, segun el campo elegido se mostraran una serie de opciones, completa segun requieras y da clic en el botón de consultar.</div>
                <Divider type="dashed" />
                <div>Mas información de uso en cada sección</div>
            </>
        }
        {params.optionFilter === 1 &&
            <>
                <h4 className='text-purple-600'>Información:</h4>
                <div>Sección que permite filtrar la información por rango de edad</div>
                <Divider align="left" type="dashed">
                    <b>Uso</b>
                </Divider>
                <div>Usar la barra de desplasamiento de abajo para seleccionar el rango de edad a consultar, usar los circulos para cambiar el minimo y maximo de edad a consultar.</div>
            </>
        }
        {params.optionFilter === 2 &&
            <>
                <h4 className='text-purple-600'>Información:</h4>
                <div>Sección que permite filtrar la información por lugares de registro</div>
                <Divider align="left" type="dashed">
                    <b>Uso</b>
                </Divider>
                <div>Seleccionar 1 o más lugares de registro segun se requiera despues dar clic en el botón de consultar.</div>
            </>
        }
        {params.optionFilter === 3 &&
            <>
                <h4 className='text-purple-600'>Información:</h4>
                <div>Sección que permite cambiar el orden de la información obtenida.</div>
                <Divider align="left" type="dashed">
                    <b>Uso</b>
                </Divider>
                <div>Paso 1: Seleccionar el campo por el que se quiere cambiar el orden de la información.</div>
                <div>Paso 2: Seleccionar el orden que se quiere dar Ascendente (A-Z) o Descendente (Z-A).</div>
                <div>Paso 3: Dar clic en consultar.</div>
            </>
        }
    </>)
}

export default InfoFilter