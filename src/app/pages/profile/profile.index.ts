import mainViewClass from '../../default/mainView.class.ts';
import topNavigation from "../../modules/top-nav/top-navigation"
import './profile.style.css';
import { addEducation,addExperience,previewImage, getProfileData, addDoc,addSkills,openProfileModal } from "./profile.service"
import createProfileModalHTML from '../../modules/profile-modal/create-profile-modal.ts';
import { initTopNavigation } from '../../modules/top-nav/top-navigation.service.ts';
import { submitAddProfileForm} from "./profile.service"
// import { ClassicEditor, Essentials, Bold, Italic, Font, Paragraph, Link, List } from 'ckeditor5';
// import 'ckeditor5/ckeditor5.css';


//CK Editor
// const editorConfig:any={
//   plugins: [ Essentials, Bold, Italic, Font, Paragraph, Link, List ],
//   toolbar: {
//       items: [
//           'undo', 'redo', '|', 'bold', 'italic', '|','bulletedList', 'numberedList',
//           'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor','link',
//         ]
//       },
      
//       heading: {
//         options: [
//           { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
//           // Add other heading options if needed
//         ]
//       },
//       // Apply custom styles to the editor content
//       fontFamily: {
//         options: [ 'default', 'Arial, Helvetica, sans-serif', 'Courier New, Courier, monospace' ],
//         supportAllValues: true
//       },
//       fontSize: {
//         options: [ 10, 12, 14, 'default', 18, 20, 22 ],
//       supportAllValues: true
//   },
//   initialData: '<p id="initialData">This is the initial content with a custom text color.</p>',      
// }
export default class extends mainViewClass {
  constructor(params: any) {
    super(params);
    this.setTitle('Listing Item');
  }
  async getHtml(): Promise<string> {
    // (window as any).popupAlert = popupAlert;
    // (window as any).saveProfileDetails = saveProfileDetails;
    // (window as any).updateProfile = updateProfile;
    (window as any).submitAddProfileForm = submitAddProfileForm;
    (window as any).addFn = addEducation;
    (window as any).addExperience=addExperience;
    (window as any).addDoc=addDoc;
    (window as any).addSkills=addSkills;
    (window as any).previewImage=previewImage;
    (window as any).openProfileModal=openProfileModal;
   
    // const loadHTML = await getHTML()

    // load content
    // loadProfileDetails()
    // const profileData=await 
    // console.log(profileData,"profileData")
    getProfileData()
    const profileModal = await createProfileModalHTML()

    // loadProfileDetails()

    setTimeout(() => {
      initTopNavigation();
    }, 500);
    
    // const editor:any=document.getElementById(`aboutYou`)
    //   ClassicEditor.create(editor,editorConfig)
    return `
      ${topNavigation}
      ${profileModal}
      <div id="loader" class="center"></div>
      <div class="w-4/5 mx-auto my-8">
      <h1 class="dark:text-white">Your Profile</h1>
      <button class="float-right bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-700 transition"
      onclick="openProfileModal()"
      >
      View Profile
      </button>
        <form method="post" onsubmit="submitAddProfileForm(event)" class="mt-10">
        <h2 class="dark:text-white text-2xl">Basic Information:</h2>
        <div class="grid gap-6 mb-6 mt-6 md:grid-cols-3">
            <div class="form-control">
              <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name*</label>
              <input type="text" id="first_name"
                 name="first_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="John" />
                <small></small>
            </div>
            <div>
              <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name*</label>
              <input type="text" id="last_name"
                name="last_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Doe"
                />
                <small></small>
            </div>
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email*</label>
              <input type="email" id="email"
                name="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="xyz@email.com"
                disabled />
                <small></small>
            </div>
            <div>
              <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number*</label>
              <input type="tel" id="phone"
                name="phone"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="1234567890" />
                <small></small>
            </div>
            <div>
              <label for="dob" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date of birth</label>
              <input type="date" id="dob"
                name="dob"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="flowbite.com" />
            </div>
            <div class="mb-6">
              <label for="gender" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gender</label>
              <select id="gender" name="gender" autocomplete="gender-name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="" >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="mb-6">
              <label for="maritialStatus" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Marital Status</label>
              <select id="maritialStatus" name="maritialStatus" autocomplete="maritialStatus-name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="" >
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="others">Others</option>
              </select>
            </div>
             <div class="mb-6">
              <label for="department" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Department</label>
              <select id="department" name="department" autocomplete="department-name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="" >
                <option value="technical">Technical</option>
                <option value="sales">Sales</option>
                <option value="marketing">Marketing</option>
                <option value="finance">Finance</option>
                <option value="administrator">Administrator</option>
                <option value="humanResource">Human Resource</option>
              </select>
            </div>
            <div class="mb-6">
              <label for="workPosition" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Position</label>
             <input type="text" id="workPosition"
                name="workPosition"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Position" />
            </div>
            <div>
              <label for="workExperience" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total Years of working experience</label>
              <input type="number" id="workExperience"
                name="workExperience"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Total Years" />
            </div>         
          </div>
          <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">

          <h2 class="dark:text-white text-2xl">About You:</h2>
          <div class="grid gap-6 mb-6 mt-6 md:grid-cols-1">
          
          <div class="mb-6">
              <label for="addressType" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"></label>
              <textarea
              rows="10" cols="80"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="aboutYou" name="aboutYou">
               </textarea>
            </div>
          </div>
          
          <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">

          <h2 class="dark:text-white text-2xl">Address:</h2>
          <div class="grid gap-6 mb-6 mt-6 md:grid-cols-3">
          
          <div class="mb-6">
              <label for="addressType" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address Type</label>
              <select id="addressType" name="addressType" autocomplete="addressType-name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="" >
                <option value="permanent">Permanent</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>
            <div>
              <label for="streetNumber" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Street Number</label>
              <input type="number" id="streetNumber"
                name="streetNumber"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Street Number" />
            </div>
            <div>
              <label for="streetAddress" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Street Addresss</label>
              <input type="text" id="streetAddress"
                name="streetAddress"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Street Address" />
            </div>
            <div>
              <label for="unit" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Unit</label>
              <input type="text" id="unit"
                name="unit"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Unit" />
            </div>
            <div>
              <label for="city" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
              <input type="text" id="city"
                name="city"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="City" />
            </div>
          <div>
              <label for="state" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">State</label>
              <input type="text" id="state"
                name="state"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="State" />
          </div>
          <div>
              <label for="zip" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Zip</label>
              <input type="text" id="zip"
                name="zip"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="zip" />
          </div>
          <div class="mb-6">
              <label for="country" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Country</label>
              <select id="country" name="country" autocomplete="country-name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="" >
                <option value="nepal">Nepal</option>
                <option value="canada">Canada</option>
              </select>
          </div>
          </div>
        <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
        <div id="inputFields">
        </div>

        <div class="grid gap-6 mb-6 mt-6 md:grid-cols-6">
         <div class="container">
        <button type="button"
            onclick="addFn();"
            class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"> + Add Education</button>
        </div>
         </div>

        <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
        <div id="inputFields-1">
        </div>
        <div class="grid gap-6 mb-6 mt-6 md:grid-cols-6">
         <div class="container-1">
          <button type="button"
            onclick="addExperience();"
            class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"> +  Add Experience</button>
         </div>
        </div>

      <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
        <div id="inputFields-3">
        </div>
        <div class="grid gap-6 mb-6 mt-6 md:grid-cols-6">
         <div class="container-3">
          <button type="button"
            onclick="addSkills();"
            class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"> +  Add Skills</button>
         </div>
        </div>

         <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
        <div id="inputFields-2">
        </div>
        <div class="grid gap-6 mb-6 mt-6 md:grid-cols-6">
         <div class="container-2">
          <button type="button"
            onclick="addDoc();"
            class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"> + Add Document</button>
         </div>
        </div>

      
        <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
         <label for="itemAttachment" class="block text-sm font-medium leading-6">Profile Images<span
                class="text-rose-400">*</span></label>
            <div class="mt-2">
              <input id="file" type="file" accept=".png, .jpg, .jpeg" onchange="previewImage(event)" name="profile" autocomplete="item-attachment"
                class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
                <input id="imgInput" name="profilePic"
                type="hidden"
                class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6 text-zinc-900 bg-zinc-50 dark:text-white dark:bg-gray-900">
                </div>
            <img id="profilePic" class="mt-5" style="border-radius:50%"; height="100px" width="70px" alt="Preview Image">
        <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
         <div class="grid gap-6 mb-6 mt-6 md:grid-cols-3">
         <div>
              <label for="currentCompany" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company Name</label>
              <input type="text" id="currentCompany"
                 name="currentCompany"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Present Company Name" />
            </div>
            <div>
              <label for="currentSalary" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Current Salary</label>
              <input type="number" id="currentSalary"
                 name="currentSalary"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Current Salary" />
            </div>
            <div>
              <label for="desireSalary" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Desire Salary</label>
              <input type="number" id="desireSalary"
                 name="desireSalary"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Desire Salary" />
            </div>
          </div> 
          <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"> 
        <button type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update</button>
        </form>
      </div>
    `
  }

}

