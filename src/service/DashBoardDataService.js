import axios from "axios"

const API = process.env.REACT_APP_API + '/data-dash'

class DashBoardDataService  {

    getDataCartas(){
        return axios.get(`${API}/get-data-cards`)
    }

    getDataMensualLugarRegistro(data){
        return axios.get(`${API}/get-data-count-lugar-registro?fecha_inicio=${data.fecha_inicio}&fecha_fin=${data.fecha_fin}&id_lugar_registro=${data.id_lugar_registro?data.id_lugar_registro:''}`)
    }

    getDataEdades(){
        return axios.get(`${API}/get-data-age`)
    }

}

export default DashBoardDataService