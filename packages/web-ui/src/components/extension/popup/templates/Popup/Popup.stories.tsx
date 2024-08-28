import { Button } from '@web-ui/components/Button'
import { BottomNavigationBar } from './BottomNavigationBar'
import { Header } from './Header'
import { Popup } from './Popup'
import { Actions } from './main/Actions'

export default {
  component: Popup,
}

export const Primary = () => {
  return (
    <div style={{ width: '300px', margin: '50px' }}>
      <Popup
        header_slot={<Header settings_url="" />}
        bottom_navigation_bar_slot={
          <BottomNavigationBar
            items={[
              { icon: 'HOME', href: '', icon_filled: 'HOME_FILLED' },
              { icon: 'BOOKMARK', href: '', icon_filled: 'BOOKMARK_FILLED' },
              { icon: 'CHAT', href: '', icon_filled: 'CHAT_FILLED' },
            ]}
          />
        }
      >
        <Actions>
          <Button on_click={() => {}}>Test 1</Button>
          <Button on_click={() => {}}>Test 2</Button>
        </Actions>
      </Popup>
    </div>
  )
}
