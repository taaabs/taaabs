'use client'
import { useRootSelector } from '@repositories/hooks/store'
import { DesktopUserForHeader } from '@web-ui/components/landing/molecules/DesktopUserForHeader'
import { useRouter } from 'next/navigation'

export const DynamicDesktopUserForHeader: React.FC = () => {
  const router = useRouter()
  // const { userData } = useRootSelector((state) => state.userData)

  return (
    <DesktopUserForHeader
      // buttonLabel={userData ? 'Open inbox' : 'Sign in'}
      // buttonOnClick={() =>
      //   userData ? router.push('/inbox') : router.push('/sign-in')
      // }
      buttonLabel="TODO"
      buttonOnClick={() => {}}
    />
  )
}
