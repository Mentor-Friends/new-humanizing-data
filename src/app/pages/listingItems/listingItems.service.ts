import {
  MakeTheInstanceConcept,
  SearchLinkMultipleAll,
  SearchQuery,
} from "mftsccs-browser";
import { getLocalStorageData } from "../../services/helper.service";

export async function getListingItems() {
  return new Promise(async (resolve: any, reject: any) => {
    try {
      const profileStorageData: any = await getLocalStorageData();
      const userId = profileStorageData?.userId;
      const token = profileStorageData?.token;

      const boomconsoleData = await MakeTheInstanceConcept(
        "the_listing",
        "Boomconsole",
        false,
        userId
      );
      console.log("boomconsoleData", boomconsoleData);

      let searchfirst = new SearchQuery();
      searchfirst.composition = boomconsoleData?.id;
      searchfirst.fullLinkers = ["the_item_s_listing"];
      searchfirst.reverse = true;
      searchfirst.inpage = 100;

      let searchsecond = new SearchQuery();
      searchsecond.fullLinkers = [
        "the_item_name",
        "the_item_price",
        "the_item_category",
        "the_item_s_image",
      ];
      searchsecond.inpage = 100;

      let searchthird = new SearchQuery();
      searchthird.fullLinkers = [
        // "the_attachment",
        "the_attachment_url",
      ];
      searchthird.inpage = 100;

      const queryParams = [searchfirst, searchsecond, searchthird];
      const output = await SearchLinkMultipleAll(queryParams, token);
      console.log("output ->", output);

      const listingItems =
        output?.data?.the_listing?.the_item_s_listing_reverse;

      const itemList = listingItems?.map((item: any) => {
        const itemDetails = item?.data?.the_item;
        return {
          id: item?.id,
          name: itemDetails?.the_item_name?.[0]?.data?.the_name,
          price: itemDetails?.the_item_price?.[0]?.data?.the_price,
          category: itemDetails?.the_item_category?.[0]?.data?.the_category,
          // image: itemDetails?.the_item_image?.[0]?.data?.the_image,
          image:
            itemDetails?.the_item_s_image?.[0]?.data?.the_attachment
              ?.the_attachment_url?.[0]?.data?.the_url,
        };
      });

      console.log("itemList", itemList);

      const finalItemsList = itemList
        ?.map((item: any) => {
          if (!item?.image || item?.image === "undefined")
            item.image = "https://placehold.co/600x600";
          return `
            <router-link href="/listitem/${item?.id}" class="mx-auto border sm:mr-0 group cursor-pointer lg:mx-auto bg-white transition-all duration-500 w-full">
              <img src="${item?.image}" alt="face cream image" class="w-full border object-cover aspect-square">
              <!-- <div>
                <img src="${item?.image}" alt="face cream image" class="w-full border aspect-square">
              </div> -->
              <div class="p-4">
                <div class="flex items-center justify-between">
                  <h6 class="truncate font-semibold text-xl leading-8 text-black transition-all duration-500 group-hover:text-indigo-600">${item?.name}</h6>
                  <h6 class="font-semibold text-xl leading-8 text-indigo-600">$${item?.price}</h6>
                </div>
                <!-- <p class="mt-2 font-normal text-sm leading-6 text-gray-500">${item?.category}</p> -->
              </div>
            </router-link>
          `;
        })
        .join("");

      resolve(finalItemsList);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}
