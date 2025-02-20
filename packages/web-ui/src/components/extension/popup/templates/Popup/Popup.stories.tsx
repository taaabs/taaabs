import { Button } from '@web-ui/components/Button'
import { Header } from './Header'
import { Popup } from './Popup'
import { Actions } from './main/Actions'
import { Separator } from './main/Separator'
import { RecentPrompts } from './main/RecentPrompts'
import { PromptField } from './main/PromptField'
import { FooterLinks } from './main/FooterLinks'
import { FlexRow } from './main/Actions/FlexRow'

export default {
  component: Popup,
}

const ASSISTANTS = [
  {
    name: 'chatgpt',
    label: 'ChatGPT',
    logo_url: 'https://www.google.com/s2/favicons?domain=openai.com&sz=64',
  },
  {
    name: 'gemini',
    label: 'Gemini',
    logo_url:
      'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=64',
  },
  {
    name: 'claude',
    label: 'Claude',
    logo_url: 'https://www.google.com/s2/favicons?domain=claude.ai&sz=64',
  },
]

export const Primary = () => {
  return (
    <div style={{ width: '360px', margin: '50px', border: '1px solid black' }}>
      <Popup
        header_slot={
          <Header
            settings_on_click={() => {}}
            vision_mode_on_click={() => {}}
            logo_on_click={() => {}}
            translations={{
              trigger_popup_shortcut: 'Trigger popup shortcut',
            }}
          />
        }
      >
        <Actions>
          <Button on_click={() => {}}>Test 1</Button>
          <Button on_click={() => {}}>Test 2</Button>
          <FlexRow>
            <Button on_click={() => {}}>Test 3</Button>
            <Button on_click={() => {}}>Test 4</Button>
          </FlexRow>
        </Actions>

        <PromptField
          value=""
          on_submit={() => {}}
          on_change={() => {}}
          prompts_history={['a', 'b']}
          is_history_enabled={false}
          autofocus={true}
          switches_slot={<>switches</>}
          translations={{
            new_prompt: 'New chat',
            placeholder: 'Message ChatGPT',
            active_input_placeholder_suffix: '(⇅ for history)',
          }}
          assistants={ASSISTANTS}
          selected_assistant_name={'chatgpt'}
          on_assistant_change={() => {}}
          on_history_back_click={() =>{}}
          on_history_forward_click={() =>{}}
        />

        <Separator />

        <RecentPrompts
          on_recent_prompt_click={(id) => {
            console.log(id)
          }}
          default_prompts={[]}
          filter_phrase=""
          on_recent_prompt_middle_click={() => {}}
          is_disabled={false}
          on_remove_prompt={() => {}}
          recent_prompts={[
            'Summarize sflsd fjlksdjf lksda jf;lks faj;l kfajkl; sfaj;lksf sdlkfj sdlkfj sdlkjfjkdjf lksdjf  dskjflsdjf sdklj flksdj f',
            'Rewrite simplified',
            'In-depth analysis',
            'Summarize',
            'Rewrite simplified',
            'In-depth analysis',
            'Summarize',
            'Rewrite simplified',
            'In-depth analysis',
          ]}
          translations={{
            heading: 'Saved prompts',
            searching_heading: 'Searching...',
            delete: 'Delete',
          }}
        />

        <FooterLinks
          on_link_click={() => {}}
          links={[
            {
              href: 'https://example.com',
              text: 'Lorem ipsum',
            },
            {
              href: 'https://example.com',
              text: 'Lorem ipsum',
            },
            {
              href: 'https://example.com',
              text: 'Lorem ipsum',
            },
          ]}
        />
      </Popup>
    </div>
  )
}
