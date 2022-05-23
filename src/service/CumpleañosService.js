import axios from "axios"

const API = process.env.REACT_APP_API + '/birthday'

class CumpleañosService  {

    getByDay(fecha){
        return axios.get(`${API}/get-by-day?fecha=${fecha}`)
    }

    getByMonth(fecha){
        return axios.get(`${API}/get-by-month?fecha=${fecha}`)
    }

    getByRange(fecha_inicio,fecha_fin){
        return axios.get(`${API}/get-by-range?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`)
    }

    getByRangeFilterAge(fecha_inicio,fecha_fin,edad_inicio,edad_fin){
        return axios.get(`${API}/get-range-filter-age?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}&edad_inicio=${edad_inicio}&edad_fin=${edad_fin}`)
    }

    getByRangeFilterLugar(fecha_inicio, fecha_fin, lugares){
        return axios.post(`${API}/get-range-filter-lugar?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`, {lugares} )
    }

    getByRangeChangeOrder(fecha_inicio,fecha_fin, campo, tipo_orden){
        return axios.get(`${API}/get-range-change-order?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}&campo=${campo}&tipo_orden=${tipo_orden}`)
    }
}

export default CumpleañosService