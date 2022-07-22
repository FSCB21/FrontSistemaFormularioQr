/* Archivo que almacena el contenido y estructura del menu lateral derecho */

//Importamos los iconos que se usan en el menu
//Para los iconos se usa una libreria denominada react-icons la cual contiene diversos iconos para ser usados como etiquetas de react
import { RiCake2Fill, RiFolder2Fill, RiBriefcase2Fill } from 'react-icons/ri';
import { FaMoneyBillWave } from 'react-icons/fa';

//Importamos react para decir que se usara esta estructura en este archivo
import React from 'react'

//Creamos un componente el cual recive un objeto de parametros
//Este componente es el encargado de mostrar el cuerpo de la etiqueta junto con el icono
const MenuConten = (params) => {
  //Retornamos una etiqueta general, la cual es un div
  return (
    //Este div tiene estilado siguiendo la libreria de prime react
    <div className='flex align-items-center justify-content-center'>
      {/* Para mostrar el icono como etiqueta de react llamamos el nombre literal desde los parametros de esta funcion */}
      <params.icon/>
      {/* Agregamos el texto haciendo uso de la estructura mostacho, donde se usa texto Javascript en vez de leer texto normal */}
      <span className='py-0'>{params.descripcion}</span>
    </div>
  )
}


//Exportamos por defecto la estructura del menu lateral
//El cual segun primeract tiene que ser un arreglo de objetos con la siguiente estructura
//?LINK DOC: https://www.primefaces.org/primereact/menumodel/
export default [
    //En el label llamamos el bloque de MenuConten, donde le pasamos como parametros el texto y el icono que se desea visualizar, el icono lo pasamos como callback ya que es un bloque de react, y por ultimo definimos la ruta donde deseamos que este redirija
    { items: [{label: MenuConten({descripcion:"Dashboard", icon:()=><RiBriefcase2Fill className='text-xl mr-1'/>}), to: '/dash/' }] },
    { items: [{label: MenuConten({descripcion:"Registros", icon:()=><RiFolder2Fill className='text-xl mr-1'/>}), to: '/dash/registros'}] },
    { items: [{label: MenuConten({descripcion:"Cumpleaños", icon:()=><RiCake2Fill className='text-xl mr-1'/>}), to: '/dash/cumpleaños'}] },
    { items: [{label: MenuConten({descripcion:"Incentivos", icon:()=><FaMoneyBillWave className='text-xl mr-1'/>}), to: '/dash/incentivos'}] },
]