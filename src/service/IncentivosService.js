
import axios from "axios"

const API = process.env.REACT_APP_API + '/incentivo-general'

class IncentivosService  {

    //Metodo que creara una nueva meta de incentivo a partir de la data enviada en el cuerpo de la solicitud
    create(data){
        return axios.post(`${API}/create`, data)
    }

    //Metodo que actualiza un registro con la data enviada, se requiere tambien enviar un id por los parametros de consulta
    update(data, tipo_update){
        return axios.put(`${API}/update?id_incentivo_general=${data.id_incentivo}&tipo_update=${tipo_update}`, data)
    }

    updateIncentivoLugar(data){
        return axios.put(`${API}/update-incentivo-lugar`, data)
    }

    //Metodo que elimina de manera permanente una meta
    delete(id){
        return axios.delete(`${API}/delete?id_incentivo_general=${id}`)
    }

    //Metodo que elimina de manera permanente una relacion entre una meta y un lugar
    deleteLugarIncentivo(data){
        return axios.post(`${API}/delete-incentivo-lugar`,data)
    }

    //Metodo que consulta los incentivos segun su estado
    //El estado se solicita como parametro
    getAllByState(estado){
        return axios.get(`${API}?estado=${estado}`)
    }

    //Metodo que consulta el progreso de registro segun lugar de registro
    getAllByIdIncentivoGeneral(id){
        return axios.get(`${API}/get-all?id_incentivo_general=${id}`)
    }

}

export default IncentivosService