const ytdl = require('ytdl-core');
const express = require('express');
const app = express();
//async function getY(url) {
//  const data = await ytdl.getInfo(url);
//  return data;
//}
app.get('/', async (req, res , err) => {
try {
const info = await ytdl.getInfo(req.query.id);
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
} catch (exception) {
        res.status(500).send(exception)
    }
})
app.get('/mp3', (req, res) => {

    var url = req.query.url;
    try {
        console.log("return");
        youtubeStream(url).pipe(res)
    } catch (exception) {
        res.status(500).send(exception)
    }
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});
