import axios from 'axios'
import classNames from 'classnames'
import { useFormik } from 'formik'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import React, { useRef, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useHistory } from 'react-router-dom'
import LoadPage from '../components/LoadPage'
import GenerateRandom from '../helpers/GenerateRandom'
import CredencialService from '../service/CredencialService'
import validationLogin from '../validations/validationLogin'

const LoginPage = () => {

    const credencialService = new CredencialService()

    const toast = useRef(null);

    const history = useHistory()

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        localStorage.removeItem('token-login')
      return () => {}
    }, [])
    

    const formik = useFormik({
        initialValues: {
            nombre_usuario: '',
            contraseña: ''
        },
        validate: (data) => validationLogin(data),
        onSubmit: (data) => {
            setLoading(true)
            credencialService.login(data).then(res=>{
                localStorage.setItem('token-login', res.data)
                axios.defaults.headers.common['token-login'] = res.data
                history.push('/dash/')
            }).catch(err=>{
                formik.resetForm()
                toast.current.show({severity:'error', summary: 'FXA Te Informa', detail: err.response.data, life: 3000});
            }).finally(()=>setLoading(false))
        }
    })

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error mb-2 block">{formik.errors[name]}</small>;
    };

    
    const [cookies, setCookie] = useCookies(['imgFormCookie']);
    const [bodyForm, setBodyForm] = useState(`bodyForm-image-${cookies.imgFormCookie?cookies.imgFormCookie:5}`)

    useEffect(() => {
        let i = cookies.imgFormCookie?parseInt(cookies.imgFormCookie):1

        
        let a = 1
        do {
            a = GenerateRandom(1,5)
        } while (i===a);

        setBodyForm(`bodyForm-image-${a}`)
        setCookie('imgFormCookie',a)
        return () => {
        };
    }, []);//eslint-disable-line

  return (<>
    <Toast ref={toast} />
    {loading && 
        <div className='relative h-screen w-full justify-content-center align-items-center flex'>
            <LoadPage/>
        </div>
    }
    {!loading &&
        <div className={'flex w-full h-screen justify-content-center align-items-center bodyForm '+bodyForm}>
            <div className="surface-card p-4 shadow-2 border-round w-10 sm:w-8 md:w-6 lg:w-4" style={{opacity:'0.9'}}>
        
                <div className="text-center mb-5">
                    <img src="images/logo-principal.svg" alt="hyper" height="50" className="mb-3" />
                    <div className="text-900 text-2xl font-medium mb-3">¡Bienvenido De Nuevo!</div>
                </div>

                <form onSubmit={formik.handleSubmit}>
                    
                    <label htmlFor="nombre_usuario" className={"block font-medium mb-2 mt-3 mx-3 " + classNames({ 'p-error': isFormFieldValid('nombre_usuario') })}>Usuario</label>
                    <InputText value={formik.values.nombre_usuario} onChange={formik.handleChange} 
                        id="nombre_usuario" type="text" className={'BorderFormNewUser w-full '+ classNames({ 'p-invalid': isFormFieldValid("nombre_usuario") })} />
                    {getFormErrorMessage('nombre_usuario')}

                    <label htmlFor="contraseña" className={"block font-medium mb-2 mt-3 mx-3 " + classNames({ 'p-error': isFormFieldValid('contraseña') })}>Contraseña</label>
                    <InputText value={formik.values.contraseña} onChange={formik.handleChange} 
                        id="contraseña" type="password" className={'BorderFormNewUser w-full '+classNames({ 'p-invalid': isFormFieldValid("contraseña") })} />
                    {getFormErrorMessage('contraseña')}

                    <Button label="Iniciar Sesion" type='submit' className="w-full BorderFormNewUser mt-4" />

                </form>
            </div>
        </div>
    }
</>)
}

export default LoginPage