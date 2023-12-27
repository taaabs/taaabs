import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { UpsertBookmark_UseCase } from '@repositories/modules/bookmarks/domain/usecases/upsert-bookmark.use-case'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { system_values } from '@shared/constants/system-values'
import { Ui } from '@web-ui'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

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
      onSubmit={(e) => {
        e.preventDefault()
        toast.promise(handleSubmit(on_submit), {
          pending: {
            render() {
              return 'Updading...'
            },
            icon: false,
          },
          success: {
            render() {
              return 'Bookmark has been updated'
            },
          },
          error: {
            render() {
              props.on_close()
              return 'Something went wrong... Try again later.'
            },
          },
        })
      }}
      onKeyDown={(e) => {
        if (e.code == 'Enter') {
          e.preventDefault()
        }
      }}
    >
      <Ui.App.Templates.FormModal
        slot_header={<Ui.App.Atoms.ModalHeader title="Edit bookmark" />}
        slot_footer={
          <Ui.App.Atoms.ModalFooter
            on_click_cancel={props.on_close}
            button_label="Save"
            is_disabled={isSubmitting || (isSubmitted && isSubmitSuccessful)}
          />
        }
      >
        <Ui.App.Atoms.Box>
          <Ui.App.Atoms.BoxHeading heading="Visibility" />
          <Controller
            name="is_public"
            control={control}
            defaultValue={props.bookmark?.is_public}
            render={({ field }) => {
              return (
                <Ui.App.Templates.FormRadio>
                  <Ui.App.Atoms.RadioSetting
                    top_line="Private"
                    bottom_line="All data is encrypted end-to-end"
                    on_click={() => {
                      field.onChange(false)
                    }}
                    is_checked={!field.value}
                  />
                  <Ui.App.Atoms.RadioSetting
                    top_line="Public"
                    bottom_line="Selected links and tags can remain private"
                    on_click={() => {
                      field.onChange(true)
                    }}
                    is_checked={field.value}
                  />
                </Ui.App.Templates.FormRadio>
              )
            }}
          />
        </Ui.App.Atoms.Box>
        <Ui.App.Atoms.Box>
          <Ui.App.Atoms.BoxHeading heading="Title" />
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
                <Ui.Common.Atoms.Input
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
        </Ui.App.Atoms.Box>
        <Ui.App.Atoms.Box>
          <Ui.App.Atoms.BoxHeading heading="Links" />
          <Controller
            name="is_public"
            control={control}
            defaultValue={props.bookmark?.is_public}
            render={({ field }) => {
              return (
                <Ui.App.Atoms.DraggableFormInputs
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
        </Ui.App.Atoms.Box>
        <Ui.App.Atoms.Box>
          <Ui.App.Atoms.BoxHeading heading="Tags" />
          <Controller
            name="is_public"
            control={control}
            defaultValue={props.bookmark?.is_public}
            render={({ field }) => {
              return (
                <Ui.App.Atoms.DraggableFormInputs
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
        </Ui.App.Atoms.Box>
        <Ui.App.Atoms.Box>
          <Ui.App.Atoms.BoxHeading heading="Note" />
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
                <Ui.Common.Atoms.Input
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
        </Ui.App.Atoms.Box>
      </Ui.App.Templates.FormModal>
    </form>
  )
}
