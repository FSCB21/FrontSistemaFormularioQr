import { Dropdown } from 'primereact/dropdown'
import React, { useEffect, useState } from 'react'
import LugarRegistroService from '../../service/LugarRegistroService';

const SelectLugarRegistro = (props) => {

    const [lugarRegistroSeleccionado, setLugarRegistroSeleccionadoo] = useState(null);

    const [lugares, setLugares] = useState([])

    useEffect(() => {
        const lugarRegistroService = new LugarRegistroService()
            
        lugarRegistroService.getAllActives().then(res=>setLugares(res.data))

        return () => {
            
        }
    }, [])

    const onLugarChange = (e) => {
        setLugarRegistroSeleccionadoo(e.value);
        props.onChange(e)
    }

  return (
    <Dropdown className={props.className} optionValue='id_lugar_registro' value={lugarRegistroSeleccionado} options={lugares} name="lugar_registro_fk" onChange={onLugarChange} optionLabel="nombre_lugar_registro" filter filterBy="nombre_lugar_registro"/>
  )
}

export default SelectLugarRegistro