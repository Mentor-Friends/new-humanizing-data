import {
  FilterSearch,
  MakeTheInstanceConcept,
  SearchLinkMultipleAll,
  SearchQuery,
} from "mftsccs-browser";
import { getLocalStorageData } from "../../../services/helper.service";

export async function getPostedJobs() {
  return new Promise(async (resolve: any, reject: any) => {
    try {
      const profileStorageData: any = await getLocalStorageData();
      const userId = profileStorageData?.userId;
      const token = profileStorageData?.token;
      const userEntityId = profileStorageData?.entityId;

      const humanizingData = await MakeTheInstanceConcept(
        "the_listing",
        "Humanizing Data",
        false,
        userId
      );

      let searchfirst = new SearchQuery();
      searchfirst.composition = humanizingData?.id;
      searchfirst.fullLinkers = ["the_item_s_listing"];
      searchfirst.reverse = true;
      searchfirst.doFilter = true;
      searchfirst.inpage = 100;
      // searchfirst.selectors = ["the_item", "the_item_name"];

      let searchsecond = new SearchQuery();
      searchsecond.fullLinkers = [
        "the_listingagent_s_item",
        "the_seller_s_item",
      ];
      // searchsecond.fullLinkers = ["the_seller_s_item"];
      searchsecond.reverse = true;
      searchsecond.doFilter = true;
      searchsecond.inpage = 100;
      searchsecond.selectors = [
        "the_item",
        "the_item_name",
        "the_item_description",
        "the_item_category",
        "the_item_price",
        "the_item_priceType",
        "the_item_priceCurrency",
        "the_item_type",
        // "the_item_s_image",
      ];

      let filterSearch = new FilterSearch();
      // filterSearch.type = "listingagent";
      filterSearch.type = "seller";
      filterSearch.search = `${userEntityId}`;
      filterSearch.composition = false;
      // searchsecond.filterSearches = [filterSearch];

      let filterSearchTwo = new FilterSearch();
      filterSearchTwo.type = "listingagent";
      filterSearchTwo.search = `${userEntityId}`;
      filterSearchTwo.composition = false;
      searchsecond.filterSearches = [filterSearch, filterSearchTwo];

      const queryParams = [searchfirst, searchsecond];
      const output = await SearchLinkMultipleAll(queryParams, token);

      const myPostedJobs =
        output?.data?.the_listing?.the_item_s_listing_reverse;

      let postedJobsHTML: any;
      if (myPostedJobs?.length) {
        const jobsList = myPostedJobs?.map((job: any) => {
          const jobItem = job?.data?.the_item;
          return {
            id: job?.id,
            createdAt: job?.created_at,
            name: jobItem?.the_item_name?.[0]?.data?.the_name,
            description:
              jobItem?.the_item_description?.[0]?.data?.the_description,
            price: jobItem?.the_item_price?.[0]?.data?.the_price,
            priceCurrency:
              jobItem?.the_item_priceCurrency?.[0]?.data?.the_priceCurrency,
            priceType: jobItem?.the_item_priceType?.[0]?.data?.the_priceType,
          };
        });
        postedJobsHTML = jobsList
          .map((job: any) => {
            return `
              <div class="grid grid-cols-3 gap-4 my-4 border rounded p-4">
                <div class="p-4 rounded-lg shadow-lg bg-indigo-500 col-span-3">
                  <h1 class="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                    ${job?.name}
                  </h1>
                  <p class="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                    ${job?.priceCurrency || "$"}${job?.price} ${
              job?.priceType || ""
            }
                  </p>
                  <p class="mb-6 text-gray-900 dark:text-white">
                    ${job?.description}
                  </p>

                  <router-link href="/job/${
                    job.id
                  }" class="mx-auto my-4 px-4 py-3 leading-loose text-xs text-center text-white font-semibold bg-green-600 hover:bg-green-700 rounded cursor-pointer">View Job Info And Applicants</router-link>
                </div>

                <!-- <div class="">Image</div> -->
              </div>
            `;
          })
          .join("");
      } else {
        postedJobsHTML = `
        <div class="flex justify-center flex-col text-center">
          <p>You do not have posted any jobs yet.</p>
          <router-link href="/additem" class="mx-auto my-4 px-4 py-3 leading-loose text-xs text-center text-white font-semibold bg-green-600 hover:bg-green-700 rounded-xl cursor-pointer">Post New Job</router>
        </div>
        `;
      }

      resolve(postedJobsHTML);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}
