import { MSGraphClientV3 } from '@microsoft/sp-http';

export const getUserProfile = async (msGraphClient: MSGraphClientV3): Promise<any> => {
  return await msGraphClient.api('/me').version('v1.0').get();
};

export const getUserPhoto = async (msGraphClient: MSGraphClientV3): Promise<string | null> => {
  try {
    const photoBlob = await msGraphClient.api('/me/photo/$value').get();
    return URL.createObjectURL(photoBlob);
  } catch {
    console.warn("No photo found");
    return null;
  }
};