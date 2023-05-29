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
  export type Visibility = 'unlisted' | 'secret'
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
    <_.container isStarred={props.isStarred}>
      <_.main isStarred={props.isStarred}>
        <div>
          <_.Main.title href={props.url}>{props.title}</_.Main.title>
        </div>
        <_.Main.siteAndTags>
          <_.Main.SiteAndTags.site onClick={() => {}}>
            example.com
          </_.Main.SiteAndTags.site>
          {props.tags.map((tag) => (
            <_.Main.SiteAndTags.tag onClick={() => {}}>
              {tag}
            </_.Main.SiteAndTags.tag>
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
        <_.Action.info>
          <Ui.Atoms.Icon variant="INFO" />
        </_.Action.info>
      </_.actions>
      <_.info>
        <_.Info.dimmedText>
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
              {props.visibility == 'unlisted' && 'Unlisted'}
              {props.visibility == 'secret' && 'Secret'}
            </_.Info.dimmedText>
          </>
        )}
      </_.info>
    </_.container>
  )
}

namespace _ {
  export const container = styled.div<{ isStarred?: boolean }>`
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
    row-gap: ${sharedValues.distance[3]}px;
    padding-top: ${sharedValues.distance[12]}px;
    padding-left: ${sharedValues.distance[16]}px;
    ${mq.to992} {
      padding-right: ${sharedValues.distance[16]}px;
    }
    ${mq.to992} {
      padding-bottom: ${sharedValues.distance[8]}px;
      border-bottom: 1px solid var(${Theme.COLOR_BORDER_SECONDARY});
      ${({ isStarred }) =>
        isStarred &&
        css`
          border-bottom-color: var(${Theme.BOOKMARK_STARRED_BORDER});
        `}
    }
  `
  export namespace Main {
    export const title = styled.a`
      display: inline-flex;
      color: var(${Theme.BOOKMARK_LINK});
      ${s.fontWeight.inter.medium}
      ${s.fontSize[17].rem}
      margin-bottom: -0.2rem;
      @media (hover: hover) {
        :hover {
          text-decoration: underline;
        }
      }
    `
    export const siteAndTags = styled.div`
      ${mq.to992} {
        padding-right: ${sharedValues.distance[16]}px;
      }
      display: flex;
      flex-wrap: wrap;
      > button {
        @media (hover: hover) {
          :hover {
            text-decoration: underline;
          }
        }
      }
    `
    export namespace SiteAndTags {
      const padding = css`
        padding: 0.25rem 0;
      `
      export const site = styled.button`
        ${padding}
        margin-right: ${sharedValues.distance[10] / 10}rem;
        color: var(${Theme.BOOKMARK_SITE});
      `
      export const tag = styled.button`
        ${padding}
        color: var(${Theme.BOOKMARK_TAG});
        padding-right: ${sharedValues.distance[5] / 10}rem;
      `
    }
    export const description = styled.div`
      color: var(${Theme.COLOR_TEXT_VARIANT});
      ${s.fontSize[15].rem}
      ${mq.to992} {
        padding-right: ${sharedValues.distance[16]}px;
      }
    `
  }
  export const actions = styled.div`
    grid-area: actions;
    display: flex;
    ${mq.to992} {
      margin-right: ${sharedValues.distance[5]}px;
    }
    ${mq.at992} {
      flex-direction: column;
      justify-content: space-between;
      margin: ${sharedValues.distance[6]}px 0 ${sharedValues.distance[3]}px 0;
    }
  `
  export namespace Action {
    const common = css`
      display: flex;
      align-items: center;
      justify-content: center;
      ${s.buttonSize[34]}
      > div > svg {
        ${s.iconSize[18]}
        fill: var(${Theme.BOOKMARK_ACTION_FILL});
        ${s.transition[150]('fill')};
      }
      @media (hover: hover) {
        :hover > div > svg {
          fill: var(${Theme.BOOKMARK_ACTION_FILL_HOVER});
        }
      }
    `
    export const menu = styled.button`
      ${common}
    `
    export const info = styled.button`
      ${common}
      ${mq.to992} {
        order: -1;
      }
    `
  }
  export const info = styled.div`
    grid-area: info;
    padding-left: ${sharedValues.distance[16]}px;
    display: flex;
    align-items: center;
    ${s.fontSize[13].rem}
    ${mq.at992} {
      padding-top: ${sharedValues.distance[5]}px;
      padding-bottom: ${sharedValues.distance[10]}px;
    }
  `
  export namespace Info {
    export const separator = styled.div`
      padding: 0 ${sharedValues.distance[5]}px;
      color: var(${Theme.COLOR_TEXT_DIMMED});
    `
    export const dimmedText = styled.div`
      color: var(${Theme.COLOR_TEXT_DIMMED});
    `
    export const nsfw = styled.div`
      ${s.fontWeight.inter.semiBold};
      color: var(${Theme.BOOKMARK_NSFW});
      transform: scale(0.85);
      position: relative;
      ::before {
        content: '';
        border: 1px solid var(${Theme.BOOKMARK_NSFW});
        ${s.borderRadius[4]}
        position: absolute;
        width: 120%;
        height: 115%;
        top: 0;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-53%);
      }
    `
  }
}
