import React, { useEffect, useState } from 'react'

import { Chart } from 'primereact/chart';
import { Dropdown } from 'primereact/dropdown';
import IncentivosService from '../../service/IncentivosService';

import ColoresGraficas from '../cumpleaños/ColoresGraficas'
import { Button } from 'primereact/button';

import { FaExchangeAlt } from 'react-icons/fa';
import { MultiSelect } from 'primereact/multiselect';

const GraficasIncentivosEnCurso = (params) => {
    
    const [opcionesIncentivos, setOpcionesIncentivos] = useState([
        {label:'Incentivo General', value:0}
    ])

    const [reloadGeneral, setReloadGeneral] = useState(0)

    const [OrdenColores, setOrdenColores] = useState([])

    const [dataGraficaActual, setDataGraficaActual] = useState([])

    useEffect(() => {
        let arrayColors = []
        params.arregloNumerosColores.forEach(el => {
            arrayColors.push(ColoresGraficas[el])
        });
        setOrdenColores(arrayColors)
        return () => {
            
        };
    }, [params.arregloNumerosColores]);

    useEffect(() => {
        let arrayOptionsSelect = []
        let arrayDataChar = []
        let total = 0
        params.dataIncentivos.forEach(el => {

            arrayOptionsSelect.push({
                label: el.titulo, 
                value: el.id_incentivo_general
            })

            let porcentajeRegistros = el.total_registros*100/el.meta_incentivo
            arrayDataChar.push({
                label: el.titulo,
                value: porcentajeRegistros
            })

            total += porcentajeRegistros

        });
        setOpcionesIncentivos([
            {label:'Incentivo General', value:0},
            ...arrayOptionsSelect
        ])
        if(OrdenColores[0]){
            orderCharData(arrayDataChar, total)
            configCharData(arrayDataChar)
            setDataGraficaActual(arrayDataChar)
        }
        return () => {
            
        };
    }, [params.dataIncentivos, OrdenColores, reloadGeneral]); //eslint-disable-line

    const orderCharData = (Objets, total)=>{
        Objets.sort(function(a, b) {
            return b.value - a.value;
          });
        
        configCharData2(Objets, total)
    }

    const configCharData = (Objets) =>{
        let labels = []
        let data = []
        Objets.forEach(el=>{
            labels.push(el.label)
            data.push(el.value)
        })
        
        setCharData({
            labels,
            datasets: [
                {
                    data,
                    backgroundColor: OrdenColores
                }
            ]
        })
    }

    const configCharData2 = (Objets, total) =>{
        let labels = []
        let data = []
        Objets.forEach(el=>{
            labels.push(el.label)
            data.push(parseInt(el.value*100/total))
        })

        setCharData2({
            labels,
            datasets: [
                {
                    data,
                    backgroundColor: OrdenColores
                }
            ]
        })
    }

    const [chartData, setCharData] = useState({});

    const [chartData2, setCharData2] = useState({});

    const charOptions =  {
        aspectRatio:1,
        plugins:{
            legend:{
                display:false
            },
            tooltip: {
                callbacks: {
                    label: element =>{
                        return ` ${element.label}: ${Math.trunc(parseInt(element.formattedValue))}%` || 'error';
                    }
                }
            }
        }
    }

    const [incentivoSeleccionado, setIncentivoSeleccionado] = useState(0)

    const incentivosService = new IncentivosService()

    const changeIncentivoChar = (value) =>{
        setIncentivoSeleccionado(value)
        
        if(value===0)
            setReloadGeneral(reloadGeneral+1)
        else{
            incentivosService.getAllByIdIncentivoGeneral(value).then(res=>{
                let arregloDataChar = []
                let total = 0
                res.data.forEach(el => {
                    let porcentajeRegistros = el.total_registros*100/el.meta_a_cumplir
                    arregloDataChar.push({
                        label: el.nombre_lugar_registro, 
                        value: porcentajeRegistros
                    })
                    total += porcentajeRegistros
                })
                orderCharData(arregloDataChar, total)
                configCharData(arregloDataChar)
            })
        }

    }

    const[showGrafic, setShowGrafic] = useState(true)

  return (
    <div className='card grid'>
        <Dropdown className='w-full mb-2' value={incentivoSeleccionado} options={opcionesIncentivos} onChange={e=>changeIncentivoChar(e.value)}/>
        
        {showGrafic === true && <>
            <div className='col-12 grid justify-content-center'>
                <Chart type="doughnut"  options={charOptions} data={chartData2} className='w-12 sm:w-8 md:w-10 lg:w-12 xl:w-9' />
            </div>
            <MultiSelect className='col-12 sm:col-11 BorderFormNewUser' options={dataGraficaActual} /* value={dataOpcionesLugaresRegistro} onChange={(e) => { setDataOpcionesLugaresRegistro(e.value); setReload(reload + 1) }} */ optionLabel="label" filter filterBy='label' placeholder="Seleccione Lugares" display="chip" />
        </>}
        {showGrafic === false &&
            <div className='col-12'>
                <Chart type="bar"  options={{...charOptions, indexAxis:'y', aspectRatio:1}} data={chartData}/>
            </div>
        }
        <Button className='p-button-text sm:col-1' onClick={()=>setShowGrafic(!showGrafic)}><FaExchangeAlt/></Button>
    </div>
  )
}

export default GraficasIncentivosEnCurso