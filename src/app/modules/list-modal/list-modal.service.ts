import {
  GetCompositionListWithId,
  GetTheConceptLocal,
  LConcept,
  LocalSyncData,
} from "mftsccs-browser";
// import { getLocalStorageData } from "../../services/helper.service";
import { CreateConnectionBetweenEntityLocal } from "../../services/entity.service";
// import { s_item_linker } from "../../constants/type.constants";
import {
  closeModal,
  getListingItemDetails,
} from "../../pages/listItem/listItem.service";

let platformList: any;

export async function getListingPlatforms() {
  // const profileStorageData: any = await getLocalStorageData();
  // const userId = profileStorageData?.userId;
  platformList = await GetCompositionListWithId("the_listing", 999, 10, 1);
  console.log("platformList", platformList);

  const listingItemData = await getListingItemDetails();
  console.log("listingItemData ->", listingItemData);

  const listingPlatforms = platformList
    ?.map((list: any) => {
      let updatedList: any;
      if (listingItemData?.data?.listing === list?.data?.the_listing) {
        updatedList = `<option value="${list?.id}" disabled>${list?.data?.the_listing}</option>`;
      } else {
        updatedList = `<option value="${list?.id}">${list?.data?.the_listing}</option>`;
      }
      return updatedList;
    })
    .join("");
  return listingPlatforms;
}

export async function submitListingForm(e: any) {
  e.preventDefault();

  const formData: any = new FormData(e.target);
  const formValues: any = Object.fromEntries(formData);
  console.log("LISTING formValues ->", formValues);

  let urlPath = location.pathname;
  let itemId = Number(urlPath.substring(10));
  console.log("LISTING itemId ->", itemId);

  console.log("platformList in submit ->", platformList);

  const selectedPlatform = platformList.find(
    (item: any) => item?.id === Number(formValues?.listingPlatform)
  );
  console.log("selectedPlatform ->", selectedPlatform);

  const listingPlatformConcept: LConcept = await GetTheConceptLocal(
    selectedPlatform?.id
  );
  console.log("listingPlatformConcept ->", listingPlatformConcept);

  const itemConcept: LConcept = await GetTheConceptLocal(itemId);
  console.log("itemConcept ->", itemConcept);

  // await CreateConnectionBetweenEntityLocal(
  //   listingPlatformConcept,
  //   itemConcept,
  //   s_item_linker
  // );

  await CreateConnectionBetweenEntityLocal(
    itemConcept,
    listingPlatformConcept,
    "s_listing"
  );

  await LocalSyncData.SyncDataOnline();

  closeModal("list-modal");
}
