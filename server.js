const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();
require('dotenv').config()
app.enable('trust proxy');
const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const secure = require('ssl-express-www');
const cookies = process.env.cookie;
const data = process.env.ydata;
app.use(morgan('common'));
app.use(cors())
app.use(secure)
app.use(express.json());

app.get('/', async (req, res) => {
  let playlistregex = /\/playlist\?list=/;
  let videos = []
  let url = req.query.url;  
  try {
    if (playlistregex.test(url)) {
      ytpl(url)
        .then(info => info.items)
        .then(info => {
          let video
          for (video of info) {
            videos.push({
              title: video.title,
              id: video.id,
              duration: video.duration,
            });
          }
          res.json(videos)
        })
        .catch(err => { 
          res.statusMessage = "can't download video(s) data. probably wrong url : "+err
          res.sendStatus(400)
        })
    } else {
      ytdl.getInfo(url , 
      { requestOptions: {
      headers: {
      'cookie': cookie,
      'x-youtube-client-version': '2.20180222',
      'x-youtube-client-name': '1',
      'x-client-data': 'CIu2yQEIpLbJAQipncoBCJm1ygEIjrjKAQiZvMoBCKbIygEI58jKAQiCycoBCLTLygEIoc3KAQijzcoBCMrOygEItdXKAQjc1coBCLLXygEIwdfKAQiC2MoBCJ/YygEIodjKAQjE2MoBCOKYywEYsMjKAQ==',
      
    },
  },
})
      .then(info => {
          let duration = (info.lengthSeconds/60).toString()
          duration = duration.substring(0, duration.indexOf('.'))+':'+Math.floor((info.lengthSeconds%60).toString())

const max = info
    .videoDetails
    .thumbnail
    .thumbnails.reduce((prev, current) => ((prev.height > current.height) ? prev : current));

          videos.push({
id: info.videoDetails.videoId,
    title: info.videoDetails.title,
    description: info.videoDetails.shortDescription,
    length: info.videoDetails.lengthSeconds,
     view: info.videoDetails.viewCount,
      date: info.videoDetails.publishDate,
   thumbnail: max,
   video:info.formats
          });
               res.json(videos)
        })
        .catch(err => { 
          res.statusMessage = "can't download video(s) data. probably wrong url : "+err
          res.sendStatus(400)
        })
    }
  } catch(err) {
    res.statusMessage = "can't download video(s) data. probably wrong url : "+err
    res.sendStatus(400)
  }
})

app.get('/audio', async (req, res, next) => {
  try {
    var url = req.query.id;
    res.header('Content-Disposition', `attachment; filename="audio.mp3"`);
    ytdl(url, {
      format: 'mp3',
      filter: 'audioonly',
      filter: 'audioonly',
      requestOptions: {
      'cookie': cookie,
      'x-youtube-client-version': '2.20180222',
      'x-youtube-client-name': '1',
      'x-client-data': 'CIu2yQEIpLbJAQipncoBCJm1ygEIjrjKAQiZvMoBCKbIygEI58jKAQiCycoBCLTLygEIoc3KAQijzcoBCMrOygEItdXKAQjc1coBCLLXygEIwdfKAQiC2MoBCJ/YygEIodjKAQjE2MoBCOKYywEYsMjKAQ=='
      
      },
}).pipe(res);

  } catch (err) {
    res.statusMessage = err
    res.sendStatus(400)
  }
});

app.get('/video', async (req, res, next) => {
  try {
    var url = req.query.id;
    res.header('Content-Disposition', `attachment; filename="audio.mp4"`);
    ytdl(url, {
      format: 'mp4',
    }).pipe(res);

  } catch (err) {
    res.statusMessage = err
    res.sendStatus(400)
  }
});

let PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Listening at port :${PORT}`);
});
