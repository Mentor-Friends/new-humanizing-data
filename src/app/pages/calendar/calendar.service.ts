import { environment } from "../../environments/environment.dev";
import { loader } from "../../modules/loader/loader.index";
import { showToast } from "../../modules/toast-bar/toast-bar.index";
import { getLocalStorageData } from "../../services/helper.service";

const thetaBoommAPI = environment?.boomURL;
export async function getAllInterviewSchedule() {
    const profileStorageData: any = await getLocalStorageData();
    // const userId = profileStorageData?.userId;
    const token = profileStorageData?.token;
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");
    const bodyData:any=[
      {
          "type": "the_interViewSchedule",
          "fullLinkers": ["the_interViewSchedule_status","the_interViewSchedule_interviewDate","the_interViewSchedule_interviewTime"],
          "inpage": 10,
          "page": 1,
          "logic": "or",
          "filterSearches": [
          ]
      }]
  
    const bodyStringify=JSON.stringify(bodyData)
   
    const response= await fetch(`${thetaBoommAPI}/api/search-all-with-linker?type=status&search=screened&isComposition=false&inpage=10&page=1`,{
    // const response = await fetch(`${thetaBoommAPI}/api/search-all-without-auth-with-linker?type=status&search=unScreened&isComposition=false&inpage=10&page=1`, {
      method: "POST",
      headers: myHeaders,
      body: bodyStringify,
      redirect: "follow",
    });
    if (!response.ok) {
      const errorData = await response.text();
      await loader(false)
      setTimeout(async () => {
        await showToast(
          "error",
          "Failed to Load Event!",
          "",
          "top-right",
          5000
        );
      }, 100);
      console.warn(`${response.status} ${errorData}`);
      return null;
    }
    const output = await response.json();
    // console.log(output,"output here")
    // return;

    let interviewSchedule=output.map((data:any)=>{
      function convertToISOTime(timeStr:any) {
        // Parse the time string and extract hours and period (AM/PM)
        const [time, period] = timeStr?.split(' ');
        let [hours, minutes] = time?.split(':').map(Number);
    
        // Convert to 24-hour format
        if (period === 'PM' && hours !== 12) {
            hours += 12;
        }
        if (period === 'AM' && hours === 12) {
            hours = 0; // Midnight case
        }
    
        // Format hours and minutes to always be two digits
        hours = hours.toString().padStart(2, '0');
        minutes = minutes ? minutes.toString().padStart(2, '0') : '00';
    
        // Return the ISO time format
        return `T${hours}:${minutes}:00`;
    }
      const timeString = data?.data?.the_interViewSchedule?.the_interViewSchedule_interviewTime?.[0]?.data?.the_interviewTime;
      const isoTime = convertToISOTime(timeString);
    return {
    title:'InterView',
    start: data?.data?.the_interViewSchedule?.the_interViewSchedule_interviewDate?.[0]?.data?.the_interviewDate+isoTime,
    color:'red',
    backgroundColor:'green' 
        }
     })
     return interviewSchedule;
    // const events:any=[
    //   {
    //     title: 'InterView',
    //     start: '2024-08-01',
        
    //   },
    //   {
    //     title: 'Long Event',
    //     start: '2024-08-07',
    //     end: '2024-08-10',
    //     color: 'purple' // override!
    //   },
    //   {
    //     groupId: '999',
    //     title: 'Repeating Event',
    //     start: '2024-08-09T16:00:00'
    //   },
    //   {
    //     groupId: '999',
    //     title: 'Repeating Event',
    //     start: '2024-08-16T16:00:00'
    //   },
    //   {
    //     title: 'Conference',
    //     start: '2024-08-11',
    //     end: '2024-08-13',
    //     color: 'purple' // override!
    //   },
    //   {
    //     title: 'Meeting',
    //     start: '2024-08-12T10:30:00',
    //     end: '2024-08-12T12:30:00'
    //   },
    //   {
    //     title: 'Lunch',
    //     start: '2024-08-12T12:00:00'
    //   },
    //   {
    //     title: 'Meeting',
    //     start: '2024-08-12T14:30:00'
    //   },
    //   {
    //     title: 'Birthday Party',
    //     start: '2024-08-13T07:00:00'
    //   },
    //   {
    //     title: 'Click for Google',
    //     url: 'https://google.com/',
    //     start: '2024-08-28'
    //   }
    // ];
         
    //  return events;

   
}