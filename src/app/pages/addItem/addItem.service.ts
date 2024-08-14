// import { Concept, MakeTheInstanceConcept, SyncData } from "mftsccs-browser";
import {
  GetLink,
  GetTheConceptLocal,
  LConcept,
  LocalSyncData,
  MakeTheInstanceConceptLocal,
  SearchLinkInternal,
  SearchLinkMultipleAll,
  SearchQuery,
  SearchStructure,
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
let categoryListHTML: any;
let typeListHTML: any;

let categoryNameList: any;
let typeNameList: any;
let currentMyAgentType: any;

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

export async function getTypeList() {
  const profileStorageData: any = await getLocalStorageData();
  const token = profileStorageData?.token;

  const queryType = [
    {
      type: "the_itemtype",
      fullLinkers: ["the_itemtype_name"],
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
      body: JSON.stringify(queryType),
      redirect: "follow",
    }
  );
  const output = await response.json();
  console.log("TYPE output ->", output);

  const typeNameList = output?.[0].data?.the_itemtype?.the_itemtype_name;

  typeListHTML = typeNameList
    ?.map((type: any) => {
      return `<option value="${type?.id}">${type?.data?.the_name}</option>`;
    })
    .join("");

  return typeListHTML;

  // create the_itemtype
  // const itemTypeConcept = await createEntityInstance("itemtype", 999, {
  //   name: 'Basic',
  //   price: 10
  // });

  // await LocalSyncData.SyncDataOnline();
  // return itemTypeConcept;

  // create new types with the_itemtype
  let search = new SearchStructure();
  search.composition = "the_itemtype";
  search.inpage = 100;

  let values = await SearchLinkInternal(search, token);

  if (values.length) {
    const typeEntityId = values?.[0]?.id;
    const typeResponse: LConcept = await GetTheConceptLocal(typeEntityId);
    const typeNameConcept: LConcept = await MakeTheInstanceConceptLocal(
      `name`,
      `Standard`,
      false,
      999,
      4,
      999
    );

    await CreateConnectionBetweenEntityLocal(
      typeResponse,
      typeNameConcept,
      "name"
    );

    await LocalSyncData.SyncDataOnline();
    return typeResponse;
  }
}

export async function getCategoryList() {
  const profileStorageData: any = await getLocalStorageData();
  const token = profileStorageData?.token;

  const queryRFQ = [
    {
      type: "the_itemcategory",
      fullLinkers: ["the_itemcategory_name"],
      inpage: 100,
      page: 1,
      logic: "or",
      filterSearches: [],
    },
  ];

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  // myHeaders.append("Authorization", `Bearer ${token}`);

  const response = await fetch(
    // `${thetaBoommAPI}/api/search-all-with-linker?inpage=100&page=1`,
    `${thetaBoommAPI}/api/search-all-without-auth-with-linker?inpage=100&page=1`,
    {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(queryRFQ),
      redirect: "follow",
    }
  );
  const output = await response.json();
  console.log("CATEGORY output ->", output);

  categoryNameList = output?.[0]?.data?.the_itemcategory?.the_itemcategory_name;

  categoryListHTML = categoryNameList
    ?.map((category: any) => {
      return `<option value="${category?.id}">${category?.data?.the_name}</option>`;
    })
    .join("");

  return categoryListHTML;

  // create new category name with the_itemcategory
  let search = new SearchStructure();
  search.composition = "the_itemcategory";
  search.inpage = 100;

  let values = await SearchLinkInternal(search, token);

  if (values.length) {
    const categoryEntityId = values?.[0]?.id;
    categoryListHTML = values;
    return;
    const categoryResponse: LConcept = await GetTheConceptLocal(
      categoryEntityId
    );

    const categoryNameConcept: LConcept = await MakeTheInstanceConceptLocal(
      `name`,
      `Services`,
      false,
      999,
      4,
      999
    );

    await CreateConnectionBetweenEntityLocal(
      categoryResponse,
      categoryNameConcept,
      "name"
    );

    await LocalSyncData.SyncDataOnline();
    return categoryResponse;
  }

  return;

  // create first the_itemcategory
  const categoryEntityConcept: LConcept = await MakeTheInstanceConceptLocal(
    `the_itemcategory`,
    "",
    true,
    999,
    4,
    999
  );

  const categoryNameConcept: LConcept = await MakeTheInstanceConceptLocal(
    `name`,
    `Products`,
    false,
    999,
    4,
    999
  );

  await CreateConnectionBetweenEntityLocal(
    categoryEntityConcept,
    categoryNameConcept,
    "name"
  );

  await LocalSyncData.SyncDataOnline();
  return categoryEntityConcept;
}

export async function updateItemCategory(e: any) {
  const selectedCategory = e?.target?.value;
  console.log("selectedCategory ->", selectedCategory);
  typeListHTML = "";

  if (selectedCategory && selectedCategory !== "cat-custom") {
    const profileStorageData: any = await getLocalStorageData();
    const token = profileStorageData?.token;

    let searchfirst = new SearchQuery();
    searchfirst.composition = selectedCategory;
    searchfirst.fullLinkers = ["the_name", "the_name_s_type"];
    searchfirst.inpage = 100;

    const queryParams = [searchfirst];
    const output = await SearchLinkMultipleAll(queryParams, token);
    console.log("output updateItemCategory ->", output);

    if (output) {
      const categorysType = output?.data?.the_name?.the_name_s_type;
      if (categorysType?.length) {
        typeNameList = categorysType;
        const typesHTML = categorysType
          ?.map((type: any) => {
            return `<option value="${type?.id}">${type?.data?.the_name}</option>`;
          })
          .join("");
        typeListHTML = `
          <option value="" selected disabled>--- select type ---</option>
          ${typesHTML}
          <option value="type-custom">[type a custom type]</option>
          <input name="type" style="display:none;" disabled="disabled" onblur="if(this.value==''){toggleField(this,this.previousSibling);}" class="block w-full rounded-md border-0 px-3 py-2 mt-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
        `;
        const selectType = document.getElementById("type");
        if (selectType) selectType.innerHTML = typeListHTML;
      } else {
        typeListHTML = `
          <option value="" selected disabled>--- select type ---</option>
          <option value="type-custom">[type a custom type]</option>
          <input name="type" style="display:none;" disabled="disabled" onblur="if(this.value==''){toggleField(this,this.previousSibling);}" class="block w-full rounded-md border-0 px-3 py-2 mt-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
        `;
        const selectType = document.getElementById("type");
        if (selectType) selectType.innerHTML = typeListHTML;
      }
    }

    // create link category with type
    // const categoryResponse: LConcept = await GetTheConceptLocal(selectedCategory);

    // const typeNameResponse:LConcept = await GetTheConceptLocal(100475888)

    // await CreateConnectionBetweenEntityLocal(
    //   categoryResponse,
    //   typeNameResponse,
    //   "s_type"
    // );

    // await LocalSyncData.SyncDataOnline();
  } else if (selectedCategory === "cat-custom") {
    typeListHTML = `
      <option value="" selected disabled>--- select type ---</option>
      <option value="type-custom">[type a custom type]</option>
      <input name="type" style="display:none;" disabled="disabled" onblur="if(this.value==''){toggleField(this,this.previousSibling);}" class="block w-full rounded-md border-0 px-3 py-2 mt-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
    `;
    const selectType = document.getElementById("type");
    if (selectType) selectType.innerHTML = typeListHTML;
  }
}

// export async function _updateItemCategory(e: any) {
//   e.preventDefault();

//   const selectedCategory = e?.target?.value;

//   // if(this.options[this.selectedIndex].value=='cat-custom'){
//   //   toggleField(this,this.nextSibling); this.selectedIndex='0';
//   // }

//   if (selectedCategory === "cat-custom") {
//     const selectParentNode = e?.target?.parentNode;

//     const selectNode = selectParentNode?.querySelector("select");
//     const selectInput = selectParentNode?.querySelector("input");
//     // toggleField(this, this.nextSibling)

//     toggleField(selectNode, selectInput);
//   }
// }

// export async function updateTypeCategory(e: any) {
//   // e.preventDefault()

//   const selectedCategory = e?.target?.value;

//   // if(this.options[this.selectedIndex].value=='cat-custom'){
//   //   toggleField(this,this.nextSibling); this.selectedIndex='0';
//   // }

//   if (selectedCategory === "type-custom") {
//     const selectParentNode = e?.target?.parentNode;

//     const selectNode = selectParentNode?.querySelector("select");
//     const selectInput = selectParentNode?.querySelector("input");
//     // toggleField(this, this.nextSibling)

//     toggleField(selectNode, selectInput);
//   }
// }

// export async function resetUpdateCategory(e: any) {
//   e.target.value = "";
//   const selectParentNode = e?.target?.parentNode;

//   const selectNode = selectParentNode?.querySelector("select");
//   const selectInput = selectParentNode?.querySelector("input");

//   toggleField(selectInput, selectNode);
// }

export async function getMyAgentType() {
  return new Promise(async (resolve: any) => {
    const profileStorageData: any = await getLocalStorageData();
    const userConceptId = profileStorageData?.userConcept;
    const agentType = await GetLink(userConceptId, "isAgent_s", 10, 1);

    const approvedAgentType = agentType?.filter(
      (agent: any) =>
        agent?.data?.agent_request_info &&
        agent?.data?.agent_request_info?.isApproved === "True"
    );

    approvedAgentType.sort((a: any, b: any) => {
      const aTime = new Date(a?.created_at).getTime();
      const bTime = new Date(b?.created_at).getTime();
      return bTime - aTime;
    });

    currentMyAgentType = approvedAgentType[0];
    resolve(currentMyAgentType);
  });
}

export async function getAgentSellers() {
  const profileStorageData: any = await getLocalStorageData();
  const token = profileStorageData?.token;

  const sellerResposne = await getAgents("seller_agent", token);
  const sellerOptions = sellerResposne
    ?.map((agentSeller: any) => {
      return `<option value="${agentSeller?.the_user?.id}">${agentSeller?.the_user?.data?.entity?.data?.person?.data?.first_name} ${agentSeller?.the_user?.data?.entity?.data?.person?.data?.last_name}</option>`;
    })
    .join("");

  return sellerOptions;
}

export async function getListingAgents() {
  const profileStorageData: any = await getLocalStorageData();
  const token = profileStorageData?.token;

  const listingAgentResposne = await getAgents("listingAgent_agent", token);
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

  const selectedCategory = formValues?.category;
  const selectedType = formValues?.type;

  const filteredCategory = categoryNameList?.filter(
    (category: any) => Number(selectedCategory) === category?.id
  );
  if (!filteredCategory || !filteredCategory?.length) {
    // console.log("CUSTOM category");
    // create the_itemcategory and the_itemtype and link each other
    const customCategoryResponse = await createCustomCategory(
      selectedCategory,
      selectedType
    );
    console.log("customCategoryResponse ->", customCategoryResponse);
  }

  const filteredType = typeNameList?.filter(
    (type: any) => Number(selectedType) === type?.id
  );
  if (
    selectedCategory &&
    filteredCategory?.length &&
    (!filteredType || !filteredType?.length)
  ) {
    // console.log("CUSTOM type");
    // link the_name with the_itemcategory
    const itemTypeNameResponse = await createItemType(
      selectedCategory,
      selectedType
    );
    console.log("itemTypeNameResponse ->", itemTypeNameResponse);
  }

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

  // the_seller_s_item || the_listingagent_s_item
  const updateItemResponse = await updateItem(itemConceptResponse);
  console.log("updateItemResponse ->", updateItemResponse);
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

export async function createCustomCategory(
  selectedCategory: any,
  selectedType: any
) {
  const profileStorageData: any = await getLocalStorageData();
  const token = profileStorageData?.token;

  // create new category name with the_itemcategory
  let search = new SearchStructure();
  search.composition = "the_itemcategory";
  search.inpage = 100;

  let values = await SearchLinkInternal(search, token);

  if (values.length) {
    const categoryEntityId = values?.[0]?.id;

    const categoryResponse: LConcept = await GetTheConceptLocal(
      categoryEntityId
    );
    const categoryNameConcept: LConcept = await MakeTheInstanceConceptLocal(
      `name`,
      selectedCategory,
      false,
      999,
      4,
      999
    );

    await CreateConnectionBetweenEntityLocal(
      categoryResponse,
      categoryNameConcept,
      "name"
    );

    await createItemType(categoryNameConcept?.id, selectedType);
    // await LocalSyncData.SyncDataOnline();
    return categoryResponse;
  } else {
    const categoryEntityConcept: LConcept = await MakeTheInstanceConceptLocal(
      `the_itemcategory`,
      "",
      true,
      999,
      4,
      999
    );

    const categoryNameConcept: LConcept = await MakeTheInstanceConceptLocal(
      `name`,
      selectedCategory,
      false,
      999,
      4,
      999
    );

    await CreateConnectionBetweenEntityLocal(
      categoryEntityConcept,
      categoryNameConcept,
      "name"
    );

    await createItemType(categoryNameConcept?.id, selectedType);
    return categoryEntityConcept;
  }
}

export async function createItemType(selectedCategory: any, selectedType: any) {
  const profileStorageData: any = await getLocalStorageData();
  const token = profileStorageData?.token;

  // create new types with the_itemtype
  let search = new SearchStructure();
  search.composition = "the_itemtype";
  search.inpage = 100;

  let values = await SearchLinkInternal(search, token);

  if (values.length) {
    const typeEntityId = values?.[0]?.id;
    console.log("typeEntityId", typeEntityId);

    const typeResponse: LConcept = await GetTheConceptLocal(typeEntityId);
    const typeNameConcept: LConcept = await MakeTheInstanceConceptLocal(
      `name`,
      selectedType,
      false,
      999,
      4,
      999
    );

    await CreateConnectionBetweenEntityLocal(
      typeResponse,
      typeNameConcept,
      "name"
    );

    // Link type name with the category
    const categoryResponse: LConcept = await GetTheConceptLocal(
      selectedCategory
    );
    await CreateConnectionBetweenEntityLocal(
      categoryResponse,
      typeNameConcept,
      "s_type"
    );

    await LocalSyncData.SyncDataOnline();
  } else {
    // create the_itemtype
    const itemTypeConcept: LConcept = await MakeTheInstanceConceptLocal(
      `the_itemtype`,
      "",
      true,
      999,
      4,
      999
    );

    const typeNameConcept: LConcept = await MakeTheInstanceConceptLocal(
      `name`,
      selectedType,
      false,
      999,
      4,
      999
    );

    await CreateConnectionBetweenEntityLocal(
      itemTypeConcept,
      typeNameConcept,
      "name"
    );

    // Link type name with the category
    const categoryResponse: LConcept = await GetTheConceptLocal(
      selectedCategory
    );
    await CreateConnectionBetweenEntityLocal(
      categoryResponse,
      typeNameConcept,
      "s_type"
    );

    await LocalSyncData.SyncDataOnline();
    return typeNameConcept;
  }
}

export async function createItem(formValues: any) {
  console.log("createItem formValues ->", formValues);
  const itemName = formValues?.name;

  const profileStorageData: any = await getLocalStorageData();
  const userId = profileStorageData?.userId;

  const itemNameConcept = await createEntityInstance("name", userId, {
    title: itemName,
  });

  const itemEntityConcept: LConcept = await MakeTheInstanceConceptLocal(
    "the_item",
    "",
    true,
    userId,
    4,
    999,
    itemNameConcept?.id
  );

  delete formValues.itemAttachment;
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

  if (attachedImageConcepts) {
    await Promise.all(
      attachedImageConcepts?.map(async (imageConcept: LConcept) => {
        return await CreateConnectionBetweenEntityLocal(
          itemEntityConcept,
          imageConcept,
          "s_image"
        );
      })
    );
  }

  return itemEntityConcept;
}

export async function updateItem(itemEntityConcept: LConcept) {
  const profileStorageData: any = await getLocalStorageData();
  const userId = profileStorageData?.userId;
  const userEntityId = profileStorageData?.entityId;
  const token = profileStorageData?.token;

  const myAgentType: string =
    currentMyAgentType?.data?.agent_request_info?.agentType.toLowerCase();

  if (!myAgentType || (myAgentType && myAgentType !== "listingagent")) {
    return await getAgentEntityConcept(
      "seller",
      itemEntityConcept,
      token,
      userEntityId,
      userId
    );
  } else if (myAgentType && myAgentType === "listingagent") {
    return await getAgentEntityConcept(
      "listingagent",
      itemEntityConcept,
      token,
      userEntityId,
      userId
    );
  }
}

export async function getAgentEntityConcept(
  agentType: string,
  itemEntityConcept: LConcept,
  token: string,
  userEntityId: number,
  userId: number
) {
  let search = new SearchStructure();
  search.composition = `the_${agentType}`;
  search.inpage = 100;
  const agentResponse = await SearchLinkInternal(search, token);

  // return;
  let agentEntityConcept: any;
  if (agentResponse?.length) {
    agentEntityConcept = await GetTheConceptLocal(agentResponse?.[0]?.id);
  } else {
    agentEntityConcept = await MakeTheInstanceConceptLocal(
      `the_${agentType}`,
      `${userEntityId}`,
      true,
      userId,
      4,
      999
    );
  }

  await CreateConnectionBetweenEntityLocal(
    agentEntityConcept,
    itemEntityConcept,
    "s_item"
  );

  return agentEntityConcept;
}

export async function _updateItem(itemEntityConcept: any) {
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
}

export async function addItemDocument() {
  const attachmentEl = <HTMLInputElement>(
    document.getElementById("itemAttachment")
  );
  attachmentEl.addEventListener("change", (e: any) => {
    // const files = e.target.files[0];
    const files = e.target.files;

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
}
