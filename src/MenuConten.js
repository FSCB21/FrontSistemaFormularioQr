import { RiCake2Fill, RiFolder2Fill, RiBriefcase2Fill } from 'react-icons/ri';

import React from 'react'

const MenuConten = (params) => {
  return (<div className='flex align-items-center justify-content-center'>
    <params.icon/>
    <span className='py-0'>{params.descripcion}</span>
  </div>)
}



export default [
    { items: [{label: MenuConten({descripcion:"Dashboard", icon:()=><RiBriefcase2Fill className='text-xl mr-1'/>}), to: '/dash/' }] },
    { items: [{label: MenuConten({descripcion:"Registros", icon:()=><RiFolder2Fill className='text-xl mr-1'/>}), to: '/dash/registros'}] },
    { items: [{label: MenuConten({descripcion:"Cumpleaños", icon:()=><RiCake2Fill className='text-xl mr-1'/>}), to: '/dash/cumpleaños'}] },
]