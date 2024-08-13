import { environment } from "../../environments/environment.dev";
import { closeinterViewModal } from "../../pages/jobs/job/job.service";
import { getLocalStorageData } from "../../services/helper.service";
import {userListOfData } from "../../services/getUserProfile.service";
import { createEntityInstance } from "../../services/createEntityInstance.service";
import { CreateConnectionBetweenEntityLocal } from "../../services/entity.service";
import {DeleteConceptById, GetTheConcept, LocalSyncData } from "mftsccs-browser";
import { listOfOneInterviewSchedule } from "../../services/getInterviewSchedule.service";
import { showToast } from "../toast-bar/toast-bar.index";
import { loader } from "../loader/loader.index";
const thetaBoommAPI = environment?.boomURL;
const EmailFieldsArray: any = [];

export const addEmail=(index:number)=>{
    const divEle: any = document.getElementById("sendEmail");
    const container = document.createElement("div");
    container.classList.add("email-container");
    const sendEmail:any=document.getElementById("send-email");
    sendEmail.classList.remove("hidden")
    // Add HTML for input fields and delete button
    container.innerHTML = `
          <div id="email-container" class="grid gap-6 m-6 md:grid-cols-2">
            <div class="form-control">
            <label for="email"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
            <input type="email" id="email${index}" name="email"
            class="email-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="" />
            <small></small>
            </div>
            <button type="button" onclick="delEmail(this);" class="delete-button mt-7 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-20 sm:w-20 px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Delete</button>
            </div>  
        `;
    divEle.appendChild(container);

}
export const delEmail=async(button: any)=>{
    // const sendEmail:any=document.getElementById("send-email");
    // sendEmail.classList.add("hidden")
    const container = button.parentElement;
    const index = Array.from(container.parentElement.children).indexOf(container);
    container.remove();
  
    // Remove from array
    EmailFieldsArray.splice(index, 1);
}
export const disablePastDates=()=> {
    var today:any = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
  
    today = yyyy + '-' + mm + '-' + dd;
    const getInterviewDate:any=document.getElementById("interviewDate")
    getInterviewDate.setAttribute("min", today);
}
export const sendEmailForInterview=async()=>{
    await loader(true)
    const head:any=document.getElementById('heading');
    const content:any=document.getElementById('body');
    const subject:any = head.value;
    const body:any = content.value
    const emailContainers = document.querySelectorAll(".email-container");
    EmailFieldsArray.length = 0; // Clear the array
  
   await emailContainers.forEach((container) => {
      const inputs: any = container.querySelectorAll(".email-field");
      EmailFieldsArray.push(inputs[0].value);
    });
    const sendBulkEmail:any={
        body:body,
        heading: subject,
        fromCompany: "" ,// optional
        bulkAddresses: EmailFieldsArray,
    }
    
    
    const profileStorageData: any = await getLocalStorageData();
    const token = profileStorageData?.token;
    // console.log(token,"token here")
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf8");
    myHeaders.append("Authorization", `Bearer ${token}`);
    // console.log(myHeaders,"")
    // return;
    const response = await fetch(`${thetaBoommAPI}/api/sendmail/bulk`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        body:JSON.stringify(sendBulkEmail),
      });
      if (!response.ok) {
        const errorData = await response.text();
        console.warn(`${response.status} ${errorData}`);
        return null;
      }else{
        await loader(false)
        setTimeout(async () => {
            await showToast(
              "success",
              "Email send successfully!",
              "",
              "top-right",
              5000
            );
          }, 100);
      }
}
export const interviewschedueGetFormData=async(userConceptId:any)=>{
    const userConceptIdInput = <HTMLInputElement>document.getElementById("userConceptId")
    userConceptIdInput.value=userConceptId
    function todayDate() {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const dd = String(today.getDate()).padStart(2, '0');
        const formattedToday = `${yyyy}-${mm}-${dd}`;
        return formattedToday;
    }
   const getInterviewSchedule=await listOfOneInterviewSchedule(userConceptId)
   const status = <HTMLInputElement>document.getElementById("status");userConceptId
   status.value=getInterviewSchedule?.interviewScheduleFormatData?.the_interViewSchedule_status?.[0]?.data?.the_status || 'unScreened'
   const interviewDateDiv=<HTMLInputElement>document.getElementById("interviewdate")
   const interviewTimeDiv=<HTMLInputElement>document.getElementById("interviewtime")
     if(status.value==='screened'){
         console.log(status.value,"codition applyies")
        interviewDateDiv.classList.remove("hidden");
        interviewTimeDiv.classList.remove("hidden");
    }
    // else{
    //     interviewDateDiv.classList.add("hidden");
    //     interviewTimeDiv.classList.add("hidden");
    // }
   const interviewDate = <HTMLInputElement>document.getElementById("interviewDate");
   interviewDate.value=getInterviewSchedule?.interviewScheduleFormatData?.the_interViewSchedule_interviewDate?.[0]?.data?.the_interviewDate || todayDate()
   
   const interviewTime = <HTMLInputElement>document.getElementById("interviewTime");
   interviewTime.value=getInterviewSchedule?.interviewScheduleFormatData?.the_interViewSchedule_interviewTime?.[0]?.data?.the_interviewTime || '9am'
   const personality = <HTMLInputElement>document.getElementById("personality");
   personality.value=getInterviewSchedule?.interviewScheduleFormatData?.the_interViewSchedule_personality?.[0]?.data?.the_personality || ''
   const skillKnowledge = <HTMLInputElement>document.getElementById("skillKnowledge");
   skillKnowledge.value=getInterviewSchedule?.interviewScheduleFormatData?.the_interViewSchedule_skillKnowledge?.[0]?.data?.the_skillKnowledge || ''
   const characterFlow = <HTMLInputElement>document.getElementById("characterFlow");
   characterFlow.value=getInterviewSchedule?.interviewScheduleFormatData?.the_interViewSchedule_characterFlow?.[0]?.data?.the_characterFlow || ''
   const template = <HTMLInputElement>document.getElementById("template");
   template.value=getInterviewSchedule?.interviewScheduleFormatData?.the_interViewSchedule_template?.[0]?.data?.the_template || ''
   const heading = <HTMLInputElement>document.getElementById("heading");
   heading.value=getInterviewSchedule?.interviewScheduleFormatData?.the_interViewSchedule_heading?.[0]?.data?.the_heading || ''
   const body = <HTMLInputElement>document.getElementById("body");
   body.value=getInterviewSchedule?.interviewScheduleFormatData?.the_interViewSchedule_body?.[0]?.data?.the_body || ''

   
   getInterviewSchedule?.interviewScheduleFormatData?.the_interViewSchedule_s_bulkEmail?.map(async (output: any, index: any) => {
    await addEmail(index);
    const inputEmail = <HTMLInputElement>(
      document.getElementById(`email${index}`)
    );
    inputEmail.value =
    output?.data?.the_bulkEmail?.the_bulkEmail_emailAddress?.[0]?.data?.the_emailAddress;
   })
}
export const onChange= async()=>{
    const getUserConceptId=<HTMLInputElement>document.getElementById("userConceptId")
    const status=<HTMLInputElement>document.getElementById("status")
    const interviewDateDiv=<HTMLInputElement>document.getElementById("interviewdate")
    const interviewTimeDiv=<HTMLInputElement>document.getElementById("interviewtime")
    const interviewDateInput=<HTMLInputElement>document.getElementById('interviewDate');
    const interviewTimeInput=<HTMLInputElement>document.getElementById('interviewTime');
    const templateInput=<HTMLInputElement>document.getElementById('template');
    const headingInput=<HTMLInputElement>document.getElementById('heading');
    const contentInput=<HTMLInputElement>document.getElementById('body');
    if(status.value==='screened'){
        interviewDateDiv.classList.remove("hidden");
        interviewTimeDiv.classList.remove("hidden");
    }else{
        interviewDateDiv.classList.add("hidden");
        interviewTimeDiv.classList.add("hidden");
    }
    const userConceptId:any=getUserConceptId.value || ''
    const userList:any= await userListOfData(userConceptId);
    const UserFirstName=userList.the_Profile?.the_profile_first_name?.[0]?.data?.the_first_name || userList?.entity?.first_name;

    if(templateInput.value=='template1'){
    headingInput.value=`[Job Title] Opportunity at Mentors Friend`; 
    contentInput.value=`Hi ${UserFirstName},

Thank you for applying to the [Job Title] position at Mentors Friend. After reviewing your application, we’re excited to invite you to interview for the role! 

Your interview will be conducted [Format] and last roughly [Length of Interview]. You’ll be speaking with [Interviewer], our [Interviewer Job Title] here at Mentors Friend.

Please let us know if you are available during the following times:

[Day, ${interviewDateInput.value} – Time, ${interviewTimeInput.value}]


Thanks again for your interest in joining the Mentors Friend team! We’re looking forward to speaking with you.

Best,

[Your Name]
[Your Email Signature]`;
    }
    else if(templateInput.value=='template2'){
        headingInput.value=`[Job Title] Opportunity at Mentors Friend`; 
        contentInput.value=`
            <div class="container" style=" max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <div class="header" style="text-align: center;
            padding: 10px 0;">
            <img style="max-width: 150px;" src="https://via.placeholder.com/150" alt="Company Logo">
            </div>
            <div class="content">
            <h2 style="color: #333;">Interview Invitation</h2>
            <p style="margin: 10px 0;">Dear ${UserFirstName},</p>
            <p style="margin: 10px 0;">We are pleased to invite you to an interview for the position of [Position Name] at Mentors Friend. Below are the details of your interview:</p>
            <div class="details" style="margin: 20px 0;
            padding: 10px;
            background-color: #f9f9f9;
            border-left: 4px solid #007BFF;">
            <p style="margin: 5px 0;"><strong>Date:</strong> ${interviewDateInput.value}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${interviewTimeInput.value}</p>
            <p style="margin: 5px 0;"><strong>Location:</strong> <a href="https://g.co/kgs/wKeJjyt">click here</a></p>
            <p style="margin: 5px 0;"><strong>Interviewers:</strong> [Interviewers]</p>
            </div>
            <p style="margin: 10px 0;">Please ensure to bring a copy of your resume and arrive 10 minutes early. If you have any questions, feel free to contact us at [Contact Information].</p>
            <p style="margin: 10px 0;">We look forward to meeting you.</p>
            <p style="margin: 10px 0;">Sincerely,</p>
            <p style="margin: 10px 0;">[Your Name]<br>[Your Position]<br>Mentors Friend</p>
            </div>
            <div class="footer" style=" text-align: center;
            color: #777;
            font-size: 12px;
            margin-top: 20px;">
            <p>&copy; [Year] Mentors Friend. All rights reserved.</p>
            </div>
            </div>`
    }else{
        headingInput.value='';
        contentInput.value='';
    }
}
export const submitSetInterviewForm=async(e:any)=>{
    e.preventDefault()
    const sendEmailContainers = document.querySelectorAll(".email-container");
    EmailFieldsArray.length = 0; // Clear the array

  sendEmailContainers.forEach(async (container) => {
    const inputs: any = container.querySelectorAll(".email-field");
    EmailFieldsArray.push({
      emailAddress: inputs[0]?.value,
    });
  });
    const formData: any = new FormData(e.target);
    const formValues: any = Object.fromEntries(formData);
    const userConceptElement:any=document.getElementById('userConceptId');
    const userConceptId=userConceptElement.value
    // console.log(formValues,"formValues",EmailFieldsArray,"userConceptId",userConceptId)
    // await DeleteConceptById(101225073);
    const getInterviewSchedule=await listOfOneInterviewSchedule(userConceptId)
    // return;
    console.log(getInterviewSchedule,"getInterviewSchedule")
    if(getInterviewSchedule?.interviewScheduleid){
        await DeleteConceptById(getInterviewSchedule?.interviewScheduleid)
       }
    delete formValues.userConceptId
    const interviewScheduleNameConcept = await createEntityInstance(
        "interViewSchedule",
        userConceptId,
        formValues
      );

    await Promise.all(
        EmailFieldsArray?.map(async (items: any) => {
          const bulkEmailNameConcept = await createEntityInstance("bulkEmail", userConceptId,items);
    
          await CreateConnectionBetweenEntityLocal(
            interviewScheduleNameConcept,
            bulkEmailNameConcept,
            "s_bulkEmail"
          );
        })
      );
    const userConcept:any=await GetTheConcept(userConceptId)
    // return;
    await CreateConnectionBetweenEntityLocal(
        userConcept,
        interviewScheduleNameConcept,
        "interViewSchedule"
      );
    await LocalSyncData.SyncDataOnline(); 
    setTimeout(async () => {
        await showToast(
          "success",
          "Interview Schedule updated successfully!",
          "",
          "top-right",
          5000
        );
        location.reload();
      }, 100);
}
export default async function createSetInterviewModalHTML() {
    (window as any).closeModal = closeinterViewModal;
    (window as any).addEmail = addEmail;
    (window as any).delEmail = delEmail;
    (window as any).sendEmailForInterview=sendEmailForInterview;
    (window as any).disablePastDates=disablePastDates;
    (window as any).onChange=onChange;
    (window as any).submitSetInterviewForm=submitSetInterviewForm

  return `
    <div id="loader" class="center"></div>
    <div id="create-setInterview-modal"
    class="fixed hidden z-50 inset-0 bg-gray-900 bg-opacity-60 dark:bg-gray-200 dark:bg-opacity-40 overflow-y-auto h-full w-full px-4">
    <div
        class="relative top-20 mx-auto shadow-xl rounded-md bg-gray max-w-6xl text-zinc-900 bg-zinc-50 dark:text-gray dark:bg-gray-900">
        <div class="flex justify-between px-4 pt-4">
            <h3 class="text-xl font-normal text-zinc-900 dark:text-white my-0">
                Set Interview
            </h3>
            <button onclick="closeModal('create-setInterview-modal')" type="button"
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"></path>
                </svg>
            </button>
        </div>
        <!--  -->
        <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
        <div class="p-6 pt-0">
        <form method="post" onsubmit="submitSetInterviewForm(event)" class="mt-10">
            <div class="grid gap-6 m-6 md:grid-cols-3">
                <div class="form-control">
                    <label for="status"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Staus</label>
                    <select id="status" name="status" autocomplete="status-name"
                        onchange="onChange()"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="">
                        <option value="">Select Your Status</option>
                        <option value="unScreened">Unscreened</option>
                        <option value="screened">Screened</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interviwed">Interviwed</option>
                        <option value="selected">Selected</option>
                        <option value="flag">Flag</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
                <div id="interviewdate" class="form-control hidden">
                    <label for="interviewDate"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">InterView Date</label>
                    <input type="date" id="interviewDate" name="interviewDate" onfocus="disablePastDates()"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="" />
                    <small></small>
                </div>
                <div id="interviewtime" class="form-control hidden">
                    <label for="interviewTime"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Time</label>
                    <select id="interviewTime" name="interviewTime" autocomplete="interviewTime-name"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="">
                        <option value="9 AM">9AM</option>
                        <option value="10 AM">10AM</option>
                        <option value="11 AM">11AM</option>
                        <option value="12 PM">12PM</option>
                        <option value="1 PM">1PM</option>
                        <option value="2 PM">2PM</option>
                        <option value="3 PM">3PM</option>
                        <option value="4 PM">4PM</option>
                        <option value="5 PM">5PM</option>
                        <option value="6 PM">6PM</option>
                    </select>
                </div>

                <div class="form-control">
                    <label for="personality"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Personality</label>
                    <select id="personality" name="personality" autocomplete="personality-name"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="">
                        <option value="">Select Personality</option>
                        <option value="Bad">Bad</option>
                        <option value="Not Bad">Not Bad</option>
                        <option value="Good">Good</option>
                        <option value="Very Good">Very Good</option>
                        <option value="Excellent">Excellent</option>
                    </select>
                </div>
                <div class="form-control">
                    <label for="skillKnowledge"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Skill Knowledge</label>
                    <select id="skillKnowledge" name="skillKnowledge" autocomplete="skillKnowledge-name"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="">
                        <option value="">Select Skill Knowledge</option>
                        <option value="Bad">Bad</option>
                        <option value="Not Bad">Not Bad</option>
                        <option value="Good">Good</option>
                        <option value="Very Good">Very Good</option>
                        <option value="Excellent">Excellent</option>
                    </select>
                </div>
                <div class="form-control">
                    <label for="characterFlow"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Character Flow</label>
                    <select id="characterFlow" name="characterFlow" autocomplete="characterFlow-name"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="">
                        <option value="">Select Character Flow</option>
                        <option value="Bad">Bad</option>
                        <option value="Not Bad">Not Bad</option>
                        <option value="Good">Good</option>
                        <option value="Very Good">Very Good</option>
                        <option value="Excellent">Excellent</option>
                    </select>
                </div>
            </div>
            <div class="grid gap-6 m-6 md:grid-cols">
              <div class="form-control">
                    <label for="template"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Template</label>
                    <select id="template" name="template" autocomplete="template-name"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder=""
                        onchange="onChange()"
                        >
                        <option value="">Select Your Templates</option>
                        <option value="template1">Template 1</option>
                        <option value="template2">Template 2</option>
                    </select>
                </div>
            </div>    
            <div class="grid gap-6 m-6 md:grid-cols">
                <div class="form-control">
                    <label for="heading"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Heading</label>
                    <input type="text" id="heading" name="heading"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="" />
                <small></small>
                </div>
            </div>

            <div class="grid gap-6 m-6 md:grid-cols">
                <div class="form-control">
                    <label for="body" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Body</label>
                        <textarea
                        rows="12" cols="60"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        id="body" name="body">
                         </textarea>
                    <small></small>
                </div>
            </div>
        <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
             <div id="sendEmail">
            </div>
            <div class="grid gap-6 m-6 md:grid-cols-6">
              <button type="button" onclick="addEmail();" id="add-button" class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">+ Add Email</button>
              <button type="button" onclick="sendEmailForInterview()" id="send-email" class="hidden text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Send Mail</button>
            </div>
              <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
            <div class="grid gap-6 m-6 md:grid-cols-6">
             <input type="hidden" id="userConceptId" name="userConceptId"/>
             <button type="submit" class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Submit</button>
            </div>
        </form>
        </div>
        <!--  -->
    </div>
</div> `;
}
