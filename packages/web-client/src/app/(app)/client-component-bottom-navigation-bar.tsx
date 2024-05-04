'use client'

import { clear_library_session_storage } from '@/utils/clear_library_session_storage'
import { BottomNavigationBar as UiAppMolecule_BottomNavigationBar } from '@web-ui/components/app/molecules/bottom-navigation-bar'
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'

export const ClientComponentBottomNavigationBar: React.FC = () => {
  const { username }: { username?: string } = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const search_params = useSearchParams()

  return !username ? (
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
            clear_library_session_storage({
              search_params: search_params.toString(),
            })
            router.push('/bookmarks')
          },
        },
        {
          label: 'Watching',
          icon_variant: 'NOTIFICATIONS',
          icon_variant_active: 'NOTIFICATIONS_FILLED',
          is_active: pathname == '/watching',
          on_click: () => {
            router.push('/watching')
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
          is_active: pathname == `/${username}`,
          on_click: () => {
            clear_library_session_storage({
              username,
              search_params: search_params.toString(),
            })
            router.push(`/${username}`)
          },
        },
        {
          label: 'Activity',
          icon_variant: 'OVERVIEW',
          icon_variant_active: 'OVERVIEW_FILLED',
          is_active: pathname == `/${username}/overview`,
          on_click: () => {
            router.push(`/${username}/activity`)
          },
        },
      ]}
    />
  )
}
