'use client'
import { useEffect } from 'react'
import { metadataActions } from '@repositories/stores/other-user/features/metadata/metadata.slice'
import { useParams } from 'next/navigation'
import Head from 'next/head'
import { useOtherUserDispatch } from '@/hooks/redux'
import { axiosInstance } from '@/config/axios-config'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const otherUserDispatch = useOtherUserDispatch()
  const params = useParams()

  useEffect(() => {
    otherUserDispatch(
      metadataActions.fetchMetadata(params.username, axiosInstance),
    )
  })

  return (
    <div>
      {children}
    </div>
  )
}

export default Layout
