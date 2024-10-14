import { Switch } from './Switch'
import { useState } from 'react'

export default {
  component: Switch,
}

export const Default = () => {
  const [is_checked, setIsChecked] = useState(false)
  return (
    <Switch
      is_checked={is_checked}
      on_change={setIsChecked}
      label="Enable Feature"
    />
  )
}

export const Disabled = () => {
  const [is_checked, setIsChecked] = useState(false)
  return (
    <Switch
      is_checked={is_checked}
      on_change={setIsChecked}
      is_disabled={true}
      label="Disabled Switch"
    />
  )
}
