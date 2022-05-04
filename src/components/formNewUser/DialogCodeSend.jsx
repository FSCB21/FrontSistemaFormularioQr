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
        fomrService.errSendSms(params.telefono_contacto).then(res=>{
            if(!res.data.error){
                params.toast.current.show({severity:'info', summary: 'FXA Te Informa', detail: res.data, life: 3000});
            }else if(res.data.error){
                params.toast.current.show({severity:'error', summary: 'FXA Te Informa', detail: res.data.error, life: 3000});
                
            }
        })
    }

  return (
    <div>
        <p>Se ha enviado el código de descuento al teléfono celular que aparece a continuación, si no te ha llegado el código puedes probar reenviarlo el boton se activa en un minuto.</p>
        <PhoneInput
            international
            className={"BorderFormNewUser mt-2 p-inputtext p-component"}
            disabled
            defaultCountry="CO"
            value={params.telefono_contacto}
            />
        <div className="w-full justify-content-center align-items-center flex">
            <Button type="button" disabled={estadoBoton} onClick={sendSms} label="Reenviar Código" className='BorderFormNewUser p-button-link text-purple-600 mt-4 mr-4'/>
            <Button type="button" onClick={()=>params.closeDialog()} label="Aceptar" className='BorderFormNewUser mt-4'/>
        </div>
    </div>
  )
}

export default DialogCodeSend