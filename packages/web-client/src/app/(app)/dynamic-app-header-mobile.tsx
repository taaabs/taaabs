'use client'

import {
  NavigationForHeader,
  NavigationForHeaderTypes,
} from '@web-ui/components/app/molecules/navigation-for-header'
import { UserForHeader } from '@web-ui/components/app/molecules/user-for-header'
import { AppHeaderMobile } from '@web-ui/components/app/templates/app-header-mobile'
import { LogoForHeader } from '@web-ui/components/common/molecules/logo-for-header'
import { useParams, usePathname } from 'next/navigation'

export const DynamicAppHeaderMobile: React.FC = () => {
  const pathname = usePathname()
  const params = useParams()

  let logoSlot: JSX.Element
  // TODO: backHref should be smarter :^)
  if (params.username) {
    logoSlot = (
      <UserForHeader user={{ username: params.username, backHref: '/' }} />
    )
  } else {
    logoSlot = <LogoForHeader href="/" />
  }

  let navigation: NavigationForHeaderTypes.Props['navigation']
  if (params.username) {
    navigation = [
      {
        label: 'Profile',
        href: `/${params.username}`,
        isActive: pathname == `/${params.username}`,
      },
      {
        label: 'Library',
        href: `/${params.username}/library`,
        isActive: pathname == `/${params.username}/library`,
      },
    ]
  } else {
    navigation = [
      {
        label: 'Inbox',
        href: '/inbox',
        isActive: pathname == '/inbox',
      },
      {
        label: 'Library',
        href: '/library',
        isActive: pathname == '/library',
      },
    ]
  }

  return (
    <AppHeaderMobile
      logoSlot={logoSlot}
      navigationSlot={<NavigationForHeader navigation={navigation} />}
    />
  )
}
