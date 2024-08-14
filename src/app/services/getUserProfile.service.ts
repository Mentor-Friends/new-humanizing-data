import { SearchLinkMultipleAll, SearchQuery } from "mftsccs-browser";
import { IUser } from "../interfaces/IUser.interface";

export const userListOfData=async(userConId:number)=>{
    let dataFromLocalStorage: string = localStorage?.getItem("profile") || "";
      const profileData: IUser = JSON.parse(dataFromLocalStorage);
      // let userId:any = Number(profileData?.userId);
      let userConceptId: any = Number(userConId);
  
      let searchfirst = new SearchQuery();
      searchfirst.composition = userConceptId;
      searchfirst.fullLinkers = ["the_user_profile"];
      searchfirst.inpage = 100;
  
      let searchsecond: any = new SearchQuery();
      searchsecond.fullLinkers = [
        "the_profile_profilePic",
        "the_profile_first_name",
        "the_profile_last_name",
        "the_profile_email",
        "the_profile_phone",
        "the_profile_dob",
        "the_profile_gender",
        "the_profile_maritialStatus",
        "the_profile_department",
        "the_profile_workPosition",
        "the_profile_workExperience",
        "the_profile_aboutYou",
        "the_profile_addressType",
        "the_profile_streetNumber",
        "the_profile_streetAddress",
        "the_profile_unit",
        "the_profile_city",
        "the_profile_state",
        "the_profile_zip",
        "the_profile_country",
        "the_profile_currentCompany",
        "the_profile_currentSalary",
        "the_profile_desireSalary",
        "the_profile_s_education",
        "the_profile_s_experience",
        "the_profile_s_documents",
        "the_profile_s_skills"
      ];
  
      let searchthird = new SearchQuery();
      searchthird.fullLinkers = [
        "the_education_eduLevel",
        "the_education_course",
        "the_education_dobFrom",
        "the_education_dobTo",
        "the_education_institutionName",
        "the_education_institutionAddress",
        "the_education_eduDescription",
        "the_experience_company",
        "the_experience_position",
        "the_experience_address",
        "the_experience_country",
        "the_experience_expdobFrom",
        "the_experience_expdobTo",
        "the_experience_expDescription",
        "the_documents_docName",
        "the_documents_docUrl",
        "the_skills_language",
        "the_skills_yearOfExperience",
      ];
      searchthird.inpage = 100;
      searchsecond.inpage = 100;
      const queryParams = [searchfirst, searchsecond, searchthird];
      const profileList = await SearchLinkMultipleAll(queryParams, profileData?.token);
      const ProfileIndex=profileList?.data?.the_user?.the_user_profile?.length-1
      return {
        the_Profile:profileList?.data?.the_user?.the_user_profile?.[ProfileIndex]?.data?.the_profile||'',
        entity:profileList?.data?.the_user?.entity || '',
        profileId:profileList?.data.the_user?.the_user_profile||''
      }
}