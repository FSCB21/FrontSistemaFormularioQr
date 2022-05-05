import axios from "axios"

const API = process.env.REACT_APP_API + '/lugar-registro'

class LugarRegistroService  {

    getAllActives(){
        return axios.get(`${API}/state-true`)
    }

    getAll(){
        return axios.get(API)
    }

}

export default LugarRegistroService