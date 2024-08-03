import { HeaderMobile } from './HeaderMobile'

export default {
  component: HeaderMobile,
}

export const Primary = () => (
  <div style={{ maxWidth: '400px', width: '100%' }}>
    <HeaderMobile
      slot_logo={<div>logo</div>}
      slot_navigation={<div>navigation</div>}
    />
  </div>
)
