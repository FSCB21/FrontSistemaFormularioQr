import React, { useState, useRef } from 'react'
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import GenReporteService from '../../service/GenReporteService';
import FilterComponent from './FilterComponent';
import { Toast } from 'primereact/toast';
const ReporteUsuarios = () => {

    const [selectedOptions, setSelectedOptions] = useState([]);

    const toast = useRef(null);
    const options = [
        { name: 'Nombres', campo: 'nombres' },
        { name: 'Apellidos', campo: 'apellidos' },
        { name: 'Identificación', campo: 'numero_doc' },
        { name: 'Teléfono', campo: 'telefono_contacto' },
        { name: 'Correo', campo: 'correo_electronico' },
        { name: 'Fecha Nacimiento', campo: 'fecha_nacimiento' },
        { name: 'Lugar Registro', campo: 'lugar_registro' },
        { name: 'Estado Codigo', campo: 'estado_codigo' },
        { name: 'Fecha De Registro', campo: 'createdAt' }
    ];

    const genReporteService = new GenReporteService()

    const submit = () =>{
        let campos = []
        let foraneas = []
        selectedOptions.forEach(el => {
            if(el.campo==="lugar_registro"||el.campo==="estado_codigo"){
                foraneas.push(el)
            }else{
                campos.push(el)
            }
        });

        //Condiciones
        let condiciones = []
        let condiciones_num = []

        condicionesFilter.forEach( el => {
            el = {...el}
            if(el.tipo===1||el.tipo===4)
                condiciones.push(el)
            else if(el.tipo===3){
                condiciones_num.push(el)
                foraneas.push({campo:'estado_codigo',value:el.value,tipo:3})
            }else{
                el.valor = el.valor.id_lugar_registro
                condiciones_num.push(el)
            }
        })

        genReporteService.genReporte({campos,foraneas, condiciones, condiciones_num}).then(res=>{
            exportExcel(res.data)
            toast.current.show({severity:'success', summary: 'FXA Te Informa', detail: 'Reporte Generado Con Exíto', life: 3000});
        })
    }

    const limpiarFormulario = () =>{
        setCondicionesFilter([])
        setSelectedOptions([])
        setValueFiltrar(false)
    }

    //Generate excel
    const exportExcel = (products) => {
        import('xlsx').then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(products);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAsExcelFile(excelBuffer, 'Reporte');
        });
    }

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then(module => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_FXA_' + new Date().getDate() + "-" + (new Date().getMonth()+1) + "-" + new Date().getFullYear() + EXCEL_EXTENSION);
            }
        });
    }

    const [valueFiltrar, setValueFiltrar] = useState(false)
    const [condicionesFilter, setCondicionesFilter] = useState([])

  return (
    <div>
        <Toast ref={toast} />
        <h5>Seleccione los campos a exportar:</h5>
        <div className='mt-4 w-6'>
            <MultiSelect value={selectedOptions} className='w-full BorderFormNewUser' filter options={options} onChange={(e) => setSelectedOptions(e.value)} optionLabel="name" placeholder="Seleccione algun campo" display="chip" />
        </div>
        <div className='mt-4 w-6'>
            <h6>Filtrar Información:</h6>
            <InputSwitch checked={valueFiltrar} onChange={(e) => setValueFiltrar(e.value)} />
        </div>

        {valueFiltrar && <FilterComponent toast={toast} setCondicionesFilter={setCondicionesFilter} condicionesFilter={condicionesFilter}/>}

        <Button onClick={limpiarFormulario} icon='pi pi-times' label='Borrar' className='mt-4 mr-4 BorderFormNewUser'/>
        <Button disabled={selectedOptions[0]?false:true} onClick={submit} icon='pi pi-download' label='Generar Reporte' className='mt-4 BorderFormNewUser'/>
    </div>
  )
}

export default ReporteUsuarios