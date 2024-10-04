export class StatefulWidget {
    params: any;
    protected element: HTMLElement | null = null;
    constructor(params: any) {
      this.params = params;
    }
  
    setTitle(title: string): void {
      document.title = title;
    }


  
    async getHtml(): Promise<string> {    
      return '';
    }
  
    /**
     * 
     * @param parent This is the function that creates a new div and then mounts the html element to the parent.
     */
    async mount(parent: HTMLElement){
  
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
  
    render(){
  
    }
  }