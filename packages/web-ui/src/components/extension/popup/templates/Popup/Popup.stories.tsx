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

export const Primary = () => {
  return (
    <div style={{ width: '360px', margin: '50px', border: '1px solid black' }}>
      <Popup
        header_slot={
          <Header
            settings_on_click={() => {}}
            vision_mode_on_click={() => {}}
            is_vision_mode_available={true}
            logo_on_click={() => {}}
            translations={{
              trigger_popup_shortcut: 'Trigger popup shortcut',
            }}
          />
        }
        should_set_height={true}
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
          is_switch_checked={true}
          on_switch_click={() => {}}
          is_switch_visible={true}
          prompts_history={['a', 'b']}
          is_history_enabled={false}
          is_plain_text_too_long={false}
          text_not_found={false}
          is_switch_disabled={false}
          translations={{
            new_prompt: 'New chat',
            placeholder: 'Message ChatGPT',
            switch: 'Send page',
            active_input_placeholder_suffix: '(⇅ for history)',
            plain_text_too_long: 'Plain text too long',
            text_not_found: 'Text not found',
          }}
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
            heading: 'Recent prompts',
            searching_heading: 'Searching...',
          }}
        />

        <FooterLinks
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
