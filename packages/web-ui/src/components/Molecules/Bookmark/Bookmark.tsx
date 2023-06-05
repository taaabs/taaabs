import { sharedValues } from '@web-ui/constants'
import { Theme } from '@web-ui/styles/components/GlobalStyles'
import { mq, styles } from '@web-ui/styles/constants'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Icon } from '@web-ui/components/Atoms/Icon'

dayjs.extend(relativeTime)

export namespace BookmarkTypes {
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

export const Bookmark: React.FC<BookmarkTypes.Props> = (props) => {
  return (
    <_.container>
      <_.main>
        <div>
          <_.Main.title href={props.url} isStarred={props.isStarred}>
            {props.title}
          </_.Main.title>
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
          <Icon variant="THREE_DOTS" />
        </_.Action.menu>
        <_.Action.info>
          <Icon variant="INFO" />
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
  export const container = styled.div`
    display: grid;
    background-color: var(${Theme.BOOKMARK_BACKGROUND});
    border: var(${Theme.BORDER_SECONDARY});
    ${styles.transition[100]('border-color')}
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
      ${styles.borderRadius[10]}

      grid-template-columns: 1fr auto;
    }
    @media (hover: hover) {
      :hover {
        border-color: var(${Theme.BORDER_COLOR_PRIMARY});
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
      border-bottom: 1px solid var(${Theme.BORDER_COLOR_SECONDARY});
    }
  `
  export namespace Main {
    export const title = styled.a<{ isStarred?: boolean }>`
      display: inline;
      color: var(${Theme.BOOKMARK_LINK});
      ${styles.fontWeight.inter.medium}
      ${styles.fontSize[17].rem}
      ${({ isStarred }) =>
        isStarred &&
        css`
          background-color: var(${Theme.BOOKMARK_STARRED_TITLE_HIGHLIGHT});
        `}
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
      gap: ${sharedValues.distance[7]}px;
    `
    export namespace SiteAndTags {
      const common = css`
        ${styles.fontSize[13].px}
      `
      export const site = styled.button`
        ${common}
        color: var(${Theme.BOOKMARK_SITE_FOREGROUND});
        ${styles.fontWeight.inter.medium}
        @media (hover: hover) {
          :hover {
            text-decoration: underline;
          }
        }
      `
      export const tag = styled.button`
        ${common}
        color: var(${Theme.BOOKMARK_TAG_FOREGROUND});
        background-color: var(${Theme.BOOKMARK_TAG_BACKGROUND});
        ${styles.borderRadius[4]}
        border: 1px solid var(${Theme.BOOKMARK_TAG_BORDER_COLOR});
        padding-right: ${sharedValues.distance[4]}px;
        padding-left: ${sharedValues.distance[4]}px;
        ${styles.fontFamily.interTight}
        @media (hover: hover) {
          :hover {
            border-color: var(${Theme.BOOKMARK_TAG_BORDER_COLOR_HOVER});
            background-color: var(${Theme.BOOKMARK_TAG_BACKGROUND_HOVER});
            color: var(${Theme.BOOKMARK_TAG_FOREGROUND_HOVER});
          }
        }
      `
    }
    export const description = styled.div`
      color: var(${Theme.COLOR_TEXT_VARIANT});
      ${styles.fontSize[15].rem}
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
      ${styles.buttonSize[34]}
      > div > svg {
        ${styles.iconSize[18]}
        fill: var(${Theme.BOOKMARK_ACTION_FILL});
        ${styles.transition[100]('fill')};
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
    ${styles.fontSize[13].px}
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
      ${styles.fontWeight.inter.semiBold};
      color: var(${Theme.BOOKMARK_NSFW});
      transform: scale(0.85);
      position: relative;
      ::before {
        content: '';
        border: 1px solid var(${Theme.BOOKMARK_NSFW});
        ${styles.borderRadius[4]}
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
