import { BottomNavigationBar } from './BottomNavigationBar'

export default {
  component: BottomNavigationBar,
}

export const Primary = () => {
  return (
    <div style={{ width: '300px', margin: '50px' }}>
      <BottomNavigationBar
        items={[
          { icon: 'HOME', href: '', icon_filled: 'HOME_FILLED' },
          { icon: 'BOOKMARK', href: '', icon_filled: 'BOOKMARK_FILLED' },
          { icon: 'CHAT', href: '', icon_filled: 'CHAT_FILLED' },
        ]}
      />
    </div>
  )
}
