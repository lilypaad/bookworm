'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import {BookUploadSchema} from "@/lib/zod";

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
  const form = useForm<z.infer<typeof BookUploadSchema>>({
    resolver: zodResolver(BookUploadSchema),
    defaultValues: {
      title: '',
      author: '',
      voice: '',
      pdfFile: undefined,
      coverImage: undefined,
    },
  })

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (values: z.infer<typeof BookUploadSchema>) => {
    setIsLoading(true)
    console.log(values)
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  return (
    <div className="new-book-wrapper">
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
                        accept=".pdf"
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
                        accept="image/*"
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
                  <div className="space-y-2">
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
                  <div className="space-y-2">
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

          <button type="submit" className="form-btn" disabled={isLoading}>
            {isLoading ? 'Synthesizing...' : 'Begin Synthesis'}
          </button>
        </form>
      </Form>
      {isLoading && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">Loading...</div>}
    </div>
  )
}

export default UploadForm
