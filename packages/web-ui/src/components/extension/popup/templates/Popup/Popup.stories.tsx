import { Button } from '@web-ui/components/Button'
import { Footer } from './Footer'
import { Header } from './Header'
import { Popup } from './Popup'
import { Actions } from './main/Actions'
import { Separator } from './main/Separator'
import { RecentPrompts } from './main/RecentPrompts'

export default {
  component: Popup,
}

export const Primary = () => {
  return (
    <div style={{ width: '300px', margin: '50px' }}>
      <Popup
        header_slot={<Header settings_on_click={() => {}} />}
        footer_slot={<Footer />}
      >
        <Actions>
          <Button on_click={() => {}}>Test 1</Button>
          <Button on_click={() => {}}>Test 2</Button>
        </Actions>
        <Separator />
        <RecentPrompts
          on_recent_prompt_click={(id) => {
            console.log(id)
          }}
          chatbots={[
            {
              display_name: 'ChatGPT',
              name: 'chatgpt',
            },
          ]}
          selected_chatbot_name="chatgpt"
          on_chatbot_change={(chatbot_name) => {
            console.log(chatbot_name)
          }}
          recent_prompts={[
            {
              id: '1',
              name: 'Summarize',
            },
            {
              id: '2',
              name: 'Rewrite simplified',
            },
            {
              id: '3',
              name: 'In-depth analysis',
            },
          ]}
          translations={{
            heading: 'Recent prompts',
          }}
        />
      </Popup>
    </div>
  )
}
