import { Button } from 'primereact/button'
import React,{ useState, useEffect } from 'react'
import PhoneInput from 'react-phone-number-input'
import FormService from '../../service/FormService'

const DialogCodeSend = (params) => {

    const [ estadoBoton, setEstadoBoton ] = useState(true)
    const [ deshabilitarBoton, setDeshabilitarBoton ] = useState(0)

    useEffect(() => {
      setTimeout(()=>setEstadoBoton(false),60000)
      return () => {}
    }, [deshabilitarBoton])

    const sendSms = () =>{
        setEstadoBoton(true)
        setDeshabilitarBoton(deshabilitarBoton+1)
        const fomrService = new FormService()
        fomrService.errSendSms(newPhone).then(res=>{
            if(!res.data.error){
                params.toast.current.show({severity:'info', summary: 'FXA Te Informa', detail: res.data, life: 3000});
            }else if(res.data.error){
                params.toast.current.show({severity:'error', summary: 'FXA Te Informa', detail: res.data.error, life: 3000});
                
            }
        })
    }


    const [statePhoneInput, setStatePhoneInput] = useState(true)

    const [newPhone, setNewPhone] = useState(params.telefono_contacto)

    const formService = new FormService()

    const changeNumber = () =>{
        if(params.telefono_contacto === newPhone){
            params.toast.current.show({severity:'error', summary: 'FXA Te Informa', detail: 'El número de telefono no ha cambiado', life: 3000});
        }else{
            formService.changeNumber({old_telefono_contacto:params.telefono_contacto,telefono_contacto:newPhone}).then(res=>{
                params.toast.current.show({severity:'info', summary: 'FXA Te Informa', detail: res.data, life: 3000});
                setStatePhoneInput(true)
            })
        }
    }

    const setNumero2 =(e)=>{
        if(e)
            (!e.length>4) ? e = "" :

            setNewPhone(e)
    }
  return (
    <div>
        {statePhoneInput && <>
            <h5>El Código ha sido enviado</h5>
            <p>Se ha enviado el código de descuento al teléfono celular que aparece a continuación, si no te ha llegado el código puedes probar reenviarlo el boton se activa en un minuto.</p>
            {<PhoneInput
                className={"BorderFormNewUser mt-2 p-inputtext p-component"}
                disabled
                defaultCountry="CO"
                value={newPhone}
                onChange={setNumero2}
                countries={['CO']}
                />}
            <div className="w-full justify-content-center align-items-center grid">
                <Button type="button" onClick={()=>setStatePhoneInput(false)} label="Ese no es mi número" className='BorderFormNewUser p-button-link text-blue-700 mt-4'/>
                <Button type="button" disabled={estadoBoton} onClick={sendSms} label="Reenviar Código" className='BorderFormNewUser p-button-link text-purple-600 mt-4 mx-3'/>
                <Button type="button" onClick={()=>params.closeDialog()} label="Aceptar" className='BorderFormNewUser mt-4'/>
            </div>        
        </>}
        {!statePhoneInput && <>
            <h5>Cambiar Número De Teléfono</h5>
            <p>Cambia tu número de telefono en la siguiente sección, una vez realices el cambio da clic en "Reenviar Código".</p>
            {<PhoneInput
                className={"BorderFormNewUser mt-2 p-inputtext p-component"}
                defaultCountry="CO"
                countries={['CO']}
                value={newPhone}
                onChange={setNumero2}
                />}
            <div className="w-full justify-content-center align-items-center grid">
                <Button type="button" onClick={()=>setStatePhoneInput(true)} label="Volver Atras" className='BorderFormNewUser p-button-link text-purple-600 mt-4 mx-3'/>
                <Button type="button" onClick={changeNumber} label="Reenviar Código" className='BorderFormNewUser mt-4'/>
            </div>        
        </>}
    </div>
  )
}

export default DialogCodeSend