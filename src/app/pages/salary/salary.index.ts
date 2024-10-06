import { ConnectionData, CreateConnectionBetweenTwoConceptsLocal, CreateTheConnection, CreateTheConnectionLocal, FormatFromConnectionsAltered, GetCompositionFromConnectionsWithDataIdInObject, GetConnectionBulk, GetConnectionDataPrefetch, GetTheConcept, LocalSyncData, MakeTheInstanceConcept, MakeTheInstanceConceptLocal, MakeTheTypeConcept, PatcherStructure, SearchLinkMultipleAll, SearchLinkMultipleAllWidget, SearchLinkMultipleApi, SearchQuery, SyncData, UpdateCompositionLocal } from "mftsccs-browser";
import { StatefulWidget } from "../../default/StatefulWidget";


export class Salary extends StatefulWidget{

    mainConcept: number = 0;
    compositionIds: number[] = [];
    internalConnections: number[] = [];
    reverse: number[] = [];
    linkers: number[] = [];
    dependency: number[] = [];
    monthlySalary: number;
    isDataLoaded: boolean = false;
    constructor(params: any){
        super(params);
        this.setTitle("Salary List");
        this.monthlySalary = 0;

    }
    mainData: any ;
    isUpdating = false;


     async mount(parent: HTMLElement) {
        this.element = document.createElement('div');
        this.element.innerHTML =  await this.getHtml();
        parent.appendChild(this.element);

        // Simulate componentDidMount by calling it after the component is inserted into the DOM
        this.componentDidMount();
    }

    componentDidMount(): void {
        this.initializeData();
    }

    async initializeData(){
        this.setState();
    }



    // listenToEvent(id: number) {
    //     window.addEventListener(`${id}`, (event) => {
    //         if(!this.isUpdating){
    //             this.isUpdating = true;
    //             let that = this;

    //             setTimeout(function(){
    //                 let newConnection = ConnectionData.GetConnectionByOfTheConceptAndType(id, id);
    //                 for(let i=0 ;i< newConnection.length; i++){
                        
    //                             ConnectionData.GetConnection(newConnection[i]).then((conn)=>{
    //                                 if(conn.typeId == that.mainConcept){
    //                                     if(!that.internalConnections.includes(conn.id)){
    //                                         that.internalConnections.push(conn.id);
    //                                     }
    //                                 }
    //                                 else{
    //                                     if(!that.linkers.includes(conn.id)){
    //                                         that.linkers.push(conn.id);

    //                                     }
    //                                 }

    //                                 if(!that.compositionIds.includes(conn.toTheConceptId)){
    //                                     that.compositionIds.push(conn.toTheConceptId);
    //                                      that.isUpdating = false;
    
    //                                 }
    //                                 that.setState();

    //                             });

    //                 }


    //             }, 1000);
    //         }
    //         else{
    //             console.log("rejected this");
    //         }

    //     });
    // }

    addEvents(){
        let myIncreaseButton = document.getElementById("increase-count");
        let addData:any = document.getElementById("add-data");

        if(addData){
            addData.onchange = () =>{
                let value = addData.value;
                 MakeTheInstanceConceptLocal("boomFolder", value, false, 999, 4, 999).then((concept)=>{
                    GetTheConcept(this.mainConcept).then((mainCon)=>{
                        CreateConnectionBetweenTwoConceptsLocal(mainCon, concept, "my_console", true).then(()=>{
                           LocalSyncData.SyncDataOnline();
                        })
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

    

    async setDataDependency(){

        let searchQuery = new SearchQuery();
        searchQuery.composition= 100716269;
        this.mainConcept = searchQuery.composition;
        searchQuery.inpage = 10;
        searchQuery.listLinkers = ["my_console_s"];

        let searchQuery2 = new SearchQuery();
        searchQuery2.listLinkers = ["read_access_by"];
        let widget = new SearchLinkMultipleAllWidget([searchQuery, searchQuery2]).onchange();

       // this.mainData =  await SearchLinkMultipleAll([searchQuery, searchQuery2], "", this);
        console.log("this is the main data", this.mainData);
        //this.listenToEvent(this.mainConcept);


    }






    async setState(){
        await this.setDataDependency();
        this.render();
    }

    async render(){
        if(this.element){
            this.element.innerHTML = await  this.getHtml();

        }
        this.addEvents();
    }


    async getHtml(): Promise<string>{
        
       // (window as any).increaseCount = this.increaseCount;
        let html = "";
        html = `
            <span>${this.monthlySalary}</span>
            <span>${JSON.stringify(this.mainData)}</span>
            <br/>
            <input id="add-data"/>
            <button id="increase-count" class="btn btn-primary">Increase Salary</button>
        `
        ;
        
        return html;
    }


}