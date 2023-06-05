import { HeaderMobile } from './HeaderMobile'

export default {
  component: HeaderMobile,
}

export const Primary = () => (
  <div css={{ maxWidth: '400px', width: '100%' }}>
    <HeaderMobile
      logoSlot={<div>logo</div>}
      navigationSlot={<div>navigation</div>}
    />
  </div>
)
