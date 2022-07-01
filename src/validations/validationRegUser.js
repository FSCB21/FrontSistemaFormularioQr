import { isPossiblePhoneNumber } from 'react-phone-number-input'
const validationRegUser = (data) =>{
    let errors = {};

    if (!data.nombres) 
        errors.nombres = 'Los Nombres Son Obligatorios.';
    else if(!/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/.test(data.nombres))
        errors.nombres = 'Los Nombres solo pueden contener caracteres de texto validos.';
    else if(!(data.nombres.length >= 2 && data.nombres.length <= 30)  )
        errors.nombres = 'Los Nombres no pueden pasar de 30 caracteres.';

    if (!data.apellidos) 
        errors.apellidos = 'Los Apellidos Son Obligatorios.';
    else if(!/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/.test(data.apellidos))
        errors.apellidos = 'Los Apellidos solo pueden contener caracteres de texto validos.';
    else if(!(data.apellidos.length >= 2 && data.apellidos.length <= 30)  )
        errors.apellidos = 'Los Apellidos no pueden pasar de 30 caracteres.';

    if (!data.correo_electronico) 
        errors.correo_electronico = 'El Correo Electronico Es Obligatorio.';
    else if (data.correo_electronico.includes('@')) 
        errors.correo_electronico = 'No es necesario poner "@".';
    else if (!/^[A-Z0-9._%+-]+$/i.test(data.correo_electronico)) 
        errors.correo_electronico = 'Direccion de correo electronico invalida.';
    
    if (!data.dominio_correo) 
        errors.dominio_correo = 'El Dominio Es Obligatorio.';
    else if (!/^[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.dominio_correo)) 
        errors.dominio_correo = 'Estructura del dominio invalida.';
    
    if (!data.fecha_nacimiento) 
        errors.fecha_nacimiento = 'La fecha de nacimiento es obligatoria.';
    

    if (!data.telefono_contacto) 
        errors.telefono_contacto = 'El número de teléfono es obligatorio.';
    else if(!isPossiblePhoneNumber(data.telefono_contacto))
        errors.telefono_contacto = 'Formato de número no es posible.';
    

    data.numero_doc = String(data.numero_doc)
    if (!data.numero_doc) 
        errors.numero_doc = 'El número de documento es obligatorio.';
    else if(!/^[0-9]+$/.test(data.numero_doc)  )
        errors.numero_doc = 'El número de documento solo admite caracteres númericos.';
    else if(!(data.numero_doc.length >= 2 && data.numero_doc.length <= 20)  )
        errors.numero_doc = 'El número de documento no puede pasar de 20 caracteres y debe tener como minimo mas de 2.';

    if (!data.lugar_registro_fk) {
        errors.lugar_registro_fk = 'El lugar de registro es obligatorio.';
    }

    if (!data.accept) {
        errors.accept = 'Es necesario aceptar los terminos y condiciones.';
    }
    if (!data.accept2) {
        errors.accept2 = 'Es necesario aceptar el envio de mensajes.';
    }

    return errors;
}

export default validationRegUser