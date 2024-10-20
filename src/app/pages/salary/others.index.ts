import { searchLinkMultipleListener, SearchQuery } from "mftsccs-browser";
import { StatefulWidget } from "../../default/StatefulWidget";

export class others extends StatefulWidget {

    mainConcept: number = 0;
    mainData: any;
    data: number = 0;

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
        searchLinkMultipleListener([searchQuery, searchQuery2]).subscribe((value: any) => {
            this.mainData = value
            console.log('Value Triggered: ', value)
            this.render()
        })
      }



      

      addEvents() {
        let myIncreaseButton = document.getElementById("up-count");
        if (myIncreaseButton) {

      myIncreaseButton.onclick = (event: any) => {
            console.log("this is clicked count", event);
            this.data = this.data + 1;
            this.setState(this.data);
          };
        }
        console.log("thi sis the event", myIncreaseButton);


      }

    
      async getHtml(): Promise<string> {
        // (window as any).increaseCount = this.increaseCount;
        console.log("this is rendering the html element");
        let html = "";
        html = `
                <span>${this.data}</span>
                <br/>
                <button id="up-count" class="btn btn-primary">Increase count</button>
            `;
    
        return html;
      }


}