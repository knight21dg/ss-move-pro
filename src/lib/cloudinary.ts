const CLOUD_NAME = "dp9pbu8wr";

export async function uploadToCloudinary(
  file: File,
  folder = "uploads"
): Promise<string> {
  const uploadPreset = "unsigned_preset";

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);
  form.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
    { method: "POST", body: form }
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`Cloudinary upload failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.secure_url as string;
}

export function optimizeCloudinaryUrl(
  url: string | null | undefined,
  width?: number,
  height?: number
): string {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com")) return url;

  const params: string[] = ["f_auto", "q_auto"];
  if (width && height) {
    params.push(`w_${width}`, `h_${height}`, "c_fill");
  } else if (width) {
    params.push(`w_${width}`);
  } else if (height) {
    params.push(`h_${height}`);
  }

  const transformStr = params.join(",");
  return url.replace("/image/upload/", `/image/upload/${transformStr}/`);
}
