/* Archivo que valida el formilario de login, almenos que se rellenen los campos */

//Definimos la funcion que va a validar, pasandole como parametro la data del formulario
const validationLogin = (data) =>{

    //Definimos error el cual es el objeto que contendra 
    let errors = {};

    //Si nombre usaurio no tiene un valor
    if (!data.nombre_usuario) 
        //Retorne mensaje informando que el nombre de usaurio esta vacio
        errors.nombre_usuario = 'El nombre de usuario es obligatorio.';
    
    //Valide si la contraseña tiene un valor
    if (!data.contraseña) 
        //Si no, retorne mensaje de campo obligatorio
        errors.contraseña = 'La contraseña es obligatoria.';

    //Como respuesta de la funcion enviamos el objeto errors
    return errors;
}

//Exportamos la funcion para que esta sea usada en el formulario de login
export default validationLogin