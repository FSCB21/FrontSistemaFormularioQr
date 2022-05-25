import axios from "axios"

const API = process.env.REACT_APP_API + '/form'

class FormService  {

    newUser(data){
        return axios.post(`${API}/reg`, data)
    }

    errSendSms(num_tel){
        return axios.post(`${API}/err-send-sms`, {telefono_contacto:num_tel})
    }

    changeNumber(data){
        return axios.post(`${API}/err-change-number`, data)
    }

}

export default FormService