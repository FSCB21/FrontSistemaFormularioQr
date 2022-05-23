import axios from "axios"

const API = process.env.REACT_APP_API + '/usuario'

class UsuarioService  {

    getAll(page, size, state_cod){
        return axios.get(`${API}?page=${page}&size=${size}&state_cod=${state_cod?state_cod:''}`)
    }

    getAllFiltered(atribute, value, method, page, size, state_cod){
        return axios.get(`${API}/filtered-users?atribute=${atribute}&value=${value}&method=${method}&page=${page}&size=${size}&state_cod=${state_cod?state_cod:''}`)
    }

    getAllByRangeDate(fechaInicio, fechaFin, campo, page, size, state_cod){
        return axios.get(`${API}/filter-by-date-range?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&campo=${campo}&page=${page}&size=${size}&state_cod=${state_cod?state_cod:''}`)
    }

    update(data){
        return axios.put(`${API}/update?id_usuario=${data.id_usuario}`,data)
    }

}

export default UsuarioService