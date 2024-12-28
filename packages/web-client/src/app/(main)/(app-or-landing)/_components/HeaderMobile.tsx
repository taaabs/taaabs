'use client'

import { HeaderMobile as Ui_app_templates_HeaderMobile } from '@web-ui/components/app/templates/App/HeaderMobile'
import { use_menu_trigger_count } from '../_providers/MenuTriggerProvider'

export const HeaderMobile: React.FC = () => {
  const menu_trigger_count_hook = use_menu_trigger_count()

  const handle_menu_click = () => {
    menu_trigger_count_hook.set_count(Date.now())
  }

  return (
    <Ui_app_templates_HeaderMobile
      slot_navigation={<>nav</>}
      on_menu_click={handle_menu_click}
    />
  )
}
