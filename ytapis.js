const express = require('express');
const ytdl = require('ytdl-core');                                              //      Youtube Video Details
const fbdl = require('fb-video-downloader');                                    //      Facebook video details
const fbvid = require('fbvideos');                                              //      Facebook video details
const path = require('path');                                                   //      To get path of any file
const findRemoveSync = require('find-remove');                                  //      To delete un-nacessary file created
const cron = require('node-cron');                                              //      Set Corn Jobs in Node

const app = express();

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


cron.schedule('*/1 * * * *', () => {
    // This corm job will be executed every 1 minutes
    var result = findRemoveSync(path.join(__dirname), {prefix: 'core', maxLevel: 1});
    console.log(result);
});
    
app.get('/', async (req, res) => {
    //res.sendFile(path.join(__dirname + '/index.html'));
    res.write('No data in Root Directory !');
    res.end();
});

const funArray = {};
        funArray.error = 'Auth-Token not found please contact Admin Team!';
        funArray.email = 'softwebtuts@gmail.com';
        funArray.authToken = 'Main ni Btaon Ga :)';
        funArray.whatsapp = '+923037465988, +447864615562';
        funArray.methodAllowed = 'GET, POST, OPTION, DELETE';
        
app.get('/ytapi', async (req, res) => {
    res.header("Content-Type", 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    try {
        let id = req.query.id;
    let info = await ytdl.getInfo(id);
    let results = ytdl.filterFormats(info.formats, 'audioandvideo');
    let posters = info.videoDetails.thumbnail.thumbnails;
    let a = {};
    function index(){
        if(results.length == 2){
            return 1
        }else{
            return 0
        }
    }
    const i = index();
    a.videoId = info.videoDetails.videoId;
    a.title = info.videoDetails.title;
    a.poster = posters[posters.length - 1].url;
    a.format = results[i].mimeType;
    a.qualityLabel = results[i].qualityLabel;
    a.url = results[i].url;
    a.width = results[i].width;
    a.height = results[i].height;
    a.size = formatBytes(results[i].contentLength);
    a.quality = results[i].quality;
    a.extension = results[i].container;
    a.duration = sec2min(info.videoDetails.lengthSeconds);
        res.send(JSON.stringify(a, null, 4));
    } catch (error) {
        console.log(error);
    }
})

app.get('/youtube', async (req, res) => {
    res.header("Content-Type", 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    try {
        let id = req.query.id;
    let info = await ytdl.getInfo(id);
    const s = {}
    s.dash = info.player_response.streamingData.dashManifestUrl;
    s.hls = info.player_response.streamingData.hlsManifestUrl;
    s.details = info;

    const jsonData = JSON.stringify(s, null, 4);
    res.send(jsonData);
    } catch (error) {
        console.log(error);
    }
})

app.get('/facebook', async (req, res) => {
    res.header("Content-Type", 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    try {
        const a = {};
        const id = req.query.id;

        const video = 'https://web.facebook.com/watch/?v=' + id;
        a.videoId = id;
        fbdl.getInfo(video).then((info) => {
            a.title = info.title;
            a.poster = info.thumb;
            fbvid.low(video).then(vid => {
                a.url = {};
                a.url.sd = vid.url;
                fbvid.high(video).then(vid => {
                    a.url.hd = vid.url
                    a.error = info.error;
                    res.send(JSON.stringify(a, null, 4));
                });
            });
        });



    } catch (error) {
        console.log(error);
    }
})

app.listen(3000, ()=>{console.log('Server is at http://localhost:3000')})