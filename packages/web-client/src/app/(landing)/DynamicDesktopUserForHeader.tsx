'use client'
import { useAppSelector } from '@/hooks/store'
import { DesktopUserForHeader } from '@web-ui/components/landing/molecules/DesktopUserForHeader'

export const DynamicDesktopUserForHeader: React.FC = () => {
  const { isLoading, userData } = useAppSelector((state) => state.userData)

  return (
    <DesktopUserForHeader
      buttonLabel={userData ? 'Open app' : 'Sign in'}
      buttonOnClick={() => {}}
      isLoading={isLoading}
    />
  )
}
