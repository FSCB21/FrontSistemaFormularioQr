import axios from "axios"

const API = process.env.REACT_APP_API + '/lugar-registro'

class LugarRegistroService  {

    getAllActives(){
        return axios.get(`${API}/state-true`)
    }

    getAll(){
        return axios.get(API)
    }

    create(data){
        return axios.post(`${API}/create`, data)
    }

    update(data){
        return axios.put(`${API}/update?id_lugar_registro=${data.id_lugar_registro}`, data)
    }

    disable(id){
        return axios.put(`${API}/disable?id_lugar_registro=${id}`)
    }
    
    enable(id){
        return axios.put(`${API}/enable?id_lugar_registro=${id}`)
    }

}

export default LugarRegistroService