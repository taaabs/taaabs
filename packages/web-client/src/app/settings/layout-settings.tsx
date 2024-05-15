'use client'

import { Settings as UiAppTemplates_Settings } from '@web-ui/components/app/templates/settings'
import { SimpleBackArrowHeader as UiAppAtom_SimpleBackArrowHeader } from '@web-ui/components/app/atoms/simple-back-arrow-header'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Dictionary } from '@/dictionaries/dictionary'
import { DesktopMenuItem as UiAppAtom_DesktopMenuItem } from '@web-ui/components/app/atoms/desktop-menu-item'

export const LayoutSettings: React.FC<{
  dictionary: Dictionary
  children?: React.ReactNode
}> = (props) => {
  const pathname = usePathname()
  const search_params = useSearchParams()
  const [back_href, set_back_href] = useState<string>()

  useEffect(() => {
    set_back_href(search_params.get('back') || undefined)
  }, [back_href])

  return (
    <UiAppTemplates_Settings
      slot_header={
        <UiAppAtom_SimpleBackArrowHeader
          back_href={back_href || '/'}
          title={props.dictionary.settings.settings}
          is_transparent_on_desktop={true}
        />
      }
      slot_desktop_navigation={
        <>
          <UiAppAtom_DesktopMenuItem
            href="/settings"
            is_active={pathname == '/settings'}
            label={props.dictionary.settings.menu.general}
          />
          <UiAppAtom_DesktopMenuItem
            href="/settings/preferences"
            is_active={pathname == '/settings/preferences'}
            label={props.dictionary.settings.menu.preferences}
          />
          <UiAppAtom_DesktopMenuItem
            href="/settings/subscription"
            is_active={pathname == '/settings/subscription'}
            label={props.dictionary.settings.menu.subscription}
          />
          <UiAppAtom_DesktopMenuItem
            href="/settings/import"
            is_active={pathname == '/settings/import'}
            label={props.dictionary.settings.menu.import}
          />
          <UiAppAtom_DesktopMenuItem
            href="/settings/backups"
            is_active={pathname == '/settings/backups'}
            label={props.dictionary.settings.menu.backups}
          />
        </>
      }
      slot_mobile_navigation={'nav'}
      slot_main={props.children}
    />
  )
}
