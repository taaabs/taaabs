'use client'

import { BottomNavigationBar } from '@web-ui/components/app/molecules/bottom-navigation-bar'

export const ClientComponentBottomNavigationBar: React.FC = () => {
  return (
    <BottomNavigationBar
      add_on_click={() => {}}
      my_library_on_click={() => {}}
      notifications_on_click={() => {}}
      search_on_click={() => {}}
      user_on_click={() => {}}
    />
  )
}
