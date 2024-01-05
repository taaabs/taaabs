'use client'

import { BottomNavigationBar as UiAppMolecule_BottomNavigationBar } from '@web-ui/components/app/molecules/bottom-navigation-bar'
import { useParams, usePathname, useRouter } from 'next/navigation'

export const ClientComponentBottomNavigationBar: React.FC = () => {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()

  return !params.username ? (
    <UiAppMolecule_BottomNavigationBar
      items={[
        {
          label: 'Home',
          icon_variant: 'HOME',
          icon_variant_active: 'HOME_FILLED',
          is_active: pathname == '/home',
          on_click: () => {
            router.push('/home')
          },
        },
        {
          label: 'Bookmarks',
          icon_variant: 'BOOKMARK',
          icon_variant_active: 'BOOKMARK_FILLED',
          is_active: pathname == '/bookmarks',
          on_click: () => {
            router.push('/bookmarks')
          },
        },
        {
          label: 'Notifications',
          icon_variant: 'NOTIFICATIONS',
          icon_variant_active: 'NOTIFICATIONS_FILLED',
          is_active: pathname == '/notifications',
          on_click: () => {
            router.push('/notifications')
          },
        },
      ]}
    />
  ) : (
    <UiAppMolecule_BottomNavigationBar
      items={[
        {
          label: 'Bookmarks',
          icon_variant: 'BOOKMARK',
          icon_variant_active: 'BOOKMARK_FILLED',
          is_active: pathname == `/${params.username}`,
          on_click: () => {
            router.push(`/${params.username}`)
          },
        },
        {
          label: 'Activity',
          icon_variant: 'ACTIVITY',
          icon_variant_active: 'ACTIVITY',
          is_active: pathname == `/${params.username}/activity`,
          on_click: () => {
            router.push(`/${params.username}/activity`)
          },
        },
      ]}
    />
  )
}
