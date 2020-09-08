const express = require("express");
const serverless = require("serverless-http");
const ytdl = require('ytdl-core');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors({
    exposedHeaders: ['Content-Disposition', 'Content-Length'],
}));
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

    let URL = req.query.URL;
    let type = req.query.type;
	let format = req.query.format ? req.query.format : 'mp4';

    if( type === 'video' ) {
        let resp = ytdl.validateURL( URL );
        console.log("----> ", resp, typeof resp)
        if( resp ){
            ytdl(URL, { format: 'mp4' })
            .on("info", info => {
                res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.${format}"`);
            })
            .on("response", response => {
                // If you want to set size of file in header
                res.setHeader("content-length", response.headers["content-length"]);
            }).on("error", error => {
                return res.status(500).json( {"Error": "Couldn't find video"} )
            }).pipe(res) 
        
        } else {
            res.send(  {"Error": "Video not found"}  )
        }
    } else {
		let resp = ytdl.validateURL( URL );
        console.log("----> ", resp, typeof resp)
        if( resp ){
            ytdl(URL, { format: 'mp4' })
            .on("info", info => {
                res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.${format}"`);
            })
            .on("response", response => {
                // If you want to set size of file in header
                res.setHeader("content-length", response.headers["content-length"]);
            }).on("error", error => {
                return res.status(500).json( {"Error": "Couldn't find video"} )
            }).pipe(res) 
        
        } else {
            res.send(  {"Error": "Video not found"}  )
        }
    }
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
