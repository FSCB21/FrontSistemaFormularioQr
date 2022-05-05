import axios from "axios"

const API = process.env.REACT_APP_API + '/usuario'

class UsuarioService  {

    getAll(page, size){
        return axios.get(`${API}?page=${page}&size=${size}`)
    }

    getAllFiltered(atribute, value, method, page, size){
        return axios.get(`${API}/filtered-users?atribute=${atribute}&value=${value}&method=${method}&page=${page}&size=${size}`)
    }

    getAllByRangeDate(fechaInicio, fechaFin, campo, page, size){
        return axios.get(`${API}/filter-by-date-range?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&campo=${campo}&page=${page}&size=${size}`)
    }

    update(data){
        return axios.put(`${API}/update?id_usuario=${data.id_usuario}`,data)
    }

    getByStateCode(state, page, size){
        return axios.get(`${API}/getby-state-code?estado_code=${state}`)
    }

}

export default UsuarioService