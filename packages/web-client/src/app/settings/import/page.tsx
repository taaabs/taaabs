'use client'

import { Box as UiAppAtom_Box } from '@web-ui/components/app/atoms/box'
import { BoxHeading as UiAppAtom_BoxHeading } from '@web-ui/components/app/atoms/box-heading'
import { RadioSetting as UiAppAtom_RadioSetting } from '@web-ui/components/app/atoms/radio-setting'
import { FormRadio as UiAppTemplate_FormRadio } from '@web-ui/components/app/templates/form-radio'
import { Button as UiCommonParticle_Button } from '@web-ui/components/common/particles/button'
import { BoxDivider as UiAppAtom_BoxDivider } from '@web-ui/components/app/atoms/box-divider'
import { use_import } from './_hooks/use-import'

const Page: React.FC = () => {
  const import_hook = use_import()

  const handle_file_change = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      import_hook.set_file_text(e.target?.result as string)
    }
    reader.readAsText(file)
  }

  return (
    <>
      <UiAppAtom_Box>
        <UiAppAtom_BoxHeading
          heading="Import bookmarks"
          subheading={
            'Export file can be generated by your web browser, a third-party service or "Backups" settings pane.'
          }
        />
        <div>
          <input type="file" onChange={handle_file_change} />
        </div>
        <p>
          <small>
            <strong>Privacy note:</strong> Imported file will be validated and
            encrypted locally and won't leave your device until you confirm
            upload. This ensures the data is accurate and secured.
          </small>
        </p>

        {import_hook.parsed_xml && (
          <>
            <UiAppAtom_BoxDivider />
            <h3>File contents</h3>
            <p>Found {import_hook.parsed_xml.length} bookmarks.</p>
            <h3>Visibility</h3>
            <UiAppTemplate_FormRadio>
              <UiAppAtom_RadioSetting
                top_line="Private"
                bottom_line="All bookmarks will be encrypted end-to-end"
                on_click={() => {
                  import_hook.set_import_as_public(false)
                }}
                is_checked={!import_hook.import_as_public}
              />
              <UiAppAtom_RadioSetting
                top_line="Public"
                bottom_line="All bookmarks will be published to your public profile"
                on_click={() => {
                  import_hook.set_import_as_public(true)
                }}
                is_checked={import_hook.import_as_public}
              />
            </UiAppTemplate_FormRadio>
            <p>
              <small>
                <strong>Important:</strong> Individual bookmark visibility can
                be adjusted once import is complete.
              </small>
            </p>
            <h3>Summary</h3>
            <p>
              You're about to import {import_hook.parsed_xml.length} bookmarks
              to your personal library.{' '}
              {import_hook.import_as_public
                ? 'All of them will show up on your public profile. '
                : 'All of them will be kept secret to anyone, even us. '}
            </p>
            <p>Would you like to proceed?</p>
            <br />
            <div>
              <UiCommonParticle_Button
                is_loading={import_hook.is_sending}
                on_click={import_hook.submit}
              >
                Proceeed
              </UiCommonParticle_Button>
            </div>
          </>
        )}

        {import_hook.import_data && (
          <>
            <UiAppAtom_BoxDivider />
            <h3>File contents</h3>
            <p>Found {import_hook.import_data.bookmarks.length} bookmarks.</p>
            <h3>Options</h3>
            <UiAppAtom_RadioSetting
              top_line="Erase library"
              bottom_line="Import will completely overwrite your library"
              on_click={() => {
                import_hook.set_erase_library(!import_hook.erase_library)
              }}
              is_checked={import_hook.erase_library}
            />
            <h3>Summary</h3>
            <p>
              This operation will restore deleted bookmarks. Changes to any
              existing bookmarks will not be overwritten.
            </p>
            <p>Would you like to proceed?</p>
            <br />
            <div>
              <UiCommonParticle_Button
                is_loading={import_hook.is_sending}
                on_click={import_hook.submit}
              >
                Proceeed
              </UiCommonParticle_Button>
            </div>
          </>
        )}
      </UiAppAtom_Box>
    </>
  )
}

export default Page