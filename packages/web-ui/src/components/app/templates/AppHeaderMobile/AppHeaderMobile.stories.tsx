import { AppHeaderMobile } from './AppHeaderMobile'

export default {
  component: AppHeaderMobile,
}

export const Primary = () => (
  <div style={{ maxWidth: '400px', width: '100%' }}>
    <AppHeaderMobile
      logoSlot={<div>logo</div>}
      navigationSlot={<div>navigation</div>}
    />
  </div>
)