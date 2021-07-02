const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.enable("trust proxy");
const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const secure = require("ssl-express-www");
const AZLyrics = require("azlyrics-ext");

const { Client } = require("youtubei");
const youtube = new Client();
app.use(morgan("common"));
app.use(cors());
app.use(secure);
app.use(express.json());
async function lyrics(query){

	const pageurl = `https:\/\/search.azlyrics.com/search.php?q=${query}`
	
	return axios.get(pageurl, {
        "headers": {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
          "cache-control": "max-age=0",
          "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
          "sec-ch-ua-mobile": "?0",
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "same-origin",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          "cookie": "_pubcid=cbe41e31-3201-4c1b-a48a-f9ea68dbd7a6; __utma=190584827.349533200.1625211424.1625211424.1625211424.1; __utmc=190584827; __utmz=190584827.1625211424.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _ga=GA1.2.349533200.1625211424; _gid=GA1.2.1298498547.1625211425; _fbp=fb.1.1625211425069.1543603457; __gads=ID=511e03d0fbdc8fd2:T=1625211425:S=ALNI_MZJ1MZTyb9mTrrsWlMd_UMsQQnMiA; rtk_p=%7B%7D; _pbjs_userid_consent_data=3524755945110770; _unifiedId=%7B%22TDID%22%3A%224fbfa0fd-9c8d-4ff1-9f99-3ef28bec110f%22%2C%22TDID_LOOKUP%22%3A%22TRUE%22%2C%22TDID_CREATED_AT%22%3A%222021-06-02T07%3A55%3A01%22%7D; OptanonConsent=isIABGlobal=false&datestamp=Fri+Jul+02+2021+14%3A55%3A20+GMT%2B0700+(Indochina+Time)&version=6.13.0&hosts=&landingPath=NotLandingPage&groups=C0003%3A1%2CC0004%3A1%2CC0001%3A1&AwaitingReconsent=false&geolocation=ID%3BJK; OptanonAlertBoxClosed=2021-07-02T07:55:20.053Z; rtk_session=eyJyZXZlbnVlIjowLCJ0cmlnZ2VyZWRSUFNSdWxlcyI6W10sInNpZCI6IjdlZDc0YzhiLTliMTItNGNhNy1hNTcyLTdhZDVhZmVhYjlmMCIsInN0YXJ0ZWRBdCI6MTYyNTIxMTQyMywibGFzdFNlZW4iOjE2MjUyMTI1MjB9; __utmb=190584827.10.9.1625212522537"
        },
        "referrer": "https://search.azlyrics.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors"
      })
		.then( (response)=>{
			const html = response.data
			const page = cheerio.load(html)
			let result = page('.visitedlyr a')[0].attribs['href']

			return axios.get(result ,  "headers": {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
          "cache-control": "max-age=0",
          "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
          "sec-ch-ua-mobile": "?0",
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "same-origin",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          "cookie": "_pubcid=cbe41e31-3201-4c1b-a48a-f9ea68dbd7a6; __utma=190584827.349533200.1625211424.1625211424.1625211424.1; __utmc=190584827; __utmz=190584827.1625211424.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _ga=GA1.2.349533200.1625211424; _gid=GA1.2.1298498547.1625211425; _fbp=fb.1.1625211425069.1543603457; __gads=ID=511e03d0fbdc8fd2:T=1625211425:S=ALNI_MZJ1MZTyb9mTrrsWlMd_UMsQQnMiA; rtk_p=%7B%7D; _pbjs_userid_consent_data=3524755945110770; _unifiedId=%7B%22TDID%22%3A%224fbfa0fd-9c8d-4ff1-9f99-3ef28bec110f%22%2C%22TDID_LOOKUP%22%3A%22TRUE%22%2C%22TDID_CREATED_AT%22%3A%222021-06-02T07%3A55%3A01%22%7D; OptanonConsent=isIABGlobal=false&datestamp=Fri+Jul+02+2021+14%3A55%3A20+GMT%2B0700+(Indochina+Time)&version=6.13.0&hosts=&landingPath=NotLandingPage&groups=C0003%3A1%2CC0004%3A1%2CC0001%3A1&AwaitingReconsent=false&geolocation=ID%3BJK; OptanonAlertBoxClosed=2021-07-02T07:55:20.053Z; rtk_session=eyJyZXZlbnVlIjowLCJ0cmlnZ2VyZWRSUFNSdWxlcyI6W10sInNpZCI6IjdlZDc0YzhiLTliMTItNGNhNy1hNTcyLTdhZDVhZmVhYjlmMCIsInN0YXJ0ZWRBdCI6MTYyNTIxMTQyMywibGFzdFNlZW4iOjE2MjUyMTI1MjB9; __utmb=190584827.10.9.1625212522537"
        },
        "referrer": pageurl,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors"
      })
				.then((response)=>{
					const html = response.data
					const page = cheerio.load(html)

					let lyrics = page('.ringtone')[0].next

					let text = ''
					while(true){
						
						if(lyrics.name == 'b' ){
							// add title
							text += lyrics.children[0].data
						}


						lyrics = lyrics.next
						if (lyrics.type == 'tag' && lyrics.name=='div'){
							break
						}
					}
					
					lyrics = text + lyrics.childNodes
						.filter((tag)=> tag.type=='text').map((tag)=>tag.data).join()
					test.value=lyrics
					return(lyrics)

				})
				.catch((error)=>{
					console.log("Error consulting", error)
				})

		}).catch((error)=>{
			console.log("Error consulting ", error)
		})
	
}

app.get("/lirik", async (req, res) => {
const songs = await lyrics(req.query.q);
  res.json(songs)
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

let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening at port :${PORT}`);
});
