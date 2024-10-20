import { StatefulWidget } from "../../default/StatefulWidget";
import { creator } from "./creator";
import { list } from "./list.index";
import { viewer } from "./viewer";
import './crud.style.css';

export class crud extends StatefulWidget
{

    mountChildWidgets(){
        let widget1 = this.getElementById("widget1");
        let widget2 = this.getElementById("widget2");
        let widget3 = this.getElementById("widget3");
        let creating =new creator();
        let listing = new list();
        let viewing = new viewer();

         if(widget1){
           this.childComponents.push(creating);
           creating.mount(widget1);
         }
         if(widget2)
         {
            listing.dataChange((value: any)=>{
                this.UpdateChildData(value, creating);
                this.UpdateChildData(value, viewing);
            });
            this.childComponents.push(listing);
            listing.mount(widget2);
         }

         if(widget3){
            this.childComponents.push(viewing);
            viewing.mount(widget3);
         }
         
    }



    async getHtml(): Promise<string> {
        let html = "";

        html = `<div class="flex-container">
            <div id= "widget1"></div>
            </div>
            <div class="flex-container">
            <div id ="widget2"></div>
            <div id ="widget3"></div>
        </div>`
        return html;
    }
}
