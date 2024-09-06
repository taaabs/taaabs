type CaptionTrack = {
  vssId: string
  baseUrl: string
}

type CaptionsData = {
  captionTracks: CaptionTrack[]
}

export class YouTubeTranscriptExtractor {
  private _video_url: string

  constructor(video_url: string) {
    const url_obj = new URL(video_url)
    const url_params = new URLSearchParams(url_obj.search)
    const video_id = url_params.get('v') || ''

    if (!video_id) {
      throw new Error('Video ID not found in the URL.')
    }

    this._video_url = `https://www.youtube.com/watch?v=${video_id}`
  }

  public async get_transcript_plain_text(): Promise<string> {
    try {
      const video_page_text = await this._fetch_video_page()
      const video_title = this._extract_video_title(video_page_text)
      const captions_data = this._extract_captions_data(video_page_text)
      const caption_url = this._find_caption_url(captions_data)
      const caption_text = await this._fetch_caption_track(caption_url)
      const transcript =
        this._extract_plain_text_from_transcript_xml(caption_text)

      return `# ${video_title}\n\n${transcript}`
    } catch (error) {
      console.error('Error fetching transcript:', error)
      return ''
    }
  }

  private async _fetch_video_page(): Promise<string> {
    const response = await fetch(this._video_url)
    if (!response.ok) {
      throw new Error(`Failed to fetch video page: ${response.statusText}`)
    }
    return await response.text()
  }

  private _extract_video_title(text: string): string {
    const title_match = text.match(/<meta itemprop="name" content="([^"]+)">/)
    if (!title_match || title_match.length < 2) {
      throw new Error('Video title not found.')
    }
    return title_match[1].replace(/&#39;/g, "'")
  }

  private _extract_captions_data(text: string): CaptionsData {
    const captions_match = text.match(/\"captions\"\:([\s\S]+?)\,"videoDetails/)
    if (!captions_match || captions_match.length < 2) {
      throw new Error('Captions data not found.')
    }
    const captions_json_string = captions_match[1].replace('\n', '')
    return JSON.parse(captions_json_string)?.playerCaptionsTracklistRenderer
  }

  private _find_caption_url(captions_data: CaptionsData): string {
    if (!captions_data) {
      throw new Error('Failed to parse captions data.')
    }
    let caption_track = captions_data.captionTracks?.find(
      (caption_track: CaptionTrack) => caption_track.vssId.startsWith('.en'),
    )
    if (!caption_track) {
      caption_track = captions_data.captionTracks?.find(
        (caption_track: CaptionTrack) => caption_track.vssId.startsWith('a.'),
      )
    }
    if (!caption_track) {
      throw new Error('No caption tracks found.')
    }

    return caption_track.baseUrl
  }

  private async _fetch_caption_track(url: string): Promise<string> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch caption track: ${response.statusText}`)
    }
    return await response.text()
  }

  private _extract_plain_text_from_transcript_xml(xml_string: string): string {
    const regex = /<text start="([^"]+)"[^>]*>([^<]*)<\/text>/g
    let match
    let extracted_text = ''
    let last_minute = -1
    let last_hour = -1
    let last_time = 0
    let current_line = ''

    while ((match = regex.exec(xml_string)) !== null) {
      const start_time = parseFloat(match[1])
      const text = match[2]
        .trim()
        .replace(/&amp;#39;/g, "'")
        .replace(/&amp;quot;/g, '"')
        .replace(/&amp;amp;/g, '"')

      const current_hour = Math.floor(start_time / 3600)
      const current_minute = Math.floor((start_time % 3600) / 60)
      const current_second = Math.floor(start_time % 60)

      // Insert timestamp only if it's a new minute
      if (
        current_hour > last_hour ||
        (current_hour == last_hour && current_minute > last_minute)
      ) {
        if (current_line.trim()) {
          extracted_text += current_line.trim()
        }
        extracted_text += `<TIMESTAMP>[${current_hour}:${current_minute
          .toString()
          .padStart(2, '0')}:${current_second
          .toString()
          .padStart(2, '0')}]<TIMESTAMP>`
        current_line = ''
        last_hour = current_hour
        last_minute = current_minute
      }

      current_line += `${text} `
      last_time = start_time
    }

    // Add any remaining text
    if (current_line.trim()) {
      extracted_text += current_line.trim()
    }

    return extracted_text
      .trim()
      .replace(/\n/g, ' ')
      .replace(/<TIMESTAMP>/g, '\n')
  }
}
