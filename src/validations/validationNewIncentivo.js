const validationNewIncentivo = (data) =>{
    let errors = {};

    if(!data.lugar_registro_fk)
        errors.lugar_registro_fk = 'Definir un lugar de registro es obligatorio'

    if(!data.fecha_inicio)
        errors.fecha_inicio = 'Definir una fecha de inicio es obligatorio'
    else if(!(data.fecha_inicio <= data.fecha_corte))
        errors.fecha_inicio = 'La fecha de inicio debe ser menor o igual a la fecha de corte'

    if(!data.fecha_corte)
        errors.fecha_corte = 'Definir una fecha de corte es obligatorio'
    else if(!(data.fecha_corte >= data.fecha_inicio))
        errors.fecha_corte = 'La fecha de corte debe ser mayor o igual a la fecha de inicio'

    if(!data.meta_incentivo)
        errors.meta_incentivo = 'Definir una meta de incentivo es obligatorio'
    else if(!/^[0-9]+$/.test(data.meta_incentivo))
        errors.meta_incentivo = 'La meta de incentivo debe ser un número entero'
    
    return errors;
}

export default validationNewIncentivo