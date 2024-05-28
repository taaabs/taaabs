import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './bookmarklet.module.scss'

type Props = {
  text: string
  subtext: string
  button_label: string
}

// Copy first line from web-client/misc/bookmarklet.js
const script = `javascript:(async function () {
  const get_og_image_url=()=>{const meta_tags=document.getElementsByTagName('meta');for(let i=0;i<meta_tags.length;i++){if(meta_tags[i].getAttribute('property')=='og:image'){return meta_tags[i].getAttribute('content')}}};const get_favicon_url=()=>{const link_tags=document.getElementsByTagName('link');const favicon_rels=['icon','shortcut icon','apple-touch-icon'];for(let i=0;i<link_tags.length;i++){if(favicon_rels.includes(link_tags[i].getAttribute('rel'))){return link_tags[i].getAttribute('href')}}return new URL(window.location.href).origin+'/favicon.ico'};const get_base64_of_image_url=async(url,width,height)=>{const img=document.createElement('img');img.src=url;img.setAttribute('crossorigin','anonymous');await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error('Image not found'))});const canvas=document.createElement('canvas');canvas.width=width||img.width;canvas.height=height||img.height;const ctx=canvas.getContext('2d');if(width&&height){ctx.drawImage(img,0,0,width,height)}else{ctx.drawImage(img,0,0)}return canvas.toDataURL('image/webp')};const og_image_url=get_og_image_url();let og_image=undefined;if(og_image_url){try{og_image=await get_base64_of_image_url(og_image_url)}catch{}}let favicon=undefined;try{favicon=await get_base64_of_image_url(get_favicon_url(),32,32)}catch{};const html=document.querySelector('html').innerHTML;navigator.clipboard.writeText(JSON.stringify({favicon,og_image,html}));
  window.open(
    'https://taaabs.com/library#url=' +
      encodeURIComponent(document.location) +
      '&title=' +
      encodeURIComponent(document.title) +
      '&description=' +
      (document.querySelector("meta[name='description']") != null
        ? document.querySelector("meta[name='description']").content
        : '')
  )
})()`

export const Bookmarklet: React.FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <div
          className={styles.heading__text}
          dangerouslySetInnerHTML={{ __html: props.text }}
        />
        <div className={styles.heading__subtext}>{props.subtext}</div>
      </div>
      <div className={styles.button}>
        <div
          dangerouslySetInnerHTML={{
            __html: `<a href='${script.replaceAll(
              "'",
              '%27',
            )}' target='_blank' onclick="event.preventDefault();">${
              props.button_label
            }</a>`,
          }}
        />
        <Icon variant="LOGO" />
      </div>
    </div>
  )
}
