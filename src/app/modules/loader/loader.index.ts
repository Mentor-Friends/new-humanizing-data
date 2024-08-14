export async function loader(param:boolean){
    const loader: any = document?.querySelector("#loader");
    const body: any = document?.querySelector("#app");

    if(param){
         body.style.opacity= "0.5"
         body.style.zIndex="100"
         loader.style.display = "block";
    }else{
        loader.style.display = "none";
        body.style.display= "block";
        body.style.opacity= "100"
        body.style.zIndex="0"
    }

}