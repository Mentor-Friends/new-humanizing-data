// import { SearchLinkInternal, SearchStructure } from "mftsccs-browser";
import { getLocalStorageData } from "../../services/helper.service";
import { openModal } from "../listItem/listItem.service";
import { environment } from "../../environments/environment.dev";

const thetaBoommAPI = environment?.boomURL;

export async function getRFQ() {
  const profileStorageData: any = await getLocalStorageData();
  const token = profileStorageData?.token;

  // let search = new SearchStructure();
  // search.composition = "the_rfq";
  // search.inpage = 100;
  // let values = await SearchLinkInternal(search, token);

  const queryRFQ = [
    {
      type: "the_rfq",
      fullLinkers: [
        "the_rfq_title",
        "the_rfq_description",
        "the_rfq_budget",
        "the_rfq_buyer",
        "the_rfq_timestamp",
        "the_rfq_buyeragent",
        "the_rfq_s_item",
        "the_rfq_s_attachment",
      ],
      // "reverse": true,
      inpage: 100,
      page: 1,
      logic: "or",
      filterSearches: [],
    },
    {
      fullLinkers: [
        // attachment
        "the_attachment_name",
        "the_attachment_size",
        "the_attachment_type",
        "the_attachment_url",
        // listing item
        "the_item_name",
        "the_item_category",
        "the_item_description",
        "the_item_price",
        "the_item_type",
        "the_item_listingagent",
        "the_item_selleragent",
        "the_item_delivery",
        "the_item_country",
        "the_item_quantity",
        "the_item_quality",
        "the_item_s_listing",
        "the_item_s_sku",
        // buyer
        "the_entity_user",
        "the_entity_firstname",
        "the_entity_lastname",
        "the_entity_email",
        "the_entity_username",
      ],
      inpage: 100,
      page: 1,
      logic: "or",
      filterSearches: [],
    },
    {
      fullLinkers: [
        "the_sku_stockIn",
        "the_sku_stockOut",
        "the_sku_stockRemaining",
      ],
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

  const rfqList = output?.map((item: any) => {
    const rfqData = item?.data?.the_rfq;
    const rfqItem = rfqData?.the_rfq_s_item?.[0]?.data?.the_item;
    const rfqAttachment =
      rfqData?.the_rfq_s_attachment?.[0]?.data?.the_attachment;
    const rfqBuyer = rfqData?.the_rfq_buyer?.[0]?.data?.the_entity;
    const rfqDetails = {
      id: item?.id,
      title: rfqData?.the_rfq_title?.[0]?.data?.the_title,
      description: rfqData?.the_rfq_description?.[0]?.data?.the_description,
      budget: rfqData?.the_rfq_budget?.[0]?.data?.the_budget,
      timestamp: new Date(
        rfqData?.the_rfq_timestamp?.[0]?.data?.the_timestamp
      ).toLocaleString(),
      item: {
        id: rfqData?.the_rfq_s_item?.[0]?.id,
        name: rfqItem?.the_item_name?.[0]?.data?.the_name,
        description: rfqItem?.the_item_description?.[0]?.data?.the_description,
        type: rfqItem?.the_item_type?.[0]?.data?.the_type,
        price: rfqItem?.the_item_price?.[0]?.data?.the_price,
        category: rfqItem?.the_item_category?.[0]?.data?.the_category,
        quantity: rfqItem?.the_item_quantity?.[0]?.data?.the_quantity,
      },
      attachment: {
        name: rfqAttachment?.the_attachment_name?.[0]?.data?.the_name,
        url: rfqAttachment?.the_attachment_url?.[0]?.data?.the_url,
        size: rfqAttachment?.the_attachment_size?.[0]?.data?.the_size,
        type: rfqAttachment?.the_attachment_type?.[0]?.data?.the_type,
      },
      buyer: {
        email: rfqBuyer?.the_entity_email?.[0]?.data?.the_email,
        username: rfqBuyer?.the_entity_username?.[0]?.data?.the_username,
        firstName:
          rfqBuyer?.the_entity_user?.[0]?.data?.the_user?.entity?.first_name,
        lastName:
          rfqBuyer?.the_entity_user?.[0]?.data?.the_user?.entity?.last_name,
        conceptId: rfqBuyer?.the_entity_user?.[0]?.id,
      },
      buyeragent: {},
    };
    return rfqDetails;
  });

  let rfqHTML = `
    <div class="text-center py-8">
      <p class="text-zinc-900 dark:text-white">You do not have any RFQs yet.</p>
    </div>
  `;

  if (rfqList.length) {
    const rfqDataList = rfqList
      ?.map((rfq: any) => {
        let isRFQItemSelected =
          rfq?.item?.name && rfq?.item?.name !== "undefined" ? true : false;
        let rfqItem = "";
        if (isRFQItemSelected) {
          rfqItem = `
            <router-link href="/listitem/${rfq?.item?.id}" class="cursor-pointer text-blue-400 hover:text-blue-600">${rfq?.item?.name}</router-link>
          `;
        }

        let isRFQFileAttached =
          rfq?.attachment?.name && rfq?.attachment?.name !== "undefined"
            ? true
            : false;
        let rfqAttachment = "";
        if (isRFQFileAttached) {
          rfqAttachment = `
           <a href="${rfq?.attachment?.url}" target="_blank">${rfq?.attachment?.name}</a>
          `;
        }

        return `
          <tr>
            <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
              ${rfq?.title}
            </td>
            <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
              ${rfq?.description}
            </td>
            <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
              $${rfq?.budget}
            </td>
            <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
              ${rfq?.timestamp}
            </td>
            <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
              ${rfqItem}
            </td>
            <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
              ${rfqAttachment}
            </td>
            <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
              <router-link href="" class="block px-4 py-2 leading-loose text-xs text-center text-white font-semibold bg-green-600 hover:bg-green-700 rounded-xl cursor-pointer">
                View Details
              </router-link>
            </td>
          </tr>
        `;
      })
      .join("");

    rfqHTML = `
      <table class="border-collapse w-full border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800 text-sm shadow-sm">
        <thead class="bg-slate-50 dark:bg-slate-700">
          <tr>
            <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Title</th>
            <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Description</th>
            <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Budget</th>
            <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Created Date</th>
            <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Listed Item</th>
            <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Attachment</th>
            <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Details</th>
          </tr>
        </thead>
        <tbody>
          ${rfqDataList}
        </tbody>
      </table>
    `;
  }

  return rfqHTML;
}

export async function openRFQModal() {
  await openModal("rfq-modal");
}
