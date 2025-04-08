import React from 'react'
import ApiKeyManagement from './ApiKeyManagement'
import { AlertCircle } from 'lucide-react'

function page() {
  return (
    <div className="container min-h-screen py-10 px-4 mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold ">API Key Management</h1>
        <p className="text-gray-600 mt-2">Generate and manage API keys for accessing the Country API</p>
      </div>
      <div className="m-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center gap-2 text-amber-800">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">API Keys are sensitive</p>
        </div>
        <p className="mt-1 text-sm text-amber-700">
          API keys grant access to your resources. Keep them secure and never share them in publicly accessible areas such as
          GitHub or client-side code.
        </p>
      </div>
      <ApiKeyManagement/>
    </div>
  )
}

export default page