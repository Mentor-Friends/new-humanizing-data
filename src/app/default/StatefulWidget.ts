export class StatefulWidget {
    params: any;
    childComponents: any = [];
    elementIdentifier: number = 0;
    componentMounted: boolean = false;
    parentElement: string = "";
    oldHtml: HTMLElement | null = null;
    data: any;
    subscribers: any = [];
    protected element: HTMLElement | null = null;
  
    setTitle(title: string): void {
      document.title = title;
    }
  
    async getHtml(): Promise<string> {    
      return '';
    }


    createRandomNumber(){
      this.elementIdentifier = Math.random() * 10000;
      return this.elementIdentifier;
    }

    dataChange(callback: any){
      this.subscribers.push(callback);
      return callback(this.data);
    }


   UpdateChildData(value: any, widget: StatefulWidget){
    let creating = widget;
    creating.data = value;
    creating.render();
    creating.updateComponent();
   }

   updateComponent(){
   }

    notify(){
        this.subscribers.map((subscriber: any) => {
            console.log('notify')

            subscriber(this.data)
        });
    }


    setState(newState: any) {
        this.data = newState;
        this.notify();
        this.render();
    }

    loadChildWidget(){
     // debugger
      console.log("this is again loading the child widget", this.childComponents, this.constructor.name);
          this.childComponents.map((child: any) => {
          let widget1 = document.getElementById(child.parentElement);
          if(widget1){
            widget1.innerHTML = "";
          }
            child.mount(widget1);
          })
  }

  async render(){
      if (this.element) {
          this.element.innerHTML = await this.getHtml();
        }
      this.addEvents();
      this.loadChildWidget();
    }

    getComponent(): HTMLElement | null{
      let component = document.getElementById(this.elementIdentifier.toString());
      return component;
    }

    getElementById(identifier: string){
      let element = this.getComponent();
      let selectedElement: HTMLElement = document.body ;
      if(element){
         let myelement =  <HTMLElement>element.querySelector('#'+identifier);
         if(myelement){
          selectedElement = myelement;
         }
      }
      return selectedElement;

    }

    mountChildWidgets(){

    }
  
    /**
     * 
     * @param parent This is the function that creates a new div and then mounts the html element to the parent.
     */
    async mount(parent: HTMLElement) {
      if(parent){
        this.element = document.createElement("div");
        this.element.id = this.createRandomNumber().toString();
        this.element.innerHTML = await this.getHtml();
        parent.appendChild(this.element);
        this.parentElement = parent.id;
        if(this.componentMounted == false){
          // Simulate componentDidMount by calling it after the component is inserted into the DOM
          this.componentDidMount();
          this.mountChildWidgets();
  
          this.componentMounted = true;
        }
        else{
          this.render();
        }
      }

    }

  
    /**
     * This function will be called after the component mounts.
     */
    componentDidMount(){
  
    }

    addEvents(){

    }
  

  }