import {cp, mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const source=root;
const output=path.join(root,'_site');
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
for(const name of ['index.html','assets']){
  await cp(path.join(source,name),path.join(output,name),{recursive:true});
}
// The former local rounded-font files total about 19 MB and are no longer used.
// Keep them out of the deployed artifact even if an older repository still has them.
await rm(path.join(output,'assets','fonts'),{recursive:true,force:true});
const template=await readFile(path.join(source,'index.html'),'utf8');
const videos=JSON.parse(await readFile(path.join(source,'data/videos.json'),'utf8'));
let siteConfig={};
try{siteConfig=JSON.parse(await readFile(path.join(source,'data/site-config.json'),'utf8'))}catch{}
const siteUrl=String(siteConfig.siteUrl||'https://shysssiee.github.io/SKINZ_Subtitle_Archive').replace(/\/$/,'');
const archiveName=siteConfig.archiveName||'SKINZ Subtitle Archive';
const dataOutput=path.join(output,'data');
const videoDataOutput=path.join(dataOutput,'videos');
await mkdir(videoDataOutput,{recursive:true});
await writeFile(path.join(dataOutput,'site-config.json'),JSON.stringify(siteConfig));
const rootHtml=template
  .replace('<title>SKINZ Subtitle Archive</title>',`<title>${escapeHtml(archiveName)}</title>`)
  .replace('content="SKINZ Subtitle Archive">',`content="${escapeHtml(archiveName)}">`);
await writeFile(path.join(output,'index.html'),rootHtml);
const indexData=videos.map(video=>({
  id:video.id,
  platform:video.platform,
  videoType:video.videoType||'',
  title:video.title,
  translations:Object.fromEntries(Object.entries(video.translations||{}).map(([lang,value])=>[lang,{title:value?.title||''}])),
  members:video.members||[],
  liveDate:video.liveDate||video.date||'',
  postDate:video.postDate||video.date||'',
  officialUrl:video.officialUrl||'',
  youtubeId:video.youtubeId||'',
  thumbnailUrl:video.thumbnailUrl||'',
  languages:['ko','zh','en','ja'].filter(lang=>(video.cues||[]).some(cue=>cue[lang]))
}));
await writeFile(path.join(dataOutput,'videos-index.json'),JSON.stringify(indexData));
for(const video of videos){
  await writeFile(path.join(videoDataOutput,`${encodeURIComponent(video.id)}.json`),JSON.stringify(video));
  const folder=path.join(output,'video',encodeURIComponent(video.id));
  await mkdir(folder,{recursive:true});
  const pageUrl=`${siteUrl}/video/${encodeURIComponent(video.id)}/`;
  const image=video.thumbnailUrl||(video.youtubeId?`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`:`${siteUrl}/assets/bstage-placeholder.svg`);
  const title=`${video.translations?.['zh-TW']?.title||video.title}｜${archiveName}`;
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
