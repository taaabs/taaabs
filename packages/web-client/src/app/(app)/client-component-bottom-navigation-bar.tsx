'use client'

import { BottomNavigationBar as UiAppMolecule_BottomNavigationBar } from '@web-ui/components/app/molecules/bottom-navigation-bar'

export const ClientComponentBottomNavigationBar: React.FC = () => {
  return (
    <UiAppMolecule_BottomNavigationBar
      add_on_click={() => {}}
      my_library_on_click={() => {}}
      notifications_on_click={() => {}}
      search_on_click={() => {}}
      home_on_click={() => {}}
      user_on_click={() => {}}
    />
  )
}
