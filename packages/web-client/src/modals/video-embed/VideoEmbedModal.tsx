import { Dictionary } from '@/dictionaries/dictionary'
import { VideoModal as Ui_modals_VideoModal } from '@web-ui/components/modals/VideoModal'

namespace VideoEmbedModal {
  export type Props = {
    url: string
    on_close: () => void
    dictionary: Dictionary
  }
}

export const VideoEmbedModal: React.FC<VideoEmbedModal.Props> = (props) => {
  const get_embed_url = (url: string): string => {
    // https://www.youtube.com/watch?v=dQw4w9WgXcQ to https://www.youtube.com/embed/dQw4w9WgXcQ
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const video_id = url.split('v=')[1]?.split('&')[0] || url.split('be/')[1]
      return `https://www.youtube.com/embed/${video_id}`
    }
    // https://www.pornhub.com/view_video.php?viewkey=ph6354d6f77e219 to https://www.pornhub.com/embed/ph6354d6f77e219
    else if (url.includes('pornhub.com')) {
      const video_id = url.split('viewkey=')[1]?.split('&')[0]
      return `https://www.pornhub.com/embed/${video_id}`
    }
    // https://www.twitch.tv/videos/1630899383 to https://player.twitch.tv/?video=1630899383&parent=www.example.com
    else if (url.includes('twitch.tv')) {
      const video_id = url.split('videos/')[1]?.split('&')[0]
      return `https://player.twitch.tv/?video=${video_id}&parent=${window.location.hostname}`
    }

    console.error('Unsupported video platform')
    throw new Error()
  }

  const embed_url = get_embed_url(props.url)

  return (
    <Ui_modals_VideoModal
      on_close={props.on_close}
      embed_url={embed_url}
    />
  )
}