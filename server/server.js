const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const multer  = require('multer')
const cors = require('cors')
const fs = require('fs');
const router = require('./routes/api/auth/index')
const tour_router = require('./routes/tour/index')
const gym_router = require('./routes/gym/index')
const cookieParser = require('cookie-parser');
const gymController = require('./routes/gym/gym.controller')
require('dotenv').config({
  path : '.env'
})

const app = express();
// 미들웨어
app.use(bodyParser.json({limit: '50mb'})); 
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(path.join(__dirname + "/public"))); // 정적 파일 위치 설정
app.use(cors({ 
  origin: "http://localhost:3000",
  credentials:true,  
  optionSuccessStatus:200
}));
app.use(cookieParser())


const upload = multer({
  storage: multer.diskStorage({
    // 저장할 장소
    destination(req, file, cb) {
      try {
        fs.accessSync(__dirname+'/public/uploads');
        cb(null, __dirname + '/public/uploads');
      } catch (error) {
        console.log(error)
      }
      // try {
      //   // const id = req.body.id
      //   // fs.access(`public/uploads/`);
        
      //   console.log("폴더가 없으므로 생성합니다.");
      //   fs.mkdirSync('./public/uploads');
      // } catch (error) {
      //   // cb(null, `public/uploads/${req.body.id}`);
      //   cb(null, String('./public/uploads/'));
      // }
      
    },
    // 저장할 이미지의 파일명
    filename(req, file, cb) {
      let filename = file.originalname
      filename = Buffer.from(filename, 'latin1').toString('utf8')
      const ext = path.extname(file.originalname); // 파일의 확장자
      // 파일명이 절대 겹치지 않도록 해줘야한다.
      // 파일이름 + 현재시간밀리초 + 파일확장자명
      cb(null, path.basename(filename, ext) + Date.now() + ext);
    },
  }),
  // limits: { fileSize: 5 * 1024 * 1024 } // 파일 크기 제한
});

app.post("/post/img", upload.single("img"), (req, res) => {
  // 해당 라우터가 정상적으로 작동하면 public/uploads에 이미지가 업로드된다.
  // 업로드된 이미지의 URL 경로를 프론트엔드로 반환한다.
  // console.log("전달받은 파일", req.file);
  // console.log("저장된 파일의 이름", req.file.filename);

  // 파일이 저장된 경로를 클라이언트에게 반환해준다.
  const IMG_URL = `${process.env.HOST_NAME}/uploads/${req.body.id}/${req.file.filename}`;
  console.log(IMG_URL);
  res.json({ url: IMG_URL });
});

app.use('/api', router);
app.use('/tour', tour_router);
app.use('/gym', gym_router);
app.post('/gym/post_review', upload.array('img'), gymController.postGymReview)

app.listen(3001, () => console.log("연결"));
