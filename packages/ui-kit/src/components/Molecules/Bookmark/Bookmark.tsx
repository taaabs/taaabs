import { mq, s } from '@/styles/constants'
import styled from '@emotion/styled'

export namespace Bookmark {
  export type Visibility = 'public' | 'private' | 'encrypted'
  export type AddedFormat = 'date' | 'timeAgo'
  export type Props = {
    isStarred: boolean
    visibility: Visibility
    page: {
      title: string
      description?: string
      sitePath?: string
      url: string
    }
    added: Date
    addedFormat: AddedFormat
    infoBar: {
      showNSFW: boolean
      showVisibility: boolean
      showArchived: boolean
    }
  }
}

export const Bookmark: React.FC<Bookmark.Props> = (props) => {
  return <$.container>x</$.container>
}

namespace $ {
  export const container = styled.div`
    ${s.borderRadius[10]}
    display: grid;
    grid-template-areas:
      'text text'
      'info actions';
    ${mq.at992} {
      grid-template-areas:
        'text actions'
        'info actions';
    }
  `
  export const text = styled.div`
    grid-area: 'text';
  `
  export const actions = styled.div`
    grid-area: 'actions';
  `
  export const info = styled.div`
    grid-area: 'info';
  `
}
