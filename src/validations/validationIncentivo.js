export const validationNewIncentivo = (data) =>{
    let errors = {};

    if(!data.titulo)
        errors.titulo = 'Definir un titulo es obligatorio'
    else if(!(data.titulo.length>=4 && data.titulo.length<31))
        errors.titulo = 'El titulo tiene que estar entre 4 y 30 caracteres'

    if(data.descripcion)
        if(!(data.descripcion.length>=4 && data.descripcion.length<300))
        errors.descripcion = 'La descripcion tiene que estar entre 4 y 300 caracteres'
    

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
