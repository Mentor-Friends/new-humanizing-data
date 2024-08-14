import { environment } from "../environments/environment.dev";

const baseURL = environment.boomURL + "/api";
export async function getConnectionList(
  data: {
    parent: string | number;
    linker?: string;
    fullLinker?: string;
    id: string | number;
  },
  token: string
) {
  return new Promise((resolve: any) => {
    try {
      const myHeaders = new Headers();
      // myHeaders.append("Cookie", ".boomconsole=CfDJ8MmCJ9gAIy1Mgm6s%2Bl7bGE5e6fXNyxQ0icleyXW7GMNiexzATGdUkTh5VFt5obhivxmVzWWU%2Bu7wdkJyTJL0jEPOMaCISt53SYkRJDXSHekbQYF9i4QvMPMJpGvqPVrgZQx6ag2w8UYAvA2BZBVfrIrdp%2FRji6hON6KABK8BuYN4; SessionId=100211313");
      myHeaders.append("Authorization", "Bearer " + token);
      const formdata = new FormData();
      formdata.append("ofConceptId", data?.parent.toString());
      if (data?.linker) formdata.append("linker", data?.linker);
      if (data?.fullLinker) formdata.append("fullLinker", data?.fullLinker);
      formdata.append("toConceptId", data?.id.toString());
      const requestOptions: any = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };
      fetch(`${baseURL}/get-connection-between-two-concepts`, requestOptions)
        .then((response: any) => response.text())
        .then((result: any) => {
          resolve(JSON.parse(result));
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.error(error);
    }
  });
}
