import classNames from 'classnames'
import { useFormik } from 'formik'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import React, { useEffect, useState } from 'react'
import IncentivosService from '../../service/IncentivosService'
import { validationNewIncentivo } from '../../validations/validationIncentivo'

const EditarIncentivo = (params) => {

    const today = new Date()

    /* const [dataUpdate, setDataUpdate] = useState({}) */

    useEffect(() => {
       /*  setDataUpdate(params.dataDetallesIncentivo) */
        formik.setValues({
            titulo:params.dataDetallesIncentivo.info.titulo,
            descripcion:params.dataDetallesIncentivo.info.descripcion,
            meta_incentivo:params.dataDetallesIncentivo.info.meta_incentivo,
            fecha_inicio:new Date(params.dataDetallesIncentivo.info.fecha_inicio),
            fecha_corte:new Date(params.dataDetallesIncentivo.info.fecha_corte),
        })
        return () => {
        };
    }, [params.dataDetallesIncentivo]); //eslint-disable-line

    const incentivoService = new IncentivosService()

    const formik = useFormik({
        initialValues: {
             titulo:'',
             descripcion:'',
             meta_incentivo:'',
             fecha_inicio:new Date(),
             fecha_corte:new Date(),
         },
        validate: (data) => validationNewIncentivo(data),
        onSubmit: (data) => {
            data.id_incentivo = params.dataDetallesIncentivo.info.id_incentivo_general

            incentivoService.update(data, 1).then(res=>{
                params.toast.current.show({severity:'success', summary: 'FXA Te Informa', detail: res.data, life: 3000});
                params.esconderDialogoEditar()
                params.reloadPageChangeValue()
            })
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

  return (
    <div className='grid mt-2'>
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

                <div className="mt-3">
                    <Button label='Actualizar Lugares' className='p-button-info mx-3'/>
                    <Button label='Guardar' onClick={formik.submitForm} className='p-button-success'/>
                </div>

            </div>
  )
}

export default EditarIncentivo