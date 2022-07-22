/* Archivo que almacena el contenido principal del modulo de Formulario nuevo registro */

//Importamos react para definir que lo que se encuentra en este archivo es un componente de react
//Importamos los ganchos de react que se van a usar en el archivo
//Importamos useEffect como el gancho que ejecuta un determinado grupo de lineas de codigo cada que se renderiza el componente
//Importamos useState como el gancho que almacena variables de estado que cambian de manera dinamica en el codigo
//Importamos useRef para crear una referencia a determinados elementos del archivo
import React, { useEffect, useState, useRef } from 'react'

//Importamos Button de primereact
//Este elemento es un boton el cual se le pueden asignar estilos de manera rapida
import { Button } from 'primereact/button';
//Importamos el objeto Calendar de primereact
//Este elemento es un estilo de input para calendario y selecion de fechas 
import { Calendar } from 'primereact/calendar';
//Importamos el objetoOverlayPanel
//Este objeto es una ventana pequeña que emerge de la seccion a la cual se le da clic
import { OverlayPanel } from 'primereact/overlaypanel';
//Importamos el objeto Dropdow de prime react
//Este elemento permite elegir entre varias opciones de valres establecidas en el item de optios
import { Dropdown } from 'primereact/dropdown';
//Importamos el elemento Toast de primereact
//Este elemento es una alerta que aparece en la pantalla 
import { Toast } from 'primereact/toast';
//Importamos el selectButton de primereact
//Este elemento es un boton el cual se le puede cambiar el valor que tiene activado por otro
import { SelectButton } from 'primereact/selectbutton';
//Importamos el componente de MultiSelect de primereact
//Este componente permite elejir varios elementos de un selector desplegable
import { MultiSelect } from 'primereact/multiselect';
//Importamos el elemento de Slider de primereact
//Este elemento es un estilado de input que permite deslizar una barra para elejir un valor
import { Slider } from 'primereact/slider';
//Importamos el elemento BreadCrumb de primereact
//Este elemento es el estilado del menu de miga de pan
import { BreadCrumb } from 'primereact/breadcrumb';
//Importamos el elemento de ScrollPanel de primereact
//Este objeto permite crear un componente con un scroll interno
import { ScrollPanel } from 'primereact/scrollpanel';
//Importamos el item Toolbar de primereact
//Este item es un estilo de barra/menu superior que organiza el contenido del header de la seccion
import { Toolbar } from 'primereact/toolbar';

//Importamos la clase de servicio de usuarios, la cual contiene todos los metodos de gestion de la informacion de consulta al api
import CumpleañosService from '../service/CumpleañosService'

//Importamos el helper que segun el número de mes retornara el nombre
import RetornarNombreMes from '../helpers/RetornarNombreMes'
//Importamos el helper que genera un numero aleatorio segun se especifique en los parametros
import GenerateRandom from '../helpers/GenerateRandom';

//Importamos el componente de ventana de carga
import LoadPage from '../components/LoadPage'
//Importamosel componente de informacion de uso de la seccion de cumpleaños
import Info from '../components/cumpleaños/Info';
//Importamos el componente de graficas de cumpleaños
import Graficas from '../components/cumpleaños/Graficas';
//Importamos el componente de mas informacion de uso, pero en este caso de filtros
import InfoFilter from '../components/cumpleaños/InfoFilter';
//Importamos el arreglo de colores(se creo para evitar colores fuertes o sin sentido al momento de asignar un color aleatorio a los registros de las graficas)
import ColoresGraficas from '../components/cumpleaños/ColoresGraficas';

//Importamos un metodo validador, el cual valida si un arreglo esta vacio
import { isEmptyArray } from 'formik';

//Importamos las clases de estilo del componente de cumpleaños
import '../components/cumpleaños/cumpleaños.css'

//icons
//Importamos el icono de globo de react-icons
import { IoBalloon } from 'react-icons/io5';

//Componente de retorno de la pagina de cumpleaños
const Cumpleaños = () => {

    //Se define una constante que tendra la referemcia a la etiqueta del overlay panel
    const op = useRef(null);
    //Se define una constante que tendra la referemcia a la etiqueta del overlay panel pero en este caso de mas informacion
    const opInfo = useRef(null);
    //Se define una constante que tendra la referemcia a la etiqueta del overlay panel pero en este caso de mas informacion en el filtro
    const opInfoFilter = useRef(null);
    //Se define una constante que tendra la referemcia a la etiqueta del overlay panel de filtro
    const opFilter = useRef(null);
    //Se define una constante que tendra la referencia a la etiqueta de toast
    const toast = useRef(null);

    //Se define una variable que contiene la fecha actual mediante el metodo de new Date()
    let hoy = new Date()

    //Gancho que almacena la fecha en la que se van a consultar los usuarios que estan cumpliendo años, de inicio se define el día actual
    const [fechaCumpleaños, setFechaCumpleaños] = useState([`${hoy.getFullYear()}-${hoy.getMonth() + 1}-${hoy.getDate()}`])
    //Gancho que almacena la informacion de las personas que cumplen años segun la fecha establecida
    const [dataCumpleaños, setDataCumpleaños] = useState([])
    //Creamos un gancho de estado para la ventana de carga, por defecto este gancho tiene un valor de false
    const [loading, setLoading] = useState(false)
    //Gancho que es usado para renderizar el componente de manera manual cuando este cambie, su valor inicial es 0 y para cada vez que se requiera renderizar sera incrementar en +1 este valor
    const [reload, setReload] = useState(0)
    //Gancho que almacena el orden de colores que se cargan al momento de renderizar el componente (esto para evitar que la grafica cambie de color sin recargar informacion)
    const [arregloNumerosColores, setArreloNumerosColores] = useState([])
    //Gancho que almacena el valor del calendario de cambiar fecha de visualizacion de las personas que cumplen años
    const [dates2, setdates2] = useState([])
    //Gancho que almacena el valor del estado del boton de filtro, esto para cambiar el estilo del boton en el momento que se ha filtrado la informacion
    const [filterIcon, setFilterIcon] = useState(false)
    //Gancho que almacena el valor de la opcion de filtrado que se quiere realizar
    const [optionFilter, setOptionFilter] = useState(null)
    //Gancho que almacena el valor de consulta para el filtro por edad
    const [edadValue, setEdadValue] = useState([0, 200])
    //Gancho que almacena el limite posible de edades para el filtro por edad
    const [edadLimits, setEdadLimits] = useState([0, 200])
    //Gancho que almacena la informacion de los lugares de registro para el filtro
    const [lugaresRegistroOptions, setLugaresRegistroOptions] = useState([])
    //Gancho que almacena los lugares seleccionados en el filtro
    const [lugaresSeleccionados, setLugaresSeleccionados] = useState([])
    //Gancho que almacena el tipo de orden que se le quiere establecer en el filtro
    const [orderValue, setOrderValue] = useState('')
    //Gancho que almacena el campo por el cual se quiere ordenar
    const [valueOrdenarSelect, setValueOrdenarSelect] = useState(null)

    //Funcion que genera 100 veces 100 numeros al azar del 1 al 100 y lo establece en el gancho de arregloNumerosColores
    const setColors = () => {
        let i = []

        for (let index = 0; index <= 100; index++) {
            i.push(GenerateRandom(0, 100))
        }
        setArreloNumerosColores(i)
    }

    //Metodo que trae la informacion del api segun filtros establecidos y la establece en los ganchos
    useEffect(() => {
        setLoading(true)
        setColors()
        const cumpleañosService = new CumpleañosService()
        cumpleañosService.getByRange(fechaCumpleaños[0], fechaCumpleaños[1] ? fechaCumpleaños[1] : fechaCumpleaños[0]).then(res => {

            setDataCumpleaños(res.data)
            obtenerLugaresRegistro(res.data)
            calcularMinimoMaximoEdad(res.data)
            setLoading(false)
            setFilterIcon(false)
        })
        return () => {

        };
    }, [fechaCumpleaños, reload]); //eslint-disable-line

    //Metodos que renderiza el contenido del menu superior
    const leftToolbarTemplate = () => {
        if (!fechaCumpleaños[1]) {
            let fechaCumpleaños2 = new Date(fechaCumpleaños)

            if (fechaCumpleaños2.getDate() === hoy.getDate() && fechaCumpleaños2.getMonth() === hoy.getMonth())
                return <h6 className='mx-3 mt-3'>Cumpleaños hoy {hoy.getDate()} de {RetornarNombreMes(hoy.getMonth() + 1)} </h6>
            else
                return <h6 className='mx-3 mt-3'>Cumpleaños día {fechaCumpleaños2.getDate()} de {RetornarNombreMes(fechaCumpleaños2.getMonth() + 1)}</h6>
        } else {
            let fechaCumpleañosA = new Date(fechaCumpleaños[0])
            let fechaCumpleañosB = new Date(fechaCumpleaños[1])
            return <h6 className='mx-3 mt-3'>Cumpleaños desde {fechaCumpleañosA.getDate()} de {RetornarNombreMes(fechaCumpleañosA.getMonth() + 1)} Hasta {fechaCumpleañosB.getDate()} de {RetornarNombreMes(fechaCumpleañosB.getMonth() + 1)}</h6>
        }
    }
    const rightToolbarTemplate = () => {
        return <>
            <div className='hidden lg:block'>
                <Button className='p-button-outlined mx-3' icon='pi pi-arrow-circle-down' tooltip='Traer Datos Hoy' tooltipOptions={{ position: 'top' }} onClick={() => changeDate([new Date()])} label='Hoy' />
                <Button className='p-button-outlined p-button-info' onClick={exportExcel} tooltip='Descargar Datos' tooltipOptions={{ position: 'top' }} icon='pi pi-download' label='Descargar Datos' />
                <Button className='p-button-outlined mx-3' onClick={e => op.current.toggle(e)} tooltip='Cambiar Fecha' tooltipOptions={{ position: 'top' }} icon='pi pi-calendar' label='Cambiar Fecha' />
            </div>
            <div className='block lg:hidden'>
                <Button className='p-button-outlined mx-3' icon='pi pi-arrow-circle-down' tooltip='Traer Datos Hoy' tooltipOptions={{ position: 'top' }} onClick={() => changeDate([new Date()])} />
                <Button className='p-button-outlined p-button-info' onClick={exportExcel} tooltip='Descargar Datos' tooltipOptions={{ position: 'top' }} icon='pi pi-download' />
                <Button className='p-button-outlined mx-3' onClick={e => op.current.toggle(e)} tooltip='Cambiar Fecha' tooltipOptions={{ position: 'top' }} icon='pi pi-calendar' />
            </div>
        </>
    }

    //Funcion que se usa para obtener la edad de las personas segun su fecha de cumpleaños
    const getAños = (fecha) => {
        return hoy.getFullYear() - new Date(fecha).getFullYear()
    }

    //Campo que renderiza la edad del usuario
    const EdadField = ({ data }) => {
        let años = getAños(data.fecha_nacimiento)
        return <span>{años} Años</span>
    }

    //Componente que renderiza el estilo de selctor de año
    const monthNavigatorTemplate = (e) => {
        return <Dropdown className='mx-4' value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} style={{ lineHeight: 1 }} />;
    }

    //Funcion que cambia la fecha en el filtro de edad
    const changeDate = e => {
        if (!e[0]) {
            toast.current.show({ severity: 'error', summary: 'Fxa te informa', detail: 'No ha seleccionado ningun valor', life: 3000 });
        } else {
            let array = []
            e.forEach(el => {
                if (el)
                    array.push(`${el.getFullYear()}-${el.getMonth() + 1}-${el.getDate()}`)
            });

            setFechaCumpleaños(array)
            op.current.hide()
        }
    }

    //Funcion que se encarga de exportar la data a excel
    const exportExcel = () => {
        setLoading(true)
        import('xlsx').then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(dataCumpleaños);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAsExcelFile(excelBuffer, 'Cumpleaños');
        });
    }

    //Funcion que guarda el documento en el equipo del usuario
    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then(module => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_FXA' + EXCEL_EXTENSION);
            }
        }).finally(() => setLoading(false))
    }

    //Funcion que limita el filtro de edad para filtrar solo segun las edades que se encuentran
    const calcularMinimoMaximoEdad = (data) => {
        let min = 200
        let max = 0
        data.forEach(el => {
            let edad = getAños(el.fecha_nacimiento)
            if (edad < min)
                min = edad
            if (edad > max)
                max = edad
        })
        setEdadValue([min, max])
        setEdadLimits([min, max])
    }

    //Se crea una nueva instancia de service para usar sus metodos de api
    const cumpleañosService = new CumpleañosService()

    //Funcion que consulta al api segun el rango de edad establecido en los filtros
    const consultarRangoEdad = (data) => {
        opFilter.current.hide()
        setLoading(true)
        cumpleañosService.getByRangeFilterAge(fechaCumpleaños[0], fechaCumpleaños[1] ? fechaCumpleaños[1] : fechaCumpleaños[0], data[0], data[1]).then(res => {
            setDataCumpleaños(res.data)
            setLoading(false)
            setFilterIcon(true)
        })
    }

    //Funcion que consulta la data y obtiene los lugares de registro de esta
    const obtenerLugaresRegistro = (data) => {
        let lugares = []
        data.forEach(el => {
            lugares.push(el.nombre_lugar_registro)
        });
        lugares = [...new Set(lugares)];
        lugares.sort()
        let lugaresB = []
        lugares.forEach(el => {
            lugaresB.push({ nombre_lugar: el, bgColor: ColoresGraficas[GenerateRandom(0, ColoresGraficas.length)] })
        });
        setLugaresRegistroOptions(lugaresB)
    }

    //Funcion que consulta al api segun los lugares de registro seleccionados
    const consultarPorLugarRegistro = data => {
        opFilter.current.hide()
        setLoading(true)
        cumpleañosService.getByRangeFilterLugar(fechaCumpleaños[0], fechaCumpleaños[1] ? fechaCumpleaños[1] : fechaCumpleaños[0], data).then(res => {
            setDataCumpleaños(res.data)
            obtenerLugaresRegistro(res.data)
            setLoading(false)
            setFilterIcon(true)
        })
    }

    //objetos para cambiar orden de los filtros 
    const orderOptions = [
        { name: 'Ascendente', value: 1 },
        { name: 'Descendente', value: 2 },
    ];
    const opcionesOrdenarSelect = [
        { label: 'Edad', value: 1 },
        { label: 'Fecha', value: 2 },
        { label: 'Nombre', value: 3 },
    ]

    const opcionesFiltro = [
        { label: 'Edad', value: 1 },
        { label: 'Lugar Registro', value: 2 },
        { label: 'Cambiar Orden', value: 3 },
    ]

    //
    const setFilteringOptions = () => {
        setOrderValue('')
        setValueOrdenarSelect(null)
        setLugaresSeleccionados([])
        setEdadValue(edadLimits)
    }

    const changeOrder = (data) => {
        opFilter.current.hide()
        setLoading(true)
        cumpleañosService.getByRangeChangeOrder(fechaCumpleaños[0], fechaCumpleaños[1] ? fechaCumpleaños[1] : fechaCumpleaños[0], data[0], data[1]).then(res => {
            setDataCumpleaños(res.data)
            setLoading(false)
            setFilterIcon(true)
        })
    }

    const items = [
        { label: 'cumpleaños', url: '/#/dash/cumpleaños' }
    ];

    const home = { icon: 'pi pi-briefcase', url: '/#/dash' }
    return (
        <div className='grid'>
            <Toast ref={toast} />

            <div className='col-12 card grid justify-content-between align-items-center ml-1'>
                <div className='h-full flex justify-content-between align-items-cente'>
                    <h4 className='inline-block my-0 '><IoBalloon className='text-pink-500' />Cumpleaños<IoBalloon className='text-pink-500' /></h4>
                    <i className='pi pi-info-circle text-purple-300 mx-3 text-2xl cursor-pointer icon-info-cumpleaños' onClick={e => opInfo.current.toggle(e)} />
                </div>
                <BreadCrumb className='inline-block mx-4 p-1' style={{ border: 'none' }} model={items} home={home} />
            </div>

            <Toolbar className="mb-4 col-12" left={leftToolbarTemplate} right={rightToolbarTemplate} />
            {!loading && <>
                <ScrollPanel className='col-12 md:col-6' style={{ maxHeight: '80vh' }}>

                    <div className='grid w-full card'>
                        <div className='col-12 flex justify-content-between align-items-center'>
                            <h6>Resultados:</h6>

                            {!filterIcon &&
                                <Button icon='pi pi-filter' className='p-button-outlined p-button-sm p-button-rounded' onClick={e => opFilter.current.toggle(e)} />
                            }

                            {filterIcon &&
                                <Button icon='pi pi-filter-slash' className='p-button-outlined p-button-sm p-button-rounded' onClick={() => setReload(reload + 1)} />
                            }
                        </div>
                        {dataCumpleaños.map((el, id) => {
                            return <div className="col-12 xl:col-6" key={id}>
                                <div className="card">
                                    <div className="flex justify-content-between">
                                        <div>
                                            {el.dia &&
                                                <div>
                                                    <span className='text-800' >{el.dia} de {RetornarNombreMes(el.mes)}</span>
                                                </div>
                                            }
                                            <div>
                                                <span className='text-purple-700 text-md font-medium'>{el.nombres}</span>
                                            </div>
                                            <div>
                                                <EdadField data={el} />
                                            </div>
                                            <div>
                                                <span className='text-pink-600 font-medium'>{el.telefono_contacto}</span>
                                            </div>
                                            <div>
                                                <span className='text-500' >{el.nombre_lugar_registro}</span>
                                            </div>
                                        </div>
                                        <div className="flex align-items-center z-5 cumpleaños-card justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                            <i className="pi pi-eye text-cyan-500 text-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })}
                        {isEmptyArray(dataCumpleaños) && <div className='col-12'>Ninguno de los usuarios registrados cumple años en esta fecha :/</div>}
                    </div>
                </ScrollPanel >
                <div className='col-12 md:col-6'>
                    <Graficas dataCumpleaños={dataCumpleaños} lugaresRegistroOptions={lugaresRegistroOptions} arregloNumerosColores={arregloNumerosColores} />
                </div>
            </>}



            {loading && <>
                <div className='relative h-screen w-full justify-content-center align-items-center flex'>
                    <LoadPage />
                </div>
            </>}

            <OverlayPanel className='' onShow={setFilteringOptions} onHide={() => setOptionFilter(null)} ref={opFilter} style={{ width: '300px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }} breakpoints={{ '640px': '90vw' }}>
                <Dropdown placeholder='Seleccione Filtro' className='w-10 BorderFormNewUser' optionLabel='label' optionValue='value' options={opcionesFiltro} value={optionFilter} onChange={e => setOptionFilter(e.value)} />
                <i className='w-1 pi pi-info-circle text-lg ml-2 cursor-pointer icon-info-cumpleaños' onClick={e => opInfoFilter.current.toggle(e)} />
                {optionFilter === 1 && <>
                    <h6>Filtar</h6>
                    <div className='text-700'>Desde {edadValue[0]} años</div>
                    <div className='mb-3 text-700'>Hasta {edadValue[1]} años</div>
                    <Slider value={edadValue} onChange={(e) => setEdadValue(e.value)} range min={edadLimits[0]} max={edadLimits[1]} />
                    <Button icon='pi pi-search' className='mt-4' label='Consultar' onClick={() => consultarRangoEdad(edadValue)} />
                </>}
                {optionFilter === 2 && <>
                    <h6>Filtar</h6>
                    <MultiSelect className='w-full' value={lugaresSeleccionados} display="chip" optionLabel="nombre_lugar" options={lugaresRegistroOptions} onChange={(e) => setLugaresSeleccionados(e.value)} placeholder="Seleccione Los Lugares" filter filterBy='nombre_lugar' emptyFilterMessage='No se encontro un registro' />
                    {lugaresSeleccionados[0] &&
                        <Button icon='pi pi-search' className='mt-4' label='Consultar' onClick={() => consultarPorLugarRegistro(lugaresSeleccionados)} />
                    }
                </>}
                {optionFilter === 3 && <>
                    <h6>Ordenar Por:</h6>
                    <Dropdown className='w-full BorderFormNewUser' optionLabel='label' optionValue='value' options={opcionesOrdenarSelect} value={valueOrdenarSelect} onChange={e => setValueOrdenarSelect(e.value)} />
                    {valueOrdenarSelect && <>
                        <h6>Orden:</h6>
                        <SelectButton value={orderValue} options={orderOptions} onChange={(e) => setOrderValue(e.value)} optionLabel="name" />
                    </>}
                    {orderValue && <>
                        <Button icon='pi pi-search' className='mt-4' label='Consultar' onClick={() => changeOrder([valueOrdenarSelect, orderValue])} />
                    </>}
                </>}
            </OverlayPanel>

            <OverlayPanel className='flex justify-content-center aling-items-center flex-column' ref={op} style={{ width: '450px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }} breakpoints={{ '640px': '95vw' }}>
                <Calendar dateFormat="dd/mm/yy" yearRange={`${hoy.getFullYear()}:${hoy.getFullYear()}`} value={dates2} inline onChange={(e) => setdates2(e.value)} monthNavigator selectionMode="range"
                    readOnlyInput monthNavigatorTemplate={monthNavigatorTemplate} className='w-full' />
                <Button onClick={() => changeDate(dates2)} className='mt-4 inline-block' label='Consultar' icon='pi pi-search' />
            </OverlayPanel>

            <OverlayPanel className='flex justify-content-center' ref={opInfo} style={{ width: '450px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }} breakpoints={{ '640px': '90vw' }}>
                <Info />
            </OverlayPanel>
            <OverlayPanel className='flex justify-content-center' ref={opInfoFilter} style={{ width: '450px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }} breakpoints={{ '640px': '90vw' }}>
                <InfoFilter optionFilter={optionFilter} />
            </OverlayPanel>

        </div>
    )
}

//Exportamos el componente para usarlo en la seccion de App.js
export default Cumpleaños