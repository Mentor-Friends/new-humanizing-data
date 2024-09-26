import mainViewClass from "../../default/mainView.class";
import topNavigation from "../../modules/top-nav/top-navigation";
import { submitAccountingForm } from "./accounting.services";

export default class extends mainViewClass {
  constructor(params: any) {
    super(params);
    this.setTitle('Accounting');
  }
  async getHtml(): Promise<string> {
    (window as any).submitAccoountingForm = submitAccountingForm;
    setTimeout(async() => {

    }, 100);
    // const cal= await diplayCalendar()
    // console.log("here",cal)
      return `
      ${topNavigation}
      <div id="loader" class="center"></div>
      <div class="w-4/5 mx-auto my-8">
     <form method="post" onsubmit="submitAccoountingForm(event)" class="mt-10">
        <h2 class="dark:text-white text-2xl">Information:</h2>
        <div class="grid gap-6 mb-6 mt-6 md:grid-cols-3">
            <div class="form-control">
              <label for="Topic" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Transaction Topic*</label>
              <input type="text" id="topic"
                 name="topic"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="" />
                <small></small>
            </div>
            
             <div class="form-control">
              <label for="amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Transaction Amount*</label>
              <input type="number" id="amount"
                 name="amount"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="5000" />
                <small></small>
            </div>

            <div class="form-control">
              <label for=account" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Transaction Account*</label>
              <input type="text" id="account"
                 name="account"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="" />
                <small></small>
            </div>
            </div>
            <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"> 
            <button type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >Submit</button>
        </form>
      </div>  
      `
    }
    }        