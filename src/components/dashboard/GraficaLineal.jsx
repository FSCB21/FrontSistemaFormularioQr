import React, {useState, useEffect} from 'react'
import { Chart } from 'primereact/chart'
import DashBoardDataService from '../../service/DashBoardDataService';
import RetornarNombreMes from '../../helpers/RetornarNombreMes';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { ColorPicker } from 'primereact/colorpicker';
import LugarRegistroService from '../../service/LugarRegistroService';


const GraficaLineal = (params) => {


    useEffect(() => {
        if (params.colorMode === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [params.colorMode]);

    const dashBoardDataService = new DashBoardDataService()
    useEffect(() => {
        let fecha_inicio =new Date()
        let fecha_fin = new Date()
        fecha_inicio.setMonth(fecha_inicio.getMonth()-12)
        fecha_inicio = fecha_inicio.getFullYear() + '-' + (fecha_inicio.getMonth()+1) + '-' + fecha_inicio.getDate()
        fecha_fin = fecha_fin.getFullYear() + '-' + (fecha_fin.getMonth()+1) + '-' + fecha_fin.getDate()
        dashBoardDataService.getDataMensualLugarRegistro({fecha_inicio,fecha_fin}).then(res=>{
            setLabels(res.data.meses)
            setDatasets([
                ...datasets,
                {
                    label: 'Total General',
                    data: res.data.valores,
                    fill: false,
                    backgroundColor: '#E31D93',
                    borderColor: '#E31D93',
                    tension: .4
                }
            ])
        })
    }, []) //eslint-disable-line

    const [lineOptions, setLineOptions] = useState(null)

    const applyLightTheme = () => {
        const lineOptions = {
            animation :false,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef',
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef',
                    }
                },
            }
        };

        setLineOptions(lineOptions)
    }

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    }
                },
            }
        };

        setLineOptions(lineOptions)
    }

    const [labels, setLabels] = useState([])
    const [datasets, setDatasets] = useState([])

    const retornarMeses = (data) =>{
        let arreglo = []
        data.forEach(el => {
            arreglo.push(RetornarNombreMes(el))
        });
        return arreglo
    }

    const lineData = {
        labels: retornarMeses(labels),
        datasets: datasets
    };
  
    const [lugaresRegistro, setLugaresRegistro] = useState([])
    const [valueOption, setValueOption] = useState('')
    const [colorOption, setColorOption] = useState('E31D93')

    const lugarRegistroService = new LugarRegistroService()
    useEffect(() => {
        lugarRegistroService.getAll().then(res=>{
            setLugaresRegistro(res.data)
        })
    
      return () => {
        
      }
    }, []) // eslint-disable-line

    const AgregarAlmacen = () =>{
        let fecha_inicio =new Date()
        let fecha_fin = new Date()
        fecha_inicio.setMonth(fecha_inicio.getMonth()-12)
        fecha_inicio = fecha_inicio.getFullYear() + '-' + (fecha_inicio.getMonth()+1) + '-' + fecha_inicio.getDate()
        fecha_fin = fecha_fin.getFullYear() + '-' + (fecha_fin.getMonth()+1) + '-' + fecha_fin.getDate()
        dashBoardDataService.getDataMensualLugarRegistro({fecha_inicio,fecha_fin,id_lugar_registro:valueOption.id_lugar_registro}).then(res=>{
            setDatasets([
                ...datasets,
                {
                    label: valueOption.nombre_lugar_registro,
                    data: res.data.valores,
                    fill: false,
                    backgroundColor: `#${colorOption}`,
                    borderColor: `#${colorOption}`,
                    tension: .4
                }
            ])
        })
    }

    const borrarData = () =>{
        setDatasets([])
    }

    return (
    <div className="col-12">
        <div className="card mb-0">
            <div className='grid'>
                <div className="col-12 md:col-6">
                    <Chart type="line" data={lineData} options={lineOptions} o/>
                </div>
                <div className="col-12 md:col-6">
                    <Dropdown className='col-12 md:col-5 BorderFormNewUser' value={valueOption} options={lugaresRegistro} onChange={e=>setValueOption(e.value)} optionLabel='nombre_lugar_registro' filter filterBy="nombre_lugar_registro"
                        emptyMessage="No se encontraron resultados" emptyFilterMessage="No se encontraron resultados" />
                    <ColorPicker value={colorOption} className='mx-6' onChange={(e) => setColorOption(e.value)}/>
                    <Button label='Agregar Almacen' className='BorderFormNewUser mx-6 mt-6' onClick={AgregarAlmacen}/>
                    <Button label='Borrar Todo' className='BorderFormNewUser mt-6' onClick={borrarData}/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default GraficaLineal