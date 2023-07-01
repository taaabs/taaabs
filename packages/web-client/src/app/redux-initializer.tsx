'use client'
import { useRootDispatch } from '@repositories/hooks/store'

export const ReduxInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useRootDispatch()

  return <>{children}</>
}
