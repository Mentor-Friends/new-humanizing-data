import { environment } from "../environments/environment.dev";


const boomURL = environment.boomURL

export async function getLinkReverse(token: string, compositionId: number, linker: string) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const response = await fetch(
    `${boomURL}/api/Connection/get-link-reverse?compositionId=${compositionId}&linker=${linker}`,
    {
      method: "GET",
      headers: myHeaders,
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    console.error(`${response.status} ${errorData}`);
    return [];
  }

  return await response.json();
}