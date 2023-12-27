'use client'

import { Ui } from '@web-ui'

export const ClientComponentBottomNavigationBar: React.FC = () => {
  return (
    <Ui.App.Molecules.BottomNavigationBar
      add_on_click={() => {}}
      my_library_on_click={() => {}}
      notifications_on_click={() => {}}
      search_on_click={() => {}}
      home_on_click={() => {}}
      user_on_click={() => {}}
    />
  )
}
