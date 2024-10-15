import {
  Concept,
  ConnectionData,
  CreateConnectionBetweenTwoConceptsLocal,
  CreateTheConnection,
  CreateTheConnectionLocal,
  FormatFromConnectionsAltered,
  GetCompositionFromConnectionsWithDataIdInObject,
  GetConnectionBulk,
  GetConnectionDataPrefetch,
  GetTheConcept,
  LocalSyncData,
  MakeTheInstanceConcept,
  MakeTheInstanceConceptLocal,
  MakeTheTypeConcept,
  PatcherStructure,
  SearchLinkMultipleAll,
  SearchLinkMultipleApi,
  SearchQuery,
  SyncData,
  UpdateCompositionLocal,
} from "mftsccs-browser";
import { StatefulWidget } from "../../default/StatefulWidget";

class ConceptConnectionObserver {
  subscribers: any[] = [];

  mainConcept: number = 0;
  concepts: number[] = [];
  internalConnections: number[] = [];
  reverse: number[] = [];
  connections: number[] = [];
  dependency: number[] = [];
  data: any;
  isUpdating = false;

  async populateApiData(result: { [key: string]: any }) {
    this.concepts = result.compositionIds;
    this.internalConnections = result.internalConnections;
    this.connections = result.linkers;
    this.reverse = result.reverse;
    if (this.internalConnections.length > 1) {
      console.log("this is the con", this.internalConnections);
      let allConnections = await GetConnectionBulk(this.internalConnections);
      for (let i = 0; i < allConnections.length; i++) {
        if (!this.dependency.includes(allConnections[i].ofTheConceptId)) {
          this.dependency.push(allConnections[i].ofTheConceptId);
        }
        if (!this.dependency.includes(allConnections[i].toTheConceptId)) {
          this.dependency.push(allConnections[i].toTheConceptId);
        }
      }
    }
  }

  async buildData() {
    let externalConnections = this.connections.slice();
    let internalConn = this.internalConnections.slice();
    let conceptIds = this.concepts.slice();
    let prefetchConnections = await GetConnectionDataPrefetch(
      externalConnections
    );
    let concepts = await GetCompositionFromConnectionsWithDataIdInObject(
      conceptIds,
      internalConn
    );

    this.data = await FormatFromConnectionsAltered(
      prefetchConnections,
      concepts,
      this.mainConcept,
      this.reverse
    );
    console.log("this is the data", this.data);
    // this.mainData = out;
    return this.data;
  }

  listenToEvent(id: number) {
    window.addEventListener(`${id}`, (event) => {
      if (!this.isUpdating) {
        this.isUpdating = true;
        console.log("this is the updating method", id);
        let that = this;
        console.log(
          "This is the old connections",
          that.connections,
          that.concepts
        );
        setTimeout(async function () {
          let newConnection = ConnectionData.GetConnectionByOfTheConceptAndType(
            id,
            id
          );
          for (let i = 0; i < newConnection.length; i++) {


              await ConnectionData.GetConnection(newConnection[i]).then(async (conn) => {
                if(conn.typeId == that.mainConcept){
                    if(!that.internalConnections.includes(conn.id)){
                        that.internalConnections.push(conn.id);
                    }
                }
                else{
                    if(!that.connections.includes(conn.id)){
                        that.connections.push(conn.id);
                    }
                }
                if (!that.concepts.includes(conn.toTheConceptId)) {
                  that.concepts.push(conn.toTheConceptId);
                  that.isUpdating = false;
                  console.log("now again this can work");
                }
              });
            
          



        };
        await that.buildData()
        that.notify();
    }, 1000);
      } else {
        console.log("rejected this");
      }
    });
  }

  notify() {
    console.log('notifiers', this.subscribers)
    this.subscribers.map(subscriber => {
        console.log('notify')
        subscriber(this.data)
    })
  }
}

class searchLinkMultipleAllObserable extends ConceptConnectionObserver {
  searchQuries: SearchQuery[] = [];
  fetched: boolean = false;

  constructor(quries: SearchQuery[]) {
    super();
    this.searchQuries = quries;
  }

  async executeData() {
    let conceptsConnections = await SearchLinkMultipleApi(this.searchQuries);
    if (!this.searchQuries?.[0]?.composition) return;

    this.mainConcept = this.searchQuries?.[0]?.composition;
    await this.populateApiData(conceptsConnections);
    await this.buildData();
    await this.listenToEvent(this.mainConcept);
  }

  async subscribe(callback: any) {
    this.subscribers.push(callback);

    if (!this.fetched) {
        console.log('hello')
      await this.executeData();
      return callback(this.data);
    }
  }
}

function searchLinkMultipleListen(searchQuries: SearchQuery[], token?: string) {
  return new searchLinkMultipleAllObserable(searchQuries);
}

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
    // this.initializeData();
    // Method one using the return closure
    let searchQuery = new SearchQuery();
    searchQuery.composition= 100128392;
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
    searchLinkMultipleListen([searchQuery, searchQuery2]).subscribe((value: any) => {
        this.mainData = value
        console.log('Value Triggered: ', value)
        this.render()
    })
  }

//   async initializeData() {
//     this.setState();
//   }

//   listenToEvent(id: number, callback?: any) {
//     window.addEventListener(`${id}`, (event) => {
//       if (!this.isUpdating) {
//         this.isUpdating = true;
//         console.log("this is the updating method", id);
//         let that = this;
//         console.log(
//           "This is the old connections",
//           that.internalConnections,
//           that.compositionIds
//         );

//         setTimeout(function () {
//           let newConnection = ConnectionData.GetConnectionByOfTheConceptAndType(
//             id,
//             id
//           );
//           for (let i = 0; i < newConnection.length; i++) {
//             ConnectionData.GetConnection(newConnection[i]).then((conn) => {
//               if (conn.typeId == that.mainConcept) {
//                 if (!that.internalConnections.includes(conn.id)) {
//                   that.internalConnections.push(conn.id);
//                 }
//               } else {
//                 if (!that.linkers.includes(conn.id)) {
//                   that.linkers.push(conn.id);
//                   console.log("this is updating the linker", that.linkers);
//                 }
//               }

//               if (!that.compositionIds.includes(conn.toTheConceptId)) {
//                 that.compositionIds.push(conn.toTheConceptId);
//                 console.log(
//                   "This is the updated connections",
//                   that.internalConnections,
//                   that.compositionIds,
//                   that.linkers
//                 );
//                 that.isUpdating = false;
//                 console.log("now again this can work");
//               }
//               // that.setState();
//               that.buildData().then(() => {
//                 if (callback) callback(that.mainData);
//               });
//             });
//           }
//         }, 1000);
//       } else {
//         console.log("rejected this");
//       }
//     });
//   }

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

//   async setDataDependency() {
//     let searchQuery = new SearchQuery();
//     searchQuery.composition = 100716269;
//     this.mainConcept = searchQuery.composition;
//     searchQuery.inpage = 10;
//     searchQuery.listLinkers = ["my_console_s"];

//     let searchQuery2 = new SearchQuery();
//     searchQuery2.listLinkers = ["read_access_by"];

//     this.mainData = await SearchLinkMultipleAll(
//       [searchQuery, searchQuery2],
//       "",
//       this
//     );
//     console.log("this is the main data", this.mainData);
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
//     this.listenToEvent(this.mainConcept);
//   }

//   async buildData() {
    // let externalConnections = this.connections.slice();
    // let internalConn = this.internalConnections.slice();
    // let conceptIds = this.concepts.slice();
    // let prefetchConnections = await GetConnectionDataPrefetch(externalConnections);
    // let concepts = await GetCompositionFromConnectionsWithDataIdInObject(conceptIds, internalConn);
    // let out = await FormatFromConnectionsAltered(prefetchConnections, concepts, this.mainConcept, this.reverse);
    // console.log("this is the data", out);
    // this.mainData = out;
//   }

//   async syncUpdated(
//     searchQueries: SearchQuery[],
//     callback: (...args: any) => any
//   ) {
//     let conceptsConnections = await SearchLinkMultipleApi(searchQueries);

//     this.mainConcept = searchQueries?.[0].composition;
//     const result = conceptsConnections;
//     // this.concepts = result.compositionIds;
//     this.internalConnections = result.internalConnections;
//     // this.connections = result.linkers;
//     this.reverse = result.reverse;
//     if (this.internalConnections.length > 1) {
//       console.log("this is the con", this.internalConnections);
//       let allConnections = await GetConnectionBulk(this.internalConnections);
//       for (let i = 0; i < allConnections.length; i++) {
//         if (!this.dependency.includes(allConnections[i].ofTheConceptId)) {
//           this.dependency.push(allConnections[i].ofTheConceptId);
//         }
//         if (!this.dependency.includes(allConnections[i].toTheConceptId)) {
//           this.dependency.push(allConnections[i].toTheConceptId);
//         }
//       }
//     }

//     // const [prefetchConnections, concepts] = await Promise.all([
//     //   GetConnectionDataPrefetch(linkers),
//     //   GetCompositionFromConnectionsWithDataIdInObject(conceptIds,connections)
//     // ]);
//     // await this.setState();
//     this.listenToEvent(this.mainConcept, callback);

//     // build data
//     await this.buildData();

//     callback(this.mainData);

//     // render
//     // this.render()
//   }

//   async setState() {
//     await this.setDataDependency();
//     //await this.buildData();
//     this.render();
//   }

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
            <span>${this.monthlySalary}</span>
            <span>${JSON.stringify(this.mainData)}</span>
            <br/>
            <input id="add-data"/>
            <button id="increase-count" class="btn btn-primary">Increase Salary</button>
        `;

    return html;
  }
}
