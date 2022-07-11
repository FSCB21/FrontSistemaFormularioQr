/* Archivo que contiene la configuracion basica para generar un reporte de usuario */

//Importamos los ganchos y el componente de react
import React, { useState, useRef } from 'react'

//Importamos componentes de estilado de prime react
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';

//Importamos el servicio de consultas al api
import GenReporteService from '../../service/GenReporteService';

//Importamos el componente de filtro
import FilterComponent from './FilterComponent';

//Metodo que se encarga de renderizar el componente
const ReporteUsuarios = () => {

    //Gancho que almacena las opciones selecionadas referentes a los campos a exportar
    const [selectedOptions, setSelectedOptions] = useState([]);
    //Gancho que almacena el valor del campo de filtro
    const [valueFiltrar, setValueFiltrar] = useState(false)
    //Gancho que almacena todos los filtros que se le realicen al formualrio
    const [condicionesFilter, setCondicionesFilter] = useState([])

    //Referencia a el componente de alerta
    const toast = useRef(null);

    //Arreglo de opciones que se mostrara en el selector multiple de campos para exportar
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

    //Metodo que arganizara las opciones y los filtros pra exportar y hara la consulta del api, generando el reporte en excel
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

    //Metodo que restablecera las opciones y los filtros por defecto
    const limpiarFormulario = () =>{
        setCondicionesFilter([])
        setSelectedOptions([])
        setValueFiltrar(false)
    }

    //Generar el excel
    const exportExcel = (products) => {
        import('xlsx').then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(products);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAsExcelFile(excelBuffer, 'Reporte');
        });
    }

    //Guardar el archivo generado en el equipo
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

    //Valor de retorno de los campos a mostrar
  return (
    <div>
        {/* Compoenente de alerta */}
        <Toast ref={toast} />
        {/* Titulo descriptivo */}
        <h5>Seleccione los campos a exportar:</h5>
        {/* Selector multiple */}
        <div className='mt-4 w-6'>
            <MultiSelect value={selectedOptions} className='w-full BorderFormNewUser' filter options={options} onChange={(e) => setSelectedOptions(e.value)} optionLabel="name" placeholder="Seleccione algun campo" display="chip" />
        </div>
        {/* Swith para establecer si se requiere o no filtrar la informacion  */}
        <div className='mt-4 w-6'>
            <h6>Filtrar Información:</h6>
            <InputSwitch checked={valueFiltrar} onChange={(e) => setValueFiltrar(e.value)} />
        </div>

        {/* Si el gancho es verdadero mostrara la seccion de filtros */}
        {valueFiltrar && <FilterComponent toast={toast} setCondicionesFilter={setCondicionesFilter} condicionesFilter={condicionesFilter}/>}

        {/* Botones de generar y de restablecer el formulario */}
        <Button onClick={limpiarFormulario} icon='pi pi-times' label='Borrar' className='mt-4 mr-4 BorderFormNewUser'/>
        <Button disabled={selectedOptions[0]?false:true} onClick={submit} icon='pi pi-download' label='Generar Reporte' className='mt-4 BorderFormNewUser'/>
    </div>
  )
}

//Exportamos el componente
export default ReporteUsuarios