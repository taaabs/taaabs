'use client'
// import { useGlobalSelector } from '@repositories/hooks/store'
import { Ui } from '@web-ui'
// import { useRouter } from 'next/navigation'

export const DynamicDesktopUserForHeader: React.FC = () => {
  // const router = useRouter()
  // const { userData } = useRootSelector((state) => state.userData)

  return (
    <Ui.Landing.Molecules.DesktopUserForHeader
      // buttonLabel={userData ? 'Open inbox' : 'Sign in'}
      // buttonOnClick={() =>
      //   userData ? router.push('/inbox') : router.push('/sign-in')
      // }
      button_label="TODO"
      button_on_click={() => {}}
    />
  )
}
