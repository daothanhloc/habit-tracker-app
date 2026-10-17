import React from 'react'

export const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col justify-center items-center p-12">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-muted rounded-full"></div>
      <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
    </div>
    <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
  </div>
)
