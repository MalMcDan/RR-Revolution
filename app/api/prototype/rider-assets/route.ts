import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "../../../../lib/supabase/admin";

function safeFileName(fileName: string) {
  return fileName.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-|-$/g, "");
}

function getRequiredBucket(name: string, fallback: string) {
  return process.env[name] || fallback;
}

async function uploadPublicFile(bucket: string, file: File, folder: string) {
  const supabase = createSupabaseAdminClient();
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const path = `${folder}/${crypto.randomUUID()}-${safeFileName(file.name || `upload.${extension}`)}`;
  const bytes = await file.arrayBuffer();

  const { error } = await supabase.storage.from(bucket).upload(path, bytes, {
    contentType: file.type || "application/octet-stream",
    upsert: false
  });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { name: file.name, path, url: data.publicUrl };
}

export async function POST(request: Request) {
  try {
    const riderPhotosBucket = getRequiredBucket("NEXT_PUBLIC_RIDER_PHOTOS_BUCKET", "rr-rider-photos");
    const motorcyclePhotosBucket = getRequiredBucket("NEXT_PUBLIC_MOTORCYCLE_PHOTOS_BUCKET", "rr-motorcycle-photos");
    const form = await request.formData();
    const riderKey = safeFileName(String(form.get("riderKey") || "rider")) || "rider";
    const profileFile = form.get("profilePhoto");
    const bikeFiles = form.getAll("bikePhotos").filter((file): file is File => file instanceof File && Boolean(file.name));

    const profilePhoto = profileFile instanceof File && profileFile.name
      ? await uploadPublicFile(riderPhotosBucket, profileFile, riderKey)
      : null;

    const bikePhotos = await Promise.all(bikeFiles.map((file) => uploadPublicFile(motorcyclePhotosBucket, file, riderKey)));

    return NextResponse.json({ profilePhoto, bikePhotos });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 });
  }
}
