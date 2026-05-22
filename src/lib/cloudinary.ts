export async function uploadToCloudinary(
  file: File,
  folder = "uploads"
): Promise<string> {
  // 1. Get signature from server API route
  const signRes = await fetch("/api/sign-cloudinary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder })
  });

  if (!signRes.ok) {
    const errText = await signRes.text().catch(() => signRes.statusText);
    throw new Error(`Failed to generate upload signature: ${errText}`);
  }

  const { signature, timestamp, apiKey, cloudName } = await signRes.json();

  // 2. Perform signed upload to Cloudinary using auto endpoint
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp.toString());
  form.append("signature", signature);
  form.append("folder", folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: "POST", body: form }
  );

  if (!uploadRes.ok) {
    const errText = await uploadRes.text().catch(() => uploadRes.statusText);
    throw new Error(`Cloudinary upload failed (${uploadRes.status}): ${errText}`);
  }

  const data = await uploadRes.json();
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
