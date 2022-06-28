/* Archivo que contiene el componente relacionado con el footer de la pagina*/

//Importamos react para establecer que va a ser un componente de react
import React from 'react';

//Importamos y exportamos el componente de react denominado AppFooter el cual contiene el pie de pagina y sus elementos
export const AppFooter = () => {
    //Retornamos el bloque de codigo del componente
    return (
        //Esta etiquete es la etiqueta fundamental/central de nuestro componente la cual almacena otras etiquetas

        //En este caso es un div con el estilado de layout-footer
        <div className="layout-footer">
            {/* Agregamos la imagen que esta almacenada en la carpeta public, definimos que el tamaño de este va a ser de 20 y va a tener un margen a la derecha */}
            <img src={'images/logo-principal.svg'} alt="Logo" height="20" className="mr-2" />
            {/* TExto sin ningun estilado */}
            by
            {/* Agregamos la etiqueta span para ponerle estilo al texto, en este caso hicimos la letra un poco negrilla con un margen izquierdo de 2 */}
            <span className="font-medium ml-2">Fuxia</span>
        </div>
    );
}
