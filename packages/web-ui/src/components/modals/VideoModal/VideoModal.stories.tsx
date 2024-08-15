import { VideoModal } from './VideoModal'
import { StoryFn } from '@storybook/react'

export default {
  component: VideoModal,
}

const Template: StoryFn<VideoModal.Props> = (args) => <VideoModal {...args} />

export const Default = Template.bind({})
const default_args: VideoModal.Props = {
  is_open: true,
  on_close: () => console.log('Closed'),
  embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
}
Default.args = default_args
