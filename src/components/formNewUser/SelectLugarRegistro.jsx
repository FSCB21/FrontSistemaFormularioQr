/* Archivo que contiene el selector de lugar de registro */

//Importacion de componentes o librerias necesarias
import React, { useEffect, useState } from 'react'

//Importamos los compoenentes de estilo de primereact
import { Dropdown } from 'primereact/dropdown'

//Importamos el servicio de consultas al api
import LugarRegistroService from '../../service/LugarRegistroService';

//Definimos el compoenente a renderizar
const SelectLugarRegistro = (props) => {

    //Gancho que almacena el lugar de registro que es seleccionado por el usuario
    const [lugarRegistroSeleccionado, setLugarRegistroSeleccionadoo] = useState(null);

    //Gancho que almacena todos los lugares de registro
    const [lugares, setLugares] = useState([])

    //Metodo que consulta y asigna los lugares de registro al gancho
    useEffect(() => {
        const lugarRegistroService = new LugarRegistroService()
            
        lugarRegistroService.getAllActives().then(res=>setLugares(res.data))

        return () => {
            
        }
    }, [])

    //Funcion que establece el valor en las propiedades cada que este se cambia
    const onLugarChange = (e) => {
        setLugarRegistroSeleccionadoo(e.value);
        props.onChange(e)
    }

  //valor de retorno
  //En este caso es solo la etiqueta de seleccion
  return (
    <Dropdown 
      className={props.className} 
      optionValue='id_lugar_registro' 
      value={lugarRegistroSeleccionado} 
      options={lugares} 
      name="lugar_registro_fk" 
      onChange={onLugarChange} 
      optionLabel="nombre_lugar_registro" 
      filter filterBy="nombre_lugar_registro"
    />
    
  )
}

export default SelectLugarRegistro