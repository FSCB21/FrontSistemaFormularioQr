/*Archivo para la creacion o configuracion de las graficas para la seccion de cumpleaños*/

//Importacion de componentes o librerias para la creacion y funcionamiento de codigo
import React, { useState, useEffect, useRef } from 'react'
import { Chart } from 'primereact/chart';
import { TabView, TabPanel } from 'primereact/tabview';
import { MultiSelect } from 'primereact/multiselect';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import ColoresGraficas from './ColoresGraficas';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Slider } from 'primereact/slider';
import { ScrollPanel } from 'primereact/scrollpanel';

//
const Graficas = (params) => {

    const op = useRef(null);
    const [reload, setReload] = useState(0)
    const [activeIndex, setActiveIndex] = useState(0);
    const [dataGraficaEdad, setDataGraficaEdad] = useState({})
    const [edadAdicional, setEdadAdicional] = useState([])

    //Objeto que contiene la configuracion basica de las graficas
    const basicOptions = {
        maintainAspectRatio: false,
        aspectRatio: 1,
        plugins: {
            legend: {
                display: false
            }
        },
        animation: false
    };

    //Gancho que ejecuta los metodos de obtener la informacion que se va a obtener en 
    useEffect(() => {
        getDataGraficaLugaresRegistro(params.dataCumpleaños)
        getDataGraficaEdad(params.dataCumpleaños)
        return () => {

        };
    }, [params.dataCumpleaños, reload]); // eslint-disable-line

    //Funcion para obtener la edad dependiedo del parametro Fecha
    const getEdad = (fecha) => {
        return new Date().getFullYear() - new Date(fecha).getFullYear()
    }

    //Funcion para obtener la informacion de la grafica de edad 
    const getDataGraficaEdad = (data) => {
        let edades = []

        data.forEach(el => {
            let edad = getEdad(el.fecha_nacimiento)
            edades.push(edad)
        })

        let edadesB = [...new Set(edades)];

        let edadesContadas = []
        edadesB.forEach((el, id) => {
            edadesContadas.push({ edad: ` ${el} años`, bgColor: ColoresGraficas[params.arregloNumerosColores[id]] })
        })

        edades.forEach(el => {
            edadesB.forEach((edad, id) => {
                if (el === edad) {
                    edadesContadas[id].cont ? edadesContadas[id].cont++ : edadesContadas[id].cont = 1
                }
            })
        })
        setGraficData(edadesContadas, setDataGraficaEdad)
    }

    //Gancho que va a almacenar los lugares de registro
    const [dataLugaresRegistro, setDataLugaresRegistro] = useState({})

    const getDataGraficaLugaresRegistro = (data) => {
        const lugares = []

        dataOpcionesLugaresRegistro.forEach(el => {
            lugares.push({ nombre: el.nombre_lugar, bgColor: el.bgColor })
        });

        data.forEach(el => {
            lugares.forEach((lugar, id) => {
                if (el.nombre_lugar_registro === lugar.nombre) {
                    lugares[id].totalUsuarios ? lugares[id].totalUsuarios++ : lugares[id].totalUsuarios = 1
                }
            });
        });
        setGraficData(lugares, setDataLugaresRegistro)
    }

    //Funcion para ingresar los valores o datos a la grafica 
    const setGraficData = (arreglo, metodo) => {
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




    //Filtrar grafica
    const [dataOpcionesLugaresRegistro, setDataOpcionesLugaresRegistro] = useState(params.lugaresRegistroOptions)


    //Filtros Grafica Edad
    const [selectEdad, setSelectEdad] = useState({ value: 18, state: false })
    const [selectEdadDefault, setSelectEdadDefault] = useState([19, 100])


    //Funcion para cambiar el rango del filtro de edad declarando el parametro Value 
    const changeRange = value => {
        if (value >= selectEdadDefault[1])
            value = selectEdadDefault[1] - 1

        setSelectEdad({ ...selectEdad, value })
        setSelectEdadDefault([value + 1, 100])
    }

    //Funcion para cambiar el rango del filtro de edad, al momento de agregar un filtro extra declarando el parametro Value 
    const changeRangeArray = (value, id) => {
        let i = edadAdicional

        if (value[1] >= selectEdadDefault[1])
            value[1] = selectEdadDefault[1] - 1

        i[id].value[1] = value[1]
        setSelectEdadDefault([value[1] + 1, 100])
    }

    //Funcion para añadir un filtro extra para el rango de edad
    const addFilterRangeEdad = () => {
        let i = edadAdicional
        if (i.length === 0) {
            if (selectEdad.value < selectEdadDefault[1] - 1) {
                setSelectEdad({ ...selectEdad, state: true })
                i.push({ value: [selectEdad.value + 1, (selectEdad.value + 2 === 100) ? selectEdad.value + 1 : selectEdad.value + 2], state: false })
                setSelectEdadDefault([(selectEdad.value + 2 === 100) ? selectEdad.value + 2 : selectEdad.value + 3, 100])
                setEdadAdicional(i)
            }
        } else {
            if (i[i.length - 1].value[1] < selectEdadDefault[1] - 1) {
                i[i.length - 1] = { ...i[i.length - 1], state: true }
                setSelectEdadDefault([
                    (parseInt(i[i.length - 1].value[1]) + 3 >= 100) ? parseInt(i[i.length - 1].value[1]) + 2 : parseInt(i[i.length - 1].value[1]) + 3,
                    100
                ])
                i.push({ value: [parseInt(i[i.length - 1].value[1]) + 1, (parseInt(i[i.length - 1].value[1]) + 2 === 100) ? parseInt(i[i.length - 1].value[1]) + 1 : parseInt(i[i.length - 1].value[1]) + 2], state: false })
                setEdadAdicional(i)
            }
        }
    }

    //Funcion para restaurar los valores por defecto en el filtro de edad
    const resetFilter = () => {
        setEdadAdicional([])
        setSelectEdad({ value: 18, state: false })
        setSelectEdadDefault([19, 100])
    }

    //Funcion para cambiar los datos de la grafica estableciendo segun el filtro de edad
    const setFilter = () => {
        let totalAños = []

        params.dataCumpleaños.forEach(el => {
            totalAños.push(getEdad(el.fecha_nacimiento))
        });

        let arregloEdadAdicional = []
        edadAdicional.forEach(el => {
            arregloEdadAdicional.push(el.value)
        });

        let arrayFilter = [[0, selectEdad.value], ...arregloEdadAdicional, selectEdadDefault]

        let filterCounter = []

        arrayFilter.forEach((el, id) => {
            filterCounter.push({ label: `${el[0]} años hasta ${el[1]} años`, bgColor: ColoresGraficas[params.arregloNumerosColores[id]], total: 0 })
        })

        totalAños.forEach(el => {
            arrayFilter.forEach((filtro, id) => {
                if (el > filtro[0] && el < filtro[1])
                    filterCounter[id].total++
            });
        });

        setGraficData(filterCounter, setDataGraficaEdad)
    }

    //Retornamos el codigo usando los metodos que se crearon anteriormente
    return (
        <div className="card">
            <h5><span className='text-purple-700'>Cantidad de cumpleañeros:</span> {params.dataCumpleaños.length}</h5>

            {params.dataCumpleaños[0] && <>
                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    <TabPanel header={<span className='font-normal'>Gráfica Lugares Registro</span>}>
                        <Chart type="doughnut" data={dataLugaresRegistro} options={basicOptions} style={{ position: 'relative', width: 'auto' }} />
                        <Divider align="left" type="dashed">
                            <small>Lugares A mostrar</small>
                        </Divider>
                        <MultiSelect className='w-full BorderFormNewUser' options={params.lugaresRegistroOptions} value={dataOpcionesLugaresRegistro} onChange={(e) => { setDataOpcionesLugaresRegistro(e.value); setReload(reload + 1) }} optionLabel="nombre_lugar" filter filterBy='nombre_lugar' placeholder="Seleccione Lugares" display="chip" />
                    </TabPanel>
                    <TabPanel header={<span className='font-normal'>Gráfica Edad</span>}>
                        <Chart type="pie" data={dataGraficaEdad} options={basicOptions} style={{ position: 'relative', width: 'auto' }} />
                        <Divider align="left" type="dashed">
                            <small>Filtrar Grafica</small>
                        </Divider>
                        <Button label='Filtro Personalizado' icon='pi pi-pencil' className='p-button-outlined BorderFormNewUser mx-3 my-2' onClick={e => op.current.toggle(e)} />
                        <Button label='Quitar Filtro' icon='pi pi-trash' className='p-button-outlined BorderFormNewUser my-2 p-button-secondary' onClick={() => getDataGraficaEdad(params.dataCumpleaños)} />
                    </TabPanel>
                </TabView>
            </>}

            {!params.dataCumpleaños[0] && <>
                No hay datos para crear una gráfica
            </>}

            <OverlayPanel ref={op} style={{ width: '450px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }} breakpoints={{ '640px': '95vw' }}>
                <h4>Filtro personalizado</h4>
                <ScrollPanel className='w-full p-2' style={{ maxHeight: '60vh' }}>
                    Desde 0 años hasta {selectEdad.value} años
                    <Slider disabled={selectEdad.state} value={selectEdad.value} onChange={(e) => changeRange(e.value)} className='my-4' />

                    {edadAdicional[0] && <>
                        {
                            edadAdicional.map((el, id) => {
                                return <div key={id}>
                                    Desde {el.value[0]} años hasta {el.value[1]} años
                                    <Slider disabled={el.state} value={edadAdicional[id].value} onChange={(e) => changeRangeArray(e.value, id)} className='my-4' range />
                                </div>
                            })
                        }
                    </>}

                    Desde {selectEdadDefault[0]} años hasta {selectEdadDefault[1]} años
                    <Slider value={selectEdadDefault} range disabled className='my-4' />

                    <Button className='p-button-success p-button-outlined BorderFormNewUser' icon='pi pi-search' label='Filtrar' onClick={setFilter} />
                    <Button className='p-button-secondary p-button-outlined mx-3 BorderFormNewUser' icon='pi pi-times' label='Borrar' onClick={resetFilter} />
                    <Button className='p-button-outlined BorderFormNewUser' label='Aregar Filtro' icon='pi pi-plus' onClick={addFilterRangeEdad} />
                </ScrollPanel>
            </OverlayPanel>
        </div>
    )
}

export default Graficas