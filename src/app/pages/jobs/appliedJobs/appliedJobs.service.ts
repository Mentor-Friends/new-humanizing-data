import { SearchLinkMultipleAll, SearchQuery } from "mftsccs-browser";
import { getLocalStorageData } from "../../../services/helper.service";

export async function getAllAppliedJobs() {
  const profileStorageData: any = await getLocalStorageData();
  const token = profileStorageData?.token;
  const userEntityId = profileStorageData?.entityId;

  let searchfirst = new SearchQuery();
  searchfirst.composition = userEntityId;
  searchfirst.fullLinkers = ["the_entity", "the_entity_s_appliedJob"];
  searchfirst.inpage = 100;

  let searchSecond = new SearchQuery();
  // searchSecond.composition = productId;
  searchSecond.fullLinkers = [
    "the_item",
    "the_item_name",
    "the_item_description",
    "the_item_category",
    "the_item_price",
    "the_item_priceType",
    "the_item_priceCurrency",
    "the_item_type",
    "the_item_listingagent",
    "the_item_selleragent",
    "the_item_delivery",
    "the_item_country",
    "the_item_quantity",
    "the_item_quality",
    "the_item_s_image",
    "the_item_s_listing",
  ];
  searchSecond.inpage = 100;

  let searchThird = new SearchQuery();
  searchThird.fullLinkers = ["the_attachment", "the_attachment_url"];
  searchThird.inpage = 100;

  const queryParams = [searchfirst, searchSecond, searchThird];
  const searchResult = await SearchLinkMultipleAll(queryParams, token);
  console.log("searchResult getMyAppliedJob ->", searchResult);

  const appliedJobList =
    searchResult?.data?.the_entity?.the_entity_s_appliedJob;

  // return searchResult;

  let appliedJobsHTML = `
    <div class="text-center py-8">
      <p class="text-zinc-900 dark:text-white">You do not have any Applied jobs yet.</p>
    </div>
  `;

  if (appliedJobList?.length) {
    console.log("appliedJobList", appliedJobList);

    const jobList = appliedJobList?.map((job: any) => {
      const jobData = job?.data?.the_item;
      return {
        id: job?.id,
        createdAt: job?.created_at,
        name: jobData?.the_item_name?.[0]?.data?.the_name,
        description: jobData?.the_item_description?.[0]?.data?.the_description,
        price: jobData?.the_item_price?.[0]?.data?.the_price,
        priceCurrency:
          jobData?.the_item_priceCurrency?.[0]?.data?.the_priceCurrency,
        priceType: jobData?.the_item_priceType?.[0]?.data?.the_priceType,
        type: jobData?.the_item_type?.[0]?.data?.the_type,
      };
    });

    appliedJobsHTML = jobList
      ?.map((job: any) => {
        return `
        <tr>
            <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
              ${job?.name}
            </td>
            <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
              ${job?.description}
            </td>
            <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
              ${job?.priceCurrency || '$'} ${job?.price} ${job?.priceType || ''}
            </td>
            <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
              ${job?.type}
            </td>
            <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
              ${job?.createdAt}
            </td>
            <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
              <router-link href="/job/${job?.id}" class="block px-4 py-2 leading-loose text-xs text-center text-white font-semibold bg-green-600 hover:bg-green-700 rounded-xl cursor-pointer">
                View Job Details
              </router-link>
            </td>
          </tr>
      `;
      })
      .join("");
    
      return `
      <table class="border-collapse w-full border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800 text-sm shadow-sm">
          <thead class="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Title</th>
              <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Description</th>
              <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Budget</th>
              <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Type</th>
              <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Created Date</th>
              <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            ${appliedJobsHTML}
          </tbody>
        </table>
    `;
  }

  return appliedJobsHTML
  
}
