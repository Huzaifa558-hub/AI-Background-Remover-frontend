import React, { createContext, useContext, useState, type ReactNode } from 'react'

interface ActiveImageContextType {
  activeFile: File | null
  activePreviewUrl: string | null
  setActiveImage: (file: File | null, previewUrl: string | null) => void
}

const ActiveImageContext = createContext<ActiveImageContextType | undefined>(undefined)

export const ActiveImageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeFile, setActiveFile] = useState<File | null>(null)
  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null)

  const setActiveImage = (file: File | null, previewUrl: string | null) => {
    setActiveFile(file)
    setActivePreviewUrl(previewUrl)
  }

  return (
    <ActiveImageContext.Provider value={{ activeFile, activePreviewUrl, setActiveImage }}>
      {children}
    </ActiveImageContext.Provider>
  )
}

export const useActiveImage = () => {
  const context = useContext(ActiveImageContext)
  if (context === undefined) {
    throw new Error('useActiveImage must be used within an ActiveImageProvider')
  }
  return context
}
