'use server'

import { del } from "@vercel/blob";
import { auth } from "@clerk/nextjs/server";

export async function deleteBlob(url: string) {
  try {
    const { userId } = await auth();
    if(!userId) throw new Error('Unauthorized')

    await del(url);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete blob:", error);
    return { success: false, error };
  }
}
