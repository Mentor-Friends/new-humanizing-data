import { environment } from "../environments/environment.dev";

const sendMailURL = environment.boomURL + "/api/sendmail";
const sendBulkMailURL = environment.boomURL + "/api/sendmail/bulk";

/**
 * Method to send Email to user
 * @param body FormData | EmailBody
 * @param token string
 * @param bulk boolean
 * @returns JSON | string | null
 */
export const sendEmail = async (
  body: FormData | EmailBody | BulkEmailBody,
  token: string,
  bulk: boolean = false
) => {
  try {
    let url = sendMailURL;
    if (bulk) url = sendBulkMailURL;

    const response = await fetch(url, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const contentType = response.headers.get("content-type");
    if (!response.ok) {
      // console.log(response.status)
      const errorData = await response.json();
      // console.log(errorData) // Log error response data
      console.log(`${response.status} ${errorData}`);
      return null;
    }
    const responseData = await response.json();

    if (contentType && contentType.includes("text/plain")) {
      return await response.text();
    }
    return responseData;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export interface EmailBody {
  toAddress: string;
  heading: string;
  body?: string;
  attachments?: Array<string>;
}

export interface BulkEmailBody extends Omit<EmailBody, "toAddress"> {
  toAddress?: string;
  ccAddresses: Array<string>;
}
