export const get_youtube_transcript_plain_text = async (
  video_id: string,
): Promise<string> => {
  const video_page_url = `https://www.youtube.com/watch?v=${video_id}`

  try {
    // Fetch the video page
    const response = await fetch(video_page_url)
    if (!response.ok) {
      throw new Error(`Failed to fetch video page: ${response.statusText}`)
    }

    const text = await response.text()

    // Extract the captions JSON string using a regular expression
    const captions_match = text.match(/\"captions\"\:([\s\S]+?)\,"videoDetails/)
    if (!captions_match || captions_match.length < 2) {
      throw new Error('Captions data not found in the video page.')
    }

    const captions_json_string = captions_match[1].replace('\n', '')
    const captions_data =
      JSON.parse(captions_json_string)?.playerCaptionsTracklistRenderer
    if (!captions_data) {
      throw new Error('Failed to parse captions data.')
    }

    // Find the base URL of the second caption track
    console.log('Caption tracks:', captions_data.captionTracks)
    let caption_track: any = undefined
    caption_track = captions_data.captionTracks?.find((caption_track: any) =>
      caption_track.vssId.startsWith('.en'),
    )
    if (!caption_track) {
      captions_data.captionTracks?.find((caption_track: any) =>
        caption_track.vssId.startsWith('a.'),
      )
    }
    if (!caption_track) {
      throw new Error('No caption tracks found.')
    }

    const caption_url = caption_track.baseUrl

    // Fetch the caption track data
    const caption_response = await fetch(caption_url)
    if (!caption_response.ok) {
      throw new Error(
        `Failed to fetch caption track: ${caption_response.statusText}`,
      )
    }

    const caption_text = await caption_response.text()

    const extract_plain_text_from_transcript_xml = (xml_string: string) => {
      const regex = /<text[^>]*>([^<]*)<\/text>/g
      let match
      let extracted_text = ''

      while ((match = regex.exec(xml_string)) !== null) {
        extracted_text +=
          match[1]
            .trim()
            .replace(/&amp;#39;/g, "'")
            .replace(/&amp;quot;/g, '"') + '\n'
      }

      return extracted_text.replace(/\n/g, ' ')
    }

    return extract_plain_text_from_transcript_xml(caption_text)
  } catch (error) {
    console.error('Error fetching transcript:', error)
    return ''
  }
}
