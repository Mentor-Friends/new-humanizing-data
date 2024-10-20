import { Concept, CreateTheConnectionLocal, GetAllConnectionsOfComposition, LocalSyncData, MakeTheInstanceConceptLocal, PatcherStructure, UpdateComposition } from "mftsccs-browser";
import { StatefulWidget } from "../../default/StatefulWidget";

export class creator extends StatefulWidget{
    
    
    
    componentDidMount(): void {

        this.render();
    }
    addEvents(): void {
        let name = this.getElementById("name") as HTMLInputElement;
        let phone = this.getElementById("phone") as HTMLInputElement;
        let id = this.getElementById("id") as HTMLInputElement;
        if(this.data){
            name.value = this.data.name;
            phone.value = this.data.phone;
            id.value = this.data.id;
        }
        let submitButton = this.getElementById("submit");
        submitButton.onclick = (ev: Event) => {
            ev.preventDefault();

            if(id.value){
                let patcherStructure: PatcherStructure = new PatcherStructure();
                patcherStructure.compositionId = Number(id.value);
                patcherStructure.patchObject = {
                    "name": name.value,
                    "phone": phone.value
                }
                UpdateComposition(patcherStructure);
            }
            else{
                MakeTheInstanceConceptLocal("the_phonebook", "", true,999,4).then((mainconcept)=> {
                    MakeTheInstanceConceptLocal("name", name.value,false, 10267, 4).then((concept)=>{
                        MakeTheInstanceConceptLocal("phone", phone.value, false, 999,4).then((concept2) => {
                            CreateTheConnectionLocal(mainconcept.id, concept.id, mainconcept.id, 1, "", 999).then(()=>{
                                CreateTheConnectionLocal(mainconcept.id, concept2.id, mainconcept.id, 1, "", 999).then(()=>{
                                    LocalSyncData.SyncDataOnline();
                                })
                            })
                        });
                    });
                });
            }


            console.log("submit button clicked");
        }
    }


    async getHtml(): Promise<string> {
        let html = "";
        html = `<div>
        <form>
            <div>
                <input type= number id=id hidden>
                <input type = text id="name" placeholder="name">
                <input type = number id="phone" placeholder="phone">
                <button id="submit" type=submit>Submit</button>
            </div>
        </form>

        </div>`
        return html;
    }
}