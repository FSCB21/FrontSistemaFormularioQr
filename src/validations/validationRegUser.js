import { isPossiblePhoneNumber } from 'react-phone-number-input'
const validationRegUser = (data) =>{
    let errors = {};

    if (!data.nombres) 
        errors.nombres = 'Los Nombres Son Obligatorios.';
    else if(!(data.nombres.length >= 2 && data.nombres.length <= 30)  )
        errors.nombres = 'Los Nombres no pueden pasar de 30 caracteres.';

    if (!data.apellidos) 
        errors.apellidos = 'Los Apellidos Son Obligatorios.';
    else if(!(data.apellidos.length >= 2 && data.nombres.length <= 30)  )
        errors.apellidos = 'Los Apellidos no pueden pasar de 30 caracteres.';

    if (!data.correo_electronico) 
        errors.correo_electronico = 'El correo Electronico Es Obligatorio.';
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.correo_electronico)) 
        errors.correo_electronico = 'Direccion de correo electronico invalida.';
    
    
    if (!data.fecha_nacimiento) 
        errors.fecha_nacimiento = 'La fecha de nacimiento es obligatoria.';
    

    if (!data.telefono_contacto) 
        errors.telefono_contacto = 'El número de teléfono es obligatorio.';
    else if(!isPossiblePhoneNumber(data.telefono_contacto))
        errors.telefono_contacto = 'Formato de número no es posible.';
    

    if (!data.numero_doc) 
        errors.numero_doc = 'El número de documento es obligatorio.';
    else if(!(data.numero_doc.length >= 2 && data.nombres.length <= 25)  )
        errors.numero_doc = 'El número de documento no puede pasar de 25 caracteres.';

    if (!data.lugar_registro_fk) {
        errors.lugar_registro_fk = 'El lugar de registro es obligatorio.';
    }

    if (!data.accept) {
        errors.accept = 'Es necesario aceptar los terminos y condiciones.';
    }

    return errors;
}

export default validationRegUser