const ytdl = require('ytdl-core');
const express = require('express');
const app = express();
//async function getY(url) {
//  const data = await ytdl.getInfo(url);
//  return data;
//}
app.get('/:id', async (req, res , err) => {
const info = await ytdl.getInfo(req.params.id);
const max = info
    .videoDetails
    .thumbnail
    .thumbnails.reduce((prev, current) => ((prev.height > current.height) ? prev : current));

res.json({
    id: info.videoDetails.videoId,
    title: info.videoDetails.title,
    description: info.videoDetails.shortDescription,
    length: info.videoDetails.lengthSeconds,
     view: info.videoDetails.viewCount,
      date: info.videoDetails.publishDate,
   thumbnail: max,
   video:info.formats
})

})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});
