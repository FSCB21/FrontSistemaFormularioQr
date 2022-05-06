export default (data) =>{
    let errors = {};

    console.log(data)
    if (!data.nombre_lugar_registro) 
        errors.nombre_lugar_registro = 'El nombre es obligatorio.';
    else if(!(data.nombre_lugar_registro.length  >= 4 && data.nombre_lugar_registro.length <= 35))
        errors.nombre_lugar_registro = 'El nombre debe estar entre 4 y 35 caracteres';

    return errors;
}