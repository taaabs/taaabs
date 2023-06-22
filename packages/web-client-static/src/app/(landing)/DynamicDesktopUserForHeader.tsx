'use client'
import { useAppSelector } from '@/hooks/store'
import { DesktopUserForHeader } from '@web-ui/components/landing/molecules/DesktopUserForHeader'
import { useRouter } from 'next/navigation'

export const DynamicDesktopUserForHeader: React.FC = () => {
  const router = useRouter()
  const { userData } = useAppSelector((state) => state.userData)

  return (
    <DesktopUserForHeader
      buttonLabel={userData ? 'Open inbox' : 'Sign in'}
      buttonOnClick={() =>
        userData ? router.push('/inbox') : router.push('/sign-in')
      }
    />
  )
}
