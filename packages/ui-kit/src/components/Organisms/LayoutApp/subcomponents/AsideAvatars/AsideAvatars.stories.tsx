import { Meta, Story } from '@storybook/react'
import { AsideAvatars } from './AsideAvatars'

export default {
  title: 'Organisms/LayoutApp/subcomponents/AsideAvatars',
  component: AsideAvatars,
} as Meta

export const WithoutPinnedAvatars: Story = () => (
  <AsideAvatars pinnedAvatars={[]} isLogoActive={true} />
)

export const WithPinnedAvatars: Story = () => (
  <AsideAvatars
    isLogoActive={false}
    pinnedAvatars={[
      { displayName: 'Alicia Keys', username: 'alicia', isActive: true },
      { displayName: 'Alicia Keys', username: 'alicia', isActive: false },
    ]}
  />
)

export const WithLotsOfPinnedAvatars: Story = () => (
  <AsideAvatars
    isLogoActive={false}
    pinnedAvatars={[
      { displayName: 'Alicia Keys', username: 'alicia', isActive: true },
      ...Array(20)
        .fill(null)
        .map(() => ({
          displayName: 'Alicia Keys',
          username: 'alicia',
          isActive: false,
        })),
    ]}
  />
)

export const WithPinnedAvatarsAndTempAvatar: Story = () => (
  <AsideAvatars
    isLogoActive={false}
    tempAvatar={{
      displayName: 'Alicia Keys',
      username: 'alicia',
      isActive: true,
    }}
    pinnedAvatars={[
      { displayName: 'Alicia Keys', username: 'alicia', isActive: false },
      { displayName: 'Alicia Keys', username: 'alicia', isActive: false },
    ]}
  />
)
