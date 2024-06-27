'use client'

import { Template as UiSettings_Template } from '@web-ui/components/settings/Template'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Dictionary } from '@/dictionaries/dictionary'
import { SimpleBackArrowHeader as UiCommon_SimpleBackArrowHeader } from '@web-ui/components/common/SimpleBackArrowHeader'
import { DesktopMenuItem as UiSettings_DekstopMenuItem } from '@web-ui/components/settings/DesktopMenuItem'

export const _Layout: React.FC<{
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
    <UiSettings_Template
      slot_header={
        <UiCommon_SimpleBackArrowHeader
          back_href={back_href || '/'}
          title={props.dictionary.settings.settings}
          is_transparent_on_desktop={true}
        />
      }
      slot_desktop_navigation={
        <>
          <UiSettings_DekstopMenuItem
            href="/settings"
            is_active={pathname == '/settings'}
            label={props.dictionary.settings.menu.general}
          />
          <UiSettings_DekstopMenuItem
            href="/settings/preferences"
            is_active={pathname == '/settings/preferences'}
            label={props.dictionary.settings.menu.preferences}
          />
          <UiSettings_DekstopMenuItem
            href="/settings/subscription"
            is_active={pathname == '/settings/subscription'}
            label={props.dictionary.settings.menu.subscription}
          />
          <UiSettings_DekstopMenuItem
            href="/settings/import"
            is_active={pathname == '/settings/import'}
            label={props.dictionary.settings.menu.import}
          />
          <UiSettings_DekstopMenuItem
            href="/settings/backups"
            is_active={pathname == '/settings/backups'}
            label={props.dictionary.settings.menu.backups}
          />
        </>
      }
      slot_mobile_navigation={'nav'}
    >
      {props.children}
    </UiSettings_Template>
  )
}
