'use server'

import { del } from "@vercel/blob";

export async function deleteBlob(url: string) {
  try {
    await del(url);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete blob:", error);
    return { success: false, error };
  }
}
