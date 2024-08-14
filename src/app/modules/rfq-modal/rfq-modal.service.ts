import { getAgents } from "../../services/agent.service";
import { getLocalStorageData } from "../../services/helper.service";

export async function getBuyerAgents() {
  const profileStorageData: any = await getLocalStorageData();
  const token = profileStorageData?.token;

  const buyerAgentList = await getAgents("buyerAgent_agent", token);

  const buyerAgentOptions = buyerAgentList?.map((buyerAgent: any) => {
    return `<option value="${buyerAgent?.the_user?.id}">${buyerAgent?.the_user?.data?.entity?.data?.person?.data?.first_name} ${buyerAgent?.the_user?.data?.entity?.data?.person?.data?.last_name}</option>`;
  });

  return buyerAgentOptions;
}
