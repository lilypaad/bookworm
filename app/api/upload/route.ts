import { NextResponse } from "next/server";
import { handleUpload, HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@clerk/nextjs/server";

import {ACCEPTED_IMAGE_TYPES, ACCEPTED_PDF_TYPES, MAX_FILE_SIZE, MAX_IMAGE_SIZE} from "@/lib/constants";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as HandleUploadBody

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const { userId } = await auth()

        if(!userId) throw new Error('Unauthorized: User not authenticated')

        // Set maximum file size depending on file type (10MB for images, 50MB for PDFs)
        let allowedContentTypes = [...ACCEPTED_PDF_TYPES, ...ACCEPTED_IMAGE_TYPES]
        let maximumSizeInBytes = MAX_IMAGE_SIZE // Default to image limit for safety

        if (clientPayload) {
          try {
            const { contentType } = JSON.parse(clientPayload)
            if (ACCEPTED_IMAGE_TYPES.includes(contentType)) {
              allowedContentTypes = ACCEPTED_IMAGE_TYPES
              maximumSizeInBytes = MAX_IMAGE_SIZE
            } else if (ACCEPTED_PDF_TYPES.includes(contentType)) {
              allowedContentTypes = ACCEPTED_PDF_TYPES
              maximumSizeInBytes = MAX_FILE_SIZE
            }
          } catch (e) {
            console.error('Failed to parse clientPayload:', e)
          }
        }

        return {
          allowedContentTypes,
          addRandomSuffix: true,
          maximumSizeInBytes,
          tokenPayload: JSON.stringify({ userId })
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('File uploaded to blob:', blob.url)

        const payload = tokenPayload ? JSON.parse(tokenPayload) : null

        // TODO: track on PostHog
      }
    })

    return NextResponse.json(jsonResponse)
  }
  catch(e) {
    const message = e instanceof Error ? e.message : 'Unknown error occurred'
    const status = message.includes('Unauthorized') ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}