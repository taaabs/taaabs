'use client'

import { Settings as UiAppTemplates_Settings } from '@web-ui/components/app/templates/settings'
import { DynamicDesktopNavigation } from './DynamicDesktopNavigation'
import { SimpleBackArrowHeader as UiAppAtom_SimpleBackArrowHeader } from '@web-ui/components/app/atoms/simple-back-arrow-header'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
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
          title="Settings"
          is_transparent_on_desktop={true}
        />
      }
      slot_desktop_navigation={<DynamicDesktopNavigation />}
      slot_mobile_navigation={'nav'}
      slot_main={children}
    />
  )
}

export default Layout
