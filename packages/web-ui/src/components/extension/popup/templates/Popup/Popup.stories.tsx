import { Button } from '@web-ui/components/Button'
import { Footer } from './Footer'
import { Header } from './Header'
import { Popup } from './Popup'
import { Actions } from './main/Actions'
import { Separator } from './main/Separator'
import { RecentPrompts } from './main/RecentPrompts'
import { AssistantSelector } from './main/AssistantSelector'
import { PromptField } from './main/PromptField'

export default {
  component: Popup,
}

export const Primary = () => {
  return (
    <div style={{ width: '300px', margin: '50px' }}>
      <Popup
        header_slot={<Header settings_on_click={() => {}} />}
        footer_slot={
          <Footer
            feedback_url=""
            transaltions={{
              send_feedback: 'Send feedback',
            }}
          />
        }
      >
        <Actions>
          <Button on_click={() => {}}>Test 1</Button>
          <Button on_click={() => {}}>Test 2</Button>
        </Actions>
        <AssistantSelector
          label="Assistant:"
          chatbots={[
            { display_name: 'Assistant 1', name: 'assistant1' },
            { display_name: 'Assistant 2', name: 'assistant2' },
          ]}
          selected_chatbot_name="assistant1"
          on_chatbot_change={(chatbot_name) => {
            console.log(chatbot_name)
          }}
        />
        <Separator />
        <RecentPrompts
          on_recent_prompt_click={(id) => {
            console.log(id)
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
        />
        <Separator />
        <PromptField
          value=""
          on_submit={() => {}}
          on_change={(value) => {}}
          on_focus={() => {}}
          is_include_content_selected={true}
          on_include_content_click={() => {}}
          prompts_history={['a', 'b']}
          translations={{
            heading: 'Custom prompt',
            placeholder: 'Ask anything',
            include_page_content: 'Include page content',
            active_input_placeholder_suffix: '(⇅ for history)',
          }}
        />
      </Popup>
    </div>
  )
}
