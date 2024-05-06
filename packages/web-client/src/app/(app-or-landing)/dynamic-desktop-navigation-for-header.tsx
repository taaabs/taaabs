'use client'

import { Dictionary } from '@/dictionaries/dictionary'
import { DesktopNavigationForHeader as UiLandingAtom_DesktopNavigationForHeader } from '@web-ui/components/landing/atoms/desktop-navigation-for-header'
import { usePathname } from 'next/navigation'

export const DynamicDesktopNavigationForHeader: React.FC<{
  dictionary: Dictionary
}> = (props) => {
  const pathname = usePathname()

  return (
    <UiLandingAtom_DesktopNavigationForHeader
      navigation_items={[
        {
          label: props.dictionary.landing.menu_items.updates,
          href: '/updates',
          is_active: pathname == '/updates',
        },
        {
          label: props.dictionary.landing.menu_items.help_center,
          href: '/help',
          is_active: pathname == '/help',
        },
        {
          label: props.dictionary.landing.menu_items.pricing,
          href: '/pricing',
          is_active: pathname == '/pricing',
        },
      ]}
    />
  )
}
