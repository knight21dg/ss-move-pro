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
