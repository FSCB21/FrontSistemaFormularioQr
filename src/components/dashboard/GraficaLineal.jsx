/* Archivo que contiene la grafica de cantidad de registros por mes */

//Importamos los ganchos y el componente de react
import React, {useState, useEffect, useRef} from 'react'

//Importamos componentes de estilado de prime react
import { Chart } from 'primereact/chart'
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Calendar } from 'primereact/calendar';

//Importamos los servicios de consulta al api
import DashBoardDataService from '../../service/DashBoardDataService';
import LugarRegistroService from '../../service/LugarRegistroService';

//Importamos los metodos ayudadores
import RetornarNombreMes from '../../helpers/RetornarNombreMes';
import GenerateRandom from '../../helpers/GenerateRandom'

//Metodo que se encarga de renderizar el componente
const GraficaLineal = (params) => {

    //Creamos una referencia para el componente de overlaypanel
    const op = useRef(null);

    let hoy = new Date()

    //Definimos un arreglo 
    const hexadecimal = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"]

    //Gancho que almacena el valor de la fecha a inicio para generar un nuevo valor en la grafica
    const [fechaInicio, setFechaInicio] = useState(new Date())
    //Gancho que almacena el valor de la fecha a fin para generar un nuevo valor en la grafica
    const [fechaFin, setFechaFin] = useState(new Date())
    //Gancho que almacena los valores por defecto a mostrar de la grafica
    const [lineOptions, setLineOptions] = useState(null)
    //Gancho que almacena que valores de texto se van a mostrer en la grafica
    const [labels, setLabels] = useState([])
    //Gancho que almacena que valores númericos van a ser mostrados en la grafica
    const [datasets, setDatasets] = useState([])
    //Gancho que almacena los lugares de registro a consultar
    const [lugaresRegistro, setLugaresRegistro] = useState([
        {id_lugar_registro: 0, nombre_lugar_registro: 'Total General', estado: true}
    ])
    //Gancho que almacena el valor de un nuevo registro para la grafica
    const [valueOption, setValueOption] = useState('')
    //Gancho que almacena los lugares de registro a consultar por fecha
    const [lugares, setLugares] = useState([])

    //Metodo que varia el color de fondo cada que se renderiza el componente
    useEffect(() => {
        if (params.colorMode === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [params.colorMode]);

    //Funcion que retorna la estructura de dia mes y año segun la fecha y el dia que se ingresa
    const traerFormatoFecha = (date, day) =>{
        date = new Date(date)
        
        if(day !== '01')
            day = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

        let retorno = `${date.getFullYear()}-${(String(date.getMonth()+1).length===1)?"0"+(date.getMonth()+1):date.getMonth()+1}-${day}`
        return retorno
    }

    const dashBoardDataService = new DashBoardDataService()

    //Metodo que consultara al api y traera el objeto de grafica para el valor general, desde la fecha actual hasta hace 6 meses
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

    //Metodo que aplica el thema claro a la grafica para cuando el color de fondo cambie
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

    //Metodo que aplica el thema oscuro a la grafica para cuando el color de fondo cambie
    const applyDarkTheme = () => {
        const lineOptions = {
            animation :false,
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


    //Metodo que cambia el valor de npumero de los meses a nombre
    const retornarMeses = (data) =>{
        let arreglo = []
        data.forEach(el => {
            arreglo.push(RetornarNombreMes(el))
        });
        return arreglo
    }

    //Constante que almacena los textos de la grafica y los datos
    const lineData = {
        labels: retornarMeses(labels),
        datasets: datasets
    };

    const lugarRegistroService = new LugarRegistroService()

    //metodo que trae todos los lugares de registro
    useEffect(() => {
        lugarRegistroService.getAll().then(res=>{
            setLugaresRegistro([...lugaresRegistro,...res.data])
        })
    
      return () => {
        
      }
    }, []) // eslint-disable-line

    //Funcion que agrega un nuevo registro a la grafica segun un determinado almacen seleccionado
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

    //Funcion que se encarga de borrar toda la informacion de la grafica
    const borrarData = () =>{
        setDatasets([])
        setLugares([])
    }

    //Funcion que se encarga de consultar al api segun las fechas establecidas en un determinado filtro
    const consultarPorFechas = () =>{
        let fecha_inicio = fechaInicio
        let fecha_fin = fechaFin
        fecha_inicio = traerFormatoFecha(fecha_inicio, '01')
        fecha_fin = traerFormatoFecha(fecha_fin, '31')
        
        let newDatasets = []
        if(lugares[0]){
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

        }else{
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
        }
    }

    //Etiquetas de retorno del componente
    return (
    <div className="col-12 xl:col-6" id='graficaMensual'>
        {/* Grafica con sus respectivos valores */}
        <div className="card mb-0">
            <h5 className='mb-4'>Gráfica Registros Mensuales:</h5>
            <Chart type="line" data={lineData} options={lineOptions} />
            <Dropdown placeholder='Seleccionar Almacen' className='p-inputtext-sm col-12 BorderFormNewUser' value={valueOption} options={lugaresRegistro} onChange={e=>setValueOption(e.value)} optionLabel='nombre_lugar_registro' filter filterBy="nombre_lugar_registro"
                emptyMessage="No se encontraron resultados" emptyFilterMessage="No se encontraron resultados" />
            <div className="grid justify-content-center">
                <Button label='Agregar Almacen' className='BorderFormNewUser mx-2 mt-4' onClick={AgregarAlmacen}/>
                <Button label='Borrar Todo' className='BorderFormNewUser mx-2 mt-4' onClick={borrarData}/>
                <Button tooltip='Cambiar Fecha' tooltipOptions={{position:'top'}} icon='pi pi-calendar' className='p-button-outlined BorderFormNewUser mx-2 mt-4' onClick={(e) => op.current.toggle(e)}/>
            </div>
        </div>

        {/* Ventana emergente de formulario de cambio de fecha de grafica */}
        <OverlayPanel ref={op} id="overlay_panel" style={{ width: '250px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }} breakpoints={{'640px': '90vw'}}>
            <div className="col-12 mt-2">
                <span className="p-float-label">
                    <Calendar readOnlyInput value={fechaInicio} maxDate={fechaFin} minDate={new Date(`${hoy.getFullYear()-1}-${hoy.getMonth()+2}-${hoy.getDate()}`)} onChange={(e) => setFechaInicio(e.value)} view="month" dateFormat="yy/mm" />
                    <label>Mes Inicio:</label>
                </span>
            </div>
            <div className="col-12 mt-2">
                <span className="p-float-label">
                    <Calendar readOnlyInput value={fechaFin} minDate={fechaInicio} maxDate={hoy} onChange={(e) => setFechaFin(e.value)} view="month" dateFormat="yy/mm" />
                    <label>Mes Final:</label>
                </span>
            </div>
            <Button type='button' onClick={consultarPorFechas} label='Establecer fecha' className='mt-2 w-full'/>
        </OverlayPanel>
    </div>
  )
}

export default GraficaLineal