/* Archivo que contiene las validaciones de el formulario de registro de usuarios */

//Importamos la libreria de react-phone para validar si uno de los formatos es valido (numero_telefono)
import { isPossiblePhoneNumber } from 'react-phone-number-input'

//Definimos el metodo validador
//Solicitamos como parametro la data del formulario
const validationRegUser = (data) =>{
    //Definimos un objeto el cual contendra todos los errores en dado caso que falle una validacion
    let errors = {};

    //Decimos si no esta definido o no tiene algun valor el campo de nombres
    if (!data.nombres) 
        //En caso de que asi sea va a retornar valor de que los nombres son obligatorios
        errors.nombres = 'Los Nombres Son Obligatorios.';
    //Si no, si el nombre no contiene una estructura que solo admite los siguientes caracteres
    //Se definen las letras de la A a la Z en mayusculas y minusculas, tambien se define para que hacepte caracteres especiales
    else if(!/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/.test(data.nombres))
        //Va a retornar que el nombre no tiene la estructura adecuada
        errors.nombres = 'Los Nombres solo pueden contener caracteres de texto validos.';
    //Si no, si el tamaño en caracteres del nombre no esta entre 2 y 30
    else if(!(data.nombres.length >= 2 && data.nombres.length <= 30)  )
        //Retornara error de que los nombres no pueden pasar de 30 
        errors.nombres = 'Los Nombres no pueden pasar de 30 caracteres ni ser inferiores a 2 caracteres.';

    //Validamos que el apellido tenga algun valor
    if (!data.apellidos) 
        //Si no tiene algun valor va a retornar que los apellidos son obligatorios
        errors.apellidos = 'Los Apellidos Son Obligatorios.';
    //Si no, si el apellido no cumple con la condicion de solo ser letras
    else if(!/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/.test(data.apellidos))
        //Va a retornar que los apellidos solo pueden contener caracteres validos
        errors.apellidos = 'Los Apellidos solo pueden contener caracteres de texto validos.';
    //Si el tamaño en caracteres no esta entre 2 y 30
    else if(!(data.apellidos.length >= 2 && data.apellidos.length <= 30)  )
        //Va a retornar que el apellido no esta entre la condicion solicitada
        errors.apellidos = 'Los Apellidos no pueden pasar de 30 caracteres ni ser inferiores a 2 caracteres.';

    //Si el campo de correo electronico no tiene ningun valor
    if (!data.correo_electronico) 
        //Enviara mensaje de que el correo es obligatorio
        errors.correo_electronico = 'El Correo Electronico Es Obligatorio.';
    //Si el campo de correo electronico tiene un "@"
    else if (data.correo_electronico.includes('@')) 
        //Va a enviar mensaje de que no es necesario poner el @
        errors.correo_electronico = 'No es necesario poner "@".';
    else if (!/^[A-Z0-9._%+-]+$/i.test(data.correo_electronico)) 
        //Se validan los caracteres del correo para que cumpla con las condiciones basicas de este
        errors.correo_electronico = 'Direccion de correo electronico invalida.';
    
    //Valida que exista un valor para el dominio del correo
    if (!data.dominio_correo) 
        //Devuelve mensaje de error infomando de que el campo es obligatorio
        errors.dominio_correo = 'El Dominio Es Obligatorio.';
    //Valida que este dominio de correo tenga una estructura logica de dominio
    else if (!/^[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.dominio_correo)) 
        //Retornara mensaje de estructura de dominio invalida
        errors.dominio_correo = 'Estructura del dominio invalida.';
    
    //Si no tiene un valor la fecha de nacimineto
    if (!data.fecha_nacimiento) 
        //Retornara mensaje de que la fecha de nacimiento es obligatoria
        errors.fecha_nacimiento = 'La fecha de nacimiento es obligatoria.';
    
    //Si el telefono no tiene algun valor
    if (!data.telefono_contacto) 
        //Retornara mensaje de que el telefono es obligatorio
        errors.telefono_contacto = 'El número de teléfono es obligatorio.';
    //Si no, si no es un posible numero de telefono
    else if(!isPossiblePhoneNumber(data.telefono_contacto))
        //Retornara mensaje de error de formato de numero no es posible
        errors.telefono_contacto = 'Formato de número no es posible.';
    

    //Se convierte el numero de documento a un string
    data.numero_doc = String(data.numero_doc)

    //Si el número de documento no tiene ningun valor
    if (!data.numero_doc) 
        //Retorna mensaje de queel npumero de doc es un campo obligatorio
        errors.numero_doc = 'El número de documento es obligatorio.';
    //Si el número de documento no tiene valores que correspondan a números de 0 a 9
    else if(!/^[0-9]+$/.test(data.numero_doc)  )
        //Retornara que el número solo acepta caracteres númericos
        errors.numero_doc = 'El número de documento solo admite caracteres númericos.';
    //Si no, si el número de documento no está entre 2 y 20
    else if(!(data.numero_doc.length >= 2 && data.numero_doc.length <= 20)  )
        //Retornara mensaje informando el error de validacion
        errors.numero_doc = 'El número de documento no puede pasar de 20 caracteres y debe tener como minimo mas de 2.';

    //Si el lugar de registro no contiene algun valor
    if (!data.lugar_registro_fk) {
        //Retornara mensaje informando que el lugar de registro es obligatorio
        errors.lugar_registro_fk = 'El lugar de registro es obligatorio.';
    }

    //Se valida que el check de aceptar los terminos este en verdadero
    if (!data.accept) {
        //Si no enviara mensaje 
        errors.accept = 'Es necesario aceptar los terminos y condiciones.';
    }
    //Se valida que el check de aceptar recivir mensajes este en verdadero
    if (!data.accept2) {
        //Si no generara error y no dejara enviar el formulario
        errors.accept2 = 'Es necesario aceptar el envio de mensajes.';
    }

    //Decimos que esta funcion retornara el objeto errors
    return errors;
}

//Ecportamos por defecto el metodo de validacion antes creado
export default validationRegUser