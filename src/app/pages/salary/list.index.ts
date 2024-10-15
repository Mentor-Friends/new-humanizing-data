import { GetLinkListener } from "mftsccs-browser";
import { StatefulWidget } from "../../default/StatefulWidget";
import { others } from "./others.index";
import { userdata } from "./userdata.index";

export class list extends StatefulWidget{
    counter: number = 0;
    folders: any;
    inpage: number= 10;
    page: number = 1;
    id: number = 100128392;
    linker: string = "console_folder_s";


    componentDidMount(): void {

        GetLinkListener(this.id, this.linker, this.inpage, this.page).subscribe((output: any)=>{
            console.log("this is the output", output);
            this.folders = output;
            this.render();
        })
        this.mountChildWidget();
    }


    updateComponent(){
        GetLinkListener(this.id, this.linker, this.inpage, this.page).subscribe((output: any)=>{
            console.log("this is the output after update", output);
            this.folders = output;
            this.render();
        })
    }




    addEvents() {
        let addData: any = document.getElementById("update-id");
        if (addData) {
          addData.onchange = () => {
            console.log("this is updating", addData.value);
            this.id = addData.value;
            this.updateComponent();
          };
        }

      }

    mountChildWidget(){
        // finding out if the widget is available
        let widget1 = document.getElementById("widget1");
       // let widget2 = document.getElementById("widget2");
        if(widget1){
          let search =new others();
          search.onchange((mydata: any)=>{
            this.data = mydata;
            this.render();
          });
          this.childComponents.push(search);
          search.mount(widget1);
        }
        // if(widget2){
        //     let userData =new userdata();
        //     userData.parentElement = "widget2";
        //     this.childComponents.push(userData);
        //     console.log("this is the widget", widget1, userData);
        //     userData.mount(widget2);
        //   }
    }



    async getHtml(): Promise<string> {
        let html = "";
        html = `<div>
        <span>parent widget: ${this.data}</span>
        <input placeholder="add" type="number" id="update-id"/>
        <div id= "widget1" ></div>

        </div>`
        return html;
    }
}