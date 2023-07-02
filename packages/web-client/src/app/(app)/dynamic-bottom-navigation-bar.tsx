'use client'

import { BottomNavigationBar } from '@web-ui/components/app/molecules/bottom-navigation-bar'

export const DynamicBottomNavigationBar: React.FC = () => {
  return (
    <BottomNavigationBar
      onClickAdd={() => {}}
      onClickMyLibrary={() => {}}
      onClickNotifications={() => {}}
      onClickSearch={() => {}}
      onClickUser={() => {}}
    />
  )
}
