'use client'

import { Dictionary } from '@/dictionaries/dictionary'
import { clear_library_session_storage } from '@/utils/clear_library_session_storage'
import { BottomNavigationBar as UiAppMolecule_BottomNavigationBar } from '@web-ui/components/app/molecules/bottom-navigation-bar'
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'

export const ClientComponentBottomNavigationBar: React.FC<{
  dictionary: Dictionary
}> = (props) => {
  const { username }: { username?: string } = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const search_params = useSearchParams()

  return !username ? (
    <UiAppMolecule_BottomNavigationBar
      items={[
        {
          label: props.dictionary.app.menu_items.home,
          icon_variant: 'HOME',
          icon_variant_active: 'HOME_FILLED',
          is_active: pathname == '/',
          on_click: () => {
            router.push('/')
          },
        },
        {
          label: props.dictionary.app.menu_items.bookmarks,
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
          label: props.dictionary.app.menu_items.notifications,
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
          label: props.dictionary.app.menu_items.bookmarks,
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
          label: props.dictionary.app.menu_items.activity,
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
