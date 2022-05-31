import React from 'react'

import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';

import './ConfigCredentials.css'

//Icons
import { FaUserShield } from 'react-icons/fa'
import { Button } from 'primereact/button';
import { useFormik } from 'formik';
import validationChangePass from '../../validations/validationChangePass';
const ConfigCredentials = () => {

    const formik = useFormik({
        initialValues: {
            nombre_usuario: '',
            contraseña: '',
            nueva_contraseña:''
        },
        validate: (data) => validationChangePass(data),
        onSubmit: (data) => {
           console.log(data)
        }
    })


    const rols = [
        {label: 'Admin', icon:()=><FaUserShield/>, value:'1'},
        {label: 'Analista', icon:()=><FaUserShield/>, value:'2'},
        {label: 'Tecnología', icon:()=><FaUserShield/>, value:'3'},
    ]

    const itemTemplate = option =>{
        return (<>
            <span className='mx-2'>{option.label}</span>
            {option.icon()}
        </>)
    }

    const headerPass = <h6>Contraseña</h6>;
    const footerPass = (
        <React.Fragment>
        <Divider />
        <p className="mt-2">Condiciones de seguridad:</p>
        <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: "1.5" }}>
            <li>Se necesita una letra minuscula</li>
            <li>Se necesita una letra mayuscula</li>
            <li>Se necesita un numero</li>
            <li>Minimo 8 caracteres</li>
            <li>Maximo 16 caracteres</li>
        </ul>
        </React.Fragment>
    );


    return (
    <div className='grid'>
        <label htmlFor="contraseña" className={"block mb-2 mt-3 mx-3 "/*  + classNames({ 'p-error': isFormFieldValid('contraseña') }) */}>Contraseña Admin</label>
        <InputText value={formik.values.contraseña} onChange={formik.handleChange} 
            id="contraseña" type="password" tooltip='Digite la contraseña de administrador' tooltipOptions={{position:'top'}} className={'BorderFormNewUser w-full '/* +classNames({ 'p-invalid': isFormFieldValid("contraseña") }) */} />
       {/*  {getFormErrorMessage('contraseña')} */}

        <label className='block mb-2 mt-3 mx-3'>Seleccione el rol a cambiar la contraseña</label>
        <Dropdown className='w-full BorderFormNewUser' value={formik.values.nombre_usuario} name='nombre_usuario' options={rols} itemTemplate={itemTemplate} onChange={formik.handleChange} tooltip="Seleccione un rol" tooltipOptions={{position:'top'}}/>
        
        <label htmlFor="contraseña" className={"block mb-2 mt-3 mx-3 "/*  + classNames({ 'p-error': isFormFieldValid('contraseña') }) */}>Nueva Contraseña</label>
        <Password 
        value={formik.values.nueva_contraseña}
        name="nueva_contraseña"
        toggleMask
        promptLabel="Ingrese la contraseña"
        weakLabel="Poco Segura"
        mediumLabel="Medianamente Segura"
        strongLabel="Muy Segura"
        onChange={formik.handleChange}
        header={headerPass}
        content=""
        footer={footerPass}
        className={'BorderFormNewUser w-full config-credentials'} />
       {/*  {getFormErrorMessage('contraseña')} */}
       <Button label='Cambiar Contraseña' onClick={()=>formik.submitForm()} className='BorderFormNewUser mt-4 w-full' />
    </div>
  )
}

export default ConfigCredentials