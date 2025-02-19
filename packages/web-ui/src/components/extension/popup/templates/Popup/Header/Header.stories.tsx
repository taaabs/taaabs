import { Header } from './Header'

export default {
  component: Header,
}

export const Primary = () => {
  return (
    <div style={{ width: '360px', margin: '50px' }}>
      <Header
        settings_on_click={() => {}}
        vision_mode_on_click={() => {}}
        is_vision_mode_available={true}
        translations={{ trigger_popup_shortcut: 'Alt+T' }}
      />
    </div>
  )
}
