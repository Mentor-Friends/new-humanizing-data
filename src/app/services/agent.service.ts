import { environment } from "../environments/environment.dev";
const thetaBoommAPI = environment?.boomURL;

export async function getAgents(
  agentType: string,
  token: string,
  inpage: number = 100,
  page: number = 1
) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const queryData = [
    {
      type: agentType,
      listLinkers: ["isAgent_by"],
      inpage: 100,
      page: 1,
      logic: "or",
      filterSearches: [],
    },
  ];

  const response = await fetch(
    `${thetaBoommAPI}/api/list-all-without-auth-with-linker?inpage=${inpage}&page=${page}`,
    {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(queryData),
      redirect: "follow",
    }
  );
  const output = await response.json();

  const agentList = output?.[0]?.[agentType]?.[`${agentType}_s_isAgent_by`];
  return agentList;
}
