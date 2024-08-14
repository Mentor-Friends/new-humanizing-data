import { environment } from "../environments/environment.dev";
import { IUser } from "../interfaces/IUser.interface";

const boomconsoleURL = environment?.boomURL;

export async function getLocalStorageData() {
  return new Promise((resolve: any) => {
    let dataFromLocalStorage: string = localStorage?.getItem("profile") || "";
    if (dataFromLocalStorage) {
      const profileData: IUser = JSON.parse(dataFromLocalStorage);
      // return profileData;
      resolve(profileData);
    } else {
      resolve();
    }
  });
}

export async function getEntityByUserconceptId(
  userConceptId: number,
  token: string
) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    const response = await fetch(
      `${boomconsoleURL}/api/get-entity-from-user?userConceptId=${userConceptId}`,
      {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      }
    );
    const userEntity = await response.json();
    return userEntity;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export function formatUserComposition(user: any) {
  return {
    id: user.id,
    email: user?.data?.the_user?.user_data?.primary_email,
    firstName: user?.data?.the_user?.entity?.person?.first_name,
    lastName: user?.data?.the_user?.entity?.person?.last_name,
    profileImg:
      user?.data?.the_user?.entity?.person?.profile_img ||
      "https://apitest.boomconcole.com/uploads/f5542452-47ea-4c1d-9a30-6e0305961a17.png",
  };
}
