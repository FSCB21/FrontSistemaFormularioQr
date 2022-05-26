import React, {useState, useEffect, useRef} from 'react'
import { Chart } from 'primereact/chart'
import DashBoardDataService from '../../service/DashBoardDataService';
import RetornarNombreMes from '../../helpers/RetornarNombreMes';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import LugarRegistroService from '../../service/LugarRegistroService';
import GenerateRandom from '../../helpers/GenerateRandom'
import { OverlayPanel } from 'primereact/overlaypanel';
import { Calendar } from 'primereact/calendar';

const GraficaLineal = (params) => {

    const op = useRef(null);
    const hexadecimal = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"]

    useEffect(() => {
        if (params.colorMode === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [params.colorMode]);

    const [fechaInicio, setFechaInicio] = useState(new Date())
    const [fechaFin, setFechaFin] = useState(new Date())

    const traerFormatoFecha = (date, day) =>{
        date = new Date(date)
        
        if(day !== '01')
            day = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

        let retorno = `${date.getFullYear()}-${(String(date.getMonth()+1).length===1)?"0"+(date.getMonth()+1):date.getMonth()+1}-${day}`
        return retorno
    }

    const dashBoardDataService = new DashBoardDataService()
    useEffect(() => {
        let fecha_inicio = fechaInicio
        let fecha_fin = fechaFin
        fecha_inicio.setMonth(fecha_inicio.getMonth()-6)
        fecha_inicio = traerFormatoFecha(fecha_inicio, '01')
        fecha_fin = traerFormatoFecha(fecha_fin, '31')

        dashBoardDataService.getDataMensualLugarRegistro({fecha_inicio,fecha_fin}).then(res=>{
            setLabels(res.data.meses)
            setLugares([...lugares, {id:0,nombre:'Total General',color:'#E31D93'}])
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
  
    const [lugaresRegistro, setLugaresRegistro] = useState([
        {id_lugar_registro: 0, nombre_lugar_registro: 'Total General', estado: true}
    ])
    const [valueOption, setValueOption] = useState('')

    const lugarRegistroService = new LugarRegistroService()
    useEffect(() => {
        lugarRegistroService.getAll().then(res=>{
            setLugaresRegistro([...lugaresRegistro,...res.data])
        })
    
      return () => {
        
      }
    }, []) // eslint-disable-line

    const AgregarAlmacen = () =>{
        if(valueOption){
            let fecha_inicio = fechaInicio
            let fecha_fin = fechaFin
            fecha_inicio = traerFormatoFecha(fecha_inicio, '01')
            fecha_fin = traerFormatoFecha(fecha_fin, '31')
            dashBoardDataService.getDataMensualLugarRegistro({fecha_inicio,fecha_fin,id_lugar_registro:valueOption.id_lugar_registro}).then(res=>{
                let color_aleatorio = "#";
                for (let i=0;i<6;i++){
                    let posarray = GenerateRandom(0,hexadecimal.length)
                    color_aleatorio += hexadecimal[posarray]
                }
                setLugares([...lugares, {id:valueOption.id_lugar_registro,nombre:valueOption.nombre_lugar_registro,color:color_aleatorio}])
                setDatasets([
                    ...datasets,
                    {
                        label: valueOption.nombre_lugar_registro,
                        data: res.data.valores,
                        fill: false,
                        backgroundColor: color_aleatorio,
                        borderColor: color_aleatorio,
                        tension: .4
                    }
                ])
                setValueOption(null)
            })
        }
    }

    const borrarData = () =>{
        setDatasets([])
        setLugares([])
    }

    //Formulario Select Fecha
    const [lugares, setLugares] = useState([])

    const consultarPorFechas = () =>{
        let fecha_inicio = fechaInicio
        let fecha_fin = fechaFin
        fecha_inicio = traerFormatoFecha(fecha_inicio, '01')
        fecha_fin = traerFormatoFecha(fecha_fin, '31')
        
        let newDatasets = []
        lugares.forEach(el=>{
            dashBoardDataService.getDataMensualLugarRegistro({fecha_inicio,fecha_fin,id_lugar_registro:el.id}).then(res=>{
                setLabels(res.data.meses)
                newDatasets.push({
                        label: el.nombre,
                        data: res.data.valores,
                        fill: false,
                        backgroundColor: el.color,
                        borderColor: el.color,
                        tension: .4
                    })
            })
        })
        setDatasets(newDatasets)

        
    }

    return (
    <div className="col-12 xl:col-6" id='graficaMensual'>
        <div className="card mb-0">
            <h5 className='mb-4'>Gráfica Registros Mensuales:</h5>
            <Chart type="line" data={lineData} options={lineOptions} o/>
            <Dropdown placeholder='Seleccionar Almacen' className='p-inputtext-sm col-12 BorderFormNewUser' value={valueOption} options={lugaresRegistro} onChange={e=>setValueOption(e.value)} optionLabel='nombre_lugar_registro' filter filterBy="nombre_lugar_registro"
                emptyMessage="No se encontraron resultados" emptyFilterMessage="No se encontraron resultados" />
            <div className="grid justify-content-center">
                <Button label='Agregar Almacen' className='BorderFormNewUser mx-2 mt-4' onClick={AgregarAlmacen}/>
                <Button label='Borrar Todo' className='BorderFormNewUser mx-2 mt-4' onClick={borrarData}/>
                <Button tooltip='Cambiar Fecha' tooltipOptions={{position:'top'}} icon='pi pi-calendar' className='p-button-outlined BorderFormNewUser mx-2 mt-4' onClick={(e) => op.current.toggle(e)}/>
            </div>
        </div>


        <OverlayPanel ref={op} /* onHide={formik.resetForm} */ id="overlay_panel" style={{ width: '250px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }} breakpoints={{'640px': '90vw'}}>
            <div className="col-12 mt-2">
                <span className="p-float-label">
                    <Calendar readOnlyInput value={fechaInicio} maxDate={fechaFin} onChange={(e) => setFechaInicio(e.value)} view="month" dateFormat="yy/mm" />
                    <label>Mes Inicio:</label>
                </span>
            </div>
            <div className="col-12 mt-2">
                <span className="p-float-label">
                    <Calendar readOnlyInput value={fechaFin} minDate={fechaInicio} onChange={(e) => setFechaFin(e.value)} view="month" dateFormat="yy/mm" />
                    <label>Mes Final:</label>
                </span>
            </div>
            <Button type='button' onClick={consultarPorFechas} label='Consultar' className='mt-2 w-full'/>
        </OverlayPanel>
    </div>
  )
}

export default GraficaLineal