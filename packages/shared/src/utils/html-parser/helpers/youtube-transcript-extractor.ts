import { ReaderData } from '../reader-data'

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

  public async get_transcript(): Promise<{
    plain_text: string
    reader_data: ReaderData.Transcript
  }> {
    try {
      const video_page_html_text = await this._fetch_video_page_html_text()
      const title = this._extract_title(video_page_html_text)
      const duration = this._extract_duration_from_html(video_page_html_text)
      const captions_data = this._extract_captions_data(video_page_html_text)
      const caption_url = this._find_caption_url(captions_data)
      const caption_track = await this._fetch_caption_track(caption_url)
      const transcript =
        this._extract_transcript_from_caption_track(caption_track)

      const reader_data: ReaderData.Transcript = {
        type: ReaderData.ContentType.TRANSCRIPT,
        title,
        duration,
        transcript,
      }

      const plain_text = this._generate_plain_text_with_timestamps(
        title,
        transcript,
      )

      return {
        plain_text,
        reader_data,
      }
    } catch (error) {
      console.error('Error fetching transcript:', error)
      throw error
    }
  }

  private _format_timestamp(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remaining_seconds = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}:${minutes
        .toString()
        .padStart(2, '0')}:${remaining_seconds.toString().padStart(2, '0')}`
    } else {
      return `${minutes}:${remaining_seconds.toString().padStart(2, '0')}`
    }
  }

  private async _fetch_video_page_html_text(): Promise<string> {
    const response = await fetch(this._video_url)
    if (!response.ok) {
      throw new Error(`Failed to fetch video page: ${response.statusText}`)
    }
    return await response.text()
  }

  private _extract_title(text: string): string {
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

  private _extract_transcript_from_caption_track(
    xml_string: string,
  ): ReaderData.Transcript['transcript'] {
    const regex = /<text start="([^"]+)" dur="([^"]+)"[^>]*>([^<]*)<\/text>/g
    let match
    let transcript: ReaderData.Transcript['transcript'] = []

    while ((match = regex.exec(xml_string)) !== null) {
      const start = parseFloat(match[1])
      const duration = parseFloat(match[2])
      const text = match[3]
        .trim()
        .replace(/&amp;#39;/g, "'")
        .replace(/&amp;quot;/g, '"')
        .replace(/&amp;amp;/g, '&')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')

      transcript.push({
        start,
        duration,
        text,
      })
    }

    return transcript
  }

  private _generate_plain_text_with_timestamps(
    title: string,
    transcript: ReaderData.Transcript['transcript'],
  ): string {
    let plain_text = `# ${title}\n\n`
    let last_timestamp = -30 // Initialize to -30 to ensure the first timestamp is shown

    for (const item of transcript) {
      if (item.start - last_timestamp >= 25) {
        // 25 seconds threshold for readability
        if (plain_text !== `# ${title}\n\n`) {
          plain_text += '\n'
        }
        plain_text += `<TIMESTAMP>[${this._format_timestamp(
          item.start,
        )}]<TIMESTAMP>\n`
        last_timestamp = item.start
      }
      plain_text += `${item.text} `
    }

    return plain_text.trim().replace(/<TIMESTAMP>/g, '\n')
  }

  private _extract_duration_from_html(html_content: string): number {
    const duration_match = html_content.match(
      /<meta itemprop="duration" content="([^"]+)">/,
    )
    if (duration_match && duration_match[1]) {
      const duration_str = duration_match[1]
      return this._parse_iso8601_duration(duration_str)
    }
    return 0
  }

  private _parse_iso8601_duration(duration: string): number {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    let hours = 0
    let minutes = 0
    let seconds = 0

    if (match) {
      if (match[1]) hours = parseInt(match[1].slice(0, -1))
      if (match[2]) minutes = parseInt(match[2].slice(0, -1))
      if (match[3]) seconds = parseInt(match[3].slice(0, -1))
    }

    return hours * 3600 + minutes * 60 + seconds
  }
}
