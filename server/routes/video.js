const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer");
// const path = require('path');
var ffmpeg = require('fluent-ffmpeg')

//Storage multer config
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4' || ext !== '.png'|| ext !== '.jpg' || ext !== '.gif') {
            return cb(res.status(400).end('only mp4, png, jpg is allowed'), false);
        }
        cb(null, true)
    }
});

// const upload = multer({ storage: storage }).array("file", 3);
const upload = multer({ storage: storage }).single("file");

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res) => {

    //비디오를 서버에 저장
    upload(req, res, err => {
        if(err) {
            return res.json({ success: false, err })
        }
        console.log(res.req.file)
        // const url = res.req.files.map(v => v.path)
        // const fileName = res.req.files.map(v => v.filename)
        // return res.json({ success:true, url: url, fileName: fileName })
        return res.json({ success:true, url: res.req.file.path, fileName: res.req.file.filename })
        
    })
})

router.post('/getVideoDetail', (req, res) => {
    Video.findOne({ "_id" : req.body.videoId })
        .populate('writer')
        .exec((err, videoDetail) => {
            if(err) return res.status(400).send(err)
            return res.status(200).json({ success: true, videoDetail })
        })
    
});

router.post('/uploadVideo', (req, res) => {

    //비디오 정보를 저장
    const video = new Video(req.body)

    video.save((err, doc) => {
        if(err) return res.json({ success: false, err})
        res.status(200).json({ success: true })
    })

})

router.get('/getVideos', (req, res) => {

    //비디오를 db에서 가져와서 클라이언트에 보낸다.
    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success:true, videos })
        })

})

router.post('/thumbnail', (req, res) => {
    let filePath = ""
    console.log(req.body.url)
    filePath = req.body.url;
    

})

// router.post('/thumbnail', (req, res) => {

//     let filePath = ""
//     let fileDuration = ""

//     //비디오 정보 가져오기
//     ffmpeg.ffprobe(req.body.url, function(err, metadata) {
//         console.dir(metadata);
//         console.log(metadata.format.duration);
//         fileDuration = metadata.format.duration
//     });

//     //썸네일 생성
//     ffmpeg(req.body.url)
//     .on('filenames', function(filenames) {
//         console.log('will generate' + filenames.join(', '))
//         console.log(filenames)

//         filePath = "uploads/thumbnails/" + filenames[0]
//     })
//     .on('end', function() {
//         console.log('Screenshots taken');
//         return res.json({ success: true, url: filePath, fileDuration: fileDuration})
//     })
//     .on('error', function(err) {
//         console.log(err);
//         return res.json({ success: false, err });
//     })
//     .screenshots({
//         count:1,
//         folder: "uploads/thumbnails",
//         size: '320x240',
//         filename: 'thumbnail-%b.png'
//     })

// })


module.exports = router;
