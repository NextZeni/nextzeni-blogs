import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

/**
 * Uploads an image file to Firebase Storage and returns its public URL.
 * Same pattern used for cover images in the write page.
 */
export async function uploadImage(file: File, folder = "content"): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storageRef = ref(storage, `${folder}/${Date.now()}_${safeName}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}
