import React, {useEffect, useState, useRef} from 'react'

import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import CumpleañosService from '../service/CumpleañosService'
import RetornarNombreMes from '../helpers/RetornarNombreMes'
import { Calendar } from 'primereact/calendar';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ScrollPanel  } from 'primereact/scrollpanel';
import { Slider } from 'primereact/slider';
import { MultiSelect } from 'primereact/multiselect';
import { SelectButton } from 'primereact/selectbutton';

import LoadPage from '../components/LoadPage'
import { isEmptyArray } from 'formik';

import '../components/cumpleaños/cumpleaños.css'
import Info from '../components/cumpleaños/Info';
import Graficas from '../components/cumpleaños/Graficas';
import InfoFilter from '../components/cumpleaños/InfoFilter';

const Cumpleaños = () => {
    const op = useRef(null);
    const opInfo = useRef(null);
    const opInfoFilter = useRef(null);
    const opFilter = useRef(null);
    const toast = useRef(null);

    let hoy = new Date()
    
    const [fechaCumpleaños, setFechaCumpleaños] = useState([`${hoy.getFullYear()}-${hoy.getMonth()+1}-${hoy.getDate()}`])
    const [dataCumpleaños, setDataCumpleaños] = useState([])
    const [loading, setLoading] = useState(false)
    
    const [reload, setReload] = useState(0)
    useEffect(() => {
        setLoading(true)
       
            const cumpleañosService = new CumpleañosService()
            cumpleañosService.getByRange(fechaCumpleaños[0],fechaCumpleaños[1]?fechaCumpleaños[1]:fechaCumpleaños[0]).then(res=>{
                setDataCumpleaños(res.data)
                obtenerLugaresRegistro(res.data)
                calcularMinimoMaximoEdad(res.data)
                setLoading(false)
                setFilterIcon(false)
            })
        return () => {
       
        };
    }, [fechaCumpleaños, reload]); //eslint-disable-line

    const leftToolbarTemplate = () =>{
        if(!fechaCumpleaños[1]){
            let fechaCumpleaños2 = new Date(fechaCumpleaños)

            if(fechaCumpleaños2.getDate() === hoy.getDate() && fechaCumpleaños2.getMonth() === hoy.getMonth())
                return <h5 className='mx-3 mt-3'>Cumpleaños hoy {hoy.getDate()} de {RetornarNombreMes(hoy.getMonth()+1)} <i className='pi pi-info-circle mx-3 text-lg cursor-pointer icon-info-cumpleaños' onClick={e=>opInfo.current.toggle(e)}/></h5>
            else
                return <h5 className='mx-3 mt-3'>Cumpleaños día {fechaCumpleaños2.getDate()} de {RetornarNombreMes(fechaCumpleaños2.getMonth()+1)}<i className='pi pi-info-circle mx-3 text-lg cursor-pointer icon-info-cumpleaños' onClick={e=>opInfo.current.toggle(e)}/></h5>
        }else{
            let fechaCumpleañosA = new Date(fechaCumpleaños[0])
            let fechaCumpleañosB = new Date(fechaCumpleaños[1])
            return <h5 className='mx-3 mt-3'>Cumpleaños desde {fechaCumpleañosA.getDate()} de {RetornarNombreMes(fechaCumpleañosA.getMonth()+1)} Hasta {fechaCumpleañosB.getDate()} de {RetornarNombreMes(fechaCumpleañosB.getMonth()+1)}<i className='pi pi-info-circle mx-3 text-lg cursor-pointer icon-info-cumpleaños' onClick={e=>opInfo.current.toggle(e)}/></h5>
        }
    }
    const rightToolbarTemplate= () =>{
        return <> 
            <div className='hidden lg:block'>
                <Button className='p-button-outlined mx-3' icon='pi pi-arrow-circle-down' tooltip='Traer Datos Hoy' tooltipOptions={{position:'top'}} onClick={()=>changeDate([new Date()])} label='Hoy'/>
                <Button className='p-button-outlined p-button-info' onClick={exportExcel} tooltip='Descargar Datos' tooltipOptions={{position:'top'}} icon='pi pi-download' label='Descargar Datos'/>
                <Button className='p-button-outlined mx-3' onClick={e=>op.current.toggle(e)} tooltip='Cambiar Fecha' tooltipOptions={{position:'top'}} icon='pi pi-calendar' label='Cambiar Fecha'/>
            </div>
            <div className='block lg:hidden'>
                <Button className='p-button-outlined mx-3' icon='pi pi-arrow-circle-down' tooltip='Traer Datos Hoy' tooltipOptions={{position:'top'}} onClick={()=>changeDate([new Date()])}/>
                <Button className='p-button-outlined p-button-info' onClick={exportExcel} tooltip='Descargar Datos' tooltipOptions={{position:'top'}} icon='pi pi-download'/>
                <Button className='p-button-outlined mx-3' onClick={e=>op.current.toggle(e)} tooltip='Cambiar Fecha' tooltipOptions={{position:'top'}} icon='pi pi-calendar'/>
            </div>
        </>
    }

    const getAños = (fecha) =>{
        return hoy.getFullYear() - new Date(fecha).getFullYear()
    }

    const EdadField = ({data}) =>{
        let diferenciaEdad = getAños(data.fecha_nacimiento)
        return <span>{diferenciaEdad} Años</span>
    }

    const monthNavigatorTemplate=(e)=> {
        return <Dropdown className='mx-4' value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} style={{ lineHeight: 1 }} />;
    }

    const changeDate = e =>{
        if(!e[0]){
            toast.current.show({severity:'error', summary: 'Fxa te informa', detail: 'No ha seleccionado ningun valor', life: 3000});
        }else{
            let array = []
            e.forEach(el => {
                if(el)
                    array.push(`${el.getFullYear()}-${el.getMonth()+1}-${el.getDate()}`)
            });

            setFechaCumpleaños(array)
            op.current.hide()
        }
    }

    const exportExcel = () => {
        setLoading(true)
        import('xlsx').then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(dataCumpleaños);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAsExcelFile(excelBuffer, 'Cumpleaños');
        });
    }

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
        }).finally(()=>setLoading(false))
    }

    const [dates2, setdates2] = useState([])


    //Segundo Filtro
    const [filterIcon, setFilterIcon] = useState(false)
    const [ optionFilter, setOptionFilter] = useState(null)

    //Edad
    const [ edadValue, setEdadValue] = useState([0,200])
    const [ edadLimits, setEdadLimits] = useState([0,200])

    const calcularMinimoMaximoEdad = (data) =>{
        let min = 200
        let max = 0
        data.forEach(el => {
            let edad = getAños(el.fecha_nacimiento)
            if(edad<min)
                min=edad
            if(edad>max)
                max=edad
        })
        setEdadValue([min,max])
        setEdadLimits([min,max])
    }

    const cumpleañosService = new CumpleañosService()

    const consultarRangoEdad = (data) =>{
        opFilter.current.hide()
        setLoading(true)
        cumpleañosService.getByRangeFilterAge(fechaCumpleaños[0],fechaCumpleaños[1]?fechaCumpleaños[1]:fechaCumpleaños[0], data[0], data[1]).then(res=>{
            setDataCumpleaños(res.data)
            setLoading(false)
            setFilterIcon(true)
        })
    }

    //Obtener lugares de registro

    const [lugaresRegistroOptions, setLugaresRegistroOptions] = useState([])
    const [lugaresSeleccionados, setLugaresSeleccionados] = useState([])

    const obtenerLugaresRegistro = (data) =>{
        let lugares = []
        data.forEach(el => {
            lugares.push(el.nombre_lugar_registro)
        });
        lugares = [...new Set(lugares)];
        lugares.sort()

        let lugaresB = []
        lugares.forEach(el => {
            lugaresB.push({nombre_lugar:el})
        });
        setLugaresRegistroOptions(lugaresB)
    }

    const consultarPorLugarRegistro = data =>{
        opFilter.current.hide()
        setLoading(true)
        cumpleañosService.getByRangeFilterLugar(fechaCumpleaños[0],fechaCumpleaños[1]?fechaCumpleaños[1]:fechaCumpleaños[0],data).then(res=>{
            setDataCumpleaños(res.data)
            setLoading(false)
            setFilterIcon(true)
        })
    }

    //Cambiar orden
    const [ orderValue, setOrderValue ] = useState('')
    const [valueOrdenarSelect, setValueOrdenarSelect] = useState(null)

    const orderOptions = [
        {name: 'Ascendente', value: 1},
        {name: 'Descendente', value: 2},
    ];
    const opcionesOrdenarSelect = [
        {label:'Edad', value:1},
        {label:'Fecha', value:2},
        {label:'Nombre',  value:3},
    ]

    const opcionesFiltro = [
        {label:'Edad', value:1},
        {label:'Lugar Registro', value:2},
        {label:'Cambiar Orden',  value:3},
    ]

    const setFilteringOptions = () =>{
        setOrderValue('')
        setValueOrdenarSelect(null)
        setLugaresSeleccionados([])
        setEdadValue(edadLimits)
    }

    const changeOrder = (data) =>{
        opFilter.current.hide()
        setLoading(true)
        cumpleañosService.getByRangeChangeOrder(fechaCumpleaños[0],fechaCumpleaños[1]?fechaCumpleaños[1]:fechaCumpleaños[0],data[0],data[1]).then(res=>{
            setDataCumpleaños(res.data)
            setLoading(false)
            setFilterIcon(true)
        })
    }

    return (
    <div className='grid'>
        <Toast ref={toast} />
        <Toolbar className="mb-4 col-12" left={leftToolbarTemplate} right={rightToolbarTemplate}/>
        {!loading && <>
            <ScrollPanel className='col-12 sm:col-6' style={{height: '70vh'}}>

                <div className='grid w-full card'>
                    <div className='col-12 flex justify-content-between align-items-center'>
                        <h6>Resultados:</h6>
                        
                        {!filterIcon &&
                            <Button icon='pi pi-filter' className='p-button-outlined p-button-sm p-button-rounded' onClick={e=>opFilter.current.toggle(e)}/>
                        }

                        {filterIcon &&
                            <Button icon='pi pi-filter-slash' className='p-button-outlined p-button-sm p-button-rounded' onClick={()=>setReload(reload+1)}/>
                        }
                    </div>
                    {dataCumpleaños.map((el,id)=>{
                        return <div className="col-12 xl:col-6" key={id}>
                        <div className="card">
                            <div className="flex justify-content-between">
                                <div>
                                    {el.dia &&
                                        <div>
                                            <span  className='text-800' >{el.dia} de {RetornarNombreMes(el.mes)}</span>
                                        </div>
                                    }
                                    <div>
                                        <span className='text-purple-700 text-md font-medium'>{el.nombres}</span>
                                    </div>
                                    <div>
                                        <EdadField data={el}/>
                                    </div>
                                    <div>
                                        <span className='text-pink-600 font-medium'>{el.telefono_contacto}</span>
                                    </div>
                                    <div>
                                        <span  className='text-500' >{el.nombre_lugar_registro}</span>
                                    </div>
                                </div>
                                <div className="flex align-items-center z-5 cumpleaños-card justify-content-center bg-cyan-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                                    <i className="pi pi-eye text-cyan-500 text-xl"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    })}
                    {isEmptyArray(dataCumpleaños) && <div className='col-12'>Ninguno de los usuarios registrados cumple años en esta fecha :/</div>}
                </div>
            </ScrollPanel >
            <div className='col-12 sm:col-6'>
                    <Graficas/>
            </div>
        </>}

        

        {loading && <>
            <div className='relative h-screen w-full justify-content-center align-items-center flex'>
              <LoadPage/>
            </div>
        </>}

        <OverlayPanel className='' onShow={setFilteringOptions} onHide={()=>setOptionFilter(null)} ref={opFilter} style={{ width: '300px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }} breakpoints={{'640px': '90vw'}}>
            <Dropdown placeholder='Seleccione Filtro' className='w-10 BorderFormNewUser' optionLabel='label' optionValue='value' options={opcionesFiltro} value={optionFilter} onChange={e=>setOptionFilter(e.value)}/>
            <i className='w-1 pi pi-info-circle text-lg ml-2 cursor-pointer icon-info-cumpleaños' onClick={e=>opInfoFilter.current.toggle(e)}/>
            {optionFilter===1 && <>
                <h6>Filtar</h6>
                <div className='text-700'>Desde {edadValue[0]} años</div>
                <div className='mb-3 text-700'>Hasta {edadValue[1]} años</div>
                <Slider value={edadValue} onChange={(e) => setEdadValue(e.value)} range min={edadLimits[0]} max={edadLimits[1]} />
                <Button icon='pi pi-search' className='mt-4' label='Consultar' onClick={()=>consultarRangoEdad(edadValue)}/>
            </>}
            {optionFilter === 2 && <>
                <h6>Filtar</h6>
                <MultiSelect className='w-full' value={lugaresSeleccionados} display="chip" optionLabel="nombre_lugar" options={lugaresRegistroOptions} onChange={(e) => setLugaresSeleccionados(e.value)} placeholder="Seleccione Los Lugares" filter filterBy='nombre_lugar' emptyFilterMessage='No se encontro un registro'/>
                {lugaresSeleccionados[0] && 
                    <Button icon='pi pi-search' className='mt-4' label='Consultar' onClick={()=>consultarPorLugarRegistro(lugaresSeleccionados)}/>
                }
            </>}
            {optionFilter ===3 && <>
                    <h6>Ordenar Por:</h6>
                    <Dropdown className='w-full BorderFormNewUser' optionLabel='label' optionValue='value' options={opcionesOrdenarSelect} value={valueOrdenarSelect} onChange={e=>setValueOrdenarSelect(e.value)}/>
                {valueOrdenarSelect && <>
                    <h6>Orden:</h6>
                    <SelectButton value={orderValue} options={orderOptions} onChange={(e) => setOrderValue(e.value)} optionLabel="name" />
                </>}
                {orderValue && <>
                    <Button icon='pi pi-search' className='mt-4' label='Consultar' onClick={()=>changeOrder([valueOrdenarSelect, orderValue])}/>
                </>}
            </>}
        </OverlayPanel>

        <OverlayPanel className='flex justify-content-center aling-items-center flex-column' ref={op} style={{ width: '450px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }} breakpoints={{'640px': '95vw'}}>
            <Calendar dateFormat="dd/mm/yy" yearRange={`${hoy.getFullYear()}:${hoy.getFullYear()}`} value={dates2} inline onChange={(e) =>setdates2(e.value)} monthNavigator selectionMode="range"
            readOnlyInput monthNavigatorTemplate={monthNavigatorTemplate} className='w-full'/>
            <Button onClick={()=>changeDate(dates2)} className='mt-4 inline-block' label='Consultar' icon='pi pi-search'/>
        </OverlayPanel>

        <OverlayPanel className='flex justify-content-center' ref={opInfo} style={{ width: '450px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }} breakpoints={{'640px': '90vw'}}>
            <Info/>
        </OverlayPanel>
        <OverlayPanel className='flex justify-content-center' ref={opInfoFilter} style={{ width: '450px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }} breakpoints={{'640px': '90vw'}}>
            <InfoFilter optionFilter={optionFilter}/>
        </OverlayPanel>

    </div>
  )
}

export default Cumpleaños