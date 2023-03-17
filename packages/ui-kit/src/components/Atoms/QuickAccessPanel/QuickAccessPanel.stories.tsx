import { Meta, Story } from '@storybook/react'
import { QuickAccessPanel } from './QuickAccessPanel'

export default {
  title: 'Atoms/QuickAccessPanel',
  component: QuickAccessPanel,
} as Meta

export const Standard: Story = () => (
  <QuickAccessPanel pinnedAvatars={[]} isLogoActive={true} />
)

export const WithPinnedAvatars: Story = () => (
  <QuickAccessPanel
    isLogoActive={false}
    pinnedAvatars={[
      { displayName: 'Alicia Keys', username: 'alicia', isActive: true },
      {
        displayName: 'Alicia Keys',
        username: 'alicia',
        isActive: false,
      },
    ]}
  />
)

export const WithPinnedImageAvatar: Story = () => (
  <QuickAccessPanel
    isLogoActive={false}
    tempAvatar={{
      displayName: 'Alicia Keys',
      username: 'alicia',
      isActive: true,
      imageUrl: 'https://picsum.photos/100',
    }}
    pinnedAvatars={[
      {
        displayName: 'Alicia Keys',
        username: 'alicia',
        isActive: false,
        imageUrl: 'https://picsum.photos/101',
      },
    ]}
  />
)

export const WithLotsOfPinnedAvatars: Story = () => (
  <QuickAccessPanel
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
  <QuickAccessPanel
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
