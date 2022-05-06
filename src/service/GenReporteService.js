import axios from "axios"

const API = process.env.REACT_APP_API + '/gen-reporte'

class GenReporteService  {

    genReporte(data){
        return axios.post(API,data)
    }

}

export default GenReporteService