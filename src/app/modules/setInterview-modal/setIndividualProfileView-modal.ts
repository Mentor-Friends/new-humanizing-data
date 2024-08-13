import { closeIndividualProfileModal } from "../../pages/jobs/job/job.service";
import { userListOfData } from "../../services/getUserProfile.service";

// let render:any;
export async function getProfileFormData(userConceptId:number){
const userProfileData=await userListOfData(userConceptId)
const the_profile:any=userProfileData.the_Profile;
const divEle: any = document.getElementById("profileBody");
const html= `<div class="container mx-auto my-10 p-6 bg-white shadow-md">
<div class="flex items-center">
    <img id="profileImg" class="w-32 h-32 rounded-full mr-6" src="${the_profile?.the_profile_profilePic?.[0]?.data?.the_profilePic||'https://via.placeholder.com/150'}" alt="Employee Photo">
    <div>
        <h1 id="fName" class="text-3xl font-bold">${the_profile?.the_profile_first_name?.[0]?.data?.the_first_name||''} ${the_profile?.the_profile_last_name?.[0]?.data?.the_last_name||''}</h1>
        <p class="text-gray-700">Software Engineer</p>
        <p class="text-gray-700">${the_profile?.the_profile_email?.[0]?.data?.the_email||''}</p>
         <p class="text-gray-700">${the_profile?.the_profile_phone?.[0]?.data?.the_phone||''}</p>
    </div>
</div>

<div class="mt-8">
    <h2 class="text-2xl font-semibold mb-4 ${the_profile?.the_profile_aboutYou?.[0]?.data?.the_aboutYou?'':'hidden'}">Profile</h2>
    <p class="text-gray-700">${the_profile?.the_profile_aboutYou?.[0]?.data?.the_aboutYou||''}</p>
</div>

<div class="mt-8">
    <h2 class="text-2xl font-semibold mb-4 ${the_profile?.the_profile_s_experience?.[0]?.data?.the_experience?'':'hidden'}">Experience</h2>
    ${the_profile?.the_profile_s_experience?.map((output:any)=>{
        return`<div class="mb-6">
        <h3 class="text-xl font-semibold">${output?.data?.the_experience?.the_experience_position?.[0]?.data?.the_position || ''}</h3>
        <p class="text-gray-700">${output?.data?.the_experience?.the_experience_company?.[0]?.data?.the_company || ''}, ${output?.data?.the_experience?.the_experience_expdobFrom?.[0]?.data?.the_expdobFrom || ''}- ${output?.data?.the_experience?.the_experience_expdobTo?.[0]?.data?.the_expdobTo || ''}</p>
        <ul class="list-disc list-inside text-gray-700">
            <li>Developed and maintained web applications using React and Node.js.</li>
            <li>Led a team of 5 developers in agile project management.</li>
            <li>Optimized application performance, reducing load times by 30%.</li>
        </ul>
    </div>`
    })||''}
</div>

<div class="mt-8">
    <h2 class="text-2xl font-semibold mb-4 ${the_profile?.the_profile_s_education?.[0]?.data?.the_education?'':'hidden'}">Education</h2>
     ${the_profile?.the_profile_s_education?.map((output:any)=>{
    return `<div class="mb-6">
        <h3 class="text-xl font-semibold">${output?.data?.the_education?.the_education_eduLevel?.[0]?.data?.the_eduLevel.toUpperCase() || ''} of ${output?.data?.the_education?.the_education_course?.[0]?.data?.the_course || ''} </h3>

        <p class="text-gray-700">${output?.data?.the_education?.the_education_institutionName?.[0]?.data?.the_institutionName || ''} , ${output?.data?.the_education?.the_education_dobFrom?.[0]?.data?.the_dobFrom || ''} - ${output?.data?.the_education?.the_education_dobTo?.[0]?.data?.the_dobTo || ''}</p>
        <p class="text-gray-700">${output?.data?.the_education?.the_education_institutionAddress?.[0]?.data?.the_institutionAddress || ''}</p>   
</div>`
})||''}
</div>

<div class="mt-8">
    <h2 class="text-2xl font-semibold mb-4 ${the_profile?.the_profile_s_skills?.[0]?.data?.the_skills?'':'hidden'}">Skills</h2>
   <div class="flex flex-wrap">
    ${the_profile?.the_profile_s_skills?.map((output:any)=>{
         return`<span class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">${output?.data?.the_skills?.the_skills_language?.[0]?.data?.the_language || ''} - ${output?.data?.the_skills?.the_skills_yearOfExperience?.[0]?.data?.the_yearOfExperience || ''}years</span>`
    })||''}
    </div>
</div>
</div>`
// const container:any = document.createElement("div");
divEle.innerHTML=html 
// const innerHtml=getelemnt
// divEle.appendChild(container);
// render =`h1`

}

export default async function createViewIndividualProfileModalHTML() {
  (window as any).closeModal = closeIndividualProfileModal;

  return `
    <div id="create-viewIndividualProfile-modal"
    class="fixed hidden z-50 inset-0 bg-gray-900 bg-opacity-60 dark:bg-gray-200 dark:bg-opacity-40 overflow-y-auto h-full w-full px-4">
    <div
        class="relative top-20 mx-auto shadow-xl rounded-md bg-gray max-w-6xl text-zinc-900 bg-zinc-50 dark:text-gray dark:bg-gray-900">
        <div class="flex justify-between px-4 pt-4">
            <h3 class="text-xl font-normal text-zinc-900 dark:text-white my-0">
                Employees Details
            </h3>
            <button onclick="closeModal('create-viewIndividualProfile-modal')" type="button"
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"></path>
                </svg>
            </button>
        </div>
        <!--  -->
         <div id="profileBody"></div>
    
        <!--  -->
    </div>
    </div> `;
}
