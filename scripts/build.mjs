import {cp, mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const source=root;
const output=path.join(root,'_site');
const siteUrl='https://shysssiee.github.io/SKINZ_Subtitle_Archive';
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
for(const name of ['index.html','assets','data']){
  await cp(path.join(source,name),path.join(output,name),{recursive:true});
}
const template=await readFile(path.join(source,'index.html'),'utf8');
const videos=JSON.parse(await readFile(path.join(source,'data/videos.json'),'utf8'));
for(const video of videos){
  const folder=path.join(output,'video',encodeURIComponent(video.id));
  await mkdir(folder,{recursive:true});
  const pageUrl=`${siteUrl}/video/${encodeURIComponent(video.id)}/`;
  const image=video.thumbnailUrl||(video.youtubeId?`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`:`${siteUrl}/assets/bstage-placeholder.svg`);
  const title=`${video.translations?.['zh-TW']?.title||video.title}｜SKINZ Subtitle Archive`;
  let html=template
    .replace('<head>','<head>\n  <base href="../../">')
    .replace('<body data-video-id="">',`<body data-video-id="${escapeHtml(video.id)}">`)
    .replace('<title>SKINZ Subtitle Archive</title>',`<title>${escapeHtml(title)}</title>`)
    .replace('content="SKINZ Subtitle Archive">',`content="${escapeHtml(title)}">`)
    .replace('<meta property="og:type" content="website">',`<meta property="og:type" content="video.other">\n  <meta property="og:url" content="${pageUrl}">\n  <meta property="og:image" content="${image}">\n  <meta property="og:image:width" content="480">\n  <meta property="og:image:height" content="360">\n  <meta name="twitter:card" content="summary_large_image">\n  <meta name="twitter:image" content="${image}">`);
  await writeFile(path.join(folder,'index.html'),html);
}
function escapeHtml(value){return String(value).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
console.log(`Built ${videos.length} video pages in _site`);
