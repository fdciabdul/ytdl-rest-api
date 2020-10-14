const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();
app.enable('trust proxy');
const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const secure = require('ssl-express-www');
var cookie = "VISITOR_INFO1_LIVE=Dv_f-Nd_r4I;PREF=app=desktop&al=id&f4=4000000&volume=100;_gcl_au=1.1.2034278470.1602532760;SID=2QezCCxfUy7C4nRe_Y06pi9JNVISdrTKbDtHgb5Mb3VgBMhA3jDHnEDY_34xYojvbypLrg.;__Secure-3PSID=2QezCCxfUy7C4nRe_Y06pi9JNVISdrTKbDtHgb5Mb3VgBMhAjmS4dwt5hHtS28RtSz91nw.;HSID=AsXdh5tw6S_bQLh54;SSID=ARoxGdWp2T43ek6GZ;APISID=WgvKtXnk9yS7Im_A/AzuAK6xEq8FPf_CrJ;SAPISID=ZuZguUvG0wHIMoty/AHfigpkaCGy4O6814;__Secure-3PAPISID=ZuZguUvG0wHIMoty/AHfigpkaCGy4O6814;LOGIN_INFO=AFmmF2swRQIhAPZKOq9GWaJK6DdaODLCmJCzXoG1TyFBuLmeCW7EE8x4AiB6Axs_t3BBkfnS_e_qSYxRkkcRMX-lEm9izDHEDY4D3g:QUQ3MjNmeTY5NllCYVItWV9pMXBNc2pJaGFMMXFvVEItQmtDdU5jTnd4SGZQVmhsdXc5RDJIeUVRVXp5SFg4TW1EaFYyT0ExcjhSb1VQZThva0xLeTNmbC16c2lVSHNxZFRnZUE3NHpJUS1RVGZvNWRRV0pXRDdoNWhhRHdWb3NCQXMtUGhqaFlmTXN0NmhLZzBQQmpxNW5mMGdhWm9BSE0xc0lpSHFYQi1jZ3RrS2ZIdnhxQ1RJ;YSC=pGtOoS2kqpw;SIDCC=AJi4QfFY1eu4v_JhgeMdHpCOGHxfEcCqG0032_tl9ztBUuonjWmrvm-gjeTOssRBbMS7qaHMnQ;__Secure-3PSIDCC=AJi4QfFoR_FbCA1GDaMl0c_S-vj7IO0xEE9MSedOeWxnCsWZMR3msODYyWohL24GK0ecpHzK";


app.use(morgan('common'));
app.use(cors())
app.use(secure)
app.use(express.json());

app.get('/', async (req, res) => {
  let playlistregex = /\/playlist\?list=/;
  let videos = []
  let url = req.query.url;  
      ytdl.getInfo(url , 
      { requestOptions: {
      headers: {
      'cookie': cookie,
      // Optional. If not given, ytdl-core will try to find it.
      // You can find this by going to a video's watch page, viewing the source,
      // and searching for "ID_TOKEN".
      // 'x-youtube-identity-token': 1324,
      'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0; vivo 1820) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36',
      'x-client-data': 'CIu2yQEIpLbJAQipncoBCJm1ygEIjrjKAQiZvMoBCKbIygEI58jKAQiCycoBCLTLygEIoc3KAQijzcoBCMrOygEItdXKAQjc1coBCLLXygEIwdfKAQiC2MoBCJ/YygEIodjKAQjE2MoBCOKYywEYsMjKAQ==',
      'x-youtube-client-name': '1',
      'x-youtube-client-version': '2.20180222'
       
    },
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
