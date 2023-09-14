import { AppHeaderMobile } from './app-header-mobile'

export default {
  component: AppHeaderMobile,
}

export const Primary = () => (
  <div style={{ maxWidth: '400px', width: '100%' }}>
    <AppHeaderMobile
      slot_logo={<div>logo</div>}
      slot_navigation={<div>navigation</div>}
    />
  </div>
)
