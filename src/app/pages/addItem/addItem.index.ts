import mainViewClass from "../../default/mainView.class";
import topNavigation from "../../modules/top-nav/top-navigation";
import { initTopNavigation } from "../../modules/top-nav/top-navigation.service";

import {
  addItemDocument,
  getAgentSellers,
  getCategoryList,
  getListingAgents,
  getMyAgentType,
  getSellerAgents,
  submitAddItemForm,
  toggleField,
  updateItemCategory,
  // updateTypeCategory,
  // resetUpdateCategory,
} from "./addItem.service";

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
    (window as any).updateItemCategory = updateItemCategory;
    // (window as any).updateTypeCategory = updateTypeCategory;
    // (window as any).resetUpdateCategory = resetUpdateCategory;

    const itemCategoryHTML = await getCategoryList();
    const myAgentType: any = await getMyAgentType();

    let listingAgentsHTML: any;
    let sellerAgentsHTML: any;
    let sellersHTML: any;
    let agentListHTML: any;

    if (myAgentType) {
      // const listingAgent = myAgentType?.filter(
      //   (agent: any) =>
      //     agent?.data?.agent_request_info?.agentType === "listingAgent" &&
      //     agent?.data?.agent_request_info?.isApproved === "True"
      // );
      const agentType = myAgentType?.data?.agent_request_info?.agentType

      if (agentType === "listingAgent") {
        // listing agent selects seller
        sellersHTML = await getAgentSellers();
        agentListHTML = `
          <div class="mt-4">
            <label for="seller" class="block text-sm font-medium leading-6">Item Seller <span
              class="text-rose-400">*</span></label>
            <select id="seller" name="seller" autocomplete="seller-name"
              class="block w-full rounded-md border-0 mt-2 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
              <option value="" selected disabled>-- select seller --</option>
              ${sellersHTML}
            </select>
          </div>
        `;
      } else {
        await getAgents();
      }
    } else {
      await getAgents();
    }

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

    async function getAgents() {
      listingAgentsHTML = await getListingAgents();
      sellerAgentsHTML = await getSellerAgents();
      agentListHTML = `
        <div class="mt-4">
          <label for="listingagent" class="block text-sm font-medium leading-6">Item listing agent <span
            class="text-rose-400">*</span></label>
          <select id="listingagent" name="listingagent" autocomplete="listingagent-name"
            class="block w-full rounded-md border-0 mt-2 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
            <option value="" selected disabled>-- select listing agent --</option>
            ${listingAgentsHTML}
          </select>
        </div>

        <div class="mt-4">
          <label for="selleragent" class="block text-sm font-medium leading-6">Item seller agent <span
            class="text-rose-400">*</span></label>
          <select id="selleragent" name="selleragent" autocomplete="selleragent-name"
            class="block w-full rounded-md border-0 mt-2 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
            <option value="" selected disabled>-- select seller agent --</option>
            ${sellerAgentsHTML}
          </select>
        </div>
      `;
    }

    // listingAgentsHTML = await getListingAgents();
    // const sellerAgentsHTML = await getSellerAgents();

    setTimeout(() => {
      initTopNavigation();
    }, 500);

    return `
      ${topNavigation}
      <div class="w-4/5 mx-auto my-8 text-zinc-900 dark:text-white">

        <h1>Add Item</h1>
        <form method="post" action="/" onsubmit="submitAddItemForm(event)" name="addItemForm" id="add-item-form">

          <div class="my-4">
            <label for="name" class="block text-sm font-medium leading-6">Item name<span
                class="text-rose-400">*</span></label>
            <div class="mt-2">
              <input type="text" name="name" id="name" autocomplete="item-name"
                class="block w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
            </div>
          </div>

          <div class="my-4">
            <label for="description" class="block text-sm font-medium leading-6">Item description<span
                class="text-rose-400">*</span></label>
            <div class="mt-2">
              <input type="text" name="description" id="description" autocomplete="item-description"
                class="block w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
            </div>
          </div>

          <div class="my-4 sm:max-w-md">
            <label for="itemAttachment" class="block text-sm font-medium leading-6">Item Images<span
                class="text-rose-400">*</span></label>
            <div class="mt-2">
              <input type="file" multiple accept=".png, .jpg, .jpeg" onclick="addItemDocument()" name="itemAttachment" id="itemAttachment" autocomplete="item-attachment"
                class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
            </div>
          </div>

          <div class="mt-4">
            <label for="category" class="block text-sm font-medium leading-6">Item category <span
              class="text-rose-400">*</span></label>
            <select id="category" name="category" autocomplete="category-name"
              class="block w-full rounded-md border-0 mt-2 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900"
              onchange="updateItemCategory(event); if(this.options[this.selectedIndex].value=='cat-custom'){ toggleField(this,this.nextSibling); this.selectedIndex='0';}"
              >
              <option value="" selected disabled>--- select category ---</option>
              <!-- <option value="cat-products">Products</option>
              <option value="cat-services">Services</option>
              <option value="cat-realState">Real State</option>
              <option value="cat-fabrics">Fabrics</option> -->
              ${itemCategoryHTML}
              <option value="cat-custom">[type a custom category]</option>
              <input name="category" style="display:none;" disabled="disabled" onblur="if(this.value==''){toggleField(this,this.previousSibling);}" class="block w-full rounded-md border-0 px-3 py-2 mt-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
            </select>
          </div>

          <div class="mt-4">
            <label for="type" class="block text-sm font-medium leading-6">Item type <span
              class="text-rose-400">*</span></label>
            <select id="type" name="type" autocomplete="type-name"
              class="block w-full rounded-md border-0 mt-2 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900"
              onchange="if(this.options[this.selectedIndex].value=='type-custom'){toggleField(this,this.nextSibling); this.selectedIndex='0';}"
              >
              <option value="" selected disabled>--- select type ---</option>
              <!-- <option value="type1">Basic</option>
              <option value="type2">Standard</option>
              <option value="type3">Premium</option> -->
              <option value="type-custom">[type a custom type]</option>
              <input name="type" style="display:none;" disabled="disabled" onblur="if(this.value==''){toggleField(this,this.previousSibling);}" class="block w-full rounded-md border-0 px-3 py-2 mt-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
            </select>
          </div>

          <div class="my-4">
            <label for="price" class="block text-sm font-medium leading-6">
              Item price<span class="text-rose-400">*</span>
            </label>
            <div class="w-full sm:max-w-md">
            <div class="relative mt-2 rounded-md shadow-sm">
              <!-- <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span class="text-gray-500 sm:text-sm">$</span>
              </div> -->
              
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

          <!-- <div class="my-4">
            <label for="price" class="block text-sm font-medium leading-6">Item price<span
                class="text-rose-400">*</span></label>
            <div class="mt-2">
              <input type="number" name="price" id="price" autocomplete="item-price"
                class="block w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
            </div>
          </div> -->

          ${agentListHTML}

          <div class="my-4">
            <label for="delivery" class="block text-sm font-medium leading-6">Item delivery<span
                class="text-rose-400">*</span></label>
            <div class="mt-2">
              <input type="text" name="delivery" id="delivery" autocomplete="item-delivery"
                class="block w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
            </div>
          </div>

          <div class="mt-4">
            <label for="country" class="block text-sm font-medium leading-6">Country<span
              class="text-rose-400">*</span></label>
            <select id="country" name="country" autocomplete="country-name"
              class="block w-full rounded-md border-0 mt-2 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
              <option value="Nepal">Nepal</option>
              <option value="United States">United States</option>
              <option value="Spain">Spain</option>
            </select>
          </div>

          <div class="my-4">
            <label for="quantity" class="block text-sm font-medium leading-6">Item quantity<span
                class="text-rose-400">*</span></label>
            <div class="mt-2">
              <input type="number" name="quantity" id="quantity" autocomplete="item-quantity"
                class="block w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
            </div>
          </div>

          <div class="my-4">
            <label for="quality" class="block text-sm font-medium leading-6">Item quality<span
                class="text-rose-400">*</span></label>
            <div class="mt-2">
              <input type="text" name="quality" id="quality" autocomplete="item-quality"
                class="block w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
            </div>
          </div>

          <button
            class="bg-green-600 cursor-pointer hover:bg-green-900 text-white text-sm leading-6 font-medium py-3 px-6 m-2 rounded-lg"
            type="submit">Add Item Now</button>
        </form>

      </div>
    `;
  }
}
