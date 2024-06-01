import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { system_values } from '@shared/constants/system-values'
import { useEffect, useRef, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { ContentStandard as UiCommonTemplate_Modal_ContentStandard } from '@web-ui/components/common/templates/modal/content-standard'
import { Header as UiCommonTemplate_Modal_ContentStandard_Header } from '@web-ui/components/common/templates/modal/content-standard/header'
import { Footer as UiCommonTemplate_Modal_ContentStandard_Footer } from '@web-ui/components/common/templates/modal/content-standard/footer'
import { Input as UiCommonAtom_Input } from '@web-ui/components/common/atoms/input'
import { DraggableUpsertFormLinks as UiAppAtom_DraggableUpsertFormLinks } from '@web-ui/components/app/atoms/draggable-upsert-form-links'
import { DraggableUpsertFormTags as UiAppAtom_DraggableUpsertFormTags } from '@web-ui/components/app/atoms/draggable-upsert-form-tags'
import { FormControllerFix as UiCommonTemplate_FormControllerFix } from '@web-ui/components/common/templates/form-controller-fix'
import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { StandardSplit as UiCommonTemplate_Modal_ContentStandard_Sections_StandardSplit } from '@web-ui/components/common/templates/modal/content-standard/sections/standard-split'
import { Standard as UiCommonTemplate_Modal_ContentStandard_Sections_Standard } from '@web-ui/components/common/templates/modal/content-standard/sections/standard'
import { Centered as UiCommonTemplate_Modal_ContentStandard_Sections_Centered } from '@web-ui/components/common/templates/modal/content-standard/sections/centered'
import { Divider as UiCommonTemplate_Modal_ContentStandard_Sections_Divider } from '@web-ui/components/common/templates/modal/content-standard/sections/divider'
import { SegmentedButton } from '@web-ui/components/app/atoms/segmented-button'
import { is_url_valid } from '@shared/utils/is-url-valid/is-url-valid'
import { Dictionary } from '@/dictionaries/dictionary'
import { HtmlParser } from '@shared/utils/html-parser'

type FormValues = {
  title: string
  note: string
  is_public?: boolean
}

// Data from fragment.
type BookmarkAutofill = {
  title?: string
  note?: string
  links?: {
    url: string
    site_path?: string
  }[]
  tags?: string[]
}

export namespace UpsertBookmark {
  export type Props = {
    bookmark?: Bookmark_Entity
    bookmark_autofill?: BookmarkAutofill
    is_archived?: boolean
    on_submit: (bookmark: UpsertBookmark_Params) => void
    on_close: () => void
    action: 'create' | 'update'
    dictionary: Dictionary
  }
}

type ClipboardData = {
  html: string
  favicon?: string
  og_image?: string
}

const cover_size = {
  width: 110 * 2,
  height: 82 * 2,
}

export const UpsertBookmark: React.FC<UpsertBookmark.Props> = (props) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isSubmitted, isSubmitSuccessful },
  } = useForm<FormValues>({ mode: 'onBlur' })
  const [clipboard_url, set_clipboard_url] = useState<string>()
  const [clipboard_data, set_clipboard_data] = useState<ClipboardData>()
  const cover_paste_area = useRef<HTMLDivElement>(null)
  const file_input = useRef<HTMLInputElement>(null)
  const [cover, set_cover] = useState<string>() // Base64 encoded webp.

  const handle_file_select = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (!input.files) {
      return
    }
    const file = input.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = async function () {
      const img = new Image()
      img.src = reader.result as string

      await new Promise((resolve) => {
        img.onload = resolve
      })

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      // Set the canvas dimensions
      const canvasWidth = cover_size.width
      const canvasHeight = cover_size.height
      canvas.width = canvasWidth
      canvas.height = canvasHeight

      // Calculate aspect ratio
      const originalWidth = img.width
      const originalHeight = img.height
      const canvasRatio = canvasWidth / canvasHeight
      const imageRatio = originalWidth / originalHeight

      // Determine the dimensions to draw the image
      let drawWidth, drawHeight, offsetX, offsetY

      if (canvasRatio > imageRatio) {
        // Canvas is wider relative to its height than the image
        drawWidth = canvasWidth
        drawHeight = canvasWidth / imageRatio
        offsetX = 0
        offsetY = (canvasHeight - drawHeight) / 2
      } else {
        // Canvas is taller relative to its width than the image
        drawWidth = canvasHeight * imageRatio
        drawHeight = canvasHeight
        offsetX = (canvasWidth - drawWidth) / 2
        offsetY = 0
      }

      // Draw the image onto the canvas
      ctx.drawImage(
        img,
        0,
        0,
        originalWidth,
        originalHeight, // Source rectangle
        offsetX,
        offsetY,
        drawWidth,
        drawHeight, // Destination rectangle
      )

      set_cover(canvas.toDataURL('image/webp'))
    }
  }

  const handle_paste_area_paste = (event: ClipboardEvent) => {
    const items = event.clipboardData?.items
    let blob: File | null = null

    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') === 0) {
          blob = items[i].getAsFile()
        }
      }
    }

    if (blob) {
      const reader = new FileReader()
      // reader.onload = function (event: ProgressEvent<FileReader>) {
      //   if (event.target && event.target.result) {
      //     preview.src = event.target.result as string;
      //   }
      // }
      reader.readAsDataURL(blob)

      // Create a new File object to set the file input value
      const file = new File([blob], 'pasted-image.png', { type: blob.type })
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      file_input.current!.files = dataTransfer.files
      file_input.current!.dispatchEvent(new Event('change'))
    }
  }

  const [links, set_links] = useState<
    {
      url: string
      site_path?: string
      is_public?: boolean
      open_snapshot?: boolean
    }[]
  >(
    props.bookmark
      ? props.bookmark?.links.map((link) => ({
          url: link.url,
          site_path: link.site_path,
          is_public: link.is_public,
          open_snapshot: link.open_snapshot,
        }))
      : props.bookmark_autofill && props.bookmark_autofill.links
      ? props.bookmark_autofill.links.map(({ url }) => ({
          url,
          is_public: true,
        }))
      : [],
  )
  const [tags, set_tags] = useState<{ name: string; is_public?: boolean }[]>(
    props.bookmark
      ? props.bookmark?.tags.map((tag) => ({
          name: tag.name,
          is_public: tag.is_public,
        }))
      : props.bookmark_autofill && props.bookmark_autofill.tags
      ? props.bookmark_autofill.tags.map((name) => ({
          name,
          is_public: true,
        }))
      : [],
  )

  const on_submit: SubmitHandler<FormValues> = async (form_data) => {
    let og_image: string | undefined = undefined
    if (clipboard_data?.og_image) {
      const img = document.createElement('img')
      img.src = clipboard_data.og_image

      await new Promise((resolve) => {
        img.onload = resolve
      })

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      // Set the canvas dimensions
      const canvasWidth = cover_size.width
      const canvasHeight = cover_size.height
      canvas.width = canvasWidth
      canvas.height = canvasHeight

      // Calculate aspect ratio
      const originalWidth = img.width
      const originalHeight = img.height
      const canvasRatio = canvasWidth / canvasHeight
      const imageRatio = originalWidth / originalHeight

      // Determine the dimensions to draw the image
      let drawWidth, drawHeight, offsetX, offsetY

      if (canvasRatio > imageRatio) {
        // Canvas is wider relative to its height than the image
        drawWidth = canvasWidth
        drawHeight = canvasWidth / imageRatio
        offsetX = 0
        offsetY = (canvasHeight - drawHeight) / 2
      } else {
        // Canvas is taller relative to its width than the image
        drawWidth = canvasHeight * imageRatio
        drawHeight = canvasHeight
        offsetX = (canvasWidth - drawWidth) / 2
        offsetY = 0
      }

      // Draw the image onto the canvas
      ctx.drawImage(
        img,
        0,
        0,
        originalWidth,
        originalHeight, // Source rectangle
        offsetX,
        offsetY,
        drawWidth,
        drawHeight, // Destination rectangle
      )

      og_image = canvas.toDataURL('image/webp')
    }

    const is_bookmark_public =
      (form_data.is_public === undefined && props.bookmark?.is_public) ||
      form_data.is_public ||
      false
    const bookmark: UpsertBookmark_Params = {
      bookmark_id: props.bookmark?.id,
      is_public: is_bookmark_public,
      title: form_data.title,
      note: form_data.note || undefined,
      created_at: props.bookmark?.created_at
        ? new Date(props.bookmark.created_at)
        : undefined,
      stars: props.bookmark?.stars,
      is_archived: props.is_archived || false,
      is_unsorted: props.bookmark?.is_unsorted || false,
      links: await Promise.all(
        links.map(async (link) => {
          const current_link = props.bookmark?.links.find(
            (l) => l.url == link.url,
          )
          const favicon = clipboard_data?.favicon
            ? clipboard_data.favicon.replace('data:image/webp;base64,', '')
            : undefined
          const plain_text =
            props.bookmark_autofill?.links &&
            props.bookmark_autofill.links.length &&
            props.bookmark_autofill.links[0].url == link.url
              ? clipboard_data
                ? HtmlParser.parse({
                    url: link.url,
                    html: clipboard_data.html,
                  })?.plain_text
                : undefined
              : undefined
          const reader_data =
            props.bookmark_autofill?.links &&
            props.bookmark_autofill.links.length &&
            props.bookmark_autofill.links[0].url == link.url
              ? clipboard_data
                ? HtmlParser.parse({
                    url: link.url,
                    html: clipboard_data.html,
                  })?.reader_data
                : undefined
              : undefined
          return {
            url: link.url,
            is_public: (form_data.is_public ? link.is_public : false) || false, // TODO: make is public optional.
            site_path: link.site_path,
            is_pinned: current_link?.is_pinned,
            pin_title: current_link?.pin_title,
            open_snapshot: link.open_snapshot,
            favicon: favicon || current_link?.favicon,
            plain_text,
            reader_data,
          }
        }),
      ),
      tags: tags.map((tag) => ({
        name: tag.name,
        is_public: (form_data.is_public ? tag.is_public : false) || false, // TODO: make is public optional.
      })),
      cover:
        cover?.replace('data:image/webp;base64,', '') ||
        og_image?.replace('data:image/webp;base64,', '') ||
        props.bookmark?.cover,
    }
    props.on_submit(bookmark)
  }

  const handle_keyboard = (event: KeyboardEvent) => {
    if (event.code == 'Escape') {
      props.on_close()
    }
  }

  useEffect(() => {
    navigator.clipboard
      .readText()
      .then((value) => {
        if (props.bookmark_autofill) {
          const clipboard_data: ClipboardData = JSON.parse(value)
          set_clipboard_data(clipboard_data)
          // Temporary solution for getting accurate title from various sources.
          // ChatGPT provides default title after reload.
          // Claude never provides default title.
          if (
            props.bookmark_autofill.links?.[0].url.startsWith(
              'https://chatgpt.com/',
            )
          ) {
            const temp_el = document.createElement('div')
            temp_el.innerHTML = clipboard_data.html
            const title = temp_el.querySelector<HTMLElement>(
              '.bg-token-sidebar-surface-secondary.active\\:opacity-90.rounded-lg.relative.group > .p-2.gap-2.items-center.flex',
            )?.innerText
            if (title) {
              setValue('title', title)
            }
          } else if (
            props.bookmark_autofill.links?.[0].url.startsWith(
              'https://claude.ai/chat/',
            )
          ) {
            const temp_el = document.createElement('div')
            temp_el.innerHTML = clipboard_data.html
            const title = temp_el.querySelector<HTMLElement>(
              '.tracking-tight.font-normal.font-tiempos.truncate',
            )?.innerText
            if (title) {
              setValue('title', title)
            }
          } else if (
            props.bookmark_autofill.links?.[0].url.startsWith(
              'https://coral.cohere.com/c/',
            )
          ) {
            const temp_el = document.createElement('div')
            temp_el.innerHTML = clipboard_data.html
            const title = temp_el.querySelector<HTMLElement>(
              '.truncate.font-body.text-p-lg',
            )?.innerText
            if (title) {
              setValue('title', title)
            }
          } else if (
            props.bookmark_autofill.links?.[0].url.startsWith(
              'https://gemini.google.com/app/',
            )
          ) {
            const temp_el = document.createElement('div')
            temp_el.innerHTML = clipboard_data.html
            const title = temp_el.querySelector<HTMLElement>(
              '.selected.ng-star-inserted.conversation.mat-mdc-tooltip-trigger > .gmat-body-1.conversation-title',
            )?.innerText
            if (title) {
              setValue('title', title)
            }
          }
        } else if (is_url_valid(value)) {
          set_clipboard_url(value)
        }
      })
      .catch(() => {})

    const handle_paste_area_focus = () => {
      cover_paste_area.current?.focus()
    }

    file_input.current?.addEventListener('change', handle_file_select)
    cover_paste_area.current?.addEventListener('click', handle_paste_area_focus)
    cover_paste_area.current?.addEventListener('paste', handle_paste_area_paste)

    window.addEventListener('keydown', handle_keyboard)

    return () => {
      file_input.current?.removeEventListener('change', handle_file_select)
      cover_paste_area.current?.removeEventListener(
        'click',
        handle_paste_area_focus,
      )
      cover_paste_area.current?.removeEventListener(
        'paste',
        handle_paste_area_paste,
      )

      window.removeEventListener('keydown', handle_keyboard)
    }
  }, [])

  return (
    <UiCommonTemplate_Modal_ContentStandard
      width={600}
      slot_header={
        <UiCommonTemplate_Modal_ContentStandard_Header
          title={
            props.action == 'update'
              ? props.dictionary.app.upsert_modal.edit_boomkark
              : props.dictionary.app.upsert_modal.create_bookmark
          }
        />
      }
      slot_footer={
        <UiCommonTemplate_Modal_ContentStandard_Footer
          on_click_cancel={props.on_close}
          button_label={
            props.action == 'update'
              ? props.dictionary.app.upsert_modal.save_changes
              : props.dictionary.app.upsert_modal.create
          }
          is_disabled={isSubmitting || (isSubmitted && isSubmitSuccessful)}
          button_on_click={handleSubmit(on_submit)}
          translations={{
            cancel: props.dictionary.app.upsert_modal.cancel,
          }}
        />
      }
    >
      <UiCommonTemplate_Modal_ContentStandard_Sections_Centered
        label={props.dictionary.app.upsert_modal.visibility}
      >
        <Controller
          name="is_public"
          control={control}
          defaultValue={props.bookmark?.is_public}
          render={({ field }) => {
            return (
              <div style={{ width: '200px' }}>
                <SegmentedButton
                  items={[
                    {
                      label: props.dictionary.app.upsert_modal.private,
                      is_selected: !field.value,
                    },
                    {
                      label: props.dictionary.app.upsert_modal.public,
                      is_selected: field.value || false,
                    },
                  ]}
                  on_item_click={(selected_idx) => {
                    if (selected_idx == 0) {
                      field.onChange(false)
                    } else {
                      field.onChange(true)
                    }
                  }}
                />
              </div>
            )
          }}
        />
      </UiCommonTemplate_Modal_ContentStandard_Sections_Centered>

      <UiCommonTemplate_Modal_ContentStandard_Sections_Standard
        label={props.dictionary.app.upsert_modal.links}
      >
        <Controller
          name="is_public"
          control={control}
          defaultValue={props.bookmark?.is_public}
          render={({ field }) => {
            return (
              <UiAppAtom_DraggableUpsertFormLinks
                links={links.map((link) => ({
                  url: link.url,
                  site_path: link.site_path,
                  is_public:
                    props.bookmark?.is_public == false ? true : link.is_public,
                  open_snapshot: link.open_snapshot,
                }))}
                on_change={(links) => {
                  set_links(
                    links.map((link) => ({
                      url: link.url,
                      site_path: link.site_path,
                      is_public: link.is_public,
                      open_snapshot: link.open_snapshot,
                    })),
                  )
                }}
                show_visibility_toggler={
                  (field.value === undefined && props.bookmark?.is_public) ||
                  field.value ||
                  false
                }
                max_items={system_values.bookmark.links.limit}
                clipboard_url={clipboard_url}
                translations={{
                  paste_url: props.dictionary.app.upsert_modal.paste_url,
                  add: props.dictionary.app.upsert_modal.add_link,
                  open: props.dictionary.app.upsert_modal.link.open,
                  original_url:
                    props.dictionary.app.upsert_modal.link.original_url,
                  snapshot: props.dictionary.app.upsert_modal.link.snapshot,
                  visibility: props.dictionary.app.upsert_modal.link.visibility,
                  private: props.dictionary.app.upsert_modal.link.private,
                  public: props.dictionary.app.upsert_modal.link.public,
                  site: props.dictionary.app.upsert_modal.link.site,
                }}
              />
            )
          }}
        />
      </UiCommonTemplate_Modal_ContentStandard_Sections_Standard>

      <UiCommonTemplate_Modal_ContentStandard_Sections_Divider />

      <UiCommonTemplate_Modal_ContentStandard_Sections_StandardSplit
        label={props.dictionary.app.upsert_modal.title}
      >
        <UiCommonTemplate_FormControllerFix>
          <Controller
            name="title"
            control={control}
            defaultValue={
              props.bookmark
                ? props.bookmark.title
                : props.bookmark_autofill
                ? props.bookmark_autofill.title
                : undefined
            }
            rules={{
              maxLength: system_values.bookmark.title.max_length,
            }}
            render={({ field }) => {
              let error_message: string | undefined

              if (errors.title?.type == 'maxLength') {
                error_message =
                  props.dictionary.app.upsert_modal.error_title_too_long
              }

              return (
                <UiCommonAtom_Input
                  value={field.value}
                  on_change={(value) => {
                    if (!isSubmitting) {
                      field.onChange(value)
                    }
                  }}
                  message_type={error_message ? 'error' : undefined}
                  message={error_message}
                  lines={2}
                  placeholder={props.dictionary.app.upsert_modal.enter_title}
                />
              )
            }}
          />
        </UiCommonTemplate_FormControllerFix>
      </UiCommonTemplate_Modal_ContentStandard_Sections_StandardSplit>

      <UiCommonTemplate_Modal_ContentStandard_Sections_Divider />

      <UiCommonTemplate_Modal_ContentStandard_Sections_StandardSplit
        label={props.dictionary.app.upsert_modal.note}
      >
        <UiCommonTemplate_FormControllerFix>
          <Controller
            name="note"
            control={control}
            defaultValue={
              props.bookmark
                ? props.bookmark?.note
                : props.bookmark_autofill
                ? props.bookmark_autofill.note
                : undefined
            }
            rules={{
              maxLength: system_values.bookmark.note.max_length,
            }}
            render={({ field }) => {
              let error_message: string | undefined

              if (errors.note?.type == 'maxLength') {
                error_message =
                  props.dictionary.app.upsert_modal.error_note_too_long
              }

              return (
                <UiCommonAtom_Input
                  value={field.value}
                  on_change={(value) => {
                    if (!isSubmitting) {
                      field.onChange(value)
                    }
                  }}
                  message_type={error_message ? 'error' : undefined}
                  message={error_message}
                  lines={5}
                  placeholder={
                    props.dictionary.app.upsert_modal.jot_something_down
                  }
                  is_note={true}
                />
              )
            }}
          />
        </UiCommonTemplate_FormControllerFix>
      </UiCommonTemplate_Modal_ContentStandard_Sections_StandardSplit>

      <UiCommonTemplate_Modal_ContentStandard_Sections_Divider />

      <UiCommonTemplate_Modal_ContentStandard_Sections_StandardSplit
        label={props.dictionary.app.upsert_modal.tags}
      >
        <Controller
          name="is_public"
          control={control}
          defaultValue={props.bookmark?.is_public}
          render={({ field }) => {
            return (
              <UiAppAtom_DraggableUpsertFormTags
                tags={tags.map((tag) => ({
                  name: tag.name,
                  is_public:
                    props.bookmark?.is_public == false ? true : tag.is_public,
                }))}
                on_change={(tags) => {
                  set_tags(
                    tags.map((tag) => ({
                      name: tag.name,
                      is_public: tag.is_public,
                    })),
                  )
                }}
                show_visibility_toggler={
                  (field.value === undefined && props.bookmark?.is_public) ||
                  field.value ||
                  false
                }
                max_items={system_values.bookmark.tags.limit}
                translations={{
                  enter_tag_name:
                    props.dictionary.app.upsert_modal.enter_tag_name,
                  add: props.dictionary.app.upsert_modal.add_tag,
                  private: props.dictionary.app.upsert_modal.tag.private,
                  public: props.dictionary.app.upsert_modal.tag.public,
                  visibility: props.dictionary.app.upsert_modal.tag.visibility,
                }}
              />
            )
          }}
        />
      </UiCommonTemplate_Modal_ContentStandard_Sections_StandardSplit>

      <UiCommonTemplate_Modal_ContentStandard_Sections_Divider />

      <UiCommonTemplate_Modal_ContentStandard_Sections_StandardSplit
        label={props.dictionary.app.upsert_modal.cover}
      >
        {(cover || clipboard_data?.og_image || props.bookmark?.cover) && (
          <img
            src={
              cover ||
              clipboard_data?.og_image ||
              (props.bookmark?.cover &&
                `data:image/webp;base64,${props.bookmark?.cover}`)
            }
            width={cover_size.width / 2}
            height={cover_size.height / 2}
          />
        )}
        <input type="file" ref={file_input} />
        <br />
        <div ref={cover_paste_area}>
          Click here and press Ctrl+V to paste an image
        </div>
      </UiCommonTemplate_Modal_ContentStandard_Sections_StandardSplit>
    </UiCommonTemplate_Modal_ContentStandard>
  )
}
