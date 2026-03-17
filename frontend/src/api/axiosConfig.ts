import config from "../service/config.json"
import axios from "axios";
// import store from "../store/index"


const http = axios.create({ baseURL: config.apiEndpoint });

// const getStore = () => {
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   const storeModule = require('../store/index');
//   return storeModule.default || storeModule;
// };

// const http = axios.create({baseURL:config.apiEndpoint})

// http.interceptors.request.use(
//     (config)=> { 
//         const token = getStore().getState().auth.token
//         const publicEndpoints = ['/login', '/register']; 
//         const isPublic = publicEndpoints.some(endpoint => config.url?.includes(endpoint));
//         if (token && !isPublic) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config},
//     (error)=>{return Promise.reject(error)}
// )
// http.interceptors.request.use(
//     (responce)=> { 
//         return responce},
//     async (error)=>{
//         const origReq=error.config
//         if(error.responce?.status===401&& !origReq._retry&&!origReq.url.includes('/refresh')){
//             origReq._retry=true
//         }
//         console.log("Token нужно обновить");
        
//         return Promise.reject(error)
//     }
// )

export default http