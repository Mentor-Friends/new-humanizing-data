import mainViewClass from "../../default/mainView.class";
import topNavigation from "../../modules/top-nav/top-navigation";
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import { getAllInterviewSchedule } from "./calendar.service";           
export const diplayCalendar=async()=>{
  // await document.addEventListener('DOMContentLoaded', async function() {
    const InterviewSchedules=await getAllInterviewSchedule()
    var calendarEl:any = document.getElementById('calendar');
    if(calendarEl){
    var calendar =await new Calendar(calendarEl, {
        plugins: [dayGridPlugin],
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay'
        },
        initialView: 'dayGridMonth',
        initialDate: '2024-08-12',
        eventColor: 'green',
        events: InterviewSchedules ||''
        
    });
    calendar.render();
  }
  // });
}
export default class extends mainViewClass {
  constructor(params: any) {
    super(params);
    this.setTitle('calender');
  }
  async getHtml(): Promise<string> {
    
    setTimeout(async() => {
      await diplayCalendar();
    }, 100);
    // const cal= await diplayCalendar()
    // console.log("here",cal)
      return `
      ${topNavigation}
      <div id="loader" class="center"></div>
      <div class="w-4/5 mx-auto my-8">
      <div id="calendar"></div>
      </div>  
      `
    }
    }        