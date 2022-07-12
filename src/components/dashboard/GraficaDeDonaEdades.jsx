/* Archivo que contiene el renderizado de la grafica de edades o dona del dashBoard */

//Importamos los ganchos y el componente de react
import React, { useRef, useState, useEffect } from 'react'

//Importamos componentes de estilado de prime react
import { Button } from 'primereact/button'
import { Chart } from 'primereact/chart'
import { Divider } from 'primereact/divider'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Slider } from 'primereact/slider'
import { ScrollPanel } from 'primereact/scrollpanel'

//Importamos el archivo que tiene los colores base para generar una grafica
import ColoresGraficas from '../cumpleaños/ColoresGraficas'

//Importamos el archivo de consultas al api
import DashBoardDataService from '../../service/DashBoardDataService'

//Importamos la funcion para generar un número aleatorio segun los argumentos enviados
import GenerateRandom from '../../helpers/GenerateRandom'

//Renderizado del componente
const GraficaDeDonaEdades = () => {

    const dashBoardDataService = new DashBoardDataService()

    //Gancho que almacena la informacion de edad de las personas registradas en el sistema
    const [dataEdad, setDataEdad] = useState([])
    //Gancho que almacenara el orden de los colores para crear la grafica
    const [arreloNumerosColores,setArreloNumerosColores] = useState([])
    //Gancho que almacena la informacion de edad que es mostrada en la grafica
    const [dataGraficaEdad, setDataGraficaEdad] = useState({})
    //Gancho que almacena la edad elejida por el usuario para realizar el filtro
    const [selectEdad, setSelectEdad] = useState({value:18,state:false})
    //Gancho que almacena la edad restante en el filtro de rango de edad
    const [selectEdadDefault, setSelectEdadDefault] = useState([19,100])
    //Gancho que almacena las edades adicionales en caso de que se agregue un filtro extra
    const [edadAdicional, setEdadAdicional] = useState([])

    //Referencia al componente de overlaypanel
    const op = useRef(null);
    
    //Funcion que establece el arreglo de orden de colores para la grafica
    const setColors = () =>{
        let i = []

        for (let index = 0; index <= 50; index++) {
            i.push(GenerateRandom(0,100))
        }
        setArreloNumerosColores(i)
    }

    useEffect(()=>{
        setColors()
    },[]) //eslint-disable-line

    //Gancho que definira un valor a los ganchos de estado segun las edades de los usuarios que son obtenidas del api
    useEffect(() => {
        if(arreloNumerosColores[0]){
            dashBoardDataService.getDataEdades().then(res=>{
                getDataGraficaEdad(res.data)
                setDataEdad(res.data)
            })
        }
        return () => {}
    }, [arreloNumerosColores]); //eslint-disable-line
     
    //Objeto que almacena la configuracion basica de la grafica
    const basicOptions = {
        maintainAspectRatio: false,
        aspectRatio: 1,
        plugins: {
            legend: {
                display:false
            }
        },
        animation:false
    };

    //Metodo que obtiene la edad segun la fecha de nacimiento que sea enviada como parametro
    const getEdad = (fecha) =>{
        return new Date().getFullYear() - new Date(fecha).getFullYear()
    }

    //Metodo que cuenta los grupos de edades segun los filtros y las establece en el gancho de grafica de edad, para que la grafica lo muestre
    const getDataGraficaEdad = (data) =>{
        let edades = []

        data.forEach( el => {
            let edad = getEdad(el.fecha_nacimiento)
            edades.push(edad)
        })

        let arrayFilter = [[0,20],[21,30],[31,40],[41,50],[51,100]]
    
        let edadesContadas = []

        arrayFilter.forEach((el,id)=>{
            edadesContadas.push({label:`${el[0]} años hasta ${el[1]} años`, bgColor:ColoresGraficas[arreloNumerosColores[id]], total:0})
        })

        edades.forEach(el => {
            arrayFilter.forEach((filtro,id) => {
                if(el > filtro[0] && el < filtro[1])
                    edadesContadas[id].total++
            });
        });
        setGraficData(edadesContadas, setDataGraficaEdad)
    }

    //Funcion que organiza la data para que esta corresponda a la estructura que recibe la grafica
    //Como parametros recive un areglo con la informacion a ordenar y un metodo para establecer el orden en el gancho 
    const setGraficData = (arreglo, metodo) =>{
        const labels = []
        const data = []
        const backgroundColor = []

        arreglo.forEach(el => {
            let i = Object.values(el)
            labels.push(i[0])
            backgroundColor.push(i[1])
            data.push(i[2])
        });

        metodo({
            labels,
            datasets: [
            {
                data,
                backgroundColor
            }]
        })
    }

//Filtros Grafica Edad

//Metodo que cambia el valor del rango de fecha a filtrar
//Cambia el valor de los ganchos de edad seleccionada y la edad por defecto
const changeRange = value =>{
    if(value >= selectEdadDefault[1])
     value = selectEdadDefault[1]-1

    setSelectEdad({...selectEdad, value})
    setSelectEdadDefault([value+1,100])
}

//En dado caso de que sea mas de un filtro de edad
//Se ejecuta funcion que cambia el valor de rango de edad segun su pocicion en el arreglo
const changeRangeArray = (value, id) => {
    let i = edadAdicional

    if(value[1] >= selectEdadDefault[1])
        value[1] = selectEdadDefault[1]-1

    i[id].value[1] = value[1]
    setSelectEdadDefault([value[1]+1,100])
}

//Metodo que agrega un nuevo filtro para el gancho de arreglo de edad adicional
const addFilterRangeEdad = () =>{
    let i = edadAdicional
    if(i.length===0){
        if(selectEdad.value < selectEdadDefault[1]-1){
            setSelectEdad({...selectEdad, state:true})
            i.push({value:[selectEdad.value+1,(selectEdad.value+2===100)?selectEdad.value+1:selectEdad.value+2], state:false})
            setSelectEdadDefault([(selectEdad.value+2===100)?selectEdad.value+2:selectEdad.value+3,100])
            setEdadAdicional(i)
        }
    }else{
        if(i[i.length-1].value[1] < selectEdadDefault[1]-1){
            i[i.length-1] = {...i[i.length-1], state:true}
            setSelectEdadDefault([
                (parseInt(i[i.length-1].value[1])+3>=100)?parseInt(i[i.length-1].value[1])+2:parseInt(i[i.length-1].value[1])+3,
                100
            ])
            i.push({value:[parseInt(i[i.length-1].value[1])+1,(parseInt(i[i.length-1].value[1])+2===100)?parseInt(i[i.length-1].value[1])+1:parseInt(i[i.length-1].value[1])+2], state:false})
            setEdadAdicional(i)
        }
    }
}
//Metodo que restablece los valores iniciales del filtro de edades
const resetFilter = () =>{
    setEdadAdicional([])
    setSelectEdad({value:18,state:false})
    setSelectEdadDefault([19,100])
}

//Metodo que establece el filtro de edad y recuenta las edades para que la grafica cambie segun los nuevos parametros establecidos
const setFilter = () =>{
    let totalAños = []

    dataEdad.forEach(el => {
        totalAños.push(getEdad(el.fecha_nacimiento))
    });

    let arregloEdadAdicional = []
    edadAdicional.forEach(el => {
        arregloEdadAdicional.push(el.value)
    });
    
    let arrayFilter = [[0,selectEdad.value],...arregloEdadAdicional, selectEdadDefault]
    
    let filterCounter = []

    arrayFilter.forEach((el,id)=>{
        filterCounter.push({label:`${el[0]} años hasta ${el[1]} años`, bgColor:ColoresGraficas[arreloNumerosColores[id]], total:0})
    })

    totalAños.forEach(el => {
        arrayFilter.forEach((filtro,id) => {
            if(el > filtro[0] && el < filtro[1])
                filterCounter[id].total++
        });
    });

    setGraficData(filterCounter, setDataGraficaEdad)
}
    

    /* Renderizado de componentes */
  return (
      <div  className="col-12 xl:col-6">
        {/* Grafica de edad */}
        <div className='card'>
            <h5>Gráfica Edades:</h5>
            <Chart type="doughnut" data={dataGraficaEdad} options={basicOptions} style={{ position: 'relative', width: 'auto' }} />
            <Divider align="left" type="dashed">
                <small>Filtrar Gráfica</small>
            </Divider>
            <Button label='Filtro Personalizado' icon='pi pi-pencil' className='p-button-outlined BorderFormNewUser mx-3 my-2' onClick={e=>op.current.toggle(e)}/>
            <Button label='Quitar Filtro' icon='pi pi-trash' className='p-button-outlined BorderFormNewUser my-2 p-button-secondary' onClick={()=>getDataGraficaEdad(dataEdad)}/>
        </div>

        {/* Ventana emergente para el filtro */}
        <OverlayPanel ref={op} style={{ width: '450px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }} breakpoints={{'640px': '95vw'}}>
            <h4>Filtro personalizado</h4>
            <ScrollPanel className='w-full p-2' style={{maxHeight: '60vh'}}>
                Desde 0 años hasta {selectEdad.value} años
                <Slider disabled={selectEdad.state} value={selectEdad.value} onChange={(e) => changeRange(e.value)} className='my-4'/>
                
                {edadAdicional[0] &&<>
                    {
                        edadAdicional.map((el,id)=>{
                            return <div key={id}>
                                Desde {el.value[0]} años hasta {el.value[1]} años
                                <Slider disabled={el.state} value={edadAdicional[id].value} onChange={(e) => changeRangeArray(e.value, id)} className='my-4' range/>
                            </div>
                        })
                    }
                </>}

                Desde {selectEdadDefault[0]} años hasta {selectEdadDefault[1]} años
                <Slider value={selectEdadDefault} range disabled className='my-4'/>
                
                <Button className='p-button-success p-button-outlined BorderFormNewUser' icon='pi pi-search' label='Filtrar' onClick={setFilter}/>
                <Button className='p-button-secondary p-button-outlined mx-3 BorderFormNewUser' icon='pi pi-times' label='Borrar' onClick={resetFilter}/>
                <Button className='p-button-outlined BorderFormNewUser' label='Aregar Filtro' icon='pi pi-plus' onClick={addFilterRangeEdad}/>
            </ScrollPanel>
        </OverlayPanel>

      </div>
  )
}

export default GraficaDeDonaEdades