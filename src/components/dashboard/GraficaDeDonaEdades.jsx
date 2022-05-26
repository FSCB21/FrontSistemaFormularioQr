import React, { useRef, useState, useEffect } from 'react'
import { Button } from 'primereact/button'
import { Chart } from 'primereact/chart'
import { Divider } from 'primereact/divider'
import ColoresGraficas from '../cumpleaños/ColoresGraficas'
import DashBoardDataService from '../../service/DashBoardDataService'
import GenerateRandom from '../../helpers/GenerateRandom'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Slider } from 'primereact/slider'
import { ScrollPanel } from 'primereact/scrollpanel'

const GraficaDeDonaEdades = () => {

    const dashBoardDataService = new DashBoardDataService()

    const [dataEdad, setDataEdad] = useState([])
    const [arreloNumerosColores,setArreloNumerosColores] = useState([])

    const setColors = () =>{
        let i = []

        for (let index = 0; index <= 150; index++) {
            i.push(GenerateRandom(0,100))
        }
        setArreloNumerosColores(i)
    }

    useEffect(()=>{
        setColors()
    },[]) //eslint-disable-line

    useEffect(() => {
        if(arreloNumerosColores[0]){
            dashBoardDataService.getDataEdades().then(res=>{
                getDataGraficaEdad(res.data)
                setDataEdad(res.data)
            })
        }
        return () => {}
    }, [arreloNumerosColores]); //eslint-disable-line

    const op = useRef(null);
     
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

    const getEdad = (fecha) =>{
        return new Date().getFullYear() - new Date(fecha).getFullYear()
    }

    const [dataGraficaEdad, setDataGraficaEdad] = useState({})

    const getDataGraficaEdad = (data) =>{
        let edades = []

        data.forEach( el => {
            let edad = getEdad(el.fecha_nacimiento)
            edades.push(edad)
        })

        let edadesB= [...new Set(edades)];
        let edadesContadas = []
        edadesB.forEach((el,id)=>{
            edadesContadas.push({edad:` ${el} años`, bgColor:ColoresGraficas[arreloNumerosColores[id]]})
        })

        edades.forEach(el=>{
            edadesB.forEach((edad,id)=>{
                if(el===edad){
                    edadesContadas[id].cont?edadesContadas[id].cont++:edadesContadas[id].cont=1
                }
            })
        })
        setGraficData(edadesContadas, setDataGraficaEdad)
    }

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
const [selectEdad, setSelectEdad] = useState({value:18,state:false})
const [selectEdadDefault, setSelectEdadDefault] = useState([19,100])

const [edadAdicional, setEdadAdicional] = useState([])

const changeRange = value =>{
    if(value >= selectEdadDefault[1])
     value = selectEdadDefault[1]-1

    setSelectEdad({...selectEdad, value})
    setSelectEdadDefault([value+1,100])
}

const changeRangeArray = (value, id) => {
    let i = edadAdicional

    if(value[1] >= selectEdadDefault[1])
        value[1] = selectEdadDefault[1]-1

    i[id].value[1] = value[1]
    setSelectEdadDefault([value[1]+1,100])
}

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

const resetFilter = () =>{
    setEdadAdicional([])
    setSelectEdad({value:18,state:false})
    setSelectEdadDefault([19,100])
}

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
    

  return (
      <div  className="col-12 xl:col-6">
        <div className='card'>
            <h5>Gráfica Edades:</h5>
            <Chart type="doughnut" data={dataGraficaEdad} options={basicOptions} style={{ position: 'relative', width: 'auto' }} />
            <Divider align="left" type="dashed">
                <small>Filtrar Gráfica</small>
            </Divider>
            <Button label='Filtro Personalizado' icon='pi pi-pencil' className='p-button-outlined BorderFormNewUser mx-3 my-2' onClick={e=>op.current.toggle(e)}/>
            <Button label='Quitar Filtro' icon='pi pi-trash' className='p-button-outlined BorderFormNewUser my-2 p-button-secondary' onClick={()=>getDataGraficaEdad(dataEdad)}/>
        </div>

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