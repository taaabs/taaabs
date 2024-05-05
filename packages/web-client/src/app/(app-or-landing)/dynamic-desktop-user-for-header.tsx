'use client'

import { DesktopUserForHeader as UiLandingMolecule_DesktopUserForHeader } from '@web-ui/components/landing/molecules/desktop-user-for-header'
import { useRouter } from 'next/navigation'

export const DynamicDesktopUserForHeader: React.FC<{
  is_authorized: boolean
}> = (props) => {
  const router = useRouter()

  return props.is_authorized ? (
    <UiLandingMolecule_DesktopUserForHeader
      button_label="Open app"
      button_on_click={() => {
        router.push('/')
      }}
    />
  ) : (
    <UiLandingMolecule_DesktopUserForHeader
      button_label="Log in"
      button_on_click={() => {
        router.push('/login')
      }}
    />
  )
}
