import { AadHttpClient } from '@microsoft/sp-http';
import { IPersonaProps } from '@fluentui/react/lib/Persona';
import { IDocument } from '../types/IDocument';


export async function getUsersFromGraph(client: AadHttpClient, searchText?: string): Promise<IPersonaProps[]> {
  const filter = searchText
    ? `?$filter=startswith(displayName,'${searchText}')&$select=displayName,mail,userPrincipalName&$top=10`
    : `?$select=displayName,mail,userPrincipalName&$top=25`;

  const response = await client.get(
    `https://graph.microsoft.com/v1.0/users${filter}`,
    AadHttpClient.configurations.v1
  );

  const data = await response.json();

  const users: IPersonaProps[] = data.value
    .filter((user: any) => user.mail || user.userPrincipalName)
    .map((user: any) => ({
      text: user.displayName,
      secondaryText: user.mail || user.userPrincipalName,
      imageInitials: getInitials(user.displayName),
    }));

  return users;
}

function getInitials(name: string): string {
  return name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

function arrayBufferToBase64(buffer: ArrayBuffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([buffer]);
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1]; // Strip the data: prefix
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const checkForDeliveryFailures = async (client: AadHttpClient, since: Date): Promise<string[]> => {
  const queryTime = since.toISOString();
  const filter = `receivedDateTime ge ${queryTime} and (startswith(subject,'Undeliverable') or startswith(subject,'Delivery has failed'))`;

  const response = await client.get(
    `https://graph.microsoft.com/v1.0/me/messages?$filter=${encodeURIComponent(filter)}&$top=5`,
    AadHttpClient.configurations.v1
  );

  const data = await response.json();
  const failures: string[] = [];

  for (const message of data.value) {
    failures.push(message.subject);
    // Optionally: parse message.body.content to extract recipient email and error details
  }

  return failures;
};


export const sendEmailToUsers = async (
  client: AadHttpClient,
  users: IPersonaProps[],
  subject: string,
  body: string,
  selectedDoc: IDocument
): Promise<string> => {
  try {
    const fileResponse = await client.get(
      `${selectedDoc.FileRef}?$select=Name`,
      AadHttpClient.configurations.v1
    );

    const arrayBuffer = await fileResponse.arrayBuffer();
    const base64String = await arrayBufferToBase64(arrayBuffer);
    const fileName = selectedDoc.FileName;

    const emailData = {
      message: {
        subject,
        body: {
          contentType: 'Text',
          content: body,
        },
        toRecipients: users.map(user => ({
          emailAddress: { address: user.secondaryText },
        })),
        attachments: [
          {
            '@odata.type': '#microsoft.graph.fileAttachment',
            name: fileName,
            contentBytes: base64String,
            contentType: 'application/pdf',
          },
        ],
      },
      saveToSentItems: 'true',
    };

    const sendTime = new Date(); // Track time of sendMail call

    const emailResponse = await client.post(
      'https://graph.microsoft.com/v1.0/me/sendMail',
      AadHttpClient.configurations.v1,
      {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      }
    );

    if (emailResponse.status !== 202) {
      const errorText = await emailResponse.text();
      throw new Error(`Graph sendMail failed: ${emailResponse.statusText} - ${errorText}`);
    }

    // Wait 5–10 seconds before checking for NDRs
    await new Promise(res => setTimeout(res, 10000));

    const failures = await checkForDeliveryFailures(client, sendTime);

    if (failures.length > 0) {
      return (`Failed: ${failures.join(', ')}`);
    }

    return 'Email sent successfully!';
  } catch (error) {
    console.error("sendEmailToUsers error:", error);
    throw error;
  }
};
