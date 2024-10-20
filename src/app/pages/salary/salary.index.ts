import {
  CreateConnectionBetweenTwoConceptsLocal,
  DATAID,
  GetTheConcept,
  JUSTDATA,
  LocalSyncData,
  MakeTheInstanceConceptLocal,
  NORMAL,
  searchLinkMultipleListener,
  SearchQuery,
} from "mftsccs-browser";
import { StatefulWidget } from "../../default/StatefulWidget";



export class Salary extends StatefulWidget {
  mainConcept: number = 0;
  compositionIds: number[] = [];
  internalConnections: number[] = [];
  reverse: number[] = [];
  linkers: number[] = [];
  dependency: number[] = [];
  monthlySalary: number;
  isDataLoaded: boolean = false;
  constructor() {
    super();
    this.setTitle("Salary List");
    this.monthlySalary = 0;
  }
  mainData: any;
  isUpdating = false;


  componentDidMount(): void {

    let searchQuery = new SearchQuery();
    searchQuery.composition= 100128392;
    this.mainConcept = searchQuery.composition;
    searchQuery.inpage = 10;
    searchQuery.listLinkers = ["my_console_s"];
    let searchQuery2 = new SearchQuery();
    searchQuery2.listLinkers = ["read_access_by"];
    let startTime = new Date().getTime();
    searchLinkMultipleListener([searchQuery, searchQuery2], "", NORMAL).subscribe((value: any) => {
        this.mainData = value
        console.log('Value Triggered: ', value)
        this.render()
        console.log("this is the time taken for the work to complete", new Date().getTime() - startTime);
    })
  }



  addEvents() {
    let myIncreaseButton = document.getElementById("increase-count");
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
    console.log("this is the increase count", myIncreaseButton);
    if (myIncreaseButton) {
      myIncreaseButton.onclick = () => {
        console.log("this is the initial count", this.monthlySalary);
        //  this.setState();
      };
    }
  }


  async getHtml(): Promise<string> {
    // (window as any).increaseCount = this.increaseCount;
    let html = "";
    html = `
            <span>${this.monthlySalary}</span>
            <span>${JSON.stringify(this.mainData)}</span>
            <br/>
            <input id="add-data"/>
        `;

    return html;
  }
}
