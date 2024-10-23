import FroalaEditor from "froala-editor";
import mainViewClass from "../../../default/mainView.class";
// import topNavigation from "../../../modules/top-nav/top-navigation";
import { initTopNavigation } from "../../../modules/top-nav/top-navigation.service";
import { sidebarHTML, sidebarMenu } from "../../../services/ui/sidebar.service";
import { textarea } from "../textarea.index";
import "froala-editor/css/froala_editor.pkgd.min.css";

import {
  addItemDocument,
  submitAddItemForm,
  toggleField,
} from "./adminAddJob.service";

export default class extends mainViewClass {
  constructor(params: any) {
    super(params);
    this.setTitle("Add Item | Humanizing Data");
  }

  async getHtml() {
    // Attach the function to the global window object
    (window as any).submitAddItemForm = submitAddItemForm;
    (window as any).addItemDocument = addItemDocument;
    (window as any).toggleField = toggleField;
    // (window as any).updateItemCategory = updateItemCategory;
    // (window as any).updateTypeCategory = updateTypeCategory;
    // (window as any).resetUpdateCategory = resetUpdateCategory;

    // const itemCategoryHTML = await getCategoryList();
    // const myAgentType: any = await getMyAgentType();
    // const itemJob : any =await getJobCategory();

    // let listingAgentsHTML: any;
    // let sellerAgentsHTML: any;
    // let sellersHTML: any;
    // let agentListHTML: any;

    // if (myAgentType) {
    //   // const listingAgent = myAgentType?.filter(
    //   //   (agent: any) =>
    //   //     agent?.data?.agent_request_info?.agentType === "listingAgent" &&
    //   //     agent?.data?.agent_request_info?.isApproved === "True"
    //   // );
    //   const agentType = myAgentType?.data?.agent_request_info?.agentType

    //   if (agentType === "listingAgent") {
    //     // listing agent selects seller
    //     sellersHTML = await getAgentSellers();
    //     agentListHTML = `
    //       <div class="mt-4">
    //         <label for="seller" class="block text-sm font-medium leading-6">Item Seller <span
    //           class="text-rose-400">*</span></label>
    //         <select id="seller" name="seller" autocomplete="seller-name"
    //           class="block w-full rounded-md border-0 mt-2 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
    //           <option value="" selected disabled>-- select seller --</option>
    //           ${sellersHTML}
    //         </select>
    //       </div>
    //     `;
    //   } else {
    //     await getAgents();
    //   }
    // } else {
    //   await getAgents();
    // }

    // if (myAgentType?.length) {
    //   const listingAgent = myAgentType?.filter(
    //     (agent: any) =>
    //       agent?.data?.agent_request_info?.agentType === "listingAgent" &&
    //       agent?.data?.agent_request_info?.isApproved === "True"
    //   );

    //   if (listingAgent?.length) {
    //     sellersHTML = await getAgentSellers();
    //     agentListHTML = `
    //     <div class="mt-4">
    //       <label for="seller" class="block text-sm font-medium leading-6">Item Seller <span
    //         class="text-rose-400">*</span></label>
    //       <select id="seller" name="seller" autocomplete="seller-name"
    //         class="block w-full rounded-md border-0 mt-2 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
    //         <option value="" selected disabled>-- select seller --</option>
    //         ${sellersHTML}
    //       </select>
    //     </div>
    //   `;
    //   } else {
    //     await getAgents();
    //   }
    // } else {
    //   await getAgents();
    // }

    // async function getAgents() {
    //   listingAgentsHTML = await getListingAgents();
    //   sellerAgentsHTML = await getSellerAgents();
    //   agentListHTML = `
    //     <div class="mt-4">
    //       <label for="listingagent" class="block text-sm font-medium leading-6">Item listing agent <span
    //         class="text-rose-400">*</span></label>
    //       <select id="listingagent" name="listingagent" autocomplete="listingagent-name"
    //         class="block w-full rounded-md border-0 mt-2 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
    //         <option value="" selected disabled>-- select listing agent --</option>
    //       </select>
    //     </div>

    //     <div class="mt-4">
    //       <label for="selleragent" class="block text-sm font-medium leading-6">Item seller agent <span
    //         class="text-rose-400">*</span></label>
    //       <select id="selleragent" name="selleragent" autocomplete="selleragent-name"
    //         class="block w-full rounded-md border-0 mt-2 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
    //         <option value="" selected disabled>-- select seller agent --</option>
    //       </select>
    //     </div>
    //   `;
    // }

    // listingAgentsHTML = await getListingAgents();
    // const sellerAgentsHTML = await getSellerAgents();

    setTimeout(() => {
      initTopNavigation();
      // Initialize Froala Editor after the page has loaded
      new FroalaEditor("#description", {
        toolbarButtons: {
          moreText: {
            buttons: [
              "bold",
              "italic",
              "underline",
              "strikeThrough",
              "subscript",
              "superscript",
              "fontFamily",
              "fontSize",
              "textColor",
              "backgroundColor",
              "inlineClass",
              "inlineStyle",
              "clearFormatting",
            ],
            align: "left",
          },
          moreParagraph: {
            buttons: [
              "alignLeft",
              "alignCenter",
              "formatOLSimple",
              "alignRight",
              "alignJustify",
              "formatOL",
              "formatUL",
              "paragraphFormat",
              "paragraphStyle",
              "lineHeight",
              "outdent",
              "indent",
              "quote",
            ],
            align: "left",
          },
          moreRich: {
            buttons: [
              "insertLink",
              "insertImage",
              "insertTable",
              "emoticons",
              "specialCharacters",
              "insertFile",
            ],
            align: "left",
          },
          moreMisc: {
            buttons: [
              "undo",
              "redo",
              "fullscreen",
              "print",
              "getPDF",
              "spellChecker",
              "selectAll",
              "html",
              "help",
            ],
            align: "right",
          },
        },
        heightMin: 200,
        heightMax: 400,
        // iconsTemplate: 'font_awesome_5',
        attribution: false,
      });
    }, 500);

    return `
      ${await sidebarHTML()}
      <div class="flex flex-row justify-end px-4 py-2 shadow w-full">${sidebarMenu()}</div>
      <div class="w-4/5 mx-auto my-8 text-zinc-900 dark:text-white">

        <h1>Add Item</h1>
         <form method="post" action="/" onsubmit="submitAddItemForm(event)" name="addItemForm" id="add-item-form">
        <!-- Hidden input for category set to Jobs -->
        <input type="hidden" name="category" value="100593641">

        <div class="my-4">
            <label for="name" class="block text-sm font-medium leading-6">Job title
                <span class="text-rose-400">*</span>
            </label>
            <div class="mt-2">
                <input type="text" name="name" id="name" autocomplete="item-name" placeholder="Title of job"
                    class="block w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
            </div>
        </div>

        <div class="my-4">
            <label for="number" class="block text-sm font-medium leading-6">Number of Vacation
                <span class="text-rose-400">*</span>
            </label>
            <div class="mt-2">
                <input type="number" name="number" id="number" autocomplete="number-of-vacation" placeholder="Number of Vacation"
                    class="block w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
            </div>
        </div>

        <div class="my-4 sm:max-w-md">
            <label for="itemAttachment" class="block text-sm font-medium leading-6">Item Images
                <span class="text-rose-400">*</span>
            </label>
            <div class="mt-2">
                <input type="file" multiple accept=".png, .jpg, .jpeg" onclick="addItemDocument()" name="itemAttachment" id="itemAttachment" autocomplete="item-attachment"
                    class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
            </div>
        </div>
         <div class="mt-4">
            <label for="department" class="block text-sm font-medium leading-6">Job Category  
                <span class="text-rose-400">*</span>
            </label>
            <select id="department" name="department" autocomplete="type-name"
                class="block w-full rounded-md border-0 mt-2 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900"
               >
                <option value="" selected disabled>--- select type ---</option>
                <option value="technical">Technical</option>
                <option value="sales">Sales</option>
                <option value="marketing">Marketing</option>
                <option value="finance">Finance</option>
                <option value="admin">Administration</option>
                <option value="hr">Human Resource</option>
            </select>
        </div>
        <div class="mt-4">
            <label for="type" class="block text-sm font-medium leading-6">Job Nature
                <span class="text-rose-400">*</span>
            </label>
            <select id="type" name="type" autocomplete="type-name"
                class="block w-full rounded-md border-0 mt-2 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900"
               >
                <option value="" selected disabled>--- select type ---</option>
                <option value="part_time">Part time</option>
                <option value="full_time">Full time</option>
            </select>
        </div>
          <div class="my-4">
              <label for="skills" class="block text-sm font-medium leading-6">Required Knowledge, Skills and Abilities
                  <span class="text-rose-400">*</span>
              </label>
              <div class="mt-2">
                  <textarea name="skills" id="description" class="block w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900"></textarea>
              </div>
          </div>
            <div class="my-4">
              <label for="description" class="block text-sm font-medium leading-6">Job Description
                  <span class="text-rose-400">*</span>
              </label>
              <div class="mt-2">
                  <textarea name="description" id="description" class="block w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900"></textarea>
              </div>
          </div>
          <div class="my-4">
            <label for="price" class="block text-sm font-medium leading-6">
              Item price<span class="text-rose-400">*</span>
            </label>
            <div class="w-full sm:max-w-md">
            <div class="relative mt-2 rounded-md shadow-sm">
             
              
              <input type="number" name="price" id="price" class="block w-full rounded-md border-0 py-1.5 pl-24 pr-40 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900" placeholder="0.00">
              <div class="absolute inset-y-0 right-0 flex items-center">
                <label for="priceType" class="sr-only">priceType</label>
                <select id="priceType" name="priceType" class="h-full rounded-md border-0 text-zinc-900 dark:text-white bg-transparent py-0 pl-2 pr-7 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                  <option class="text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">per day</option>
                  <option class="text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">per piece</option>
                  <option class="text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">per square meter</option>
                  <option class="text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">per kilogram</option>
                </select>
              </div>
              <div class="absolute inset-y-0 left-0 flex items-center">
                <label for="priceCurrency" class="sr-only">priceCurrency</label>
                <select id="priceCurrency" name="priceCurrency" class="h-full rounded-md border-0 text-zinc-900 dark:text-white bg-transparent py-0 px-3 mr-2 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                  <option class="text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">USD</option>
                  <option class="text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">CAD</option>
                  <option class="text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">EUR</option>
                </select>
              </div>
              </div>
            </div>
          </div>


     

        

        

         <div class="mt-4">
            <label for="education" class="block text-sm font-medium leading-6">Education
                <span class="text-rose-400">*</span>
            </label>
            <select id="education" name="education" autocomplete="type-name"
                class="block w-full rounded-md border-0 mt-2 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900"
               >
                <option value="" selected disabled>--- select type ---</option>
                <option value="high_school">High School</option>
                <option value="bachelor">Bachelors</option>
                <option value="master">Master</option>
            </select>
        </div>
      
         <div class="mt-4">
          <label for="expire" class="block text-sm font-medium leading-6">Expiry Date
                  <span class="text-rose-400">*</span>
          </label>
         <input type="date" name="expire" id="expire" required
           class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
         </div>
        

          <button
            class="bg-green-600 cursor-pointer hover:bg-green-900 text-white text-sm leading-6 font-medium py-3 px-6 m-2 rounded-lg"
            type="submit">Add Item Now</button>
        </form>

      </div>
    `;
  }
}
