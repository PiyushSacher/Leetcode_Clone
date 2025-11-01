import axios from "axios";

const axiosClient=axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true,  //browser ko bta rhe hai ki cookies ko attach krdena
    headers:{
        "Content-Type":"application/json"  //jo bhi data hum bhejenge wo json format mai hoga
    }
});

export default axiosClient;