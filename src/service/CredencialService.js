import axios from "axios"

const API = process.env.REACT_APP_API + '/credencial'

class CredencialService  {

    login(data){
        return axios.post(`${API}/login`, data)
    }


}

export default CredencialService