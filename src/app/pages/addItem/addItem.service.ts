// import { Concept, MakeTheInstanceConcept, SyncData } from "mftsccs-browser";
import {
  GetTheConceptLocal,
  LConcept,
  LocalSyncData,
  MakeTheInstanceConceptLocal,
} from "mftsccs-browser";
import { getLocalStorageData } from "../../services/helper.service";
import { CreateConnectionBetweenEntityLocal } from "../../services/entity.service";
import { updateContent } from "../../routes/renderRoute.service";
import { environment } from "../../environments/environment.dev";
import { createEntityInstance } from "../../services/createEntityInstance.service";
import { showToast } from "../../modules/toast-bar/toast-bar.index";
import { getAgents } from "../../services/agent.service";

const thetaBoommAPI = environment?.boomURL;
// let attachmentValues: any;
// let attachmentConcept;
let attachedImageConcepts: any;

export async function getHTML() {
  try {
    const response = await fetch(
      "/src/app/pages/addItem/addItem.component.html"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const htmlContent = await response.text();
    return htmlContent;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

// export async function loadHTML() {
//   return await getHTML();
// }

export async function getListingAgents() {
  const profileStorageData: any = await getLocalStorageData();
  const token = profileStorageData?.token;

  const listingAgentResposne = await getAgents("listingAgent_agent", token);
  console.log("listingAgentResposne ->", listingAgentResposne);

  const listingAgentOptions = listingAgentResposne
    ?.map((listingAgent: any) => {
      return `<option value="${listingAgent?.the_user?.id}">${listingAgent?.the_user?.data?.entity?.data?.person?.data?.first_name} ${listingAgent?.the_user?.data?.entity?.data?.person?.data?.last_name}</option>`;
    })
    .join("");

  return listingAgentOptions;
}

export async function getSellerAgents() {
  const profileStorageData: any = await getLocalStorageData();
  const token = profileStorageData?.token;

  const sellerAgentResposne = await getAgents("sellerAgent_agent", token);
  console.log("sellerAgentResposne ->", sellerAgentResposne);

  const sellerAgentOptions = sellerAgentResposne
    ?.map((sellerAgent: any) => {
      return `<option value="${sellerAgent?.the_user?.id}">${sellerAgent?.the_user?.data?.entity?.data?.person?.data?.first_name} ${sellerAgent?.the_user?.data?.entity?.data?.person?.data?.last_name}</option>`;
    })
    .join("");

  return sellerAgentOptions;
}

export async function submitAddItemForm(e: any) {
  e.preventDefault();

  const formData: any = new FormData(e.target);
  // output as an object
  const formValues: any = Object.fromEntries(formData);
  console.log("formValues ->", formValues);

  // return;

  // ...or iterate through the name-value pairs
  // for (let pair of formData.entries()) {
  //   formValues[pair[0]] = pair[1]
  // }

  const elements = e.target;
  for (let i = 0, len = elements.length; i < len; ++i) {
    elements[i].disabled = true;
  }

  const itemConceptResponse = await createItem(formValues);
  // await LocalSyncData.SyncDataOnline();

  // the_seller_s_item
  const sellerItemResponse = await updateItem(itemConceptResponse);
  console.log("sellerItemResponse ->", sellerItemResponse);
  await LocalSyncData.SyncDataOnline();

  if (itemConceptResponse) {
    // success toast message
    setTimeout(async () => {
      await showToast(
        "success",
        "Item added successfully!",
        "List the item so anyone can view this item.",
        "top-right",
        5000
      );
    }, 100);

    e?.target?.reset();
    for (let i = 0, len = elements.length; i < len; ++i) {
      elements[i].disabled = false;
    }
    updateContent("/listing");
  } else {
    // error toast message
    await showToast(
      "error",
      "Item can not add successfully!",
      "There is something went wrong!",
      "top-right",
      5000
    );
  }
}

// toast with vanilla js
// export async function _showToast(type: string, heading: string, msg: string) {
//   const body = <HTMLElement>document.getElementById('app')
//   const toastBar = document.createElement('div')
//   let bgColor = 'bg-white'

//   switch(type) {
//     case 'info':
//       bgColor = 'bg-blue-200'
//       break
//     case 'success':
//       bgColor = 'bg-green-200'
//       break
//     case 'warning':
//       bgColor = 'bg-yellow-200'
//       break
//     case 'error':
//       bgColor = 'bg-red-200'
//       break
//     default:
//       bgColor = 'bg-white'
//   }

//   toastBar.innerHTML = `
//     <div class="fixed top-4 right-4 p-4 ${bgColor} text-black z-20 border border-gray-200 rounded shadow-lg">
//       <h4>${heading}</h4>
//       <p>${msg}</p>
//     </div>
//   `
//   body.appendChild(toastBar)
//   setTimeout(() => {
//     toastBar.remove()
//   }, 5000);
// }

export async function createItem(formValues: any) {
  console.log("createItem formValues ->", formValues);
  const itemName = formValues?.name;

  const profileStorageData: any = await getLocalStorageData();
  const userId = profileStorageData?.userId;

  const itemNameConcept = await createEntityInstance("name", userId, {
    title: itemName,
  });

  const itemEntityConcept = await MakeTheInstanceConceptLocal(
    "the_item",
    "",
    true,
    userId,
    4,
    999,
    itemNameConcept?.id
  );

  delete formValues.itemAttachment;
  // formValues.image = attachmentValues?.url
  console.log("final formValues ->", formValues);

  for (const [key, value] of Object.entries(formValues)) {
    let ObjKey = key;

    const keyConcept: LConcept = await MakeTheInstanceConceptLocal(
      `${ObjKey}`,
      `${value}`,
      false,
      userId,
      4,
      999
    );
    await CreateConnectionBetweenEntityLocal(
      itemEntityConcept,
      keyConcept,
      ObjKey
    );
  }

  console.log("attachedImageConcepts 2 ->", attachedImageConcepts);
  await Promise.all(
    attachedImageConcepts.map(async (imageConcept: LConcept) => {
      console.log("imageConcept", imageConcept);
      return await CreateConnectionBetweenEntityLocal(
        itemEntityConcept,
        imageConcept,
        "s_image"
      );
    })
  );

  console.log("itemEntityConcept ID ->", itemEntityConcept?.id);
  console.log("item created!");
  return itemEntityConcept;
}

export async function updateItem(itemEntityConcept: any) {
  console.log("updateItem itemEntityConcept ->", itemEntityConcept);

  const profileStorageData: any = await getLocalStorageData();
  const userId = profileStorageData?.userId;
  const userConceptId = profileStorageData?.userConcept;
  const token = profileStorageData?.token;

  let sellerEntityConcept: LConcept;

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const sellerConceptResponse = await fetch(
    `${thetaBoommAPI}/api/search-compositions-internal?search=&type=&composition=the_seller&inpage=10&page=1`,
    {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    }
  );

  const output = await sellerConceptResponse.json();

  // let search = new SearchStructure();
  // search.composition = "the_seller";
  // search.inpage = 100;
  // const output = await SearchLinkInternal(search, token);

  const sellerEntityId = Number(Object.keys(output)?.[0]);
  console.log("sellerEntityId ->", sellerEntityId);

  if (sellerEntityId) {
    sellerEntityConcept = await GetTheConceptLocal(sellerEntityId);
  } else {
    const entityDetails: any = await fetch(
      `${thetaBoommAPI}/api/get-entity-from-user?userConceptId=${userConceptId}`
    )
      .then((res) => res.json())
      .then((json) => {
        return json;
      });

    const entityId = entityDetails?.entity;
    sellerEntityConcept = await MakeTheInstanceConceptLocal(
      "the_seller",
      entityId,
      true,
      userId,
      4,
      999
    );
  }

  console.log("sellerEntityConcept ->", sellerEntityConcept);

  await CreateConnectionBetweenEntityLocal(
    sellerEntityConcept,
    itemEntityConcept,
    "s_item"
  );

  return sellerEntityConcept;
}

export async function toggleField(hideObj: any, showObj: any) {
  hideObj.disabled = true;
  hideObj.style.display = "none";
  showObj.disabled = false;
  showObj.style.display = "inline";
  showObj.focus();
  console.log("TOGGLE");
}

export async function addItemDocument() {
  const attachmentEl = <HTMLInputElement>(
    document.getElementById("itemAttachment")
  );
  attachmentEl.addEventListener("change", (e: any) => {
    // const files = e.target.files[0];
    const files = e.target.files;
    console.log("files ->", files);

    // for (let i = 0; i < files.length; i++) {
    //   const file = files.item(i);
    //   const fileName = file.name;
    //   // this.uploadFile(file, fileName);
    // }

    // let formdata = new FormData();
    // formdata.append("file", files);

    uploadFile(files);
  });
}

export async function uploadFile(files: any) {
  let formdata = new FormData();
  // formdata.append("images", files);

  for (let i = 0; i < files.length; i++) {
    const file = files.item(i);
    const fileName = file.name;
    console.log("file", file);
    console.log("fileName", fileName);
    // this.uploadFile(file, fileName);
    formdata.append("images", file, fileName);
  }

  const profileStorageData: any = await getLocalStorageData();
  const userId = profileStorageData?.userId;
  const token = profileStorageData?.token;

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const response = await fetch(
    // `${thetaBoommAPI}/api/Image/UploadImage`,
    // `${thetaBoommAPI}/api/Image/upload_file_bulk`,
    `${thetaBoommAPI}/api/Image/upload_image_bulk`,
    {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    }
  );
  if (!response.ok) {
    const errorData = await response.text();
    console.error(`${response.status} ${errorData}`);
    return null;
  }
  const output = await response.json();
  console.log("output", output);

  attachedImageConcepts = await Promise.all(
    output?.data?.map(async (image: string) => {
      const itemImageValues = {
        url: image,
      };

      return await createEntityInstance("attachment", userId, itemImageValues);
    })
  );

  console.log("attachedImageConcepts 1 ->", attachedImageConcepts);

  // attachmentValues = {
  //   name: files?.name,
  //   size: files?.size,
  //   type: files?.type,
  //   url: output?.data
  // }

  // attachmentConcept = await createEntityInstance(
  //   "attachment",
  //   userId,
  //   attachmentValues
  // );

  // console.log('attachmentConcept', attachmentConcept)
}
