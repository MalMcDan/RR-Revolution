import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "../../../../../lib/supabase/admin";
import { env } from "../../../../../lib/env";

function safeFileName(fileName: string) {
  return fileName.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-|-$/g, "");
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
    const form = await request.formData();
    const riderKey = safeFileName(String(form.get("riderKey") || "rider")) || "rider";
    const profileFile = form.get("profilePhoto");
    const bikeFiles = form.getAll("bikePhotos").filter((file): file is File => file instanceof File && Boolean(file.name));

    const profilePhoto = profileFile instanceof File && profileFile.name
      ? await uploadPublicFile(env.riderPhotosBucket, profileFile, riderKey)
      : null;

    const bikePhotos = await Promise.all(bikeFiles.map((file) => uploadPublicFile(env.motorcyclePhotosBucket, file, riderKey)));

    return NextResponse.json({ profilePhoto, bikePhotos });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 });
  }
}
