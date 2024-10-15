import {CreateTheCompositionLocal, DeleteConnectionById, GetCompositionListListener, LocalSyncData, PatcherStructure, UpdateCompositionLocal } from "mftsccs-browser";
import { StatefulWidget } from "../../default/StatefulWidget";

export class userdata extends StatefulWidget{
    id: number = 100680646;
    mainData: any;
    childComponents: any = [];

    componentDidMount(): void {

      GetCompositionListListener("boomgpt", 10267, 10, 1).subscribe((value: any)=>{
        this.mainData = value;
        console.log('Value triggered', value);
        this.render();
      }); 
      }


      addEvents() {
        let updateData: any = document.getElementById("update-data");
        let addData: any = document.getElementById("add-data");
        let deleteConnection: any = document.getElementById('delete-data');
        if(addData){
          addData.onchange = () => {
            let value = addData.value;
            let tocreate = JSON.parse(value);
            console.log("this is the json", tocreate);
            CreateTheCompositionLocal(tocreate, null, null, null, 10267).then(()=>{
              LocalSyncData.SyncDataOnline();
            });
          };
        }
        if(deleteConnection){
          deleteConnection.onchange = () => {
            let value = deleteConnection.value;
            DeleteConnectionById(value);
          }
        }
        if (updateData) {
          updateData.onchange = () => {
            let value = updateData.value;
            let patcherStructure = new PatcherStructure();
            patcherStructure.compositionId = this.id;
            patcherStructure.patchObject = {
              "work": value
            };
            UpdateCompositionLocal(patcherStructure);

          };
        }

      }


      async render() {
        if (this.element) {
          this.element.innerHTML = await this.getHtml();
        }
        this.addEvents();

      }
    
      async getHtml(): Promise<string> {
        // (window as any).increaseCount = this.increaseCount;
        let html = "";
        html = `
                <div>
                <span>${JSON.stringify(this.mainData)}</span>
                </div>
                <br/>
                <input placeholder="add" type="text" id="add-data"/>
                <input placeholder="update" id="update-data"/>
                <input placeholder="delete" id="delete-data"/>
                <button id="increase-count" class="btn btn-primary">Increase Salary</button>
            `;
    
        return html;
      }
}