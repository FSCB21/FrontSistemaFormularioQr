
import React, { useRef, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { classNames } from 'primereact/utils';
import validationRegUser from '../validations/validationRegUser';
import SelectLugarRegistro from '../components/formNewUser/SelectLugarRegistro';
import FormService from '../service/FormService';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import PhoneInput from 'react-phone-number-input'
import { Card } from 'primereact/card';
import "../components/formNewUser/stylesForm.css"
import Terms from '../components/formNewUser/Terms';
import 'react-phone-number-input/style.css'
import LoadPage from '../components/LoadPage';
import DialogCodeSend from '../components/formNewUser/DialogCodeSend';
import ViewsCounterService from '../service/ViewsCounterService';

const FormNewUser = () => {

    useEffect(() => {
        const viewsCounterService = new ViewsCounterService()
        viewsCounterService.newPageVisit('FormRegister').then()
      return () => {
      }
    }, [])
    

    let today = new Date()
    const toast = useRef(null);

    const formService = new FormService()

    const [displayBasic, setDisplayBasic] = useState(false);
    const [displaySendSms, setDisplaySendSms] = useState(false);

    const formik = useFormik({
        initialValues: {
            nombres: '',
            apellidos: '',
            correo_electronico: '',
            fecha_nacimiento: false,
            telefono_contacto:'',
            numero_doc:'',
            lugar_registro_fk:'',
            accept: false
        },
        validate: (data) => validationRegUser(data),
        onSubmit: (data) => {
            setLoading(true)
            formService.newUser(data).then(res=>{
                
                if(res.data.errors){
                    setLoading(false)
                    res.data.errors.forEach(el => {
                        toast.current.show({severity:'error', summary: 'FXA Te Informa', detail: el.msg, life: 3000});
                    });
                }else if(res.data.error){
                    setLoading(false)
                    toast.current.show({severity:'error', summary: 'FXA Te Informa', detail: res.data.error, life: 3000});
                    
                }else{
                    setLoading(false)
                    setDisplaySendSms(true)
                    toast.current.show({severity:'success', summary: 'FXA Te Informa', detail: res.data.message, life: 3000});
                }
                   
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
        return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} className="p-ml-2" style={{ lineHeight: 1 }} />;
    }

    const [loading, setLoading] = useState(false)


    const setNumero2 =(e)=>{

        if(e)
            (!e.length>4) ? e = "" :
        
        formik.setValues({
            ...formik.values,
            telefono_contacto:e?e:""
        })
    }
    
    return (
        <div className={'relative w-full justify-content-center align-items-center flex bodyForm bodyForm-image-4'}>
            <Toast ref={toast} />
            {loading && <div className='relative h-screen w-full justify-content-center align-items-center flex'>
                <LoadPage/>
            </div>}
            {!loading &&
            <div className='w-10 xl:w-5'>
                <div className="flex w-full justify-content-center align-items-center flex-column my-4">
                    <img src="images/logo-principal.svg" alt="" className='w-4'/>
                    <p className='text-pink-800 font-bold'>Bienvenid@ A Nuestra Familia Fuxia!</p>
                </div>
                <Card className='cardForm mb-6 BorderFormNewUser'>
                    <p className='text-center mx-3 my-0 text-pink-600 font-medium'>Recuerda llenar todos los campos de manera adecuada para obtener tu codigo de descuento de FXA</p>
                    <form onSubmit={formik.handleSubmit} className="grid">

                        <div className="col-12 sm:col-6 mt-6">
                            <span className="p-float-label">
                                <InputText id="nombres" name="nombres" value={formik.values.nombres} onChange={formik.handleChange} autoFocus className={'BorderFormNewUser w-full '+classNames({ 'p-invalid': isFormFieldValid("nombres") })} />
                                <label htmlFor="nombres" className={classNames({ 'p-error': isFormFieldValid("nombres") })}>Nombres*</label>
                            </span>
                            {getFormErrorMessage("nombres")}
                        </div>

                        
                        <div className="col-12 sm:col-6 mt-6">
                            <span className="p-float-label">
                                <InputText id="apellidos" name="apellidos" value={formik.values.apellidos} onChange={formik.handleChange} className={'BorderFormNewUser w-full '+classNames({ 'p-invalid': isFormFieldValid("apellidos") })} />
                                <label htmlFor="apellidos" className={classNames({ 'p-error': isFormFieldValid("apellidos") })}>Apellidos*</label>
                            </span>
                            {getFormErrorMessage("apellidos")}
                        </div>

                        <div className="col-12 sm:col-6 mt-4">
                            <span className="p-float-label w-full ">
                                <InputText id="correo_electronico" name="correo_electronico" value={formik.values.correo_electronico} onChange={formik.handleChange} className={'BorderFormNewUser w-full '+classNames({ 'p-invalid': isFormFieldValid('correo_electronico') })} />
                                <label htmlFor="correo_electronico" className={classNames({ 'p-error': isFormFieldValid('correo_electronico') })}>Correo Electrónico*</label>
                            </span>
                            {getFormErrorMessage('correo_electronico')}
                        </div>

                        <div className="col-12 sm:col-6 mt-4">
                            <span className="p-float-label">
                                <InputText id="numero_doc" name="numero_doc" value={formik.values.numero_doc} onChange={formik.handleChange} className={'BorderFormNewUser w-full '+classNames({ 'p-invalid': isFormFieldValid("numero_doc") })} />
                                <label htmlFor="numero_doc" className={classNames({ 'p-error': isFormFieldValid("numero_doc") })}>Número Documento*</label>
                            </span>
                            {getFormErrorMessage("numero_doc")}
                        </div>

                        <div className="col-12 sm:col-6 mt-4">
                            <span className="p-float-label">
                                <Calendar dateFormat="dd/mm/yy" name="fecha_nacimiento" yearRange={`${today.getFullYear()-101}:${today.getFullYear()-14}`} id="fecha_nacimiento" value={formik.values.fecha_nacimiento} onChange={formik.handleChange}  monthNavigator yearNavigator style={{ borderRadius: "100%" }} className={'w-full  '+classNames({ 'p-invalid': isFormFieldValid('fecha_nacimiento') })}
                                    readOnlyInput monthNavigatorTemplate={monthNavigatorTemplate} yearNavigatorTemplate={yearNavigatorTemplate} />
                                <label htmlFor="fecha_nacimiento"  className={classNames({ 'p-error': isFormFieldValid('fecha_nacimiento') })}>Fecha Nacimiento</label>
                            </span>
                            {getFormErrorMessage('fecha_nacimiento')}
                        </div>

                        <div className="col-12 sm:col-6 mt-4">
                            <span className="p-float-label p-input-icon-right w-full ">
                                <SelectLugarRegistro value={formik.values.lugar_registro_fk} onChange={formik.handleChange}  className={'BorderFormNewUser w-full '+classNames({ 'p-invalid': isFormFieldValid('lugar_registro_fk') })}/>
                                <label htmlFor="lugar_registro_fk" className={classNames({ 'p-error': isFormFieldValid('lugar_registro_fk') })}>Lugar Registro*</label>
                            </span>
                            {getFormErrorMessage('lugar_registro_fk')}
                        </div>

                        <div className="col-12 ">
                                <label htmlFor="telefono_contacto" className={"mx-3 "+classNames({ 'p-error': isFormFieldValid('telefono_contacto') })}>Número Contacto*</label>
                                <PhoneInput
                                    international
                                    id="telefono_contacto" 
                                    className={"BorderFormNewUser mt-2 p-inputtext p-component "+classNames({ 'p-invalid': isFormFieldValid('telefono_contacto') })}
                                    name="telefono_contacto"
                                    defaultCountry="CO"
                                    value={formik.values.telefono_contacto}
                                    onChange={setNumero2}
                                    />
                            {getFormErrorMessage('telefono_contacto')}
                        </div>

                        <div className="field-checkbox col-12 mt-3">
                            <Checkbox inputId="accept" name="accept" checked={formik.values.accept} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('accept') })} />
                            <label htmlFor="accept" className={classNames({ 'p-error': isFormFieldValid('accept') })}>Acepto los <span className='p-link text-blue-500' onClick={()=>setDisplayBasic(true)}>terminos y condiciones</span> de uso del sistema*</label>
                        </div>

                        <div className="col-12 flex justify-content-center align-items-center">
                            <Button type="submit" label="Generar Codigo" className='BorderFormNewUser'/>
                        </div>

                    </form>
                </Card>
            </div>
            }

            <Dialog closable={false} visible={displaySendSms} className="w-11 md:w-8 xl:w-5" onHide={() => {setDisplaySendSms(false);formik.resetForm()}}>
                <DialogCodeSend telefono_contacto={formik.values.telefono_contacto} closeDialog={() => {setDisplaySendSms(false);formik.resetForm()}} toast={toast}/>
            </Dialog>

            <Dialog header="Términos Y Condiciones" visible={displayBasic} className="w-11 md:w-8 xl:w-5" onHide={() => setDisplayBasic(false)}>
                <Terms/>
            </Dialog>
        </div>
    );
}

export default FormNewUser