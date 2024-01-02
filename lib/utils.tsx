import { notifications } from "@mantine/notifications";

export function showErrorNotification(error: {
  response: { data: { message: string } };
  message: string;
}) {
  notifications.show({
    title: "Error",
    message:
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong",
    color: "red",
    autoClose: 4000,
  });
}

export function showSuccessNotification(message: string) {
  notifications.show({
    title: "Success",
    message,
    color: "green",
    autoClose: 4000,
  });
}

export function formatedDate(date: string | Date) {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formateTime(date: string | Date) {
  if (date?.toString().split(":").length === 2) {
    const [hours, minutes] = date.toString().split(":");
    const ampm = Number(hours) >= 12 ? "PM" : "AM";
    const hours12 = Number(hours) % 12 || 12;
    return `${hours12}:${minutes} ${ampm}`;
  }

  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
}

export async function getFileFromUrl(
  url: string,
  name: string,
  defaultType = "image/jpeg"
) {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, {
    type: data.type || defaultType,
  });
}

export function filterParams(
  queryParams: Record<string, any>
): Record<string, any> {
  return Object.entries(queryParams)
    .filter(([key, value]) => value !== undefined)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

export const uploadImageCloud = async (
  file: File[]
): Promise<string | null> => {
  try {
    const data = new FormData();
    data.append("file", file?.[0] as File);
    data.append("upload_preset", "dev_setups");
    data.append("cloud_name", "dpkb069by");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dpkb069by/image/upload",
      {
        method: "post",
        body: data,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to upload image. Status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData.url;
  } catch (err) {
    console.error(err);
    return null;
  }
};
