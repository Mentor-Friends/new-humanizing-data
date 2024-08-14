// import { SearchLinkInternal, SearchStructure } from "mftsccs-browser";
import { getLocalStorageData } from "../../services/helper.service";
import { environment } from "../../environments/environment.dev";

const thetaBoommAPI = environment?.boomURL;

// export async function getHTML() {
//   try {
//     const response = await fetch(
//       "src/app/pages/listing/listing.component.html"
//     );
//     if (!response.ok) {
//       throw new Error("Network response was not ok " + response.statusText);
//     }
//     const htmlContent = await response.text();
//     return htmlContent;
//   } catch (error) {
//     console.error("There has been a problem with your fetch operation:", error);
//   }
// }

// export const loadHTML = await getHTML();
// export async function loadHTML() {
//   return await getHTML();
// }

export async function initiateListing() {
  // initTopNavigation()
  // getProducts()
  // return true
}

export async function getProducts() {
  return new Promise(async (resolve: any, reject: any) => {
    try {

      const profileStorageData: any = await getLocalStorageData();
      let token = profileStorageData?.token;

      // let search = new SearchStructure();
      // search.composition = "the_item";
      // search.inpage = 100;
      
      // let values = await SearchLinkInternal(search, token);
      // const productList = values;

      const queryRFQ = [
        {
          type: "the_item",
          fullLinkers: ["the_item_name", "the_item_price", "the_item_category", "the_item_s_image"],
          inpage: 100,
          page: 1,
          logic: "or",
          filterSearches: [],
        },
        {
          fullLinkers: ["the_attachment", "the_attachment_url"],
          inpage: 100,
          page: 1,
          logic: "or",
          filterSearches: [],
        },
      ];

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const response = await fetch(
        `${thetaBoommAPI}/api/search-all-with-linker?inpage=100&page=1`,
        {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify(queryRFQ),
          redirect: "follow",
        }
      );
      const output = await response.json();
      // console.log("ITEM output ->", output);

      const productList = output.map((productItem: any) => {
        // const productItem = output;
        const item = productItem?.data?.the_item;
        const itemImageList = item?.the_item_s_image?.map((itemImage: any) => {
          return itemImage?.data?.the_attachment?.the_attachment_url?.[0]?.data
            ?.the_url;
        });
        const itemData: any = {
          id: productItem?.id,
          data: {
            name: item?.the_item_name?.[0]?.data?.the_name,
            category: item?.the_item_category?.[0]?.data?.the_category,
            price: item?.the_item_price?.[0]?.data?.the_price,
            image: itemImageList?.[0],
            // description: item?.the_item_description?.[0]?.data?.the_description,
            // priceType: item?.the_item_priceType?.[0]?.data?.the_priceType,
            // priceCurrency:
            //   item?.the_item_priceCurrency?.[0]?.data?.the_priceCurrency,
            // type: item?.the_item_type?.[0]?.data?.the_type,
            // listingagent:
            //   item?.the_item_listingagent?.[0]?.data?.the_listingagent,
            // selleragent: item?.the_item_selleragent?.[0]?.data?.the_selleragent,
            // delivery: item?.the_item_delivery?.[0]?.data?.the_delivery,
            // country: item?.the_item_country?.[0]?.data?.the_country,
            // quantity: item?.the_item_quantity?.[0]?.data?.the_quantity,
            // quality: item?.the_item_quality?.[0]?.data?.the_quality,
            // attachment: item?.the_item_attachment?.[0]?.data?.the_attachment,
            // imageList: itemImageList,
          },
        };
        return itemData;
      });

      // console.log('productList new ->', productList)

      let listingItems = `
        <div class="py-8 text-center">
          <h4 class="text-center text-zinc-900 dark:text-white">You have not added any items yet.</h4>
        </div>
      `;

      if (productList.length) {
        listingItems = productList
          .map((product: any) => {
            if (!product?.data?.image || product?.data?.image === "undefined")
              product.data.image = "https://placehold.co/600x600";
            return `
            <router-link href="/listitem/${product?.id}" class="mx-auto border sm:mr-0 group cursor-pointer lg:mx-auto bg-white transition-all duration-500 w-full">
              <img src="${product?.data?.image}" alt="face cream image" class="w-full border object-cover aspect-square">
              <!-- <div>
                <img src="${product?.data?.image}" alt="face cream image" class="w-full border aspect-square">
              </div> -->
              <div class="p-4">
                <div class="flex items-center justify-between">
                  <h6 class="truncate font-semibold text-xl leading-8 text-black transition-all duration-500 group-hover:text-indigo-600">${product?.data?.name}</h6>
                  <h6 class="font-semibold text-xl leading-8 text-indigo-600">$${product?.data?.price}</h6>
                </div>
                <!-- <p class="mt-2 font-normal text-sm leading-6 text-gray-500">${product?.data?.category}</p> -->
              </div>
            </router-link>
          `;
          })
          .join("");
      }

      const itemListLoader = <HTMLDivElement>(
        document.getElementById("item-list-loader")
      );
      itemListLoader.classList.add("hidden");

      const itemListContainer = <HTMLDivElement>(
        document.getElementById("item-list-container")
      );
      itemListContainer.classList.remove("hidden");

      const itemContainer = <HTMLDivElement>(
        document.getElementById("product-listings")
      );
      itemContainer.innerHTML = listingItems;

      resolve(listingItems);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

// export async function _getProducts() {
//   const productList: any = await fetch(
//     "https://fakestoreapi.com/products?limit=10"
//   )
//     .then((res) => res.json())
//     .then((json) => {
//       return json;
//     });

//   const listingItems = await productList
//     .map((product: any) => {
//       return `
//       <router-link href="/listitem/${product.id}" class="mx-auto sm:mr-0 group cursor-pointer lg:mx-auto bg-white transition-all duration-500">
//         <div class="">
//           <img src="${product.image}" alt="face cream image" class="w-full aspect-square">
//         </div>
//         <div class="mt-5">
//           <div class="flex items-center justify-between">
//             <h6 class="font-semibold text-xl leading-8 text-black transition-all duration-500 group-hover:text-indigo-600">${product.title}</h6>
//             <h6 class="font-semibold text-xl leading-8 text-indigo-600">$${product.price}</h6>
//           </div>
//           <p class="mt-2 font-normal text-sm leading-6 text-gray-500">${product.category}</p>
//         </div>
//       </router-link>
//     `;
//     })
//     .join("");

//   return listingItems;
// }
