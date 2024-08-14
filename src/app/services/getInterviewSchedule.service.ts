import { SearchLinkMultipleAll, SearchQuery } from "mftsccs-browser";
import { getLocalStorageData } from "./helper.service";

export const listOfOneInterviewSchedule=async(usrConceptId:number)=>{
      let userConceptId: any = Number(usrConceptId);
      const profileStorageData: any = await getLocalStorageData();
      const token = profileStorageData?.token;
      let searchfirst = new SearchQuery();
      searchfirst.composition = userConceptId;
      searchfirst.fullLinkers = ["the_user_interViewSchedule"];
      searchfirst.inpage = 100;
  
      let searchsecond: any = new SearchQuery();
      searchsecond.fullLinkers = [
      'the_interViewSchedule_status',
      'the_interViewSchedule_interviewDate',
      'the_interViewSchedule_interviewTime',
      'the_interViewSchedule_personality',
      'the_interViewSchedule_skillKnowledge',
      'the_interViewSchedule_characterFlow',
      'the_interViewSchedule_template',
      'the_interViewSchedule_heading',
      'the_interViewSchedule_body',
      'the_interViewSchedule_s_bulkEmail'
      ];
      searchsecond.inpage = 100;

      let searchthird: any = new SearchQuery();
      searchthird.fullLinkers = [
      'the_bulkEmail_emailAddress'
      ];
      searchthird.inpage = 100;
  
     
      const queryParams = [searchfirst, searchsecond,searchthird];
      const interviewSchedule = await SearchLinkMultipleAll(queryParams,token);
      const interviewScheduleid=interviewSchedule?.data?.the_user?.the_user_interViewSchedule?.[0]?.id || ''
      const interviewScheduleFormatData=interviewSchedule?.data?.the_user?.the_user_interViewSchedule?.[0]?.data?.the_interViewSchedule || ''
    return {interviewScheduleid,interviewScheduleFormatData};
}