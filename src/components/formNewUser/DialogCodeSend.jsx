/* Archivo que almacena el contenido del dialogo que aparece al momento de registrarse en el sistema */

//Importacion de componentes o librerias necesarias
import React,{ useState, useEffect } from 'react'

//Importamos los compoenentes de estilo de primereact
import { Button } from 'primereact/button'

//Importamos el compoenente de estilado para el número de telefono
import PhoneInput from 'react-phone-number-input'

//Importamos el servicio de consultas al api
import FormService from '../../service/FormService'


//Definimos el compoenente a renderizar
const DialogCodeSend = (params) => {

    //Gancho que almacena si el boton de reenviar mensaje de texto esta activo o inactivo
    const [ estadoBoton, setEstadoBoton ] = useState(true)
    //Gancho encargado de volver a renderizar el estado del boton cada que cambie
    const [ deshabilitarBoton, setDeshabilitarBoton ] = useState(0)
    //Gancho que indica que compoenentes se deben mostrar
    const [statePhoneInput, setStatePhoneInput] = useState(true)
    //Gancho que almacena el nuevo numero de telefono si es que lo hay
    const [newPhone, setNewPhone] = useState(params.telefono_contacto)

    //Metodo que establece el estado del boton en falso despues de 1 minuto
    useEffect(() => {
      setTimeout(()=>setEstadoBoton(false),60000)
      return () => {}
    }, [deshabilitarBoton])

    //Funcion que envia un mensaje de texto y despues responde con mensaje de error o no
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


    const formService = new FormService()

    //Metodo que ejecuta la funcion de cambiar de núemro en el api, para que de esta manera se cambie el npumero del usuario si este lo puso mal
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

    //Metodo que cambia el valor del gancho de número de telefono
    const setNumero2 =(e)=>{
        if(e)
            (!e.length>4) ? e = "" :

            setNewPhone(e)
    }

    //Retornamos las etiquetas que se desean renderizar
  return (
    <div>
        {/* Mensaje de codigo enviado con exito */}
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
        {/* Seccion de cambiar el núemro de telefono */}
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