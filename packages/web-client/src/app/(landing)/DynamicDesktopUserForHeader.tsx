'use client'
import { useAppSelector } from '@/hooks/store'
import { DesktopUserForHeader } from '@web-ui/components/landing/molecules/DesktopUserForHeader'
import { useRouter } from 'next/navigation'

export const DynamicDesktopUserForHeader: React.FC = () => {
  const { userData } = useAppSelector((state) => state.userData)
  const router = useRouter()

  return (
    <DesktopUserForHeader
      buttonLabel={!userData ? 'Go to my library' : 'Sign in'}
      buttonOnClick={() => {
        userData ? router.push('/app/library') : () => {} // TODO: sign in popup
      }}
    />
  )
}
