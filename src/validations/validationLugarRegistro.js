/* Archivo que contiene las validaciones de el formulario de lugar de registro */

// Exportamos por defecto la funcion que va a validar el contenido del formulario
//Como parametros solicitamos la data del formulario
export default (data) =>{
    //Definimos un objeto el cual contendra todos los errores en dado caso que falle una validacion
    let errors = {};

    //Validamos si el nombre del lugar de registro existe
    if (!data.nombre_lugar_registro) 
        //si no tiene ningun valor retornamos mensaje de error
        errors.nombre_lugar_registro = 'El nombre es obligatorio.';
    //Si no, si el tamaño en caracteres del lugar de registro NO esta entre 4 y 35
    else if(!(data.nombre_lugar_registro.length  >= 4 && data.nombre_lugar_registro.length <= 35))
        //Retornara mensaje de error de el nombre tiene que estar en determinadorango de caracteres
        errors.nombre_lugar_registro = 'El nombre debe estar entre 4 y 35 caracteres';

    //Como resultado la funcion retornara el objeto errors
    return errors;
}