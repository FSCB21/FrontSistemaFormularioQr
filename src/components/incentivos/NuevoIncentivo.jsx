import React, { useEffect, useState } from 'react'
import { Steps } from 'primereact/steps';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';
import { useFormik } from 'formik';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Divider } from 'primereact/divider';
import { InputSwitch } from 'primereact/inputswitch';
import { MultiSelect } from 'primereact/multiselect';
import { Message } from 'primereact/message';

import { validationNewIncentivo } from '../../validations/validationIncentivo'
import LugarRegistroService from '../../service/LugarRegistroService';
import IncentivosService from '../../service/IncentivosService';
const NuevoIncentivo = (params) => {

    let today = new Date()
    const [activeStep, setActiveStep] = useState(0)

    const itemsSteps = [
        {label:"Detalles Incentivo"},
        {label:"Relacionar Lugares"},
        {label:"Personalizar Metas"}
    ]

    const formik = useFormik({
       initialValues: {
            titulo:'',
            descripcion:'',
            meta_incentivo:'',
            fecha_inicio:today,
            fecha_corte:new Date(`${today.getFullYear()}-${today.getMonth()+2}-${today.getDate()}`),
        },
       validate: (data) => validationNewIncentivo(data),
       onSubmit: () => {
        setActiveStep(activeStep+1)
       }
   });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const monthNavigatorTemplate=(e)=> {
        return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} style={{ lineHeight: 1 }} />;
    }

    const yearNavigatorTemplate=(e)=> {
        let array = []
        e.options.forEach((_el,id) => {
            array.push(e.options[e.options.length - (id+1)])
        });
        return <Dropdown value={e.value} options={array} onChange={(event) => e.onChange(event.originalEvent, event.value)} className="p-ml-2" style={{ lineHeight: 1 }} />;
    }


    const [valorSwitchLugaresRelacionados, setValorSwitchLugaresRelacionados] = useState(true)

    const [lugaresSeleccionadosIncentivo, setLugaresSeleccionadosIncentivo] = useState([])

    const [lugaresRegistroActivos, setLugaresRegistroActivos] = useState([])

    useEffect(() => {
        let lugarRegistroService = new LugarRegistroService()
        lugarRegistroService.getAllActives().then(res=>{
            setLugaresRegistroActivos(res.data)
            setLugaresSeleccionadosIncentivo(res.data)
        })
        return () => {
        };
    }, []);


    const toggleLugaresIncentivo = (value) =>{
        setValorSwitchLugaresRelacionados(value)
        setLugaresSeleccionadosIncentivo(value?[...lugaresRegistroActivos]:[])
    }

    const [valorCumplimiento, setValorCumplimiento] = useState(0)

    const comprobarLugaresElejidos = () =>{
        if(lugaresSeleccionadosIncentivo[0]){
            setActiveStep(activeStep+1)
            setValorCumplimiento(Math.ceil(formik.values.meta_incentivo/lugaresSeleccionadosIncentivo.length))
            setLugaresRegistroPersonalizado([])
            setValorSwitchLugarMeta(false)
        }
        else 
            params.toast.current.show({severity:'error', summary: 'FXA Te Informa', detail: "No se ha elegido algun lugar para cumplir la meta", life: 3000});
    }

    const siguientePagina = () =>{
        switch (activeStep) {
            case 0:
                formik.submitForm()
                break;
            case 1:
                comprobarLugaresElejidos()
                break;

            case 2:
                crearNuevoIncentivoGeneral()
                break;
        
            default:
                break;
        }
    }

    const [valorSwitchLugarMeta, setValorSwitchLugarMeta] = useState(false)

    const toggleLugarMeta = (value) =>{
        setValorSwitchLugarMeta(value)
    }

    const [lugaresRegistroPersonalizado, setLugaresRegistroPersonalizado] = useState([])

    const establecerNuevaMetaLugar = (e, id) =>{
        let array = [...dataLugaresMetaDefinida]
        array[id].meta_a_cumplir =  e.target.value
        setDataLugaresMetaDefinida(array)
    }


    const [dataLugaresMetaDefinida, setDataLugaresMetaDefinida] = useState([])
    const establecerLugaresCampoMetaACumplir = (value)=>{
        let arreglo = []
        value.forEach(el=>{
            arreglo.push({lugar_registro_fk:el.id_lugar_registro, meta_a_cumplir:valorCumplimiento})
        })
        setDataLugaresMetaDefinida(arreglo)
        setLugaresRegistroPersonalizado(value)
    }

    const incentivoService = new IncentivosService()
    const crearNuevoIncentivoGeneral = () =>{

        let arregloLugaresCompleto = lugaresSeleccionadosIncentivo.filter(el => {
            let i = el
            dataLugaresMetaDefinida.forEach(elMetaDef => {
                if(el.id_lugar_registro === elMetaDef.lugar_registro_fk){
                    i=-1
                }
            });
            return i !== -1
        })

        let arreglo_lugares = []

        arregloLugaresCompleto.forEach(el => {
            arreglo_lugares.push(el.id_lugar_registro)
        });
       
        let data = {
            ...formik.values,
            arreglo_lugares_meta_definida: dataLugaresMetaDefinida,
            arreglo_lugares
        }
        
        incentivoService.create(data).then(res=>{
            params.toast.current.show({severity:'success', summary: 'FXA Te Informa', detail: res.data, life: 3000});
            params.reloadPageChangeValue()
            params.ocultarVentanaDialogo()
        })
    }

  return (
    <div>

        <Steps className='hidden sm:block' model={itemsSteps} activeIndex={activeStep}/>

        {activeStep === 0 && 
            <div className='grid mt-2'>
                
                <Divider align="left" type="dashed">
                    Nuevo Incentivo General
                </Divider>

                <div className="col-12 mt-2">
                    <span className="p-float-label">
                        <InputText id="titulo" name="titulo" value={formik.values.titulo} onChange={formik.handleChange} className={'text-center BorderFormNewUser w-full text-xl '+classNames({ 'p-invalid': isFormFieldValid("titulo") })} />
                        <label htmlFor="titulo" className={classNames({ 'p-error': isFormFieldValid("titulo") })}>Titulo Incentivo*</label>
                    </span>
                    {getFormErrorMessage("titulo")}
                </div>

                <div className="col-12 mt-4 ">
                    <span className="p-float-label">
                        <InputTextarea  id="descripcion" name="descripcion" autoResize rows={4}  value={formik.values.descripcion} onChange={formik.handleChange} className={'BorderFormNewUser w-full '+classNames({ 'p-invalid': isFormFieldValid("descripcion") })} />
                        <label htmlFor="descripcion" className={classNames({ 'p-error': isFormFieldValid("descripcion") })}>Descripcion*</label>
                    </span>
                    {getFormErrorMessage("descripcion")}
                </div>

                <div className="col-12 mt-4 ">
                    <span className="p-float-label">
                        <InputText id="meta_incentivo" name="meta_incentivo" type={'number'} value={formik.values.meta_incentivo} onChange={formik.handleChange} className={'BorderFormNewUser w-full '+classNames({ 'p-invalid': isFormFieldValid("meta_incentivo") })} />
                        <label htmlFor="meta_incentivo" className={classNames({ 'p-error': isFormFieldValid("meta_incentivo") })}>Meta Incentivo Total*</label>
                    </span>
                    {getFormErrorMessage("meta_incentivo")}
                </div>

                <div className="col-12 sm:col-6 mt-4">
                    <span className="p-float-label">
                        <Calendar dateFormat="dd/mm/yy" name="fecha_inicio" yearRange={`${today.getFullYear()}:${today.getFullYear()+3}`} id="fecha_inicio" value={formik.values.fecha_inicio} onChange={formik.handleChange}  monthNavigator yearNavigator style={{ borderRadius: "100%" }} className={'w-full  '+classNames({ 'p-invalid': isFormFieldValid('fecha_inicio') })}
                            readOnlyInput monthNavigatorTemplate={monthNavigatorTemplate} yearNavigatorTemplate={yearNavigatorTemplate}  minDate={today} maxDate={formik.values.fecha_corte}/>
                        <label htmlFor="fecha_inicio"  className={classNames({ 'p-error': isFormFieldValid('fecha_inicio') })}>Fecha Inicio</label>
                    </span>
                    {getFormErrorMessage('fecha_inicio')}
                </div>

                <div className="col-12 sm:col-6 mt-4">
                    <span className="p-float-label">
                        <Calendar dateFormat="dd/mm/yy" name="fecha_corte" yearRange={`${today.getFullYear()}:${today.getFullYear()+3}`} id="fecha_corte" value={formik.values.fecha_corte} onChange={formik.handleChange}  monthNavigator yearNavigator style={{ borderRadius: "100%" }} className={'w-full  '+classNames({ 'p-invalid': isFormFieldValid('fecha_corte') })}
                            readOnlyInput monthNavigatorTemplate={monthNavigatorTemplate} yearNavigatorTemplate={yearNavigatorTemplate}  minDate={formik.values.fecha_inicio}/>
                        <label htmlFor="fecha_corte" className={classNames({ 'p-error': isFormFieldValid('fecha_corte') })}>Fecha Corte</label>
                    </span>
                    {getFormErrorMessage('fecha_corte')}
                </div>

            </div>
        }

        {activeStep===1 && 
            <div className='mt-2'>
                <h6>Relacionar Todos Los Lugares</h6>
                <InputSwitch checked={valorSwitchLugaresRelacionados} onChange={(e) => toggleLugaresIncentivo(e.value)} />
                {!valorSwitchLugaresRelacionados && <div>
                    <Divider />
                    <h6>Seleccione los lugares a relacionar para cumplir la meta</h6>
                    <MultiSelect className='w-12 h-auto' value={lugaresSeleccionadosIncentivo} options={lugaresRegistroActivos} onChange={(e) => setLugaresSeleccionadosIncentivo(e.value)} optionLabel="nombre_lugar_registro" placeholder="Lugares De registro" emptyFilterMessage='No se encontro algun registro que coincida con este nombre 😕' filter/>    
                </div>}
            </div>
        }
        {activeStep===2 && 
            <div className='mt-2'>
                <Message severity="info" className='w-full mb-4' text={`Todos los lugares deben cumplir con un total de ${valorCumplimiento} registros`} />
                <h6>Personalizar cumplimiento</h6>
                <InputSwitch checked={valorSwitchLugarMeta} onChange={(e) => toggleLugarMeta(e.value)} />
                {valorSwitchLugarMeta && <div>
                    <Divider />
                    <h6>Seleccione los lugares para perzonalizar el cumplimiento</h6>
                    <MultiSelect className='w-12 h-auto' value={lugaresRegistroPersonalizado} options={lugaresSeleccionadosIncentivo} onChange={(e) => establecerLugaresCampoMetaACumplir(e.value)} optionLabel="nombre_lugar_registro" placeholder="Lugares De registro" emptyFilterMessage='No se encontro algun registro que coincida con este nombre 😕' filter/>    
                    {
                        lugaresRegistroPersonalizado.map((el,id)=>{
                            return <div key={id}>
                                <Divider />
                                <span className='text-pink-700'>{el.nombre_lugar_registro}</span>
                                <div className='mx-2'>
                                    Debe cumplir con esta cantidad de registros:
                                </div>
                                <InputText type={'number'} value={dataLugaresMetaDefinida[id].meta_a_cumplir} onChange={e=>establecerNuevaMetaLugar(e,id)} className='BorderFormNewUser w-12 sm:w-6 mt-2' />
                                
                            </div>
                        })
                    }
                </div>}
            </div>
        }

        <Button className='mt-4 mx-2 p-button-secondary' label='Anterior' onClick={()=>setActiveStep(activeStep-1)} disabled={activeStep===0?true:false}/>
        <Button className='mt-4' label={!(activeStep===(itemsSteps.length-1))?'Siguiente':'Enviar'} onClick={siguientePagina}/>

    </div>
  )
}

export default NuevoIncentivo