'use client'
import { useGlobalDispatch } from '@repositories/hooks/store'

export const GlobalStoreInitializer: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const dispatch = useGlobalDispatch()

  return <>{children}</>
}
