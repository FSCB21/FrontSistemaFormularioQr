const validationLogin = (data) =>{
    let errors = {};

    if (!data.nombre_usuario) 
        errors.nombre_usuario = 'El nombre de usuario es obligatorio.';
    
    if (!data.contraseña) 
        errors.contraseña = 'La contraseña es obligatoria.';

    return errors;
}

export default validationLogin