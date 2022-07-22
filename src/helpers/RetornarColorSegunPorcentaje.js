export default (num)=> {
    num = parseInt(num)
        if(num<20 || !num)
            return "pink-900"
        else if(num<45)
            return "orange-600"
        else if(num<80)
            return "yellow-400"
        else if(num<100)
            return "green-300"
        else if(num>=100)
            return "green-700"
}