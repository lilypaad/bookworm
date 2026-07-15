'use client'

import React, {useEffect, useState} from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { upload } from "@vercel/blob/client";
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon } from 'lucide-react'

import { BookUploadSchema } from "@/lib/zod";
import { BookUploadFormValues } from "@/types";
import { ACCEPTED_IMAGE_TYPES, ACCEPTED_PDF_TYPES, DEFAULT_VOICE } from "@/lib/constants";
import { checkBookExists, createBook, saveBookSegments } from "@/lib/actions/book.actions";
import { deleteBlob } from "@/lib/actions/blob.actions";
import { parsePDFFile } from "@/lib/utils";

const voicesMale = [
  {
    id: 'dave',
    name: 'Dave',
    description: 'Young male, British-Essex, casual & conversational',
  },
  {
    id: 'daniel',
    name: 'Daniel',
    description: 'Middle-aged male, British, authoritative but warm',
  },
  {
    id: 'chris',
    name: 'Chris',
    description: 'Male, casual & easy-going',
  },
] as const

const voicesFemale = [
  {
    id: 'rachel',
    name: 'Rachel',
    description: 'Young female, American, calm & clear',
  },
  {
    id: 'sarah',
    name: 'Sarah',
    description: 'Young female, American, soft & approachable',
  },
] as const

function UploadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { userId, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const form = useForm<BookUploadFormValues>({
    resolver: zodResolver(BookUploadSchema),
    defaultValues: {
      title: '',
      author: '',
      voice: DEFAULT_VOICE,
      pdfFile: undefined,
      coverImage: undefined,
    },
  })

  const onSubmit = async (values: BookUploadFormValues) => {
    if(!isLoaded || !userId) {
      return toast.error('You must be logged in to upload a book')
    }

    setIsSubmitting(true)

    // TODO: PostHog track book uploads

    try {
      // Error checking
      const existsCheck = await checkBookExists(values.title)
      if(existsCheck && existsCheck.exists && existsCheck.data) {
        toast.info(`Book "${existsCheck.data.title}" already exists.`)
        form.reset()
        router.push(`/books/${existsCheck.data.slug}`)
        return
      }

      const fileTitle = values.title.replace(/\s+/g, '-').toLowerCase()

      // Extract PDF file
      const parsedPDF = await parsePDFFile(values.pdfFile)
      if(parsedPDF.content.length === 0) {
        toast.error('Failed to parse PDF. Please try again with a different file.')
        return
      }

      // Upload PDF file to blob storage
      const uploadedPdfBlob = await upload(fileTitle, values.pdfFile, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        contentType: 'application/pdf'
      })

      // Upload user-specified cover image OR cover extracted from PDF to blob storage
      let coverUrl: string
      if(values.coverImage && values.coverImage.size > 0) {
        const uploadedCoverBlob = await upload(fileTitle, values.coverImage, {
          access: 'public',
          handleUploadUrl: '/api/upload',
          contentType: values.coverImage.type
        })
        coverUrl = uploadedCoverBlob.url
      }
      else {
        const response = await fetch(parsedPDF.cover)
        const blob = await response.blob()

        const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, blob, {
          access: 'public',
          handleUploadUrl: '/api/upload',
          contentType: 'image/png'
        })
        coverUrl = uploadedCoverBlob.url
      }

      // Save book entry to MongoDB
      const book = await createBook({
        clerkId: userId,
        title: values.title,
        author: values.author,
        voice: values.voice,
        fileURL: uploadedPdfBlob.url,
        fileBlobKey: uploadedPdfBlob.pathname,
        coverURL: coverUrl,
        fileSize: values.pdfFile.size,
      })
      if(!book.success) {
        // Delete PDF and cover blobs for failed submission
        await deleteBlob(uploadedPdfBlob.url)
        await deleteBlob(coverUrl)

        throw new Error('Failed to create book')
      }
      if(book.alreadyExists) {
        // Delete duplicate PDF and cover blobs
        await deleteBlob(uploadedPdfBlob.url)
        await deleteBlob(coverUrl)

        toast.info(`Book "${book.data.title}" already exists.`)
        form.reset()
        router.push(`/books/${book.data.slug}`)
        return
      }

      // Save book segments to MongoDB
      const segments = await saveBookSegments(book.data._id, userId, parsedPDF.content)
      if(!segments.success) {
        throw new Error('Failed to save book segments')
      }

      form.reset()
      router.push('/')
    }
    catch(e) {
      console.error(e)
      toast.error("Failed to upload book. Please try again later.")
    }
    finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="new-book-wrapper">
      {isSubmitting &&
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          Loading...
        </div>
      }

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="pdfFile"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel className="form-label">Book PDF File</FormLabel>
                <FormControl>
                  {value ? (
                    <div className="flex items-center justify-between p-3 border border-input rounded-lg bg-card">
                      <span className="text-sm truncate">{value.name}</span>
                      <button type="button" onClick={() => onChange(null)} className="text-muted-foreground hover:text-destructive">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="upload-dropzone">
                      <input
                        type="file"
                        className="hidden"
                        accept={ACCEPTED_PDF_TYPES.join(',')}
                        onChange={(e) => onChange(e.target.files?.[0])}
                        {...field}
                      />
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <span className="text-foreground font-medium">Click to upload PDF</span>
                      <span className="text-sm text-muted-foreground">PDF file (max 50MB)</span>
                    </label>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coverImage"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel className="form-label">Cover Image (Optional)</FormLabel>
                <FormControl>
                  {value ? (
                    <div className="flex items-center justify-between p-3 border border-input rounded-lg bg-card">
                      <span className="text-sm truncate">{value.name}</span>
                      <button type="button" onClick={() => onChange(null)} className="text-muted-foreground hover:text-destructive">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="upload-dropzone">
                      <input
                        type="file"
                        className="hidden"
                        accept={ACCEPTED_IMAGE_TYPES.join(',')}
                        onChange={(e) => onChange(e.target.files?.[0])}
                        {...field}
                      />
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      <span className="text-foreground font-medium">Click to upload cover image</span>
                      <span className="text-sm text-muted-foreground">Leave empty to auto-generate from PDF</span>
                    </label>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Title</FormLabel>
                <FormControl>
                  <Input placeholder="ex: Rich Dad Poor Dad" className="form-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Author Name</FormLabel>
                <FormControl>
                  <Input placeholder="ex: Robert Kiyosaki" className="form-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="voice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Choose Assistant Voice</FormLabel>
                <div className="grid gap-4">
                  <div className="space-y-2 pl-1 pr-1">
                    <p className="text-sm font-semibold text-muted-foreground">Male Voices</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {voicesMale.map((voice) => (
                        <div
                          key={voice.id}
                          className={`voice-selector-option ${field.value === voice.id ? 'voice-selector-option-selected' : ''}`}
                          onClick={() => field.onChange(voice.id)}
                        >
                          <input type="radio" className="hidden" checked={field.value === voice.id} readOnly />
                          <span className="font-semibold">{voice.name}</span>
                          <p className="text-xs text-muted-foreground">{voice.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 pl-1 pr-1">
                    <p className="text-sm font-semibold text-muted-foreground">Female Voices</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {voicesFemale.map((voice) => (
                        <div
                          key={voice.id}
                          className={`voice-selector-option ${field.value === voice.id ? 'voice-selector-option-selected' : ''}`}
                          onClick={() => field.onChange(voice.id)}
                        >
                          <input type="radio" className="hidden" checked={field.value === voice.id} readOnly />
                          <span className="font-semibold">{voice.name}</span>
                          <p className="text-xs text-muted-foreground">{voice.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <button type="submit" className="form-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Synthesizing...' : 'Begin Synthesis'}
          </button>
        </form>
      </Form>
    </div>
  )
}

export default UploadForm
