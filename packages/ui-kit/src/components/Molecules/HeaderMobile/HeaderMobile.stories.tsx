import { Meta } from '@storybook/react'
import { HeaderMobile } from './HeaderMobile'

export default {
  title: 'Molecules/HeaderMobile',
  component: HeaderMobile,
} as Meta

export const standard = () => (
  <div css={{ maxWidth: '400px', width: '100%' }}>
    <HeaderMobile hamburgerIsToggled={false} onClickHamburger={() => {}} />
    <HeaderMobile hamburgerIsToggled={false} onClickHamburger={() => {}} />
  </div>
)
