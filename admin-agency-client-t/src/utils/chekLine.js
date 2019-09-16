import axios from 'axios'

let getEasyUrl = () => {
    let cb;
    let p = new Promise(resolve => cb = resolve);
    let cbok = false;
    let testOne = async(url)=>{
        try{
            let ret = await axios.get(url + prex);
            if(ret.data.code===200) {
                console.log("urlItem:",url) 
                if(!cbok) {
                    cbok =true;
                    cb(url);
                }
            }
         } catch(e) {
             console.error("catch", e,"url:",url)
         }         
    }
  
    let prex = "/api/speedtest";
    let baseUrls = process.env.BASE_API_LIST; 
    let ps =[]
    for (let k in baseUrls) {
       ps.push(testOne(baseUrls[k]))
    }
    Promise.all(ps).then(() => cb());
     return p;
}
export default getEasyUrl
