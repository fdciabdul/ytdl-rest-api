const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const figlet = require("figlet");
const Innertube = require('youtubei.js');

app.use(morgan("common"));
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {

  res.send("hello welcome");
})

app.get("/get", async (req, res) => {
  const youtube = await new Innertube();
  let playlistregex = /\/playlist\?list=/;
  let videos = [];

  let url = req.query.url;
  const info = await youtube.getDetails(url);
  console.log(info)

  res.json({
    id: info.title,
    title: info.title,
    description: info.description,
    view: info.view_count,
    date: info.publish_date_text,
    thumbnail: info.thumbnail.url,
    video: info.formats,



  })



});

app.get("/audio", async (req, res, next) => {
  const info = await ytdl.getInfo(req.query.id);
  const youtube = await new Innertube();
  try {
    var url = req.query.id;
    res.header("Content-Disposition", `attachment; filename="${info.videoDetails.title}-fdciabdul.mp3"`);
    youtube.download(url, {
      format: 'mp4a', // Optional, defaults to mp4 and I recommend to leave it as it is unless you know what you're doing
      quality: '360p', // if a video doesn't have a specific quality it'll fall back to 360p, also ignored when type is set to audio
      type: 'audio' // can be “video”, “audio” and “videoandaudio”
    }).pipe(res);
  } catch (err) {
    res.statusMessage = err;
    res.sendStatus(400);
  }
});
app.get("/search", async (req, res, next) => {
  let search = [];
  const youtube = await new Innertube();
  const videos = await youtube.search(req.query.q);

  for (var i = 0; i < videos.length; i++) {
    search.push({
      id: videos[i].id,
      title: videos[i].title,
      viewcount: videos[i].viewCount,
    });
  }
  res.json(videos); // 20
});

app.get("/video", async (req, res, next) => {
  const info = await ytdl.getInfo(req.query.id);
  const youtube = await new Innertube();
  try {
    var url = req.query.id;
    res.header("Content-Disposition", `attachment; filename="${info.videoDetails.title}-fdciabdul.mp3"`);
    youtube.download(url, {
      format: 'mp4', // Optional, defaults to mp4 and I recommend to leave it as it is unless you know what you're doing
      quality: '360p', // if a video doesn't have a specific quality it'll fall back to 360p, also ignored when type is set to audio
      type: 'video' // can be “video”, “audio” and “videoandaudio”
    }).pipe(res);
  } catch (err) {
    res.statusMessage = err;
    res.sendStatus(400);
  }
});

let PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(figlet.textSync('Youtube Grabber ', {
    font: '',
    horizontalLayout: 'default',
    verticalLayout: true,
    width: 60,
    whitespaceBreak: true
  }));
  console.log(`Made By  : fdciabdul`);
  console.log(`Listening at port :${PORT}`);
});
