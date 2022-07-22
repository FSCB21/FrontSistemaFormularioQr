import React from 'react'
import { Button } from 'primereact/button'
import { OverlayPanel } from 'primereact/overlaypanel'
import classNames from 'classnames'
//Importamos libreria para la facil validacion de formulario
import { useFormik } from 'formik'
import SelectLugarRegistro from '../formNewUser/SelectLugarRegistro'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import validationNewIncentivo from '../../validations/validationNewIncentivo'
import IncentivosService from '../../service/IncentivosService'


const NewIncentivo = (params) => {
    let today = new Date()

    const incentivoService = new IncentivosService()
    const formik = useFormik({
        initialValues: {
            meta_incentivo: 0,
            fecha_inicio: '',
            fecha_corte: '',
            lugar_registro_fk: ''
        },
        validate: (data) => validationNewIncentivo(data),
        onSubmit: (data) => {
            incentivoService.create(data).then(res=>{
                params.toast.current.show({severity:'success', summary: 'FXA Te Informa', detail: res.data, life: 3000});
                params.opNew.current.hide()
                params.reloadPageChangeValue()
            })
        }
    });

    //Metodo valida si hay algun error en la validacion de formik
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    
    //Metodo que obtiene el mensaje de error segun el campo enviado por los parametros
    const getFormErrorMessage = (name) => {
      return isFormFieldValid(name) && <small className="p-error mb-2 block">{formik.errors[name]}</small>;
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
    <OverlayPanel ref={params.opNew} onHide={formik.resetForm} id="overlay_panel" style={{ width: '350px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }} breakpoints={{'640px': '90vw'}}>
        <h5 className='w-full text-center'>Crear Nuevo Incentivo</h5>
        
        
        <div className="col-12 mt-4">
            <span className="p-float-label p-input-icon-right w-full ">
                <SelectLugarRegistro value={formik.values.lugar_registro_fk} onChange={formik.handleChange}  className={'BorderFormNewUser w-full '+classNames({ 'p-invalid': isFormFieldValid('lugar_registro_fk') })}/>
                <label htmlFor="lugar_registro_fk" className={classNames({ 'p-error': isFormFieldValid('lugar_registro_fk') })}>Lugar Registro*</label>
            </span>
            {getFormErrorMessage('lugar_registro_fk')}
        </div>

        <div className="col-12 mt-3">
            <span className="p-float-label p-input-icon-right w-full ">
                <Calendar name='fecha_inicio'  className='w-full' dateFormat="dd/mm/yy" minDate={today} maxDate={formik.values.fecha_corte} yearRange={`${today.getFullYear()}:${today.getFullYear()+1}`} value={formik.values.fecha_inicio} onChange={formik.handleChange}  monthNavigator yearNavigator style={{ borderRadius: "100%" }}
                monthNavigatorTemplate={monthNavigatorTemplate} yearNavigatorTemplate={yearNavigatorTemplate} />
                <label htmlFor="fecha_inicio" className={classNames({ 'p-error': isFormFieldValid('fecha_inicio') })}>Fecha Inicio*</label>
            </span>
            {getFormErrorMessage('fecha_inicio')}
        </div>

        <div className="col-12 mt-3">
            <span className="p-float-label p-input-icon-right w-full ">
                <Calendar name='fecha_corte'  className='w-full' dateFormat="dd/mm/yy" minDate={formik.values.fecha_inicio} yearRange={`${today.getFullYear()}:${today.getFullYear()+1}`} value={formik.values.fecha_corte} onChange={formik.handleChange}  monthNavigator yearNavigator style={{ borderRadius: "100%" }}
                monthNavigatorTemplate={monthNavigatorTemplate} yearNavigatorTemplate={yearNavigatorTemplate} />
                <label htmlFor="fecha_corte" className={classNames({ 'p-error': isFormFieldValid('fecha_corte') })}>Fecha Corte*</label>
            </span>
            {getFormErrorMessage('fecha_corte')}
        </div>

        <div className="col-12 mt-3">
            <span className="p-float-label">
                <InputText id="meta_incentivo" type={'number'} name="meta_incentivo" value={formik.values.meta_incentivo} onChange={formik.handleChange} className={'BorderFormNewUser w-full '+classNames({ 'p-invalid': isFormFieldValid("meta_incentivo") })} />
                <label htmlFor="meta_incentivo" className={classNames({ 'p-error': isFormFieldValid("meta_incentivo") })}>Meta Incentivo*</label>
            </span>
            {getFormErrorMessage("meta_incentivo")}
        </div>
        
        <Button type='button' onClick={formik.handleSubmit} label='Guardar' className='mt-2 w-full'/>
    </OverlayPanel>
  )
}

export default NewIncentivo