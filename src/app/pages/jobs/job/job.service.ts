import {
  GetTheConceptLocal,
  Concept,
  LocalSyncData,
  MakeTheInstanceConceptLocal,
  SearchLinkInternal,
  SearchLinkMultipleAll,
  SearchQuery,
  SearchStructure,
  // ViewInternalData,
} from "mftsccs-browser";
import {
  itemSkuLinker,
  // rfqAttachmentLinker,
  // s_item_linker,
} from "../../../constants/type.constants";
import { createEntityInstance } from "../../../services/createEntityInstance.service";
import { CreateConnectionBetweenEntityLocal } from "../../../services/entity.service";
import {
  getEntityByUserconceptId,
  getLocalStorageData,
} from "../../../services/helper.service";

import rfqModalHTML from "../../../modules/rfq-modal/rfq-modal";
import listModalHTML from "../../../modules/list-modal/list-modal";
// import { showToast } from "../../../modules/toast-bar/toast-bar.index";
import { environment } from "../../../environments/environment.dev";
import { closeModal } from "../../../services/modal.service";
import { ListOfJob } from "../../../services/getJob.services";
import { interviewschedueGetFormData } from "../../../modules/setInterview-modal/setInterview-modal";
import { getProfileFormData } from "../../../modules/setInterview-modal/setIndividualProfileView-modal";

const thetaBoommAPI = environment?.boomURL;
// let attachmentConcept: Concept;
// for modal

export async function openIndividualProfileModal(
  modalId: string,
  userConceptId: number
) {
  const check = document.getElementById(modalId);
  if (check) check.style.display = "block";
  document.getElementsByTagName("body")[0].classList.add("overflow-y-hidden");

  await getProfileFormData(userConceptId);
  // Close all modals when press ESC
  document.onkeydown = function (event: any) {
    if (event.code === "Escape" || event.key === "Escape") {
      // if (check) check.style.display = "none";
      closeIndividualProfileModal(modalId);
    }
  };
}
export async function closeIndividualProfileModal(modalId: string) {
  const modal: any = document.getElementById(modalId);
  // const modalFormEl = modal.querySelector("form");
  // modalFormEl.reset();

  if (modal) modal.style.display = "none";
  document
    .getElementsByTagName("body")[0]
    .classList.remove("overflow-y-hidden");
}
export async function openScheduleInterviewModal(
  modalId: string,
  userConceptId: number
) {
  await interviewschedueGetFormData(userConceptId);
  const userConcept: any = document.getElementById("userConceptId");
  userConcept.value = userConceptId;
  const check = document.getElementById(modalId);
  if (check) check.style.display = "block";
  document.getElementsByTagName("body")[0].classList.add("overflow-y-hidden");

  // Close all modals when press ESC
  document.onkeydown = function (event: any) {
    if (event.code === "Escape" || event.key === "Escape") {
      // if (check) check.style.display = "none";
      closeinterViewModal(modalId);
    }
  };
}
export async function closeinterViewModal(modalId: string) {
  const modal: any = document.getElementById(modalId);
  // const modalFormEl = modal.querySelector("form");
  // modalFormEl.reset();

  if (modal) modal.style.display = "none";
  document
    .getElementsByTagName("body")[0]
    .classList.remove("overflow-y-hidden");
}
let rfqModalHTMLCode = `
  <h1>Hey</h1>
`;
let listModalHTMLCode = `
  <h1>List Modal</h1>
`;
let listingItem: any;
let isItemListedByMe: boolean = false;
let jobId!: number;
export async function getMyListingItems() {
  let search = new SearchStructure();
  search.composition = "the_item";
  search.inpage = 100;

  const profileStorageData: any = await getLocalStorageData();
  let token = profileStorageData?.token;
  let values = await SearchLinkInternal(search, token);

  return values;
}

export async function _getMyAppliedJob() {
  const profileStorageData: any = await getLocalStorageData();
  const token = profileStorageData?.token;
  const userEntityId = profileStorageData?.entityId;

  let searchfirst = new SearchQuery();
  searchfirst.composition = userEntityId;
  searchfirst.fullLinkers = ["the_entity", "the_entity_s_appliedJob"];
  searchfirst.inpage = 100;

  const queryParams = [searchfirst];
  const output = await SearchLinkMultipleAll(queryParams, token);
  return output;
}

export async function getJobApplicants(jobProductId: number) {
  let jobProId = jobProductId;
  const output: any = await ListOfJob(jobProId);

  let applicantData = output?.data?.the_item?.the_entity_s_appliedJob_reverse;
  let applicantHTML: any;
  if (applicantData?.length) {
    const applicantList = applicantData?.map((applicant: any) => {
      const applicantUserData =
        applicant?.data?.the_entity?.the_entity_user?.[0]?.data?.the_user;
      const userProfileIndex = applicantUserData?.the_user_profile?.length - 1;
      return {
        entityId: applicant?.id,
        userConceptId: applicant?.data?.the_entity?.the_entity_user?.[0]?.id,
        profileImage:
          applicantUserData?.the_user_profile?.[userProfileIndex]?.data
            ?.the_profile?.the_profile_profilePic?.[0]?.data?.the_profilePic ||
          applicantUserData?.entity?.person?.profile_img,
        fname:
          applicantUserData?.the_user_profile?.[userProfileIndex]?.data
            ?.the_profile?.the_profile_first_name?.[0]?.data?.the_first_name ||
          applicantUserData?.entity?.person?.first_name,
        lname:
          applicantUserData?.the_user_profile?.[userProfileIndex]?.data
            ?.the_profile?.the_profile_last_name?.[0]?.data?.the_last_name ||
          applicantUserData?.entity?.person?.last_name,
        bio: applicantUserData?.entity?.person?.bio,
        status:
          applicantUserData?.the_user_interViewSchedule?.[0]?.data
            ?.the_interViewSchedule?.the_interViewSchedule_status?.[0]?.data
            ?.the_status,
        email:
          applicantUserData?.the_user_profile?.[userProfileIndex]?.data
            ?.the_profile?.the_profile_email?.[0]?.data?.the_email ||
          applicantUserData?.entity?.person?.email,
        location: applicantUserData?.entity?.person?.location,
        phone:
          applicantUserData?.the_user_profile?.[userProfileIndex]?.data
            ?.the_profile?.the_profile_phone?.[0]?.data?.the_phone ||
          applicantUserData?.entity?.person?.phone,
      };
    });
    applicantHTML = applicantList
      ?.map((applicant: any) => {
        if (!applicant?.profileImage || applicant?.profileImage === "undefined")
          applicant.profileImage = "https://placehold.co/600x600";
        return `
        <tr>
            <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
              <img src="${applicant?.profileImage}" alt="profile image of ${
          applicant?.name
        }" class="rounded w-[48px] h-[48px] bg-gray-200">
            </td>
            <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
              ${applicant?.fname + " " + applicant?.lname || ""}
            </td>
            <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
              ${applicant?.status || "unScreened"}
            </td>
            <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
              ${applicant?.email || ""}
            </td>
            <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
              ${applicant?.location || ""}
            </td>
            <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
              ${applicant?.phone || ""}
            </td>
            <td class="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
              <a href="${thetaBoommAPI}/bm/${
          applicant?.userConceptId
        }" target="_blank" class="block px-4 py-2 leading-loose text-xs text-center text-white font-semibold bg-green-600 hover:bg-green-700 hover:text-gray-200 rounded-xl cursor-pointer">
                Visit Profile
              </a>
              <td class="border border-slate-300 dark:border-slate-700 p-3 text-slate-500 dark:text-slate-400">
              <button class="text-center bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-700 transition"
              onclick="openIndividualProfileModal('create-viewIndividualProfile-modal',${
                applicant?.userConceptId
              })">
              View Profile
              </button>
              
            </td>
              <td class="border border-slate-300 dark:border-slate-700 p-3 text-slate-500 dark:text-slate-400">
              <button class="text-center bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-700 transition"
              onclick="openScheduleInterviewModal('create-setInterview-modal',
              ${applicant?.userConceptId},
              )">
              Interview Schedule
              </button>
            </td>
            </td>
          </tr>
      `;
      })
      .join("");

    return `
    <div class="my-8">
    <h2 class="mb-4">Job Applicants</h2>
    <table class="border-collapse w-full border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800 text-sm shadow-sm">
        <thead class="bg-slate-50 dark:bg-slate-700">
          <tr>
            <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Photo</th>
            <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Name</th>
            <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Status</th>
            <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Email</th>
            <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Location</th>
            <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Phone</th>
            <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">CV</th>
            <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">View Profile</th>
            <th class="w-1/7 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${applicantHTML}
        </tbody>
      </table>
    </div>
  `;
  }

  return "";
}

export async function getMyAppliedJobStatus(jobProductId: number) {
  const profileStorageData: any = await getLocalStorageData();
  const token = profileStorageData?.token;
  const userEntityId = profileStorageData?.entityId;

  const myHeaders = new Headers();
  // myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const response = await fetch(
    `${thetaBoommAPI}/api/Connection/get-link-reverse?compositionId=${jobProductId}&linker=the_entity_s_appliedJob`,
    {
      method: "GET",
      headers: myHeaders,
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    console.error(`${response.status} ${errorData}`);
    return null;
  }

  const appliedJobsData = await response.json();
  console.log("appliedJobsData getMyAppliedJobStatus ->", appliedJobsData);

  if (appliedJobsData?.output?.length) {
    return appliedJobsData?.output?.some(
      (appliedEntity: any) => appliedEntity?.id === userEntityId
    );
  }
  return false;
}

export async function applyJob(itemId: number) {
  // alert('Applied!')

  const profileStorageData: any = await getLocalStorageData();
  const userEntityId = profileStorageData?.entityId;
  console.log("userEntityId", userEntityId);

  console.log("itemId", itemId);
  console.log("jobId", jobId);

  const userEntityConcept: Concept = await GetTheConceptLocal(userEntityId);
  const jobItemConcept: Concept = await GetTheConceptLocal(jobId);

  console.log("userEntityConcept", userEntityConcept);
  console.log("jobItemConcept", jobItemConcept);

  const connectionResponse = await CreateConnectionBetweenEntityLocal(
    userEntityConcept,
    jobItemConcept,
    "s_appliedJob"
  );
  console.log("connectionResponse", connectionResponse);

  // the_entity
  // the_entity_s_appliedJob
  // the_item

  await LocalSyncData.SyncDataOnline();

  // show toast
  alert("Job applied successfully!");
  // send email
}

export async function getJobDetails(productId: number) {
  try {
    const profileStorageData: any = await getLocalStorageData();
    const token = profileStorageData?.token;
    const userId = profileStorageData?.userId;

    jobId = productId;

    let searchfirst = new SearchQuery();
    searchfirst.composition = productId;
    searchfirst.fullLinkers = [
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
    searchfirst.inpage = 100;

    let searchsecond = new SearchQuery();
    searchsecond.fullLinkers = ["the_attachment", "the_attachment_url"];
    searchsecond.inpage = 100;

    const queryParams = [searchfirst, searchsecond];
    const output = await SearchLinkMultipleAll(queryParams, token);
    console.log("output product ->", output);

    const productItem = output;
    const item = productItem?.data?.the_item;
    const itemImageList = item?.the_item_s_image?.map((itemImage: any) => {
      return itemImage?.data?.the_attachment?.the_attachment_url?.[0]?.data
        ?.the_url;
    });
    const product: any = {
      id: productItem?.id,
      data: {
        name: item?.the_item_name?.[0]?.data?.the_name,
        description: item?.the_item_description?.[0]?.data?.the_description,
        category: item?.the_item_category?.[0]?.data?.the_category,
        price: item?.the_item_price?.[0]?.data?.the_price,
        priceType: item?.the_item_priceType?.[0]?.data?.the_priceType,
        priceCurrency:
          item?.the_item_priceCurrency?.[0]?.data?.the_priceCurrency,
        type: item?.the_item_type?.[0]?.data?.the_type,
        listingagent: item?.the_item_listingagent?.[0]?.data?.the_listingagent,
        selleragent: item?.the_item_selleragent?.[0]?.data?.the_selleragent,
        delivery: item?.the_item_delivery?.[0]?.data?.the_delivery,
        country: item?.the_item_country?.[0]?.data?.the_country,
        quantity: item?.the_item_quantity?.[0]?.data?.the_quantity,
        quality: item?.the_item_quality?.[0]?.data?.the_quality,
        imageList: itemImageList,
        listing: item?.the_item_s_listing?.[0]?.data?.the_listing,
      },
    };

    listingItem = product;
    let imagesHTML: string = "";
    if (!product?.data?.imageList?.length) {
      imagesHTML = `<img class="w-full border" src="https://placehold.co/600x600" alt="item image" />`;
    } else {
      const itemImageList = product?.data?.imageList?.map(
        (imageData: any, index: number) => {
          const imgHTML = `<img class="w-full border" src="${imageData}" alt="item image ${index}" />`;
          return imgHTML;
        }
      );

      const imagesFilteredHTML = itemImageList
        ?.filter(
          (itemImage: any = "", index: number) => itemImage && index !== 0
        )
        .join("");

      imagesHTML = `
        ${itemImageList?.[0]}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
          ${imagesFilteredHTML}
        </div>
      `;
    }

    // check if item is listed by me
    // const myListingItems = await getMyListingItems();

    // if (myListingItems.length) {
    //   isItemListedByMe = myListingItems?.some(
    //     (item: any) => item?.id === product.id
    //   );
    // }

    const productDetailsData = await GetTheConceptLocal(productId);
    isItemListedByMe = userId === productDetailsData?.userId;

    let productDetails: string = "";
    let jobApplicants: string = "";

    if (product?.errors) {
      productDetails = `
        <div class="py-20 text-center">
          <p>There is no such item</p>
        </div>
      `;
    } else {
      const skuData: any = await getSkuDetails();
      let listedInfoEl = "";

      let accessibleButtons = "";
      if (isItemListedByMe) {
        if (product?.data?.listing) {
          listedInfoEl = `
            <hr class="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
            <p>Listed at: ${product?.data?.listing}</p>
          `;
        }
        accessibleButtons = `
          <button class="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-700 transition" onclick="openModal('list-modal')">
            List this Item
          </button>

          <button class="bg-rose-500 text-white rounded-md px-4 py-2 hover:bg-rose-700 transition"
            onclick="openModal('modelConfirm')">
            Update Item SKU
          </button>
        `;

        // check job applicants here
        jobApplicants = await getJobApplicants(Number(productId));
      } else {
        const isJobApplied: any = await getMyAppliedJobStatus(
          Number(productId)
        );
        if (isJobApplied) {
          accessibleButtons = `
            <button disabled class="bg-green-500 text-white rounded-md px-4 py-2 bg-green-700 transition">
              Already applied
            </button>
          `;
        } else {
          accessibleButtons = `
            <button class="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-700 transition" onclick="applyJob()">
              Apply Job
            </button>
          `;
        }
      }

      productDetails = `
        <div class="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16" id="list-item">
          <div class="shrink-0 max-w-md lg:max-w-lg mx-auto">
            ${imagesHTML}
          </div>

          <div class="mt-6 sm:mt-8 lg:mt-0">
            <h1 class="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
              ${product?.data?.name}
            </h1>
            <div class="mt-4 sm:items-center sm:gap-4 sm:flex">
              <p class="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                $${product?.data?.price}
              </p>
            </div>

            <hr class="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

            <p class="mb-6 text-gray-500 dark:text-gray-400">
              ${product?.data?.description}
            </p>

            <p class="mb-6 text-gray-500 dark:text-gray-400">
            Stocks In: ${skuData?.totalStockIn || 0}, Stocks Out: ${
        skuData?.totalStockOut || 0
      }, Stocks Remaining: ${skuData?.toatalStockRemaining || 0}
            </p>

            ${listedInfoEl}

            <div class="max-w-screen-xl px-4 mx-auto 2xl:px-0 text-center py-8">
              ${accessibleButtons}
            </div>

            <div id="list-modal" class="fixed hidden z-50 inset-0 bg-gray-900 bg-opacity-60 dark:bg-gray-200 dark:bg-opacity-40 overflow-y-auto h-full w-full px-4">
              ${listModalHTMLCode}
            </div>

            <div id="rfq-modal" class="fixed hidden z-50 inset-0 bg-gray-900 bg-opacity-60 dark:bg-gray-200 dark:bg-opacity-40 overflow-y-auto h-full w-full px-4">
              ${rfqModalHTMLCode}
            </div>

            <div id="modelConfirm"
              class="fixed hidden z-50 inset-0 bg-gray-900 bg-opacity-60 dark:bg-gray-200 dark:bg-opacity-40 overflow-y-auto h-full w-full px-4 ">
              <div class="relative top-20 mx-auto shadow-xl rounded-md bg-white max-w-md text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
                <div class="flex justify-between px-4 pt-4">
                  <h3 class="text-xl font-normal text-zinc-900 dark:text-white my-0">SKU Details</h3>
                  <button onclick="closeModal('modelConfirm')" type="button"
                    class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>

                <div class="p-6 pt-0">
                  <form method="post" onsubmit="submitUpdateSKUForm(event)" name="updateSKUForm"
                    id="update-sku-form">
                    <div class="my-4">
                      <label for="stockIn" class="block text-sm font-medium leading-6">Stock In<span
                          class="text-rose-400">*</span></label>
                      <div class="mt-2">
                        <input type="number" name="stockIn" id="stockIn" autocomplete="sku-stockIn"
                          class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
                      </div>
                    </div>
                    <div class="my-4">
                      <label for="stockOut" class="block text-sm font-medium leading-6">Stock Out<span
                          class="text-rose-400">*</span></label>
                      <div class="mt-2">
                        <input type="number" name="stockOut" id="stockOut" autocomplete="sku-stockOut"
                          class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
                      </div>
                    </div>
                    <div class="my-4">
                      <label for="stockRemaining" class="block text-sm font-medium leading-6">Stock Remaining<span
                          class="text-rose-400">*</span></label>
                      <div class="mt-2">
                        <input type="number" name="stockRemaining" id="stockRemaining" autocomplete="sku-stockRemaining"
                          class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
                      </div>
                    </div>

                    <div class="text-right">
                      <button type="button" onclick="closeModal('modelConfirm')"
                        class="text-gray-900 bg-white hover:bg-gray-300 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center"
                        data-modal-toggle="delete-user-modal">
                        Cancel
                      </button>
                      <button type="submit"
                        class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2">
                        Update SKU Now
                      </button>
                    </div>
                  </form>

                </div>
              </div>
            </div>
          </div>

          </div>
          ${jobApplicants}
      `;
    }
    return productDetails;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getListingItemDetails() {
  return listingItem;
}

export async function getSkuDetails() {
  return new Promise(async (resolve: any, reject: any) => {
    try {
      let urlPath = location.pathname;
      let itemId = Number(urlPath.substring(5));

      const profileStorageData: any = await getLocalStorageData();
      const token = profileStorageData?.token;

      // let search = new SearchStructure();
      // search.composition = "the_rfq";
      // search.inpage = 100;

      // let values = await SearchLinkInternal(search, token);

      // let search = new SearchStructure();
      // search.composition = "the_buyeragent";
      // search.inpage = 100;

      // let values = await SearchLinkInternal(search, token);

      let searchfirst = new SearchQuery();
      searchfirst.composition = itemId;
      searchfirst.fullLinkers = ["the_item_s_sku"];
      searchfirst.inpage = 100;

      let searchsecond = new SearchQuery();
      searchsecond.fullLinkers = [
        "the_sku_stockIn",
        "the_sku_stockOut",
        "the_sku_stockRemaining",
      ];
      searchsecond.inpage = 100;

      const queryParams = [searchfirst, searchsecond];
      const output = await SearchLinkMultipleAll(queryParams, token);

      // sku summary
      const skuData = output?.data?.the_item?.the_item_s_sku;

      const skuStockIn = skuData?.reduce(
        (accum: number, curr: any) =>
          Number(accum) +
          Number(curr?.data?.the_sku?.the_sku_stockIn?.[0]?.data?.the_stockIn),
        0
      );

      const skuStockOut = skuData?.reduce(
        (accum: number, curr: any) =>
          Number(accum) +
          Number(
            curr?.data?.the_sku?.the_sku_stockOut?.[0]?.data?.the_stockOut
          ),
        0
      );

      const skuStockRemaining = skuData?.reduce(
        (accum: number, curr: any) =>
          Number(accum) +
          Number(
            curr?.data?.the_sku?.the_sku_stockRemaining?.[0]?.data
              ?.the_stockRemaining
          ),
        0
      );

      if (isItemListedByMe) listModalHTMLCode = await listModalHTML();
      else rfqModalHTMLCode = await rfqModalHTML();

      resolve({
        totalStockIn: skuStockIn,
        totalStockOut: skuStockOut,
        toatalStockRemaining: skuStockRemaining,
      });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

export async function submitUpdateSKUForm(e: any) {
  e.preventDefault();
  const formData: any = new FormData(e.target);
  const formValues: any = Object.fromEntries(formData); // output as an object
  await createItemSKU(formValues);
}

export async function createItemSKU(formValues: any) {
  let urlPath = location.pathname;
  let itemId = Number(urlPath.substring(5));

  const itemEntityConcept: Concept = await GetTheConceptLocal(itemId);

  const profileStorageData: any = await getLocalStorageData();
  const userId = profileStorageData?.userId;

  const skuEntityConcept: Concept = await createEntityInstance(
    "sku",
    userId,
    formValues
  );

  // the_item_s_sku
  await CreateConnectionBetweenEntityLocal(
    itemEntityConcept,
    skuEntityConcept,
    itemSkuLinker
  );
  await LocalSyncData.SyncDataOnline();

  closeModal("modelConfirm");
}

// for modal
// export async function openModal(modalId: string) {
//   const check = document.getElementById(modalId);
//   if (check) check.style.display = "block";
//   document.getElementsByTagName("body")[0].classList.add("overflow-y-hidden");

//   // Close all modals when press ESC
//   document.onkeydown = function (event: any) {
//     if (event.code === "Escape" || event.key === "Escape") {
//       // if (check) check.style.display = "none";
//       closeModal(modalId);
//     }
//   };
// }

export async function createListingPlatform() {
  const listingInstanceConcept: Concept = await MakeTheInstanceConceptLocal(
    `the_listing`,
    "Nepal CRE",
    true,
    999,
    4,
    999
  );

  await LocalSyncData.SyncDataOnline();
  console.log("listingInstanceConcept ->", listingInstanceConcept);
}

// export async function closeModal(modalId: string) {
//   const modal: any = document.getElementById(modalId);

//   const modalFormEl = modal.querySelector("form");
//   modalFormEl.reset();

//   if (modal) modal.style.display = "none";
//   document
//     .getElementsByTagName("body")[0]
//     .classList.remove("overflow-y-hidden");
//   // Close all modals when press ESC
//   // document.onkeydown = function (event) {
//   //   event = event || window.event;
//   //   if (event.keyCode === 27) {
//   //     document
//   //       .getElementsByTagName("body")[0]
//   //       .classList.remove("overflow-y-hidden");
//   //     let modals = document.getElementsByClassName("modal");
//   //     Array.prototype.slice.call(modals).forEach((i) => {
//   //       i.style.display = "none";
//   //     });
//   //   }
//   // };
// }

// export async function submitRFQForm(e: any) {
//   e.preventDefault();

//   const formData: any = new FormData(e.target);
//   // output as an object
//   const formValues: any = Object.fromEntries(formData);

//   const rfqResponse = await createItemRFQ(formValues);
// }

// export async function createItemRFQ(formValues: any) {

//   // let urlPath = location.pathname;
//   // let itemId = Number(urlPath.substring(10));

//   // // const itemEntityConcept: Concept = await GetTheConcept(itemId);
//   // const itemEntityConcept = await GetTheConceptLocal(itemId);

//   const profileStorageData: any = await getLocalStorageData();
//   const userId = profileStorageData?.userId;
//   const token = profileStorageData?.token;

//   // buyerAgentEntity
//   const buyAgentEntityDetails = await getBuyerAgentData(
//     Number(formValues?.buyeragent),
//     userId,
//     token
//   );

//   delete formValues.attachment;
//   delete formValues.buyeragent;
//   delete formValues.buyer;

//   // formValues.buyer = profileStorageData?.entityId;
//   formValues.timestamp = new Date().toISOString();

//   const rfqEntityConcept = await createEntityInstance(
//     "rfq",
//     userId,
//     formValues
//   );

//   // the_rfq_buyer
//   const buyerConcept: Concept = await GetTheConceptLocal(
//     profileStorageData?.entityId
//   );
//   await CreateConnectionBetweenEntityLocal(
//     rfqEntityConcept,
//     buyerConcept,
//     "buyer"
//   );

//   // the_rfq_buyeragent
//   await CreateConnectionBetweenEntityLocal(
//     rfqEntityConcept,
//     buyAgentEntityDetails,
//     "buyeragent"
//   );

//   // the_rfq_s_attachment
//   await CreateConnectionBetweenEntityLocal(
//     rfqEntityConcept,
//     attachmentConcept,
//     rfqAttachmentLinker
//   );

//   // the_rfq_s_item
//   let urlPath = location.pathname;
//   let itemId = Number(urlPath.substring(10));

//   if (itemId > 0) {
//     const itemEntityConcept = await GetTheConceptLocal(itemId);
//     // the_rfq_s_item
//     await CreateConnectionBetweenEntityLocal(
//       rfqEntityConcept,
//       itemEntityConcept,
//       s_item_linker
//     );
//   }

//   await LocalSyncData.SyncDataOnline();

//   closeModal("rfq-modal");
//   setTimeout(async () => {
//     await showToast(
//       "success",
//       "RFQ sent successfully!",
//       "Your RFQs can view in RFQ page.",
//       "top-right",
//       5000
//     );
//   }, 100);
// }

export async function getBuyerAgentData(
  buyerAgentConceptId: number,
  userId: number,
  token: string
) {
  let buyerAgentEntityConcept: Concept;

  let search = new SearchStructure();
  search.composition = "the_buyeragent";
  search.inpage = 100;

  let values = await SearchLinkInternal(search, token);
  console.log("values the_buyeragent ->", values);

  // return

  // let buyerAgentEntityConcept: Concept;

  // const myHeaders = new Headers();
  // myHeaders.append("Content-Type", "application/json");
  // myHeaders.append("Authorization", `Bearer ${token}`);

  // const buyerAgentConceptResponse = await fetch(
  //   `${thetaBoommAPI}/api/search-compositions-internal?search=&type=&composition=the_buyeragent&inpage=10&page=1`,
  //   {
  //     method: "GET",
  //     headers: myHeaders,
  //     redirect: "follow",
  //   }
  // );

  // const output = await buyerAgentConceptResponse.json();

  // const buyerAgentEntityId = Number(Object.keys(output)?.[0]);

  // return

  // if (buyerAgentEntityId) {
  // if (values.length) {
  //   const buyerAgentEntityId = values?.[0]?.id
  //   buyerAgentEntityConcept = await GetTheConceptLocal(buyerAgentEntityId);
  // } else {
  const entityDetails = await getEntityByUserconceptId(
    Number(buyerAgentConceptId),
    token
  );

  // const entityDetails: any = await fetch(
  //   `${thetaBoommAPI}/api/get-entity-from-user?userConceptId=${userConceptId}`
  // )
  //   .then((res) => res.json())
  //   .then((json) => {
  //     return json;
  //   });

  const entityId = entityDetails?.entity;

  buyerAgentEntityConcept = await MakeTheInstanceConceptLocal(
    "the_buyeragent",
    "",
    true,
    userId,
    4,
    999,
    entityId
  );
  // }

  return buyerAgentEntityConcept;
}

export async function addDocument() {
  const attachmentEl = <HTMLInputElement>document.getElementById("attachment");
  attachmentEl.addEventListener("change", (e: any) => {
    const files = e.target.files[0];
    // const docName = files.name;

    // for (let i = 0; i < files.length; i++) {
    //   const file = files.item(i);
    //   const fileName = file.name;
    //   // this.uploadFile(file, fileName);
    // }

    // let formdata = new FormData();
    // formdata.append("file", files);

    uploadFile(files);
  });

  // event.target.value = null;
}

export async function uploadFile(files: any) {
  let formdata = new FormData();
  formdata.append("file", files);

  const profileStorageData: any = await getLocalStorageData();
  // const userId = profileStorageData?.userId;
  const token = profileStorageData?.token;

  const myHeaders = new Headers();
  // myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const response = await fetch(`${thetaBoommAPI}/api/Image/UploadFile`, {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  });
  if (!response.ok) {
    const errorData = await response.text();
    console.error(`${response.status} ${errorData}`);
    return null;
  }
  // const output = await response.json();

  // const attachmentValues = {
  //   name: files?.name,
  //   size: files?.size,
  //   type: files?.type,
  //   url: output?.data,
  // };

  // attachmentConcept = await createEntityInstance(
  //   "attachment",
  //   userId,
  //   attachmentValues
  // );
}
