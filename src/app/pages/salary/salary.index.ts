import { Concept, ConnectionData, CreateConnectionBetweenTwoConceptsLocal, CreateTheConnection, CreateTheConnectionLocal, FormatFromConnectionsAltered, GetCompositionFromConnectionsWithDataIdInObject, GetConnectionBulk, GetConnectionDataPrefetch, GetTheConcept, LocalSyncData, MakeTheInstanceConcept, MakeTheInstanceConceptLocal, MakeTheTypeConcept, PatcherStructure, SearchLinkMultipleAll, SearchLinkMultipleApi, SearchQuery, SyncData, UpdateCompositionLocal } from "mftsccs-browser";
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



    listenToEvent(id: number) {
        window.addEventListener(`${id}`, (event) => {
            if(!this.isUpdating){
                this.isUpdating = true;
                console.log("this is the updating method", id);
                let that = this;
                console.log("This is the old connections", that.internalConnections,that.compositionIds);

                setTimeout(function(){
                    let newConnection = ConnectionData.GetConnectionByOfTheConceptAndType(id, id);
                    for(let i=0 ;i< newConnection.length; i++){
                        
                                ConnectionData.GetConnection(newConnection[i]).then((conn)=>{
                                    if(conn.typeId == that.mainConcept){
                                        if(!that.internalConnections.includes(conn.id)){
                                            that.internalConnections.push(conn.id);
                                        }
                                    }
                                    else{
                                        if(!that.linkers.includes(conn.id)){
                                            that.linkers.push(conn.id);
                                        console.log("this is updating the linker", that.linkers);

                                        }
                                    }

                                    if(!that.compositionIds.includes(conn.toTheConceptId)){
                                        that.compositionIds.push(conn.toTheConceptId);
                                        console.log("This is the updated connections", that.internalConnections, that.compositionIds, that.linkers);
                                         that.isUpdating = false;
                                        console.log("now again this can work");
    
                                    }
                                    that.setState();

                                });

                    }


                }, 1000);
            }
            else{
                console.log("rejected this");
            }

        });
    }

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

        this.mainData =  await SearchLinkMultipleAll([searchQuery, searchQuery2], "", this);
        console.log("this is the main data", this.mainData);
        // let conceptsConnections = await SearchLinkMultipleApi([searchQuery, searchQuery2]);
        // this.mainConcept = searchQuery.composition;
        // const result = conceptsConnections;
        // this.concepts = result.compositionIds;
        // this.internalConnections = result.internalConnections;
        // this.connections = result.linkers;
        // this.reverse = result.reverse;
        // if(this.internalConnections.length > 1){
        //     console.log("this is the con", this.internalConnections);
        //     let allConnections = await GetConnectionBulk(this.internalConnections);
        //     for(let i=0; i< allConnections.length; i++){
        //         if(!this.dependency.includes(allConnections[i].ofTheConceptId)){
        //             this.dependency.push(allConnections[i].ofTheConceptId);

        //         }
        //         if(!this.dependency.includes(allConnections[i].toTheConceptId)){
        //             this.dependency.push(allConnections[i].toTheConceptId);

        //         }
        //     }
        // }



        // const [prefetchConnections, concepts] = await Promise.all([
        //   GetConnectionDataPrefetch(linkers),
        //   GetCompositionFromConnectionsWithDataIdInObject(conceptIds,connections)
        // ]); 
        this.listenToEvent(this.mainConcept);


    }

    async buildData(){
        // let externalConnections = this.connections.slice();
        // let internalConn = this.internalConnections.slice();
        // let conceptIds = this.concepts.slice();
        // let prefetchConnections = await GetConnectionDataPrefetch(externalConnections);

        // let concepts = await GetCompositionFromConnectionsWithDataIdInObject(conceptIds, internalConn);
        
        // let out = await FormatFromConnectionsAltered(prefetchConnections, concepts, this.mainConcept, this.reverse);
        // console.log("this is the data", out);
        // this.mainData = out;
    }




    async setState(){
        await this.setDataDependency();
        //await this.buildData();
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