import { SearchLinkMultipleAll, SearchQuery } from "mftsccs-browser";
import { getLocalStorageData } from "./helper.service";

export const ListOfJob=async(jobProId:number)=>{
    const profileStorageData: any = await getLocalStorageData();
    const token = profileStorageData?.token;

    let searchfirst = new SearchQuery();
    searchfirst.composition = jobProId;
    searchfirst.fullLinkers = ["the_entity_s_appliedJob"];
    searchfirst.reverse = true;
    searchfirst.inpage = 100;
  
    let searchSecond = new SearchQuery();
    searchSecond.fullLinkers = [
      "the_entity",
      "the_entity_firstname",
      "the_entity_lastname",
      "the_entity_email",
      "the_entity_user",
    ];
    searchSecond.inpage = 100;
  
    let searchThird = new SearchQuery();
    searchThird.fullLinkers = [
      "the_user_profile",
      "the_user_interViewSchedule",
    ];
    searchThird.inpage = 100;
  
    let searchFourth: any = new SearchQuery();
    searchFourth.fullLinkers = [
      "the_profile_profilePic",
      "the_profile_first_name",
      "the_profile_last_name",
      "the_profile_email",
      "the_profile_phone",
      "the_profile_s_documents",
      "the_interViewSchedule_status",
      'the_interViewSchedule_interviewDate',
      'the_interViewSchedule_interviewTime', 
    ];
    searchFourth.inpage = 100;
    
    const queryParams = [searchfirst, searchSecond,searchThird,searchFourth];
    const output = await SearchLinkMultipleAll(queryParams, token);
    return output;
}