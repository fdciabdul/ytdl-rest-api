const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const {lirikLagu} = require("./lirik")
const app = express();
const { getLyrics, getSong } = require("genius-lyrics-api")
app.enable("trust proxy");
const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const secure = require("ssl-express-www");
const { Client } = require("youtubei");
const youtube = new Client();
const figlet = require("figlet");
app.use(morgan("common"));
app.use(cors());
app.use(secure);
app.use(express.json());

app.get("/lirik", async (req, res) => {
  const options = {
    apiKey: '_jrlcoPx93aPDnM1i1KsMVIwsAM0hCF2rZ_GzyWNNthgeXl0Ohh8s-cgEnG1R0oJ',
    title: req.query.judul,
    artist: req.query.artis,
    optimizeQuery: true
  };

  const lirik = await getLyrics(options);
  res.send(lirik)
})

app.get("/", async (req, res) => {
  let playlistregex = /\/playlist\?list=/;
  let videos = [];
  let url = req.query.url;
  try {
    if (playlistregex.test(url)) {
      ytpl(url)
        .then((info) => info.items)
        .then((info) => {
          let video;
          for (video of info) {
            videos.push({
              title: video.title,
              id: video.id,
              duration: video.duration,
            });
          }
          res.json(videos);
        })
        .catch((err) => {
          res.statusMessage =
            "can't download video(s) data. probably wrong url : " + err;
          res.sendStatus(400);
        });
    } else {
      ytdl
        .getInfo(url)
        .then((info) => {
          // console.log(info.videoDetails.keywords.toString());
          let duration = (info.lengthSeconds / 60).toString();
          duration =
            duration.substring(0, duration.indexOf(".")) +
            ":" +
            Math.floor((info.lengthSeconds % 60).toString());

          const max = info.videoDetails.thumbnails.reduce(
            (prev, current) => (prev.height > current.height ? prev : current)
          );

          videos.push({
            id: info.videoDetails.videoId,
            title: info.videoDetails.title,
            keywords:info.videoDetails.keywords.toString(),
            description: info.videoDetails.shortDescription,
            length: info.videoDetails.lengthSeconds,
            view: info.videoDetails.viewCount,
            date: info.videoDetails.publishDate,
            thumbnail: max,
            video: info.formats,
            artis: info.videoDetails.media.artist,
            judul: info.videoDetails.media.song
           
          });
          res.json(videos);
        })
        .catch((err) => {
          res.statusMessage =
            "can't download video(s) data. probably wrong url : " + err;
          res.sendStatus(400);
        });
    }
  } catch (err) {
    res.statusMessage =
      "can't download video(s) data. probably wrong url : " + err;
    res.sendStatus(400);
  }
});

app.get("/audio", async (req, res, next) => {
  try {
    var url = req.query.id;
    res.header("Content-Disposition", `attachment; filename="audio.mp3"`);
    ytdl(url, {
      format: "mp3",
      filter: "audioonly",
      filter: "audioonly",
    }).pipe(res);
  } catch (err) {
    res.statusMessage = err;
    res.sendStatus(400);
  }
});
app.get("/search", async (req, res, next) => {
  let search = [];
  const videos = await youtube.search(req.query.q, {
    type: "video", // video | playlist | channel | all
  });

  for (var i = 0; i < videos.length; i++) {
    search.push({
      id: videos[i].id,
      title: videos[i].title,
      viewCount: videos[i].viewCount,
    });
  }
  res.json(videos); // 20
});

app.get("/video", async (req, res, next) => {
  try {
    var url = req.query.id;
    res.header("Content-Disposition", `attachment; filename="audio.mp4"`);
    ytdl(url, {
      format: "mp4",
    }).pipe(res);
  } catch (err) {
    res.statusMessage = err;
    res.sendStatus(400);
  }
});

let PORT = process.env.PORT || 8080;
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
