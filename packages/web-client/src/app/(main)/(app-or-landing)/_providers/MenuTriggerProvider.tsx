'use client'

import { createContext, useContext, useState } from 'react'

type MenuTriggerCountContext = {
  count: number
  set_count: (count: number) => void
}

export const MenuTriggerCountContext = createContext<MenuTriggerCountContext>(
  {} as MenuTriggerCountContext,
)

export const use_menu_trigger_count = () => useContext(MenuTriggerCountContext)

export const MenuTriggerCountProvider: React.FC<{
  children: React.ReactNode
}> = (props) => {
  const [count, set_count] = useState(0)

  return (
    <MenuTriggerCountContext.Provider
      value={{
        count,
        set_count,
      }}
    >
      {props.children as any}
    </MenuTriggerCountContext.Provider>
  )
}
