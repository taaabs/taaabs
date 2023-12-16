import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { UpsertBookmark_UseCase } from '@repositories/modules/bookmarks/domain/usecases/upsert-bookmark.use-case'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { Box } from '@web-ui/components/app/atoms/box'
import { BoxHeading } from '@web-ui/components/app/atoms/box-heading'
import { DraggableFormInputs } from '@web-ui/components/app/atoms/draggable-form-inputs'
import { ModalFooter } from '@web-ui/components/app/atoms/modal-footer'
import { ModalHeader } from '@web-ui/components/app/atoms/modal-header'
import { Form } from '@web-ui/components/app/templates/form'
import { Input } from '@web-ui/components/common/atoms/input'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

type FormValues = {
  title: string
  links: string[]
  tags: string[]
  note: string
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
    formState: { errors, isSubmitting, isSubmitted },
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
        is_public: link.is_public,
      })),
      tags: tags.map((tag) => ({ name: tag.name, is_public: tag.is_public })),
    })
    if (props.bookmark) {
      props.on_submit(bookmark)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(on_submit)}
      onKeyDown={(e) => {
        if (e.code == 'Enter') {
          e.preventDefault()
        }
      }}
    >
      <Form
        slot_header={<ModalHeader title="Edit bookmark" />}
        slot_footer={
          <ModalFooter
            on_click_cancel={props.on_close}
            button_label="Save"
            is_disabled={isSubmitting || isSubmitted}
          />
        }
      >
        <Box>
          <BoxHeading heading="Links" />
          <DraggableFormInputs
            items={links.map((el) => ({
              value: el.url,
              is_public: el.is_public,
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
          />
        </Box>
        <Box>
          <BoxHeading heading="Title" />
          <Controller
            name="title"
            control={control}
            defaultValue={props.bookmark?.title}
            rules={{
              required: true,
            }}
            render={({ field }) => {
              let error_message: string | undefined

              if (errors.title?.type == 'required') {
                error_message = 'Bookmark title must be set'
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
                />
              )
            }}
          />
        </Box>
        <Box>
          <BoxHeading heading="Tags" />
          <DraggableFormInputs
            items={tags.map((tag) => ({
              value: tag.name,
              is_public: tag.is_public,
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
          />
        </Box>
        <Box>
          <BoxHeading heading="Note" />
          <Controller
            name="note"
            control={control}
            defaultValue={props.bookmark?.note}
            render={({ field }) => {
              return (
                <Input
                  value={field.value}
                  on_change={(value) => {
                    if (!isSubmitting) {
                      field.onChange(value)
                    }
                  }}
                />
              )
            }}
          />
        </Box>
      </Form>
    </form>
  )
}
