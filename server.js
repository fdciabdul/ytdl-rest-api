const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const scrapeYt = require("scrape-yt");
const app = express();
app.enable('trust proxy');
const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const secure = require('ssl-express-www');
const cookie = "SID=2gezCNJJNrnxhriK7bvOqz8-ZuOE3GIl_lCv7kAYFoiMPHGcrtFQAY7PmOYMI64PTqUlUQ.;__Secure-3PSID=2gezCNJJNrnxhriK7bvOqz8-ZuOE3GIl_lCv7kAYFoiMPHGcZ0UT85gL3Uf5Jt25N-DJCQ.;HSID=A7EDzLn3kae2B1Njb;SSID=AheuwUjMojTWvA5GN;APISID=cgfXh13rQbb4zbLP/AlvlPJ2xBJBsykmS_;SAPISID=m82rJG4AC9nxQ5uG/A1FotfA_gi9pvo91C;__Secure-3PAPISID=m82rJG4AC9nxQ5uG/A1FotfA_gi9pvo91C;VISITOR_INFO1_LIVE=RgZLnZtCoPU;LOGIN_INFO=AFmmF2swRQIhAOXIXsKVou2azuz-kTsCKpbM9szRExAMUD-OwHYiuB6eAiAyPm4Ag3O9rbma7umBK-AG1zoGqyJinh4ia03csp5Nkw:QUQ3MjNmeXJ0UHFRS3dzaTNGRmlWR2FfMDRxa2NRYTFiN3lfTEdOVTc4QUlwbUI4S2dlVngxSG10N3ZqcHZwTHBKano5SkN2dDlPSkhRMUtReE42TkhYeUVWS3kyUE1jY2I1QzA1MDZBaktwd1llWU9lOWE4NWhoZV92aDkxeE9vMTNlcG1uMU9rYjhOaDZWdno2ZzN3TXl5TVNhSjNBRnJaMExrQXpoa2xzRVUteFNWZDI5S0Fn;YSC=8shK-NSCbaY;PREF=al=id&f4=4000000;SIDCC=AJi4QfFT7ZKhKrkdFC7K98GSFG7KOn9KmymtlbsuK65Aa4iMKd357hogNbLAhBhBRPKHSeKvmg;__Secure-3PSIDCC=AJi4QfFNBkYWxC9UvyQWm3vXy535JO_zHoEN7WuAl7lH-oVscImymWtGALUzw61-t-VkU2nR";



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
      'Cookie': cookie,
      'Referer':'https://www.youtube.com/InsideHeartz',
      'X-client-data':'CIm2yQEIo7bJAQipncoBCL6nygEI4qjKAQ==',
      'X-youtube-client-version':'2.20201013.02.02',
      'X-youtube-client-name': '1',
      'X-chrome-connected':'mode=0,enable_account_consistency=true',
      'X-youtube-identity-token': 'QUFFLUhqbG1OVUx1UXlJazNsSjdLTE1WYzdyVFJPMEVyQXw=',
      'X-youtube-device':'cbr=Chrome&cbrver=70.0.3538.110&ceng=WebKit&cengver=537.36&cos=X11&cosver=0'
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
headers: {
      headers: {
      'Cookie': cookie,
      'Referer':'https://www.youtube.com/InsideHeartz',
      'X-client-data':'CIm2yQEIo7bJAQipncoBCL6nygEI4qjKAQ==',
      'X-youtube-client-version':'2.20201013.02.02',
      'X-youtube-client-name': '1',
      'X-chrome-connected':'mode=0,enable_account_consistency=true',
      'X-youtube-identity-token': 'QUFFLUhqbG1OVUx1UXlJazNsSjdLTE1WYzdyVFJPMEVyQXw=',
      'X-youtube-device':'cbr=Chrome&cbrver=70.0.3538.110&ceng=WebKit&cengver=537.36&cos=X11&cosver=0'
    },
},
}).pipe(res);

  } catch (err) {
    res.statusMessage = err
    res.sendStatus(400)
  }
});
app.get('/search', async (req, res, next) => {
var id = req.query.q;
  try {
scrapeYt.search(id, {
    type: "video"
}).then(videos => {
    res.json(videos);
})
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
    } , { requestOptions: {
      headers: {
      'Cookie': cookie,
      'Referer':'https://www.youtube.com/InsideHeartz',
      'X-client-data':'CIm2yQEIo7bJAQipncoBCL6nygEI4qjKAQ==',
      'X-youtube-client-version':'2.20201013.02.02',
      'X-youtube-client-name': '1',
      'X-chrome-connected':'mode=0,enable_account_consistency=true',
      'X-youtube-identity-token': 'QUFFLUhqbG1OVUx1UXlJazNsSjdLTE1WYzdyVFJPMEVyQXw=',
      'X-youtube-device':'cbr=Chrome&cbrver=70.0.3538.110&ceng=WebKit&cengver=537.36&cos=X11&cosver=0'
    },
  },
})
.pipe(res);

  } catch (err) {
    res.statusMessage = err
    res.sendStatus(400)
  }
});

let PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Listening at port :${PORT}`);
});
