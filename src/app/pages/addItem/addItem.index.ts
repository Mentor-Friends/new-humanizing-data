import mainViewClass from "../../default/mainView.class";
import topNavigation from "../../modules/top-nav/top-navigation";
import { loadHTML } from "./addItem.service";

import { submitAddItemForm } from "./addItem.service";

// import { formcheck } from "./addItem.service";

export default class extends mainViewClass {
  constructor(params: any) {
    super(params);
    this.setTitle("Add Item | Humanizing Data");
  }

  async getHtml() {
    // Attach the function to the global window object
    (window as any).submitAddItemForm = submitAddItemForm;

    // window.addEventListener("load", async (event: Event) => {
    //   console.log('event ->', event)
    //   const formcheckResponse = await formcheck()
    //   console.log('formcheckresponse', formcheckResponse)
    // })

    return `
      ${topNavigation}
      ${loadHTML}
    `;
  }
}
