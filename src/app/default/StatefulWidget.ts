export class StatefulWidget {
    params: any;
    childComponents: any = [];
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

    onchange(callback: any){
      this.subscribers.push(callback);
      console.log("this is the data update");
      return callback(this.data);
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
      console.log("this is again loading the child widget", this.childComponents);
          this.childComponents.map((child: any) => {
          let widget1 = document.getElementById(child.parentElement);
          console.log("this is the widget to mount", widget1);
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
  
    /**
     * 
     * @param parent This is the function that creates a new div and then mounts the html element to the parent.
     */
    async mount(parent: HTMLElement) {
      this.element = document.createElement("div");
      this.element.innerHTML = await this.getHtml();
      parent.appendChild(this.element);
      this.parentElement = parent.id;
      if(this.componentMounted == false){
        // Simulate componentDidMount by calling it after the component is inserted into the DOM
        this.componentDidMount();
        this.componentMounted = true;
      }
      else{
        this.render();
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