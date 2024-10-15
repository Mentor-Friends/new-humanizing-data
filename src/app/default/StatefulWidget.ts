export class StatefulWidget {
    params: any;
    childComponents: any = [];
    componentMounted: boolean = false;
    parentElement: string = "";
    oldHtml: HTMLElement | null = null;
    protected element: HTMLElement | null = null;
  
    setTitle(title: string): void {
      document.title = title;
    }


  
    async getHtml(): Promise<string> {    
      return '';
    }

    loadChildWidget(){
      console.log("this is again loading the child widget");
          this.childComponents.map((child: any) => {
          let widget1 = document.getElementById(child.parentElement);
            child.mount(widget1);
          })
  }

  async render(){
      if (this.element) {
          this.element.innerHTML = await this.getHtml();
          this.oldHtml = this.element;
          console.log("this is the old html element",this.oldHtml);
        }
      this.loadChildWidget();
      this.addEvents();
    }
  
    /**
     * 
     * @param parent This is the function that creates a new div and then mounts the html element to the parent.
     */
    async mount(parent: HTMLElement) {
      this.element = document.createElement("div");
      this.element.innerHTML = await this.getHtml();
      parent.appendChild(this.element);
  
      if(this.componentMounted == false){
        // Simulate componentDidMount by calling it after the component is inserted into the DOM
        this.componentDidMount();
        this.componentMounted = true;
      }
    }

  
    /**
     * This is 
     */
    setState(newState: any) {
    }
  
    /**
     * This function will be called after the component mounts.
     */
    componentDidMount(){
  
    }

    addEvents(){
      
    }
  

  }