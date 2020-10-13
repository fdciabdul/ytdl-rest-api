const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();
app.enable('trust proxy');
const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const secure = require('ssl-express-www');
var cookie = "VISITOR_INFO1_LIVE=tHFVSZc0Png; _gcl_au=1.1.1456374323.1601472163; PREF=f4=4000000&volume=100; SID=1wecW05dZ9cP6PsgaWbyui97xRbS_Q4e2o8pTW0xcojvMjBnwujtLRpKcE7yxD3rL1fP7A.; __Secure-3PSID=1wecW05dZ9cP6PsgaWbyui97xRbS_Q4e2o8pTW0xcojvMjBn-Vj0Rpv59T9iw3P9WxYndQ.; HSID=AKIvdEYGL-0dmPEcl; SSID=Atdi7GqzmotELNEG6; APISID=CRSiVL0dnwLT7U3w/A9notN-gQ85RNbRY6; SAPISID=T2d-Fsk2qACW-5Zc/AsY_l8-X9tkNM_PRT; __Secure-3PAPISID=T2d-Fsk2qACW-5Zc/AsY_l8-X9tkNM_PRT; CONSENT=YES+ID.en+201910; LOGIN_INFO=AFmmF2swRgIhAJjl4SVgjzp3VdEWhNoILsicJWp3rPj6Bbe1kWBCrDOdAiEAxBaj48_1bk5t5tNxc2dIIprC7HAwtBGIp5Bii2x1gYQ:QUQ3MjNmempLZGhxa2lQVklEQ1VYR3pyTjNOWmRBM1dNTTV2UmM4TFh5aDkxcFg1djhCMUVpWkdtX24yTGcxNW1Lam1uWUw3SnpMN2ZOWldrVVY3TTNyNHZwOERwN1I1THQteUNILUMtcm15SFdVUHpnMHlkM0xMNlVSV3N2Nl9iM3JFOVAtMXJOYlZwVkVOQTFYZXByaVJGekhDNlF4ZTk3VENlRkdsRUF1VEQ5OVV6SE9oU29jNjM5blg4WlNoSDBpay01YkRNcUts; SIDCC=AJi4QfGzCvWecIXBdQxe3R3FpEB3TMXX4heAj3utIRJEObPMfbPPnOPnz6lz31KXb3xB9ZNUHA; __Secure-3PSIDCC=AJi4QfElL3RNL-ZoWuN4UIYw8UGTqKG0ba4_NXZSNVvnV7cRmyEJl2kds4ZdKcGLLJmZ0kX0oQ; YSC=saZKly7xdkM";
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
      ytdl.getInfo(url , {requestOptions: { Cookie: cookie }})
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
    res.header('Content-Disposition', `attachment; filename= "Musiknya_Tuan.mp3"`);
    ytdl(url, {
      format: 'mp3',
      filter: 'audioonly',
    }).pipe(res);

  } catch (err) {
    res.statusMessage = err
    res.sendStatus(400)
  }
});

app.get('/video', async (req, res, next) => {
  try {
    var url = req.query.id;
    res.header('Content-Disposition', `attachment; filename="video.mp4"`);
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
