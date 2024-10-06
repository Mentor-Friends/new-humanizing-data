import { CreateConnectionBetweenTwoConceptsLocal, GetTheConcept, LocalSyncData, MakeTheInstanceConceptLocal, SearchLinkMultipleAllWidget, SearchQuery } from "mftsccs-browser";
import { StatefulWidget } from "../../default/StatefulWidget";

export class others extends StatefulWidget {

    mainConcept: number = 0;
    mainData: any;


    componentDidMount(): void {
        // this.initializeData();
        // Method one using the return closure
        let searchQuery = new SearchQuery();
        searchQuery.composition= 100680646;
        this.mainConcept = searchQuery.composition;
        searchQuery.inpage = 10;
        searchQuery.listLinkers = ["my_console_s"];
        let searchQuery2 = new SearchQuery();
        searchQuery2.listLinkers = ["read_access_by"];
        // this.syncUpdated([searchQuery, searchQuery2], (value) => {
        //     console.log(`New Value: ${value}`, value);
        //     this.render();
        //   });
        // method two using the obserber and subscriber
        new SearchLinkMultipleAllWidget([searchQuery, searchQuery2]).subscribe((value: any) => {
            this.mainData = value
            console.log('Value Triggered: ', value)
            this.render()
        })
      }

      

    async mount(parent: HTMLElement) {
        this.element = document.createElement("div");
        this.element.innerHTML = await this.getHtml();
        parent.appendChild(this.element);
    
        // Simulate componentDidMount by calling it after the component is inserted into the DOM
        this.componentDidMount();
      }
      addEvents() {
        let addData: any = document.getElementById("add-data");
    
        if (addData) {
          addData.onchange = () => {
            let value = addData.value;
            MakeTheInstanceConceptLocal(
              "boomFolder",
              value,
              false,
              999,
              4,
              999
            ).then((concept) => {
              GetTheConcept(this.mainConcept).then((mainCon) => {
                CreateConnectionBetweenTwoConceptsLocal(
                  mainCon,
                  concept,
                  "my_console",
                  true
                ).then(() => {
                  LocalSyncData.SyncDataOnline();
                });
              });
              console.log("this data has been updated", value);
            });
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
                <span>${JSON.stringify(this.mainData)}</span>
                <br/>
                <input id="add-data"/>
                <button id="increase-count" class="btn btn-primary">Increase Salary</button>
            `;
    
        return html;
      }

}