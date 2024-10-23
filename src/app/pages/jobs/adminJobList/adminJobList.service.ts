import {
  MakeTheInstanceConcept,
  SearchLinkMultipleAll,
  SearchQuery,
} from "mftsccs-browser";
import { getLocalStorageData } from "../../../services/helper.service";

export async function getallJobItems() {
  return new Promise(async (resolve: any, reject: any) => {
    try {
      const profileStorageData: any = await getLocalStorageData();
      const userId = profileStorageData?.userId;
      const token = profileStorageData?.token;

      const humanizingData = await MakeTheInstanceConcept(
        "the_listing",
        "Humanizing Data",
        false,
        userId
      );
      
      console.log("humanizingData", humanizingData);

      let searchfirst = new SearchQuery();
      searchfirst.composition = humanizingData?.id;
      searchfirst.fullLinkers = ["the_item_s_listing"];
      searchfirst.reverse = true;
      searchfirst.inpage = 100;

      let searchsecond = new SearchQuery();
      searchsecond.fullLinkers = [
        "the_item_name",
        "the_item_price",
        "the_item_category",
        "the_item_s_image",
        "the_item_number",
        "the_item_department",
        "the_item_expire"

      ];
      searchsecond.inpage = 100;

      let searchthird = new SearchQuery();
      searchthird.fullLinkers = [
        "the_attachment_url",
      ];
      searchthird.inpage = 100;

      const queryParams = [searchfirst, searchsecond, searchthird];
      const output = await SearchLinkMultipleAll(queryParams, token);
      console.log("output ->", output);

      const listingItems =
        output?.data?.the_listing?.the_item_s_listing_reverse;
      console.log(listingItems, "listingitems");

      const itemList = listingItems?.map((item: any) => {
        console.log(item,"Itemsssssssssssssssssss");
        
        const itemDetails = item?.data?.the_item;
        console.log(itemDetails, "item details");

        return {
          id: item?.id,
          name: itemDetails?.the_item_name?.[0]?.data?.the_name,
          price: itemDetails?.the_item_price?.[0]?.data?.the_price,
          category: itemDetails?.the_item_category?.[0]?.data?.the_category,
          image:
            itemDetails?.the_item_s_image?.[0]?.data?.the_attachment
              ?.the_attachment_url?.[0]?.data?.the_url,
          expire:itemDetails?.the_item_expire?.[0]?.data?.the_expire,
          department: itemDetails?.the_item_department?.[0]?.data?.the_department
        };
        
      });

      console.log("itemList", itemList);
      

      const finalItemsList = itemList
        ?.map((item: any) => {
          if (!item?.image || item?.image === "undefined")
            item.image = "https://placehold.co/600x600";
          return `
            <tr>
            <!..  <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
               
              </td>..>
              <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
                ${item?.name  || ""}
              </td>
              <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
                ${item?.department || ""}
              </td>
              <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
                ${item?.start || ""}
              </td>
              <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
                ${item?.expire || ""}
              </td>
            
              <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400 flex space-x-2">
              <svg class="h-6 w-6 text-gray-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z"/>  
                <circle cx="12" cy="12" r="2" />  
                <path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" />  
                <path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" />
              </svg>
              <div onclick>
              <svg class="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6" />  
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />  
                <line x1="10" y1="11" x2="10" y2="17" />  
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
              </div>
              
              <svg class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
            </td>


            </tr>
          `;
        })
        .join("");

      const finalHtml = `
        <table class="border-collapse w-full border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800 text-sm shadow-sm">
          <thead class="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Job Title</th>
              <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Department</th>
              <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Posted At</th>
              <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Expired At</th>

              <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${finalItemsList}
          </tbody>
        </table>
        
      `;
      
      resolve(finalHtml);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  }); 
}
