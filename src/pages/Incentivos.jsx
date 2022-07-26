/* Archivo que almacena el contenido principal referente a los incentivos */

//Importacion de react y sus ganchos
import React, { useEffect, useRef, useState } from 'react'

//Importamos los componentes de estilos de plantilla
import { BreadCrumb } from 'primereact/breadcrumb'
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import { Toolbar } from 'primereact/toolbar';
import { ScrollPanel } from 'primereact/scrollpanel';

//Importamos el servicio para la consulta de informacion al apiS
import IncentivosService from '../service/IncentivosService';

//Importamos los componentes extras usados en el codigo
import LoadPage from '../components/LoadPage';

//Iconos
import { GiMoneyStack } from 'react-icons/gi'
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import DetallesIncentivo from '../components/incentivos/DetallesIncentivo';
import RetornarColorSegunPorcentaje from '../helpers/RetornarColorSegunPorcentaje';
import NuevoIncentivo from '../components/incentivos/NuevoIncentivo';
import { confirmDialog } from 'primereact/confirmdialog';
import EditarIncentivo from '../components/incentivos/EditarIncentivo';


const Incentivos = () => {

    //Creamos un gancho de estado para la ventana de carga, por defecto este gancho tiene un valor de false
    const [loading, setLoading] = useState(false)
    //Gancho que hace referencia a que seccion del incentivo se esta visualizando en el contenido
    const [verSeccionIncentivo, setVerSeccionIncentivo] = useState('1');
    //Gancho que almacena la informacion de los incentivos consultados
    const [dataIncentivos, setDataIncentivos] = useState([]);
    //Gancho para recargar el componente de manera manual
    const [realoadPage, setRealoadPage] = useState(0);

    const [displayDetallesIncentivo, setDisplayDetallesIncentivo] = useState(false)
    const [displayNuevoIncentivo, setDisplayNuevoIncentivo] = useState(false)

    const [displayEditarIncentivo, setDisplayEditarIncentivo] = useState(false)

    const toast = useRef(null);

    //Definicion del contenido del menu de miga de pan
    const itemsBreadCrumb = [
        { label: 'incentivos', url: '/#/dash/incentivos' }
    ];
    const homeBreadCrumb = { icon: 'pi pi-briefcase', url: '/#/dash' }

    const reloadPageChangeValue = () =>{
        setRealoadPage(realoadPage+1)
    }

    //Componente derecho del menu superior
    const rightToolbarContent = () =>{
        return <>
            <Button 
                icon='pi pi-plus' 
                label='Nuevo Incentivo' 
                className='hidden sm:block p-button-outlined' 
                tooltip='Crear una nueva meta de incentivo' 
                tooltipOptions={{position:'top'}}
                onClick={()=>setDisplayNuevoIncentivo(true)}
            />
            
            <Button 
                icon='pi pi-plus' 
                className='block sm:hidden p-button-outlined' 
                tooltip='Crear una nueva meta de incentivo' 
                tooltipOptions={{position:'top'}}
                onClick={()=>setDisplayNuevoIncentivo(true)}
            />
        </>
    }

    //Opciones del boton para cambiar la seccion de insentivo que se visualiza en el contenido
    const optionsVerSeccionIncentivo = [
        {label:'Finalizados', icon:'pi pi-check-circle', value:'3'},
        {label:'En Curso', icon:'pi pi-clock', value:'1'},
        {label:'Planeados', icon:'pi pi-calendar', value:'2'},
    ]

    //Formato de cada seccion del boton
    const templateVerSeccionIncentivo = (e) =>{
        return <>
          <span className='hidden md:block'>{e.label}</span>
  
          <i className={e.icon + ' ml-2'}/>
        </>
    }

    //Contenido izquierdo del menu superior
    const leftToolbarContent = () =>{
        return <SelectButton value={verSeccionIncentivo} unselectable={false} options={optionsVerSeccionIncentivo} optionValue='value' onChange={(e) => setVerSeccionIncentivo(e.value)} itemTemplate={templateVerSeccionIncentivo} optionLabel="value" />
    }


    //Metodo que consulta los incentivos segun el estado del gancho de verSeccionIncentivo
    useEffect(() => {

        const incentivoService = new IncentivosService()
        setLoading(true)
        incentivoService.getAllByState(verSeccionIncentivo).then(res=>{
            setDataIncentivos(res.data)
            setLoading(false)
        })
        return () => {
        };
    }, [verSeccionIncentivo, realoadPage]); 

    const incentivoService = new IncentivosService()

    const [dataDetallesIncentivo, setDataDetallesIncentivo] = useState({
                                                                        data:[],
                                                                        info:{
                                                                            titulo:'',
                                                                            descripcion:''
                                                                        }
                                                                    })

    const showDetallesIncentivo = (data) =>{
        setLoading(true)
        setDisplayDetallesIncentivo(true)
        incentivoService.getAllByIdIncentivoGeneral(data.id_incentivo_general).then(res=>{
            setDataDetallesIncentivo({data:res.data, info:data})
            setLoading(false)
        })
    }

    const BorrarIncentivoGeneral = id =>{
        incentivoService.delete(id).then(res=>{
            toast.current.show({severity:'warn', summary: 'FXA Te Informa', detail: res.data, life: 3000});
            reloadPageChangeValue()
        })
    }

    const AbrirVentanaConfirmacionBorrarIncentivo = id => {
        confirmDialog({
            message: '¿Está seguro de eliminar esta meta de incentivo a nivel general?',
            header: 'Borrar Incentivo General',
            position:'bottom',
            icon: 'pi pi-exclamation-triangle',
            accept:()=>BorrarIncentivoGeneral(id),
            acceptLabel:'Continuar'
        });
    };
    
  return (
    <div className="grid">

        {/* Etiqueta de mensajes la cual solo con definirla se puede hacer usod e todos los metodos que esta dispone */}
        <Toast ref={toast} />

        {/* Encabezado de pagina */}
        <div className='col-12 card grid justify-content-between align-items-center ml-1'>
            <div className='h-full flex justify-content-between align-items-cente'>
                <h4 className='inline-block my-0'><GiMoneyStack className='text-green-500 text-4xl mx-1' />Incentivos<GiMoneyStack className='text-green-500 text-4xl mx-1' /></h4>
            </div>
            <BreadCrumb className='inline-block mx-4 p-1' style={{ border: 'none' }} model={itemsBreadCrumb} home={homeBreadCrumb} />
        </div>

        {/* Menu superior */}
        <Toolbar className="mb-4 col-12" left={leftToolbarContent} right={rightToolbarContent} />
    
        {/* Componente de carga */}
        {loading && <>
                <div className='relative w-full justify-content-center align-items-center flex'>
                    <LoadPage />
                </div>
        </>}

        {!loading && <>
            {/* Seccion de graficas */}
            <div className='col-12 md:col-6'>
                Graficas
            </div>

            {/* Seccion de contenido de consulta */}
            <ScrollPanel className='col-12 md:col-6' style={{ maxHeight: '80vh' }}>
                <ul className="list-none p-0 m-0">

                    {
                        dataIncentivos.map((el,id)=>{
                            let porcentajes = parseInt(el.total_registros*100)/parseInt(el.meta_incentivo)
                            return (
                                <li key={id} className='card pt-2 pl-2 p-0 m-0 mb-4'>
                                    <div className='grid aling-items-between '>
                                        <div className='col-5 sm:col-7'>
                                            <span className="text-900 font-medium mr-2 mb-1 md:mb-0">{el.titulo}</span>
                                            <div className="mt-1 text-600">{el.total_registros} registros de {el.meta_incentivo}</div>
                                        </div>
                                        <div className='col-7 sm:col-5'>
                                            <div className="mt-1 text-800">
                                                Desde: <span className='text-purple-600'>{el.fecha_inicio}</span>
                                            </div>
                                            <div className="mt-1 text-800 ">
                                                Hasta: <span className='text-purple-600'>{el.fecha_corte}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='grid'>
                                        <div className="mt-2 md:mt-0 flex align-items-center col-6 sm:col-7 ">
                                            <div className="surface-300 border-round overflow-hidden w-10" style={{height: '11px'}}>
                                            <div className={`bg-${RetornarColorSegunPorcentaje(porcentajes)} h-full`} style={{width: `${porcentajes}%`}}/>
                                        </div>
                                            <span className={`text-${RetornarColorSegunPorcentaje(porcentajes)} ml-3 font-medium`}>%{Math.trunc(porcentajes)}</span>
                                        </div>
                                        <div className='col-6 sm:col-5'>
                                            <Button className='p-button-text p-button-info' onClick={()=>showDetallesIncentivo(el)}  icon='pi pi-eye'/>
                                            <Button className='p-button-text p-button-danger' onClick={()=>AbrirVentanaConfirmacionBorrarIncentivo(el.id_incentivo_general)} icon='pi pi-trash'/>
                                        </div>
                                    </div>
                                </li>
                            )
                        })
                    }

                </ul>
            </ScrollPanel>
        </>}

        {/* Componente emergente para crear un nuevo incentivo */}
        <Dialog header="Nueva Meta de incentivo" visible={displayNuevoIncentivo} className="w-11 sm:w-10 md:w-8 xl:w-5" onHide={() => setDisplayNuevoIncentivo(false)}>
                <NuevoIncentivo toast={toast} reloadPageChangeValue={reloadPageChangeValue} ocultarVentanaDialogo={()=>setDisplayNuevoIncentivo(false)}/> 
        </Dialog>

        {/* Componente emergente para editar un incentivo */}
        <Dialog header={`Editando Incentivo: ${dataDetallesIncentivo.info.titulo}`} visible={displayEditarIncentivo} className="w-11 sm:w-10 md:w-8 xl:w-5" onHide={() => setDisplayEditarIncentivo(false)}>
               <EditarIncentivo reloadPageChangeValue={reloadPageChangeValue} dataDetallesIncentivo={dataDetallesIncentivo} toast={toast} esconderDialogoEditar={()=>setDisplayEditarIncentivo(false)}/>
        </Dialog>

        <Dialog header={!loading?dataDetallesIncentivo.info.titulo:"Cargando..."} visible={displayDetallesIncentivo} className="w-11 md:w-9 xl:w-6" onHide={() => setDisplayDetallesIncentivo(false)}>
            <DetallesIncentivo dataDetallesIncentivo={dataDetallesIncentivo} setDisplayDetallesIncentivo={setDisplayDetallesIncentivo} reloadPageChangeValue={reloadPageChangeValue} loading={loading} toast={toast}  showDetallesIncentivo={showDetallesIncentivo} setDisplayEditarIncentivo={setDisplayEditarIncentivo}/>
        </Dialog>

    </div>

    
  )
}

export default Incentivos