const express = require("express");
const serverless = require("serverless-http");
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();
app.use(cors());
const router = express.Router();

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function sec2min(time) {
  var hr = ~~(time / 3600);
  var min = ~~((time % 3600) / 60);
  var sec = time % 60;
  var sec_min = "";
  if (hr > 0) {
    sec_min += "" + hrs + ":" + (min < 10 ? "0" : "");
  }
  sec_min += "" + min + ":" + (sec < 10 ? "0" : "");
  sec_min += "" + sec;
  return sec_min + " min";
}

router.get("/", async (req, res) => {
  res.header("Content-Type", 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    let id = req.query.id;
    let info = await ytdl.getInfo(id);
    //let a = info.formats;
    let videoaudio = ytdl.filterFormats(info.formats, 'audioandvideo');
    let audio = ytdl.filterFormats(info.formats, 'audioonly');
    let video = ytdl.filterFormats(info.formats, 'videoonly');
    let otherFormats = info.player_response.streamingData.adaptiveFormats;
    let a = {};
    a.videoId = info.videoDetails.videoId;
    a.title = info.videoDetails.title;

    let posters = info.videoDetails.thumbnail.thumbnails;
    a.poster = posters[posters.length - 1].url;
    a.videoaudio = videoaudio;
    a.video = video;
    a.audio = audio;
    a.otherFormats = otherFormats;
    res.send(JSON.stringify(a, null, 4));
  } catch (error) {
    console.log(error);
  }
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
