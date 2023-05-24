import { sharedValues } from '@/constants'
import { Ui } from '@/index'
import { Theme } from '@/styles/components/GlobalStyles'
import { mq, s } from '@/styles/constants'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export namespace Bookmark {
  export type Visibility = 'public' | 'private' | 'encrypted'
  export type AddedFormat = 'date' | 'timeAgo'
  export type Props = {
    title: string
    description?: string
    sitePath?: string
    url: string
    added: Date
    addedFormat: AddedFormat
    visibility?: Visibility
    isNSFW?: boolean
    isArchived?: boolean
    isStarred?: boolean
    tags: string[]
  }
}

export const Bookmark: React.FC<Bookmark.Props> = (props) => {
  return (
    <_.container href={props.url} isStarred={props.isStarred}>
      <_.main>
        <_.Main.title>{props.title}</_.Main.title>
        <_.Main.siteAndTags>
          <_.Main.SiteAndTags.site>example.com</_.Main.SiteAndTags.site>
          {props.tags.map((tag) => (
            <_.Main.SiteAndTags.tag>{tag}</_.Main.SiteAndTags.tag>
          ))}
        </_.Main.siteAndTags>
        {props.description && (
          <_.Main.description>{props.description}</_.Main.description>
        )}
      </_.main>
      <_.action>
        <_.Action.button>
          <Ui.Atoms.Icon variant="THREE_DOTS" />
        </_.Action.button>
      </_.action>
      <_.info>
        <_.Info.dimmedText>{dayjs(props.added).fromNow()}</_.Info.dimmedText>
        {props.isNSFW && (
          <>
            <_.Info.separator />
            <_.Info.nsfw>NSFW</_.Info.nsfw>
          </>
        )}
        {props.visibility && (
          <>
            <_.Info.separator />
            <_.Info.dimmedText>
              {props.visibility == 'public' && 'Public'}
              {props.visibility == 'private' && 'Private'}
              {props.visibility == 'encrypted' && 'Encrypted'}
            </_.Info.dimmedText>
          </>
        )}
        {props.isArchived && (
          <>
            <_.Info.separator />
            <_.Info.dimmedText>Archived</_.Info.dimmedText>
          </>
        )}
      </_.info>
    </_.container>
  )
}

namespace _ {
  export const container = styled.a<{ isStarred?: boolean }>`
    display: grid;
    background-color: var(${Theme.BOOKMARK_BACKGROUND});
    border: var(${Theme.BORDER_SECONDARY});
    padding-left: ${sharedValues.spacer[16]}px;

    ${({ isStarred }) =>
      isStarred &&
      css`
        background-color: var(${Theme.BOOKMARK_STARRED_BACKGROUND});
        border-color: var(${Theme.BOOKMARK_STARRED_BORDER});
      `}
    ${mq.to992} {
      grid-template-areas:
        'main main'
        'info actions';
      border-left-width: 0px;
      border-right-width: 0px;
      grid-template-columns: 1fr auto;
    }
    ${mq.at992} {
      grid-template-areas:
        'main actions'
        'info actions';
      ${s.borderRadius[10]}
      ${s.transition[150]('border-color')}
      grid-template-columns: 1fr auto;
    }
    @media (hover: hover) {
      :hover {
        border-color: var(${Theme.COLOR_BORDER_PRIMARY});
      }
    }
  `
  export const main = styled.div`
    grid-area: main;
    display: flex;
    flex-direction: column;
    row-gap: ${sharedValues.spacer[12]}px;
  `
  export namespace Main {
    export const title = styled.div`
      display: flex;
      color: var(${Theme.BOOKMARK_LINK});
      ${s.fontSize[17].rem}
      ${s.fontWeight.inter.medium}
      padding-top: ${sharedValues.spacer[16]}px;
      ${mq.to992} {
        padding-right: ${sharedValues.spacer[16]}px;
      }
      margin: -0.3em 0;
      @media (hover: hover) {
        :hover {
          text-decoration: underline;
        }
      }
    `
    export const siteAndTags = styled.div`
      display: flex;
      flex-wrap: wrap;
      column-gap: ${sharedValues.spacer[10]}px;
      ${mq.to992} {
        padding-right: ${sharedValues.spacer[16]}px;
      }
      > div {
        margin: -0.3em 0;
      }
    `
    export namespace SiteAndTags {
      export const site = styled.div`
        display: flex;
        align-items: center;
        margin-right: ${sharedValues.spacer[5]}px;
        color: var(${Theme.BOOKMARK_SITE});
      `
      export const tag = styled.div`
        display: flex;
        align-items: center;
        color: var(${Theme.BOOKMARK_TAG});
      `
    }
    export const description = styled.div`
      color: var(${Theme.COLOR_TEXT_VARIANT});
      margin: -0.3em 0;
      ${mq.to992} {
        padding-right: ${sharedValues.spacer[16]}px;
      }
    `
  }
  export const action = styled.div`
    grid-area: actions;
    display: flex;
    ${mq.at992} {
      flex-direction: column;
    }
  `
  export namespace Action {
    export const button = styled.button`
      display: flex;
      align-items: center;
      justify-content: center;
      ${mq.to992} {
        ${s.buttonHeight[40]}
        padding: 0 ${sharedValues.spacer[16]}px;
      }
      ${mq.at992} {
        padding: ${sharedValues.spacer[16]}px;
      }
      > div > svg {
        height: 15px;
        fill: var(${Theme.COLOR_TEXT_DIMMED});
        ${s.transition[150]('fill')}
      }
      @media (hover: hover) {
        :hover > div > svg {
          fill: var(${Theme.COLOR_BLACK});
        }
      }
    `
  }
  export const info = styled.div`
    grid-area: info;
    display: flex;
    align-items: center;
    ${mq.at992} {
      padding-top: ${sharedValues.spacer[12]}px;
      padding-bottom: ${sharedValues.spacer[12]}px;
    }
    > div {
      margin: -0.3em 0;
    }
  `
  export namespace Info {
    export const separator = styled.div`
      padding: 0 ${sharedValues.spacer[5]}px;
      ::after {
        content: '·';
        color: var(${Theme.COLOR_TEXT_DIMMED});
      }
    `
    export const dimmedText = styled.div`
      ${s.fontSize[13].rem}
      color: var(${Theme.COLOR_TEXT_DIMMED});
    `
    export const nsfw = styled.div`
      font-size: 1rem;
      ${s.borderRadius[4]}
      ${s.fontWeight.inter.semiBold}
      border: 1px solid var(${Theme.BOOKMARK_NSFW});
      color: var(${Theme.BOOKMARK_NSFW}) !important;
      padding: 0px 4px;
    `
  }
}
