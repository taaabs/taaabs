import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { UpsertBookmark_UseCase } from '@repositories/modules/bookmarks/domain/usecases/upsert-bookmark.use-case'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { system_values } from '@shared/constants/system-values'
import { Box } from '@web-ui/components/app/atoms/box'
import { BoxHeading } from '@web-ui/components/app/atoms/box-heading'
import { DraggableFormInputs } from '@web-ui/components/app/atoms/draggable-form-inputs'
import { ModalFooter } from '@web-ui/components/app/atoms/modal-footer'
import { ModalHeader } from '@web-ui/components/app/atoms/modal-header'
import { RadioSetting } from '@web-ui/components/app/atoms/radio-setting'
import { FormModal } from '@web-ui/components/app/templates/form-modal'
import { FormRadio } from '@web-ui/components/app/templates/form-radio'
import { Input } from '@web-ui/components/common/atoms/input'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

type FormValues = {
  title: string
  links: string[]
  tags: string[]
  note: string
  is_public?: boolean
}

export const UpsertBookmarkForm: React.FC<{
  bookmark?: Bookmark_Entity
  is_archived?: boolean
  on_submit: (bookmark: Bookmark_Entity) => void
  on_close: () => void
  auth_token: string
}> = (props) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted, isSubmitSuccessful },
  } = useForm<FormValues>({ mode: 'all' })
  const [links, set_links] = useState<{ url: string; is_public: boolean }[]>(
    props.bookmark?.links.map((link) => ({
      url: link.url,
      is_public: link.is_public,
    })) || [],
  )
  const [tags, set_tags] = useState<{ name: string; is_public: boolean }[]>(
    props.bookmark?.tags.map((tag) => ({
      name: tag.name,
      is_public: tag.is_public,
    })) || [],
  )

  const on_submit: SubmitHandler<FormValues> = async (form_data) => {
    const data_source = new Bookmarks_DataSourceImpl(
      process.env.NEXT_PUBLIC_API_URL,
      props.auth_token,
    )
    const repository = new Bookmarks_RepositoryImpl(data_source)
    const upsert_bookmark_use_case = new UpsertBookmark_UseCase(repository)

    try {
      const bookmark = await upsert_bookmark_use_case.invoke({
        bookmark_id: props.bookmark?.id,
        is_public:
          (form_data.is_public === undefined && props.bookmark?.is_public) ||
          form_data.is_public ||
          false,
        title: form_data.title,
        note: form_data.note || undefined,
        created_at: props.bookmark?.created_at
          ? new Date(props.bookmark.created_at)
          : undefined,
        stars: props.bookmark?.stars,
        is_archived: props.is_archived || false,
        is_unread: props.bookmark?.is_unread || false,
        links: links.map((link) => ({
          url: link.url,
          is_public: form_data.is_public ? link.is_public : false,
        })),
        tags: tags.map((tag) => ({
          name: tag.name,
          is_public: form_data.is_public ? tag.is_public : false,
        })),
      })
      if (props.bookmark) {
        props.on_submit(bookmark)
      }
    } catch {}
  }

  const handle_keyboard = (event: any) => {
    if (event.code == 'Escape') {
      props.on_close()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handle_keyboard)

    return () => {
      window.removeEventListener('keydown', handle_keyboard)
    }
  }, [])

  return (
    <form
      onSubmit={handleSubmit(on_submit)}
      onKeyDown={(e) => {
        if (e.code == 'Enter') {
          e.preventDefault()
        }
      }}
    >
      <FormModal
        slot_header={<ModalHeader title="Edit bookmark" />}
        slot_footer={
          <ModalFooter
            on_click_cancel={props.on_close}
            button_label="Save"
            is_disabled={isSubmitting || (isSubmitted && isSubmitSuccessful)}
          />
        }
      >
        <Box>
          <BoxHeading heading="Visibility" />
          <Controller
            name="is_public"
            control={control}
            defaultValue={props.bookmark?.is_public}
            render={({ field }) => {
              return (
                <FormRadio>
                  <RadioSetting
                    top_line="Private"
                    bottom_line="All data is encrypted end-to-end"
                    on_click={() => {
                      field.onChange(false)
                    }}
                    is_checked={!field.value}
                  />
                  <RadioSetting
                    top_line="Public"
                    bottom_line="Selected links and tags can remain private"
                    on_click={() => {
                      field.onChange(true)
                    }}
                    is_checked={field.value}
                  />
                </FormRadio>
                // <input
                //   type="checkbox"
                //   checked={field.value}
                //   onChange={(is_checked) => {
                //     field.onChange(is_checked)
                //   }}
                // />
              )
            }}
          />
        </Box>
        <Box>
          <BoxHeading heading="Title" />
          <Controller
            name="title"
            control={control}
            defaultValue={props.bookmark?.title}
            rules={{
              maxLength: system_values.bookmark.title.max_length,
            }}
            render={({ field }) => {
              let error_message: string | undefined

              if (errors.title?.type == 'maxLength') {
                error_message = `Title should be no longer than ${system_values.bookmark.title.max_length} characters.`
              }

              return (
                <Input
                  value={field.value}
                  on_change={(value) => {
                    if (!isSubmitting) {
                      field.onChange(value)
                    }
                  }}
                  message_type={error_message ? 'error' : undefined}
                  message={error_message}
                  lines={2}
                />
              )
            }}
          />
        </Box>
        <Box>
          <BoxHeading heading="Links" />
          <Controller
            name="is_public"
            control={control}
            defaultValue={props.bookmark?.is_public}
            render={({ field }) => {
              return (
                <DraggableFormInputs
                  items={links.map((link) => ({
                    value: link.url,
                    is_public:
                      props.bookmark?.is_public == false
                        ? true
                        : link.is_public,
                  }))}
                  on_change={(links) => {
                    set_links(
                      links.map((el) => ({
                        url: el.value,
                        is_public: el.is_public,
                      })),
                    )
                  }}
                  button_text="Add link"
                  show_visibility_toggler={
                    (field.value === undefined && props.bookmark?.is_public) ||
                    field.value ||
                    false
                  }
                />
              )
            }}
          />
        </Box>
        <Box>
          <BoxHeading heading="Tags" />
          <Controller
            name="is_public"
            control={control}
            defaultValue={props.bookmark?.is_public}
            render={({ field }) => {
              return (
                <DraggableFormInputs
                  items={tags.map((tag) => ({
                    value: tag.name,
                    is_public:
                      props.bookmark?.is_public == false ? true : tag.is_public,
                  }))}
                  on_change={(tags) => {
                    set_tags(
                      tags.map((el) => ({
                        name: el.value,
                        is_public: el.is_public,
                      })),
                    )
                  }}
                  button_text="Add tag"
                  show_visibility_toggler={
                    (field.value === undefined && props.bookmark?.is_public) ||
                    field.value ||
                    false
                  }
                  max_items={system_values.bookmark.tags.limit}
                />
              )
            }}
          />
        </Box>
        <Box>
          <BoxHeading heading="Note" />
          <Controller
            name="note"
            control={control}
            defaultValue={props.bookmark?.note}
            rules={{
              maxLength: system_values.bookmark.note.max_length,
            }}
            render={({ field }) => {
              let error_message: string | undefined

              if (errors.note?.type == 'maxLength') {
                error_message = `Note should be no longer than ${system_values.bookmark.note.max_length} characters.`
              }

              return (
                <Input
                  value={field.value}
                  on_change={(value) => {
                    if (!isSubmitting) {
                      field.onChange(value)
                    }
                  }}
                  message_type={error_message ? 'error' : undefined}
                  message={error_message}
                  lines={5}
                />
              )
            }}
          />
        </Box>
      </FormModal>
    </form>
  )
}
