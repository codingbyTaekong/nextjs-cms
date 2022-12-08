const multer  = require('multer');
const fs = require('fs');
const express = require('express');
const path = require('path')

exports.upload = multer({
    storage: multer.diskStorage({
      // 저장할 장소
      destination(req, file, cb) {
        const id = 'test'
        try {
          
            // const id = req.body.id
            const id = 'test'
            // process.chdir('../');
            // fs.accessSync(`public/uploads/${id}`);
            cb(null, `../public/uploads/${id}`);
        } catch (error) {
            console.log("폴더가 없으므로 생성합니다.");
            // process.chdir('../');
            // fs.mkdirSync(`public/uploads/${id}`);
            cb(null, `../public/uploads/${id}`);
        }
        // try {
            
        //     cb(null, `../public/uploads/${id}`);
        // } catch (error) {
        //     console.log(error)
        // }
      },
      // 저장할 이미지의 파일명
      filename(req, file, cb) {
        let filename = file.originalname
        filename = Buffer.from(filename, 'latin1').toString('utf8')
        const ext = path.extname(file.originalname); // 파일의 확장자
        // console.log("file.originalname", file.originalname);
        // 파일명이 절대 겹치지 않도록 해줘야한다.
        // 파일이름 + 현재시간밀리초 + 파일확장자명
        cb(null, path.basename(filename, ext) + Date.now() + ext);
      },
    }),
    // limits: { fileSize: 5 * 1024 * 1024 } // 파일 크기 제한
  });