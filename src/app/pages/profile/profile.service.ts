import {
  Concept,
  CreateConnectionBetweenTwoConcepts,
  CreateTheConnection,
  // GetCompositionWithId,
  GetLink,
  GetTheConcept,
  GetTheConceptLocal,
  LocalSyncData,
  MakeTheInstanceConcept,
  PatcherStructure,
  SyncData,
  UpdateComposition,
  DeleteConceptById,
} from "mftsccs-browser";
import { IUser } from "../../interfaces/IUser.interface";
import { getLocalStorageData } from "../../services/helper.service";
import { createEntityInstance } from "../../services/createEntityInstance.service";
// import { initTopNavigation } from "../../modules/top-nav/top-navigation.service";
import { environment } from "../../environments/environment.dev";
import { showToast } from "../../modules/toast-bar/toast-bar.index";
import { CreateConnectionBetweenEntityLocal } from "../../services/entity.service";
import "./profile.style.css";
import { userListOfData } from "../../services/getUserProfile.service";
import {loader} from '../../modules/loader/loader.index';

const thetaBoommAPI = environment?.boomURL;
let attachmentValues: any;
// let attachmentConcept: any;
// let output: any;
let profileList: any;
// let profilePicUrl: any;

(window as any).deleteFn = deleteFn;
(window as any).deleteFnExperience = deleteFnExperience;
(window as any).deleteDocFn = deleteDocFn;
// (window as any).updateInput = updateInput;
// Array to hold the input field data
const EducationFieldsArray: any = [];
const ExperienceFieldsArray: any = [];
const DocumentFieldsArray: any = [];
const SkillsFieldsArray: any = [];

// for modal
export async function closeProfileModal(modalId: string) {
  const modal: any = document.getElementById(modalId);

  // const modalFormEl = modal.querySelector("form");
  // modalFormEl.reset();

  if (modal) modal.style.display = "none";
  document
    .getElementsByTagName("body")[0]
    .classList.remove("overflow-y-hidden");
}

export async function openModal(modalId: string) {
  const check = document.getElementById(modalId);
  if (check) check.style.display = "block";
  document.getElementsByTagName("body")[0].classList.add("overflow-y-hidden");

  // Close all modals when press ESC
  document.onkeydown = function (event: any) {
    if (event.code === "Escape" || event.key === "Escape") {
      // if (check) check.style.display = "none";
      closeProfileModal(modalId);
    }
  };
}

export async function openProfileModal() {
  await openModal("create-profile-modal");
}

// Function to add addEducation fields
export async function addEducation(param: any) {
  const divEle: any = document.getElementById("inputFields");
  const container = document.createElement("div");
  container.classList.add("input-container");

  // Add HTML for input fields and delete button
  container.innerHTML = `
             <div id="input-container" class="grid gap-6 mb-6 mt-6 md:grid-cols-3">
            <div>
              <label for="eduLevel" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Education Level</label>
              <select id="eduLevel${param}" name='eduLevel' autocomplete="eduLevel-name"
                class="input-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="" >
                 <option value="phd">PHD</option>
                <option value="masters">Masters</option>
                <option value="bachelore">Bachelore</option>
                <option value="highSchool">High School</option>
              </select>
          </div>
          <div>
              <label for="course" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Course</label>
              <select id="course${param}" name="course" autocomplete="course-name"
                class="input-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="" >
                 <option value="science">Science</option>
                <option value="computerScience">Computer Science</option>
                <option value="engineering">Engineering</option>
                <option value="management">Management</option>
                <option value="business">Business</option>
              </select>
          </div>
          <div>
              <label for="eduDateFrom" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date From</label>
              <input type="date" id="eduDateFrom${param}"
                name="eduDateFrom"
                class="input-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="From Date" />
            </div>
          <div>
              <label for="eduDateTo" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date To</label>
              <input type="date" id="eduDateTo${param}"
                name="eduDateTo"
                class="input-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="To Date" />
          </div>
          <div>
              <label for="institutionName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Institution Name</label>
              <input type="text" id="institutionName${param}"
                name="institutionName"
                class="input-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Institution Name" />
          </div>
          <div>
              <label for="institutionAddress" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Institution Address</label>
              <input type="text" id="institutionAddress${param}"
                name="institutionAddress"
                class="input-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Institution Address" />
          </div>
          </div>
          <div id="input-container" class="grid gap-6 mb-6 mt-6 md:grid-cols-1">
           <div>
              <label for="institutionAddress" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
          <textarea name="eduDescription" 
          id="eduDescription${param}"
          rows="10" cols="80"
          class="input-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
          </textarea>
          </div>
        </div> 
        <button 
           class="delete-button text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          onclick="deleteFn(this)">Delete</button>
      <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
      `;
      divEle.appendChild(container);
}

// Function to add addEducation fields
export async function addExperience(param: any) {
  const divEle: any = document.getElementById("inputFields-1");
  const container = document.createElement("div-1");
  container.classList.add("input-container-1");
  // Add HTML for input fields and delete button
  container.innerHTML = `
        <div id="input-container-1" class="grid gap-6 mb-6 mt-6 md:grid-cols-3">
           <div>
            <label for="company" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company</label>
             <input type="text" id="company${param}"
                name="company"
                class="input-field-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Company Name" />
          </div>      
          <div>
              <label for="position" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Position</label>
             <input type="text" id="position${param}"
                name="position"
                class="input-field-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Position" />
          </div>
           <div>
              <label for="expAddress" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
             <input type="text" id="expAddress${param}"
                name="expAddress"
                class="input-field-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Address" />
          </div>
         <div>
              <label for="expCountry" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Country</label>
              <select id="expCountry${param}" name='expCountry' autocomplete="expCountry-name"
                class="input-field-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="" >
                 <option value="nepal">Nepal</option>
                <option value="india">India</option>
                <option value="usa">USA</option>
                <option value="canada">Canada</option>
              </select>
          </div>
          <div>
              <label for="expDateFrom" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date From</label>
              <input type="date" id="expDateFrom${param}"
                name="expDateFrom"
                class="input-field-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="From Date" />
            </div>
          <div>
              <label for="expDateTo" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date To</label>
              <input type="date" id="expDateTo${param}"
                name="expDateTo"
                class="input-field-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="To Date" />
          </div>
        </div> 
           <div id="input-container" class="grid gap-6 mb-6 mt-6 md:grid-cols-1">
           <div>
          <label for="expDescription" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
          <textarea name="expDescription" 
          id="expDescription${param}"
          rows="10" cols="80"
          class="input-field-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
          </textarea>
          </div>
        </div> 
        <button 
          class="delete-button-1 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          onclick="deleteFnExperience(this)">Delete</button>
      <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
      `;
  divEle.appendChild(container);
}

// Function to add Documents fields
export async function addDoc(param: any) {
  const divEle: any = document.getElementById("inputFields-2");
  const container = document.createElement("div-2");
  container.classList.add("input-container-2");

  // Add HTML for input fields and delete button
  container.innerHTML = `
          <div id="input-container-2" class="grid gap-6 mb-6 mt-6 md:grid-cols-3">
            <div>
              <label for="docName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Document Name</label>
               <input type="text" id="docName${param}"
                name="docName"
                class="input-field-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Document Name" />
            </div>
       
          <div>
              <label for="docUpload" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">File</label>
              <input id="docUpload${param}" type="file" accept=".pdf" onchange="previewImage(event)" name="profilePic" autocomplete="item-attachment"
                class="input-field-2 block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
          </div>
          <div id="pdfField${param}" class="mt-6 hidden">
              <label for="docUpload" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"></label>
              <a href=""
              target="_blank"
              id="viewPdf${param}"
              >Download PDF</a>
          </div>
           <div>
              <input id="pdfFile" type="hidden" accept=".pdf" name="profilePic" autocomplete="item-attachment"
                class="input-field-2 block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
          </div>
            <div>
              <input id="pdfFromDb${param}" type="hidden" accept=".pdf" name="profilePic" autocomplete="item-attachment"
                class="input-field-2 block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
          </div>
        </div>
        <button 
           class="delete-button text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          onclick="deleteDocFn(this)">Delete</button>
      <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
      `;
  divEle.appendChild(container);
}

// Function to add Documents fields
export async function addSkills(param: any) {
  const divEle: any = document.getElementById("inputFields-3");
  const container = document.createElement("div-3");
  container.classList.add("input-container-3");

  // Add HTML for input fields and delete button
  container.innerHTML = `
          <div id="input-container-3" class="grid gap-6 mb-6 mt-6 md:grid-cols-3">
           <div class="mb-6">
              <label for="language" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Language</label>
              <select id="language${param}" name="language" autocomplete="language-name"
                class="input-field-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="">
                <option value="html">Html/Css</option>
                <option value="bootstrap">Bootstrap</option>
                <option value="php">Php</option>
                <option value="javascript">Javascript</option>
                <option value="nodejs">Node Js</option>
                <option value="reactjs">React JS</option>
                <option value="angular">Angular</option>
                <option value="typescript">Typescript</option>
                <option value="python">Python</option>
                <option value="c#">C#</option>
                <option value="c++">C++</option>
                <option value="ruby">Ruby</option>
                <option value="perl">Perl</option>
                <option value="laravel">Laravel</option>
                <option value="reactnative">React Native</option>
                <option value="flutter">Flutter</option>
                <option value="nextjs">NextJS</option>
              </select>
          </div> 

            <div>
              <label for="yearOfExperience" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Years</label>
               <input type="number" id="yearOfExperience${param}"
                name="yearOfExperience"
                class="input-field-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="years" />
            </div>
        </div>
        <button 
           class="delete-button text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          onclick="deleteDocFn(this)">Delete</button>
      <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
      `;
  divEle.appendChild(container);
}

// Function to delete Education fields
export async function deleteFn(button: any) {
  const container = button.parentElement;
  const index = Array.from(container.parentElement.children).indexOf(container);
  container.remove();

  // Remove from array
  EducationFieldsArray.splice(index, 1);
}

// Function to delete Education fields
export async function deleteFnExperience(button: any) {
  const container = button.parentElement;
  const index = Array.from(container.parentElement.children).indexOf(container);
  container.remove();

  // Remove from array
  EducationFieldsArray.splice(index, 1);
}

// Function to delete Documents fields
export async function deleteDocFn(button: any) {
  const container = button.parentElement;
  const index = Array.from(container.parentElement.children).indexOf(container);
  container.remove();

  // Remove from array
  EducationFieldsArray.splice(index, 1);
}

// function is to preview image
export async function previewImage(event: any) {
  var input: any = event.target;
  var image: any = document.getElementById("profilePic");
  if (input.files && input.files[0]) {
    const files = input.files[0];

    if (files.type === "image/jpeg" || files.type === "image/png") {
      var reader = new FileReader();
      reader.onload = function (e: any) {
        image.src = e.target.result;
      };
      await uploadImageFile(files);
      reader.readAsDataURL(input.files[0]);
    } else if (files.type === "application/pdf") {
      await uploadPdfFile(files);
    } else {
      setTimeout(async () => {
        await showToast(
          "error",
          "File formate incorrect!",
          "",
          "top-right",
          5000
        );
      }, 100);
    }
  }
}

// function is to upload files
export async function uploadImageFile(files: any) {
  await loader(true)
  // return 
  let formdata = new FormData();
  formdata.append("image", files);

  const profileStorageData: any = await getLocalStorageData();
  // const userId = profileStorageData?.userId;
  const token = profileStorageData?.token;

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const response = await fetch(`${thetaBoommAPI}/api/Image/UploadImage`, {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  });
  if (!response.ok) {
    const errorData = await response.text();
    await loader(false)
    setTimeout(async () => {
      await showToast(
        "error",
        "Failed to upload Profile Image!",
        "",
        "top-right",
        5000
      );
    }, 100);
    console.warn(`${response.status} ${errorData}`);
    return null;
  }
  const output = await response.json();
  const inputImg = <HTMLInputElement>document.getElementById("imgInput");
  inputImg.value = output.data;

  // attachmentValues = {
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
  if (output.data) {
    await loader(false)
    setTimeout(async () => {
      await showToast(
        "success",
        "Profile Image uploaded successfully!",
        "",
        "top-right",
        5000
      );
    }, 100);
  }
}

// function is to upload files
export async function uploadPdfFile(files: any) {
  await loader(true)
  let formdata = new FormData();
  formdata.append("file", files);

  const profileStorageData: any = await getLocalStorageData();
  // const userId = profileStorageData?.userId;
  const token = profileStorageData?.token;

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const response = await fetch(`${thetaBoommAPI}/api/Image/UploadFile`, {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  });

  if (!response.ok) {
    const errorData = await response.text();
    await loader(false)
    setTimeout(async () => {
      await showToast(
        "error",
        "PDF Size Limit!",
        "",
        "top-right",
        5000
      );
    }, 100);
    console.error(`${response.status} ${errorData}`);
    return null;
  }
  const output = await response.json();
  // console.log(output, "output");
  const inputPdf = <HTMLInputElement>document?.getElementById("pdfFile");
  inputPdf.value = output?.data;
  // attachmentValues = {
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
  if (output) {
    await loader(false)
    setTimeout(async () => {
      await showToast(
        "success",
        "PDF added successfully!",
        "",
        "top-right",
        5000
      );
    }, 100);
  }
}

//function to add experience
export async function experience(data: any) {
  const divEle: any = document.getElementById(`experience`);
  data?.map(async (opt: any, index: any) => {
    const container = document.createElement(`div${index}`);
    container.innerHTML = `
      <div class="experience-item">
          <h3>${opt?.data.the_experience?.the_experience_position?.[0]?.data?.the_position}</h3>
          <p>${opt?.data.the_experience?.the_experience_company?.[0]?.data?.the_company}, ${opt?.data.the_experience?.the_experience_expdobFrom?.[0]?.data?.the_expdobFrom} to ${opt?.data.the_experience?.the_experience_expdobTo?.[0]?.data?.the_expdobTo}</p>
          <pre style="color:black">${opt?.data?.the_experience?.the_experience_expDescription?.[0]?.data?.the_expDescription}</pre>
      </div>`;
    divEle?.appendChild(container);
  });
}

//function to add experience
export async function education(data: any) {
  const divEle: any = document.getElementById(`education`);
  data?.map(async (opt: any, index: any) => {
    const container = document.createElement(`div${index}`);
    container.innerHTML = `
            <div class="education-item">
                <h3>${opt?.data?.the_education.the_education_eduLevel[0].data.the_eduLevel} in ${opt?.data?.the_education.the_education_course[0].data.the_course}</h3>
                <p>${opt?.data?.the_education.the_education_institutionName[0].data.the_institutionName}, ${opt?.data?.the_education.the_education_dobFrom[0].data.the_dobFrom} - ${opt?.data?.the_education.the_education_dobTo[0].data.the_dobTo}</p>
                <pre style="color:black">${opt?.data?.the_education?.the_education_eduDescription?.[0]?.data?.the_eduDescription}</pre>
                </div>`;
    divEle?.appendChild(container);
  });
}

//function to add experience
export async function skills(data: any) {
  const divEle: any = document.getElementById(`skills`);

  data?.map(async (opt: any, index: any) => {
    const container = document.createElement(`div${index}`);
    container.innerHTML = `<li>${opt?.data?.the_skills.the_skills_language[0].data.the_language}</li>`;
    divEle?.appendChild(container);
  });
}

// Save profile details
export async function saveProfileDetails(e: Event) {
  e.preventDefault();

  let userId!: number;
  let userConceptId!: number;
  let dataFromLocalStorage: string = localStorage?.getItem("profile") || "";
  if (dataFromLocalStorage) {
    const profileData: IUser = JSON.parse(dataFromLocalStorage);
    userId = Number(profileData?.userId);
    userConceptId = Number(profileData?.userConcept);
  }

  const testProfile: Concept = await MakeTheInstanceConcept(
    "test-profile",
    "",
    true,
    userId,
    4,
    0
  );

  const inputFirstName = <HTMLInputElement>(
    document.getElementById("first_name")
  );
  const firstNameValue = inputFirstName?.value;
  const firstNameConcept: Concept = await MakeTheInstanceConcept(
    "firstName",
    firstNameValue,
    false,
    userId,
    4,
    0
  );
  CreateTheConnection(
    testProfile?.id,
    testProfile?.userId,
    firstNameConcept?.id,
    firstNameConcept?.userId,
    testProfile?.id,
    firstNameConcept?.sessionInformationId,
    firstNameConcept?.sessionInformationUserId
  );

  const inputLastName = <HTMLInputElement>document.getElementById("last_name");
  const lastNameValue = inputLastName?.value;
  const lastNameConcept: Concept = await MakeTheInstanceConcept(
    "lastName",
    lastNameValue,
    false,
    userId,
    4,
    0
  );
  CreateTheConnection(
    testProfile?.id,
    testProfile?.userId,
    lastNameConcept?.id,
    lastNameConcept?.userId,
    testProfile?.id,
    lastNameConcept?.sessionInformationId,
    lastNameConcept?.sessionInformationUserId
  );

  const inputCompany = <HTMLInputElement>document.getElementById("company");
  const companyValue = inputCompany?.value;
  const companyConcept: Concept = await MakeTheInstanceConcept(
    "company",
    companyValue,
    false,
    userId,
    4,
    0
  );
  CreateTheConnection(
    testProfile?.id,
    testProfile?.userId,
    companyConcept?.id,
    companyConcept?.userId,
    testProfile?.id,
    companyConcept?.sessionInformationId,
    companyConcept?.sessionInformationUserId
  );

  const inputPhone = <HTMLInputElement>document.getElementById("phone");
  const phoneValue = inputPhone?.value;
  const phoneConcept: Concept = await MakeTheInstanceConcept(
    "phone",
    phoneValue,
    false,
    userId,
    4,
    0
  );
  CreateTheConnection(
    testProfile?.id,
    testProfile?.userId,
    phoneConcept?.id,
    phoneConcept?.userId,
    testProfile?.id,
    phoneConcept?.sessionInformationId,
    phoneConcept?.sessionInformationUserId
  );

  const inputWebsite = <HTMLInputElement>document.getElementById("website");
  const websiteValue = inputWebsite?.value;
  const websiteConcept: Concept = await MakeTheInstanceConcept(
    "website",
    websiteValue,
    false,
    userId,
    4,
    0
  );
  CreateTheConnection(
    testProfile?.id,
    testProfile?.userId,
    websiteConcept?.id,
    websiteConcept?.userId,
    testProfile?.id,
    websiteConcept?.sessionInformationId,
    websiteConcept?.sessionInformationUserId
  );

  const inputEmail = <HTMLInputElement>document.getElementById("email");
  const emailValue = inputEmail?.value;
  const emailConcept: Concept = await MakeTheInstanceConcept(
    "email",
    emailValue,
    false,
    userId,
    4,
    0
  );
  CreateTheConnection(
    testProfile?.id,
    testProfile?.userId,
    emailConcept?.id,
    emailConcept?.userId,
    testProfile?.id,
    emailConcept?.sessionInformationId,
    emailConcept?.sessionInformationUserId
  );

  await SyncData.SyncDataOnline();

  const tesProfileConcept = await GetTheConcept(testProfile?.id);

  // const testProfileComp2 = await GetCompositionWithId(testProfile?.id);

  const userConcept: Concept = await GetTheConcept(userConceptId);
  await CreateConnectionBetweenTwoConcepts(
    userConcept,
    tesProfileConcept,
    "hd_profile",
    true
  );
  await SyncData.SyncDataOnline();
  // loadProfileDetails();
}

export async function getHTML() {
  try {
    const response = await fetch(
      "/src/app/pages/profile/profile.component.html"
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

// export const loadHTML = await getHTML();
// export async function loadHTML() {
//   return await getHTML();
// }

// export async function initiateProfile() {
//   initTopNavigation()
//   loadProfileDetails()
// }

export async function popupAlert() {
  alert("ABCDE");
}

// export async function loadProfileDetails() {
//   let userId!: number;
//   let userConceptId!: number;
//   let dataFromLocalStorage: string = localStorage?.getItem("profile") || "";
//   if (dataFromLocalStorage) {
//     const profileData: IUser = JSON.parse(dataFromLocalStorage);
//     userId = Number(profileData?.userId);
//     userConceptId = Number(profileData?.userConcept);
//   }

//   const linkResponse = await GetLink(userConceptId, "hd_profile_s", 10, 1);
//   const data = linkResponse?.[0]?.data?.["test-profile"];

//   const inputFirstName = <HTMLInputElement>(
//     document.getElementById("first_name")
//   );
//   inputFirstName.value = data?.firstName || "";

//   const inputLastName = <HTMLInputElement>document.getElementById("last_name");
//   inputLastName.value = data?.lastName || "";

//   const inputEmail = <HTMLInputElement>document.getElementById("email");
//   inputEmail.value = data?.email || "";

//   const inputPhone = <HTMLInputElement>document.getElementById("phone");
//   inputPhone.value = data?.phone || "";

//   const inputDob = <HTMLInputElement>document.getElementById("dob");
//   inputDob.value = data?.dob || "dummy";

//   const inputGender = <HTMLInputElement>document.getElementById("gender");
//   inputGender.value = data?.gender || "dummy";

//   const inputMaritialStatus = <HTMLInputElement>(
//     document.getElementById("maritialStatus")
//   );
//   inputMaritialStatus.value = data?.maritialStatus || "dummy";

//   const inputEducationLevel = <HTMLInputElement>(
//     document.getElementById("educationLevel")
//   );
//   inputEducationLevel.value = data?.educationLevel || "educationLevel";

//   const inputDepartment = <HTMLInputElement>(
//     document.getElementById("department")
//   );
//   inputDepartment.value = data?.department || "educationLevel";

//   const inputWorkExperience = <HTMLInputElement>(
//     document.getElementById("workExperience")
//   );
//   inputWorkExperience.value = data?.workExperience || "workExperience";

//   const inputAddressType = <HTMLInputElement>(
//     document.getElementById("addressType")
//   );
//   inputAddressType.value = data?.addressType || "addressType";

//   const inputStreetnumber = <HTMLInputElement>(
//     document.getElementById("streetnumber")
//   );
//   inputStreetnumber.value = data?.streetnumber || "streetnumber";

//   const inputStreetAddress = <HTMLInputElement>(
//     document.getElementById("streetAddress")
//   );
//   inputStreetAddress.value = data?.streetAddress || "streetAddress";

//   const inputUnit = <HTMLInputElement>document.getElementById("unit");
//   inputUnit.value = data?.unit || "unit";
//   // if (data?.company) {
//   //   await addExperience();
//   //   const inputCompany = <HTMLInputElement>document.getElementById("company");
//   //   inputCompany.value = data?.company || "";
//   //   const divEle: any = document.getElementById("show");
//   //   divEle.style.display = "none";

//   //   const inputPosition = <HTMLInputElement>document.getElementById("position");
//   //   inputPosition.value = data?.position || "";

//   //   const inputAddress = <HTMLInputElement>document.getElementById("address");
//   //   inputAddress.value = data?.address || "";

//   //   const inputCountry = <HTMLInputElement>document.getElementById("country");
//   //   inputCountry.value = data?.country || "";

//   //   const inputDateFrom = <HTMLInputElement>document.getElementById("dateFrom");
//   //   inputDateFrom.value = data?.dateFrom || "";

//   //   const inputDateTo = <HTMLInputElement>document.getElementById("dateTo");
//   //   inputDateTo.value = data?.dateTo || "";
//   // }

//   const inputWebsite = <HTMLInputElement>document.getElementById("website");
//   inputWebsite.value = data?.website || "";
// }

export async function updateProfile(e: Event) {
  e.preventDefault();

  // let userId!: number
  let userConceptId!: number;
  let dataFromLocalStorage: string = localStorage?.getItem("profile") || "";
  if (dataFromLocalStorage) {
    const profileData: IUser = JSON.parse(dataFromLocalStorage);
    // userId = Number(profileData?.userId)
    userConceptId = Number(profileData?.userConcept);
  }

  const linkResponse = await GetLink(userConceptId, "profile", 10, 1);

  if (!linkResponse?.length) {
    saveProfileDetails(e);
  } else {
    submitUpdateProfile(linkResponse);
  }
}

export async function submitUpdateProfile(linkProfileData: any) {
  let userId!: number;
  let dataFromLocalStorage: string = localStorage?.getItem("profile") || "";
  if (dataFromLocalStorage) {
    const profileData: IUser = JSON.parse(dataFromLocalStorage);
    userId = Number(profileData?.userId);
  }

  const profileCompositionId = linkProfileData?.[0]?.id;

  const inputFirstName = <HTMLInputElement>(
    document.getElementById("first_name")
  );
  const firstNameValue = inputFirstName?.value;

  const inputLastName = <HTMLInputElement>document.getElementById("last_name");
  const lastNameValue = inputLastName?.value;

  const inputCompany = <HTMLInputElement>document.getElementById("company");
  const companyValue = inputCompany?.value;

  const inputPhone = <HTMLInputElement>document.getElementById("phone");
  const phoneValue = inputPhone?.value;

  const inputWebsite = <HTMLInputElement>document.getElementById("website");
  const websiteValue = inputWebsite?.value;

  const inputEmail = <HTMLInputElement>document.getElementById("email");
  const emailValue = inputEmail?.value;

  const patcherStructure = new PatcherStructure();
  patcherStructure.userId = userId;
  patcherStructure.compositionId = profileCompositionId;
  patcherStructure.ofTheCompositionId = profileCompositionId;
  patcherStructure.patchObject = {
    firstName: firstNameValue,
    lastName: lastNameValue,
    company: companyValue,
    phone: phoneValue,
    website: websiteValue,
    email: emailValue,
  };
  await UpdateComposition(patcherStructure);
  // loadProfileDetails();
}

export async function getProfileData() {
  let dataFromLocalStorage: string = localStorage?.getItem("profile") || "";
  const profileData: IUser = JSON.parse(dataFromLocalStorage);
  // let userId:any = Number(profileData?.userId);
  let userConceptId: any = Number(profileData?.userConcept)
    profileList= await userListOfData(userConceptId);
    // console.log("output ->", profileList);
    if(profileList){
    const data = profileList?.the_Profile || "";

    const inputProfilePic = <HTMLInputElement>(
      document.getElementById("profilePic")
    );
    inputProfilePic.src =
      data?.the_profile_profilePic?.[0]?.data?.the_profilePic ||
      profileList?.entity?.person?.profile_img ||'';

    const inputImgInput = <HTMLInputElement>document.getElementById("imgInput");
    inputImgInput.value =
      data?.the_profile_profilePic?.[0]?.data?.the_profilePic ||
      profileList?.entity?.person?.profile_img || '';

    const inputFirstName = <HTMLInputElement>(
        document.getElementById("first_name")
      );
  
    inputFirstName.value =
      data?.the_profile_first_name?.[0]?.data?.the_first_name ||
      profileList?.entity?.person?.first_name || "";

    const inputLastName = <HTMLInputElement>(
      document.getElementById("last_name")
    );
    inputLastName.value =
      data?.the_profile_last_name?.[0]?.data?.the_last_name ||
      profileList?.entity?.person?.last_name ||"";

    const inputEmail = <HTMLInputElement>document.getElementById("email");
    inputEmail.value =
      data?.the_profile_email?.[0]?.data?.the_email ||
      profileList?.entity?.person?.email || "";

    const inputPhone = <HTMLInputElement>document.getElementById("phone");
    inputPhone.value =
      data?.the_profile_phone?.[0]?.data?.the_phone ||
      profileList?.entity?.person?.phone || "";

    const inputDob = <HTMLInputElement>document.getElementById("dob");
    inputDob.value = data?.the_profile_dob?.[0]?.data?.the_dob || "";

    const inputGender = <HTMLInputElement>document.getElementById("gender");
    inputGender.value = data?.the_profile_gender?.[0]?.data?.the_gender || "";

    const inputMaritialStatus = <HTMLInputElement>(
      document.getElementById("maritialStatus")
    );
    inputMaritialStatus.value =
      data?.the_profile_maritialStatus?.[0]?.data?.the_maritialStatus || "";

    const inputWorkPosition = <HTMLInputElement>(
      document.getElementById("workPosition")
    );
    inputWorkPosition.value =
      data?.the_profile_workPosition?.[0]?.data?.the_workPosition || "";

    const inputDepartment = <HTMLInputElement>(
      document.getElementById("department")
    );
    inputDepartment.value =
      data?.the_profile_department?.[0]?.data?.the_department || "";

    const inputWorkExperience = <HTMLInputElement>(
      document.getElementById("workExperience")
    );
    inputWorkExperience.value =
      data?.the_profile_workExperience?.[0]?.data?.the_workExperience || "";

    const inputAboutYou = <HTMLInputElement>document.getElementById("aboutYou");
    inputAboutYou.value =
      data?.the_profile_aboutYou?.[0]?.data?.the_aboutYou || "";

    const inputAddressType = <HTMLInputElement>(
      document.getElementById("addressType")
    );
    inputAddressType.value =
      data?.the_profile_addressType?.[0]?.data?.the_addressType || "";

    const inputStreetNumber = <HTMLInputElement>(
      document.getElementById("streetNumber")
    );
    inputStreetNumber.value =
      data?.the_profile_streetNumber?.[0]?.data?.the_streetNumber || "";

    const inputStreetAddress = <HTMLInputElement>(
      document.getElementById("streetAddress")
    );
    inputStreetAddress.value =
      data?.the_profile_streetAddress?.[0]?.data?.the_streetAddress || "";

    const inputUnit = <HTMLInputElement>document.getElementById("unit");
    inputUnit.value = data?.the_profile_unit?.[0]?.data?.the_unit || "";

    const inputCity = <HTMLInputElement>document.getElementById("city");
    inputCity.value = data?.the_profile_city?.[0]?.data?.the_city || "";

    const inputState = <HTMLInputElement>document.getElementById("state");
    inputState.value = data?.the_profile_state?.[0]?.data?.the_state || "";

    const inputZip = <HTMLInputElement>document.getElementById("zip");
    inputZip.value = data?.the_profile_zip?.[0]?.data?.the_zip || "";

    const inputCountry = <HTMLInputElement>document.getElementById("country");
    inputCountry.value =
      data?.the_profile_country?.[0]?.data?.the_country || "";

    const inputCurrentCompany = <HTMLInputElement>(
      document.getElementById("currentCompany")
    );
    inputCurrentCompany.value =
      data?.the_profile_currentCompany?.[0]?.data?.the_currentCompany || "";

    const inputCurrentSalary = <HTMLInputElement>(
      document.getElementById("currentSalary")
    );
    inputCurrentSalary.value =
      data?.the_profile_currentSalary?.[0]?.data?.the_currentSalary || "";

    const inputDesireSalary = <HTMLInputElement>(
      document.getElementById("desireSalary")
    );
    inputDesireSalary.value =
      data?.the_profile_desireSalary?.[0]?.data?.the_desireSalary || "";

    data?.the_profile_s_education?.map(async (data: any, index: any) => {
      await addEducation(index);
      const inputEduLevel = <HTMLInputElement>(
        document.getElementById(`eduLevel${index}`)
      );
      inputEduLevel.value =
        data?.data?.the_education?.the_education_eduLevel?.[0]?.data
          ?.the_eduLevel || "";

      const inputCourse = <HTMLInputElement>(
        document.getElementById(`course${index}`)
      );
      inputCourse.value =
        data?.data?.the_education?.the_education_course?.[0]?.data
          ?.the_course || "";

      const inputEduDateFrom = <HTMLInputElement>(
        document.getElementById(`eduDateFrom${index}`)
      );
      inputEduDateFrom.value =
        data?.data?.the_education?.the_education_dobFrom?.[0]?.data
          ?.the_dobFrom || "";

      const inputEduDateTo = <HTMLInputElement>(
        document.getElementById(`eduDateTo${index}`)
      );
      inputEduDateTo.value =
        data?.data?.the_education?.the_education_dobTo?.[0]?.data?.the_dobTo ||
        "";

      const inputInstitutionName = <HTMLInputElement>(
        document.getElementById(`institutionName${index}`)
      );
      inputInstitutionName.value =
        data?.data?.the_education?.the_education_institutionName?.[0]?.data
          ?.the_institutionName || "";

      const inputInstitutionAddress = <HTMLInputElement>(
        document.getElementById(`institutionAddress${index}`)
      );
      inputInstitutionAddress.value =
        data?.data?.the_education?.the_education_institutionAddress?.[0]?.data
          ?.the_institutionAddress || "";
      const inputEduDescription = <HTMLInputElement>(
            document.getElementById(`eduDescription${index}`)
          );
      inputEduDescription.value =
            data?.data?.the_education?.the_education_eduDescription?.[0]?.data
              ?.the_eduDescription || "";          
    });

    data?.the_profile_s_experience?.map(async (data: any, index: any) => {
      await addExperience(index);
      const inputCompany = <HTMLInputElement>(
        document.getElementById(`company${index}`)
      );
      inputCompany.value =
        data?.data?.the_experience?.the_experience_company?.[0]?.data
          ?.the_company || "";

      const inputPosition = <HTMLInputElement>(
        document.getElementById(`position${index}`)
      );
      inputPosition.value =
        data?.data?.the_experience?.the_experience_position?.[0]?.data
          ?.the_position || "";

      const inputExpAddress = <HTMLInputElement>(
        document.getElementById(`expAddress${index}`)
      );
      inputExpAddress.value =
        data?.data?.the_experience?.the_experience_address?.[0]?.data
          ?.the_address || "";

      const inputExpCountry = <HTMLInputElement>(
        document.getElementById(`expCountry${index}`)
      );
      inputExpCountry.value =
        data?.data?.the_experience?.the_experience_country?.[0]?.data
          ?.the_country || "";

      const inputExpDateFrom = <HTMLInputElement>(
        document.getElementById(`expDateFrom${index}`)
      );
      inputExpDateFrom.value =
        data?.data?.the_experience?.the_experience_expdobFrom?.[0]?.data
          ?.the_expdobFrom || "";

      const inputExpDateTo = <HTMLInputElement>(
        document.getElementById(`expDateTo${index}`)
      );
      inputExpDateTo.value =
        data?.data?.the_experience?.the_experience_expdobTo?.[0]?.data
          ?.the_expdobTo || "";

      const inputExpDescription = <HTMLInputElement>(
        document.getElementById(`expDescription${index}`)
          );
      inputExpDescription.value =
        data?.data?.the_experience?.the_experience_expDescription?.[0]?.data
          ?.the_expDescription || "";    
    });

    data?.the_profile_s_documents?.map(async (data: any, index: any) => {
      await addDoc(index);
      const inputDocName = <HTMLInputElement>(
        document.getElementById(`docName${index}`)
      );
      inputDocName.value =
        data?.data?.the_documents?.the_documents_docName?.[0]?.data?.the_docName;

      const inputViewPDF: any = document.getElementById(`viewPdf${index}`);
      inputViewPDF.href =
        data?.data?.the_documents?.the_documents_docUrl?.[0]?.data?.the_docUrl;

      if (data?.data?.the_documents?.the_documents_docUrl) {
        const inputPdfValue: any = document.getElementById(`pdfFromDb${index}`);
        inputPdfValue.value =
          data?.data?.the_documents?.the_documents_docUrl?.[0]?.data?.the_docUrl;
        const pdfFl: any = document.getElementById(`pdfField${index}`);
        pdfFl.classList.remove("hidden");
        pdfFl.classList.add("block");
      }
    });

    data?.the_profile_s_skills?.map(async (data: any, index: any) => {
      await addSkills(index);
      const inputlanguage = <HTMLInputElement>(
        document.getElementById(`language${index}`)
      );
      inputlanguage.value =
        data?.data?.the_skills?.the_skills_language?.[0]?.data?.the_language ||
        "";

      const inputYearOfExperience = <HTMLInputElement>(
        document.getElementById(`yearOfExperience${index}`)
      );
      inputYearOfExperience.value =
        data?.data?.the_skills?.the_skills_yearOfExperience?.[0]?.data
          ?.the_yearOfExperience || "";
    });
    const inputFullName = <HTMLInputElement>document.getElementById("fullName");
    inputFullName.innerHTML = data?data?.the_profile_first_name?.[0]?.data?.the_first_name+ " "+data?.the_profile_last_name?.[0]?.data?.the_last_name:profileList.entity?.first_name +" "+profileList.entity?.last_name

    const inputworkingPosition = <HTMLInputElement>document.getElementById("workingPosition");
    inputworkingPosition.innerHTML=data.the_profile_workPosition?.[0]?.data?.the_workPosition;

    const inputContact = <HTMLInputElement>document.getElementById("contact");
    inputContact.innerHTML=data?.the_profile_email?.[0]?.data?.the_email || profileList?.entity?.person?.email +"||"+data?.the_profile_phone?.[0]?.data?.the_phone||profileList?.data?.the_user?.entity?.person?.phone;

    const inputAbout = <HTMLInputElement>document.getElementById("about");
    if(data?.the_profile_aboutYou){
    inputAbout.innerHTML = data?.the_profile_aboutYou?.[0]?.data?.the_aboutYou || '';
    const inputProfile = <HTMLInputElement>document.getElementById("profile");
    inputProfile.style.display="block"
    }
    if(data?.the_profile_s_experience){
    const inputExp = <HTMLInputElement>document.getElementById("exp");
    inputExp.style.display="block"
    await experience(data?.the_profile_s_experience);
    }
    if(data?.the_profile_s_experience){
      const inputEdu = <HTMLInputElement>document.getElementById("edu");
      inputEdu.style.display="block"
      await education(data?.the_profile_s_education);
      }
    if(data?.the_profile_s_experience){
      const inputSkill = <HTMLInputElement>document.getElementById("skill");
      inputSkill.style.display="block"
      await skills(data?.the_profile_s_skills); 
      }
  }
}

export async function submitAddProfileForm(e: any) {
  e.preventDefault();
  const eduContainers = document.querySelectorAll(".input-container");
  EducationFieldsArray.length = 0; // Clear the array
  
  eduContainers.forEach((container) => {
    const inputs: any = container.querySelectorAll(".input-field");
    EducationFieldsArray.push({
      eduLevel: inputs[0].value,
      course: inputs[1].value,
      dobFrom: inputs[2].value,
      dobTo: inputs[3].value,
      institutionName: inputs[4].value,
      institutionAddress: inputs[5].value,
      eduDescription: inputs[6].value,
    });
  });

  const expContainers = document.querySelectorAll(".input-container-1");
  ExperienceFieldsArray.length = 0; // Clear the array
  
  expContainers?.forEach(async (container) => {
    const inputs: any = container.querySelectorAll(".input-field-1");
    ExperienceFieldsArray.push({
      company: inputs[0].value,
      position: inputs[1].value,
      address: inputs[2].value,
      country: inputs[3].value,
      expdobFrom: inputs[4].value,
      expdobTo: inputs[5].value,
      expDescription: inputs[6].value,
    });
  });

  const docContainers = document.querySelectorAll(".input-container-2");
  DocumentFieldsArray.length = 0; // Clear the array
  
  docContainers?.forEach((container2) => {
    const inputs: any = container2.querySelectorAll(".input-field-2");
    DocumentFieldsArray.push({
      docName: inputs[0].value,
      // docUrl: inputs[1].value,
      docUrl: inputs[2].value,
    });
  });

  const skillsContainers = document.querySelectorAll(".input-container-3");
  SkillsFieldsArray.length = 0; // Clear the array

  skillsContainers?.forEach((container) => {
    const inputs: any = container.querySelectorAll(".input-field-3");
    SkillsFieldsArray.push({
      language: inputs[0].value,
      yearOfExperience: inputs[1].value,
      // docUrl: inputs[2].value,
    });
  });
  const formData: any = new FormData(e.target);
  formData.append("education", JSON.stringify(EducationFieldsArray));
  formData.append("experience", JSON.stringify(ExperienceFieldsArray));
  formData.append("skills", JSON.stringify(SkillsFieldsArray));
  formData.append("documents", JSON.stringify(DocumentFieldsArray));
  delete formData?.profilePic;
  formData.image = attachmentValues?.url;
  // output as an object
  const formValues: any = Object.fromEntries(formData);
  
  
  const inputFirstName = <HTMLInputElement>document.getElementById("first_name");
  const inputLastName = <HTMLInputElement>document.getElementById("last_name");
  const inputEmail = <HTMLInputElement>document.getElementById("email");
  const inputPhone = <HTMLInputElement>document.getElementById("phone");
  
  function setErrorFor(input: any, message: any) {
    const formControl = input.parentElement;
    const small = formControl.querySelector("small");
    formControl.className = "form-control error";
    small.innerText = message;
  }
  if (formValues.first_name === "") {
    inputFirstName.focus();
    setErrorFor(inputFirstName, "First Name cannot be empty");
  }
  if (formValues.last_name === "") {
    inputLastName.focus();
    setErrorFor(inputLastName, "Last Name cannot be empty");
  }
  if (formValues.email === "") {
    inputEmail.focus();
    setErrorFor(inputEmail, "Email cannot be empty");
  }
  if (formValues.phone === "") {
    setErrorFor(inputPhone, "Phone no cannot be empty");
  }
  if (
    formValues.first_name &&
    formValues.last_name &&
    formValues.phone
  ) {
    await createProfile(formValues);
  }
}

export async function createProfile(formValues: any) {
  // let profileIdLen:number=profileList.profileId.length-1
  if (profileList.profileId){
  profileList?.profileId?.forEach(async function(x:any) {
      await DeleteConceptById(x.id);
})}

  const profileStorageData: any = await getLocalStorageData();
  const userId = profileStorageData?.userId;
  const eduName = JSON.parse(formValues?.education as string);
  const expName = JSON.parse(formValues?.experience as string);
  const documents = JSON.parse(formValues?.documents as string);
  const skills = JSON.parse(formValues?.skills as string);
  let profileNameConcept: any;
  let eduNameConcept: any;
  let expNameConcept: any;
  let docConcept: any;
  // Object.assign(formValues, { profilePicUrl: profilePicUrl });

  delete formValues.education;
  delete formValues.experience;
  delete formValues.documents;
  delete formValues.skills;
  delete formValues.eduLevel;
  delete formValues.course;
  delete formValues.eduDateFrom;
  delete formValues.eduDateTo;
  delete formValues.eduDescription;
  delete formValues.institutionName;
  delete formValues.institutionAddress;
  delete formValues.company;
  delete formValues.position;
  delete formValues.expAddress;
  delete formValues.expCountry;
  delete formValues.expDateFrom;
  delete formValues.expDateTo;
  delete formValues.expDescription;
  delete formValues.language;
  delete formValues.yearOfExperience;
  await loader(true)
  profileNameConcept = await createEntityInstance(
    "profile",
    userId,
    formValues
  );
  await Promise.all(
    eduName?.map(async (items: any) => {
      eduNameConcept = await createEntityInstance("education", userId, items);

      await CreateConnectionBetweenEntityLocal(
        profileNameConcept,
        eduNameConcept,
        "s_education"
      );
    })
  );

  await Promise.all(
    expName?.map(async function (item: any) {
      expNameConcept = await createEntityInstance("experience", userId, item);
      await CreateConnectionBetweenEntityLocal(
        profileNameConcept,
        expNameConcept,
        "s_experience"
      );
    })
  );
  await Promise.all(
    documents?.map(async function (item: any) {
      docConcept = await createEntityInstance("documents", userId, item);
      await CreateConnectionBetweenEntityLocal(
        profileNameConcept,
        docConcept,
        "s_documents"
      );
    })
  );
  await Promise.all(
    skills?.map(async function (item: any) {
      docConcept = await createEntityInstance("skills", userId, item);
      await CreateConnectionBetweenEntityLocal(
        profileNameConcept,
        docConcept,
        "s_skills"
      );
    })
  );
  const userConcept: any = await GetTheConceptLocal(
    profileStorageData.userConcept
  );
  await CreateConnectionBetweenEntityLocal(
    userConcept,
    profileNameConcept,
    "profile"
  );
await LocalSyncData.SyncDataOnline();
await loader(false)
  setTimeout(async () => {
    await showToast(
      "success",
      "Profile updated successfully!",
      "",
      "top-right",
      5000
    );
    location.reload();
  }, 100);

}
// await getProfileData()
// return profileNameConcept;
