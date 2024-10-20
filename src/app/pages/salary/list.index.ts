import {  DeleteConceptById, GetCompositionListListener,  NORMAL } from "mftsccs-browser";
import { StatefulWidget } from "../../default/StatefulWidget";

export class list extends StatefulWidget{
    counter: number = 0;
    phonebooks: any = [];
    inpage: number= 10;
    page: number = 1;
    id: number = 100128392;
    linker: string = "console_folder_s";


    componentDidMount(): void {

        GetCompositionListListener("the_phonebook", 10267, 10, 1, NORMAL).subscribe((output: any)=>{
            console.log("this is the output", output);
            this.phonebooks = output;
            this.render();
        })
        this.mountChildWidget();
    }


    updateComponent(){

    }




    addEvents() {
      let tableElement = this.getElementById("mainbody");
      console.log("this is the element", tableElement);
      if(this.phonebooks.length > 0){
        for(let i= 0; i< this.phonebooks.length; i++){
          let row = document.createElement("tr");
          let name = document.createElement("span");
          let nameValue = this.phonebooks[i].the_phonebook.name
          let phoneValue = this.phonebooks[i].the_phonebook.phone
          name.innerHTML = nameValue;
          let phone = document.createElement("span");
          phone.innerHTML = phoneValue;
          let edit = document.createElement("button");

          edit.setAttribute('class', 'btn btn-primary');
          edit.setAttribute('padding', "10px");
          edit.id = this.phonebooks[i].the_phonebook.id;
          edit.innerHTML = "edit";

          let del = document.createElement("button");
          del.setAttribute('class', 'btn btn-primary');
          del.setAttribute('padding', "10px");
          del.id = this.phonebooks[i].the_phonebook.id;
          del.innerHTML = "Delete";

          del.onclick = () =>{
            DeleteConceptById(this.phonebooks[i].the_phonebook.id);
            that.notify();
          }
          let that = this;
          edit.onclick = () =>{
            that.data = {
              "id": edit.id,
              "name": nameValue,
              "phone": phoneValue
            }
            console.log("this is the update click", that.data, that.subscribers);
            
            that.notify();
          }
          row.appendChild(name);
          row.appendChild(phone);
          row.appendChild(edit);
          row.appendChild(del);
          tableElement.append(row);
        }


      }

      }


    mountChildWidget(){

    }



    async getHtml(): Promise<string> {

        let html = "";

        html = `<div>
        <table>
        <thead>
          <tr>
              <th>name</th>
              <th>phone</th>
          </tr>
        </thead>
        <tbody id= mainbody>

        </tbody>
        </table>
        
        </div>`
        return html;
    }
}