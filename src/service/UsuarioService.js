import axios from "axios"

const API = process.env.REACT_APP_API + '/usuario'

class UsuarioService  {

    getAll(page, size){
        return axios.get(`${API}?page=${page}&size=${size}`)
    }

    getAllFiltered(atribute, value, method, page, size){
        return axios.get(`${API}/filtered-users?atribute=${atribute}&value=${value}&method=${method}&page=${page}&size=${size}`)
    }

}

export default UsuarioService