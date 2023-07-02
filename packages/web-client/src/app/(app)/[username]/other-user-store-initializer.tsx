'use client'
import { axiosInstance } from '@/config/axios-config'
import { useOtherUserDispatch } from '@/hooks/redux'
import { metadataActions } from '@repositories/stores/other-user/features/metadata/metadata.slice'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

export const OtherUserStoreInitializer: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const otherUserDispatch = useOtherUserDispatch()
  const params = useParams()

  // useEffect(() => {
  //   otherUserDispatch(
  //     metadataActions.fetchMetadata(params.username, axiosInstance),
  //   )
  // })

  return children
}
