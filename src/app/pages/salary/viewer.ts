import { GetCompositionListener, NORMAL } from "mftsccs-browser";
import { StatefulWidget } from "../../default/StatefulWidget";

export class viewer extends StatefulWidget{
    output: any;

    componentDidMount(): void {
        this.render();
    }

    updateComponent(){
        if(this.data?.id){
            console.log("this is calling the update", this.data.id);
            GetCompositionListener(this.data.id, NORMAL).subscribe((value: any)=>{
                this.output = value.the_phonebook;
                console.log("this is the output", this.output);
                this.render();
            })
        }

    }


    async getHtml(): Promise<string> {
        let html = "";
        html = `<div>
                <div>
                    <span> name: ${this.output?.name} </span>
                </div>
                <div>
                    <span> name: ${this.output?.phone} </span>
                </div>

        </div>`
        return html;
    }
}