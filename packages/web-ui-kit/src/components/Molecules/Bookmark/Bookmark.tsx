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
  export type Visibility = 'private' | 'encrypted'
  export type Props = {
    title: string
    description?: string
    sitePath?: string
    url: string
    createdAt: Date
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
      <_.main isStarred={props.isStarred}>
        <_.Main.title>
          <span>{props.title}</span>
        </_.Main.title>
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
      <_.actions>
        <_.Action.menu>
          <Ui.Atoms.Icon variant="THREE_DOTS" />
        </_.Action.menu>
        <_.Action.quickAction>
          <Ui.Atoms.Icon variant="STAR" />
        </_.Action.quickAction>
      </_.actions>
      <_.info>
        <_.Info.dimmedText style={{ whiteSpace: 'nowrap' }}>
          {dayjs(props.createdAt).fromNow()}
        </_.Info.dimmedText>
        {props.isNSFW && (
          <>
            <_.Info.separator>·</_.Info.separator>
            <_.Info.nsfw>NSFW</_.Info.nsfw>
          </>
        )}
        {props.visibility && (
          <>
            <_.Info.separator>·</_.Info.separator>
            <_.Info.dimmedText>
              {props.visibility == 'private' && 'Private'}
              {props.visibility == 'encrypted' && 'Encrypted'}
            </_.Info.dimmedText>
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
        ${({ isStarred }) =>
          isStarred &&
          css`
            border-color: var(${Theme.BOOKMARK_STARRED_BORDER_HOVER});
          `}
      }
    }
  `
  export const main = styled.div<{ isStarred?: boolean }>`
    grid-area: main;
    display: flex;
    flex-direction: column;
    row-gap: ${sharedValues.spacer[14] / 10}rem;
    ${mq.to992} {
      padding-bottom: ${sharedValues.spacer[14]}px;
      border-bottom: 1px solid var(${Theme.COLOR_BORDER_SECONDARY});
      ${({ isStarred }) =>
        isStarred &&
        css`
          border-bottom-color: var(${Theme.BOOKMARK_STARRED_BORDER});
        `}
    }
  `
  export namespace Main {
    export const title = styled.div`
      display: flex;
      color: var(${Theme.BOOKMARK_LINK});
      ${s.fontWeight.inter.medium}
      padding-top: ${sharedValues.spacer[16]}px;
      padding-left: ${sharedValues.spacer[16]}px;
      ${mq.to992} {
        padding-right: ${sharedValues.spacer[16]}px;
      }
      > span {
        ${s.capsize.inter17}
        ${s.fontSize[17].rem}
        @media (hover: hover) {
          :hover {
            text-decoration: underline;
          }
        }
      }
    `
    export const siteAndTags = styled.div`
      padding-left: ${sharedValues.spacer[16]}px;
      ${mq.to992} {
        padding-right: ${sharedValues.spacer[16]}px;
      }
      ${s.capsize.inter15};
      ${s.fontSize[15].rem}
      > div {
        display: inline-block;
      }
    `
    export namespace SiteAndTags {
      export const site = styled.div`
        margin-right: ${sharedValues.spacer[10] / 10}rem;
        color: var(${Theme.BOOKMARK_SITE});
      `
      export const tag = styled.div`
        color: var(${Theme.BOOKMARK_TAG});
        padding-right: ${sharedValues.spacer[5] / 10}rem;
      `
    }
    export const description = styled.div`
      padding-left: ${sharedValues.spacer[16]}px;
      color: var(${Theme.COLOR_TEXT_VARIANT});
      ${s.capsize.inter15}
      ${s.fontSize[15].rem}
      ${mq.to992} {
        padding-right: ${sharedValues.spacer[16]}px;
      }
    `
  }
  export const actions = styled.div`
    grid-area: actions;
    display: flex;
    ${mq.to992} {
      margin-right: ${sharedValues.spacer[5]};
    }
    ${mq.at992} {
      flex-direction: column;
    }
  `
  export namespace Action {
    const common = css`
      display: flex;
      align-items: center;
      justify-content: center;
      ${mq.to992} {
        ${s.buttonSize[40]}
      }
      ${mq.at992} {
        ${s.buttonSize[34]}
      }
      > div > svg {
        height: 18px;
        fill: var(${Theme.BOOKMARK_ACTION_FILL});
        ${s.transition[150]('fill')};
      }
      @media (hover: hover) {
        :hover > div > svg {
          fill: var(${Theme.COLOR_BLACK});
        }
      }
    `
    export const menu = styled.button`
      ${common}
      ${mq.at992} {
        margin-top: 5px;
      }
    `
    export const quickAction = styled.button`
      ${common}
      ${mq.to992} {
        order: -1;
      }
    `
  }
  export const info = styled.div`
    grid-area: info;
    padding-left: ${sharedValues.spacer[16]}px;
    display: flex;
    align-items: center;
    ${mq.at992} {
      padding-top: ${sharedValues.spacer[14] / 10}rem;
      padding-bottom: ${sharedValues.spacer[14]}px;
    }
    > div {
      ${s.capsize.inter13}
      ${s.fontSize[13].rem}
    }
  `
  export namespace Info {
    export const separator = styled.div`
      padding: 0 ${sharedValues.spacer[5]}px;
      color: var(${Theme.COLOR_TEXT_DIMMED});
    `
    export const dimmedText = styled.div`
      color: var(${Theme.COLOR_TEXT_DIMMED});
    `
    export const nsfw = styled.div`
      ${s.borderRadius[4]}
      ${s.fontWeight.inter.semiBold}
      color: var(${Theme.BOOKMARK_NSFW}) !important;
      position: relative;
      transform: scale(0.85);
      ::before {
        padding: 0.5rem 0.4rem;
        border: 1px solid var(${Theme.BOOKMARK_NSFW});
        ${s.borderRadius[4]}
        box-sizing: content-box;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
      }
    `
  }
}
