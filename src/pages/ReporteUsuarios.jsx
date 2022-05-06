import React, { useState } from 'react'
import { Card } from 'primereact/card'
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import GenReporteService from '../service/GenReporteService';
const ReporteUsuarios = () => {

    const [selectedOptions, setSelectedOptions] = useState([]);

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

        console.log(campos)
        console.log(foraneas)
        genReporteService.genReporte({campos,foraneas, condiciones:[], condiciones_num:[]}).then(res=>{
            exportExcel(res.data)
        })
    }

    //Generate excel
    const exportExcel = (products) => {
        import('xlsx').then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(products);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAsExcelFile(excelBuffer, 'products');
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

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    }

  return (
    <Card>
        <div>Seleccione los campos a exportar:</div>
        <div className='mt-4 w-6'>
            <MultiSelect value={selectedOptions} className='w-full' filter options={options} onChange={(e) => setSelectedOptions(e.value)} optionLabel="name" placeholder="Seleccione algun campo" display="chip" />
        </div>
        
        <Button disabled={selectedOptions[0]?false:true} onClick={submit} icon='pi pi-download' label='Generar Reporte' className='mt-4'/>
    </Card>
  )
}

export default ReporteUsuarios