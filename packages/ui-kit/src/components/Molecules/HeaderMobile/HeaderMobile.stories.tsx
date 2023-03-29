import { StorybookMargin } from '@/helpers/storybook/StorybookMargin'
import { StorybookSpacer } from '@/helpers/storybook/StorybookSpacer'
import { Meta } from '@storybook/react'
import { HeaderMobile } from './HeaderMobile'

export default {
  title: 'Molecules/HeaderMobile',
  component: HeaderMobile,
} as Meta

export const standard = () => (
  <StorybookMargin>
    <div css={{ maxWidth: '400px', width: '100%' }}>
      <HeaderMobile
        hamburgerIsToggled={false}
        onClickHamburger={() => {}}
        currentTheme="LIGHT"
        onClickTheme={() => {}}
      />
      <StorybookSpacer />
      <HeaderMobile
        hamburgerIsToggled={false}
        onClickHamburger={() => {}}
        user={{ displayName: 'Alicia Keys', backHref: '/' }}
        currentTheme="LIGHT"
        onClickTheme={() => {}}
      />
    </div>
  </StorybookMargin>
)
