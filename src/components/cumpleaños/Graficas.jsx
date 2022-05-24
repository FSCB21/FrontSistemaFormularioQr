import React, {useState, useEffect} from 'react'
import { Chart } from 'primereact/chart';
import { TabView, TabPanel } from 'primereact/tabview';
import { MultiSelect } from 'primereact/multiselect';
import { Divider } from 'primereact/divider';
import ColoresGraficas from './ColoresGraficas';
import GenerateRandom from '../../helpers/GenerateRandom';

const Graficas = (params) => {
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

    const [reload, setReload] = useState(0)

    useEffect(() => {
        getDataGraficaLugaresRegistro(params.dataCumpleaños)
        getDataGraficaEdad(params.dataCumpleaños)
        return () => {
            
        };
    }, [params.dataCumpleaños, reload]); // eslint-disable-line

    const [dataGraficaEdad, setDataGraficaEdad] = useState({})

    const getEdad = (fecha) =>{
        return new Date().getFullYear() - new Date(fecha).getFullYear()
    }
    const getDataGraficaEdad = (data) =>{
        let edades = []

        data.forEach( el => {
            let edad = getEdad(el.fecha_nacimiento)
            edades.push(edad)
        })

        let edadesB= [...new Set(edades)];

        let edadesContadas = []
        edadesB.forEach(el=>{
            edadesContadas.push({edad:` ${el} años`, bgColor:ColoresGraficas[GenerateRandom(0,ColoresGraficas.length)]})
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

    //GET DATA LUGARES
    const [dataLugaresRegistro, setDataLugaresRegistro] = useState({})

    const getDataGraficaLugaresRegistro = (data) =>{
        const lugares = []

        dataOpcionesLugaresRegistro.forEach(el => {
            lugares.push({nombre:el.nombre_lugar, bgColor: el.bgColor})
        });

        data.forEach(el => {
            lugares.forEach((lugar,id) => {
                if(el.nombre_lugar_registro === lugar.nombre){
                    lugares[id].totalUsuarios?lugares[id].totalUsuarios++:lugares[id].totalUsuarios=1
                }
            });
        });
        setGraficData(lugares, setDataLugaresRegistro)
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

    const [activeIndex, setActiveIndex] = useState(0);


    //Filtrar grafica
    const [dataOpcionesLugaresRegistro, setDataOpcionesLugaresRegistro] = useState(params.lugaresRegistroOptions)

  return (
    <div className="card">
        <h5><span className='text-purple-700'>Cantidad de cumpleañeros:</span> {params.dataCumpleaños.length}</h5>
        
    
        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
            <TabPanel header={<span className='font-normal'>Gráfica Lugares Registro</span>}>
                <Chart type="doughnut" data={dataLugaresRegistro} options={basicOptions} style={{ position: 'relative', width: 'auto' }}/>
                <Divider align="left" type="dashed">
                    <small>Lugares A mostrar</small>
                </Divider>
                <MultiSelect className='w-full BorderFormNewUser' options={params.lugaresRegistroOptions}value={dataOpcionesLugaresRegistro} onChange={(e) => {setDataOpcionesLugaresRegistro(e.value);setReload(reload+1)}} optionLabel="nombre_lugar" filter filterBy='nombre_lugar' placeholder="Seleccione Lugares" display="chip" />
            </TabPanel>
            <TabPanel header={<span className='font-normal'>Gráfica Edad</span>} className='flex justify-content-center'>
                <Chart type="doughnut" data={dataGraficaEdad} options={basicOptions} style={{ position: 'relative', width: 'auto' }} />
            </TabPanel>
        </TabView>

    </div>
  )
}

export default Graficas