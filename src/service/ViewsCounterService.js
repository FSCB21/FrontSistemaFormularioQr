import axios from "axios"

const API = process.env.REACT_APP_API + '/visit-counter'

class ViewsCounterService  {

    getPageVisits(page){
        return axios.get(`${API}/get-visits?page=${page}`)
    }

    newPageVisit(page){
        return axios.get(`${API}/new-visit?page=${page}`)
    }

}

export default ViewsCounterService