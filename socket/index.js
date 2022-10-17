const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
// const { createAdapter } = require("@socket.io/cluster-adapter");
// const { setupWorker } = require("@socket.io/sticky");
const cors = require("cors");
const { instrument } = require("@socket.io/admin-ui");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
const server = http.createServer(app);
// const server = http.createServer();

const io = new Server(server, {
  cors: {
    // origin: "https:admin.socket.io",
    origin: "*",
    credentials: true,
  },
});


instrument(io, {
  // auth: false,
  auth: {
    type: 'basic',
    username: 'admin',
    password: `${bcrypt.hashSync('vlrxmroqkf1004!', 10)}`
  }
});




const port = 5000;
const handleListen = () => console.log(`Listening on http://118.67.142.104:${port}`);


// 내 코드
const channelLength = 30;
const channelLimit = {
  pc: 33,
  mobile: 15,
};

// 채널 이동 함수
function onChangeChannel(device, currentRoomName, socketId, requestRoomName) {

}

server.listen(port, handleListen);

function publicRooms() {
  // const {sids, rooms} = io.sockets.adapter
  // const socketIds = sids;
  // const rooms = rooms;
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io
  console.log('sids::::', sids)
  console.log('rooms::::', rooms)
  const publicRooms = [];
  rooms.forEach((value, key) => {
    sids.get(key) === undefined ? publicRooms.push(key) : null
  })
  return publicRooms;
}


function countRoom(roomName) {
  return io.sockets.adapter.rooms.get(roomName)?.size
}

function getListOfSocketsInRoom(roomName) {
  return io.sockets.adapter.rooms.get(roomName)
}

io.on("connection", (socket) => {
  socket.onAny((e) => {
    console.log(`Socket Event:${e}, id : ${socket.id}`);
  });
  // 누군가 들어오면 (네비부터 모든 세팅이 다 끝났다고 가정하에) 할 일
  //
  socket.once("ENTER_USER", function ({ device, campus, userInfo, nickname, id }) {
    let flag = true;
    io.sockets.sockets.forEach(skt => {
      if (skt.userId === id) flag = false;
    })
    if (flag) {
      socket.userId = id; // -> id
      socket.nickname = userInfo.nickname;
      socket.campus = campus;
      socket.device = device;
      socket.userInfo = userInfo;
      socket.isLoaded = false;
      let isPossible = true;
      let roomName = undefined;
      for (let i = 0; i < channelLength; i++) {
        // 첫 손님 개시~
        // 룸 사이즈보다 작으면 입장
        if (countRoom(`${device}_${i}_room`) < channelLimit[device] || countRoom(`${device}_${i}_room`) === undefined) {
          // 방에 입장
          roomName = `${device}_${i}_room`;
          socket.roomName = `${device}_${i}_room`;
          socket.join(`${device}_${i}_room`);
          console.log(publicRooms())
          // for문 탈출
          break;
        }
        if (i === (channelLength - 1) && countRoom(`${device}_${i}_room`) === channelLimit.pc) {
          console.log(i, channelLength)
          isPossible = false;
        }
      }
      if (!isPossible) {
        console.log("만석이유~")
        return socket.emit("ERROR_ENTER", false);
      }

      const userList = [];
      const idList = Array.from(getListOfSocketsInRoom(roomName)).filter(id => id !== socket.id);
      idList.forEach(socketId => {
        const otherUser = io.sockets.sockets.get(socketId)
        console.log(otherUser.campus)
        if (otherUser.campus === socket.campus) userList.push({
          id: socketId,
          ...otherUser.userInfo
        })
      })
      if (userList.length === 0) {
        socket.isLoaded = true
      }
      socket.emit("ROOM_INFO", { roomName, userList });
    } else {
      console.log("중복접속")
      return socket.emit("ERROR_ENTER", false);
    }
  });


  socket.once("SETUP_ALL", function () {
    socket.isLoaded = true;
    let roomName = socket.roomName;
    Array.from(getListOfSocketsInRoom(roomName)).forEach(id => {
      if (id !== socket.id) {
        const otherUser = io.sockets.sockets.get(id);
        if (otherUser.campus === socket.campus) socket.to(id).emit("_ENTER_USER", {
          id: socket.id,
          ...socket.userInfo
        })
      }
    });
  });

  // 내가 움직이면 서버로 내 포지션을 보내고, 값을 변경 후에 다른 유저에게 전달
  socket.on("MOVE_POZ", (poz) => {
    try {
      socket.userInfo.position = {
        ...poz
      }
      let roomName = socket.roomName;
      Array.from(getListOfSocketsInRoom(roomName)).forEach(id => {
        if (id !== socket.id) {
          const otherUser = io.sockets.sockets.get(id);
          if (otherUser.campus === socket.campus && otherUser.isLoaded) socket.to(id).emit("_MOVE_POZ", {
            id: socket.id,
            x: poz.x, y: poz.y, z: poz.z
          })
        }
      });
    } catch (error) {
      console.log(error)
    }
  });

  // 아이템 교체시 다른 유저에게도 교체된 정보를 알려줘야함
  socket.on("CHANGE_CUSTOM", (items) => {
    try {
      socket.userInfo.items = {
        ...items
      }
      let roomName = socket.roomName;
      Array.from(getListOfSocketsInRoom(roomName)).forEach(id => {
        if (id !== socket.id) {
          const otherUser = io.sockets.sockets.get(id);
          if (otherUser.campus === socket.campus) socket.to(id).emit("_CHANGE_CUSTOM", {
            id: socket.id,
            items: socket.userInfo.items
          })
        }
      });
    } catch (error) {
      console.log(error)
    }
  });

  const cheat = async (msg) => {
    let flag = true
    var slang = msg;
    var slang_arr = slang.split(" ");
    const fs = require('fs');
    const article = fs.readFileSync("fword_list.txt");

    const emotionWordTXT = fs.readFileSync("emotion_list.txt");
    let filteringEmotionWord = null;

    const lineArray = article.toString().split('\n');
    lineArray.forEach((value) => {
      slang_arr.map(slang => slang.indexOf(value.replaceAll('\r', '')) !== -1 ? flag = false : null);
    })

    const emotionWordArray = emotionWordTXT.toString().split('\n');
    emotionWordArray.forEach((value) => {
      slang_arr.map((slang) => {
        if (slang.indexOf(value.replaceAll('\r', '')) !== -1) {
          filteringEmotionWord = value;
        }
      })
    })

    return ({ flag: flag, filteringEmotionWord: filteringEmotionWord });
  }
  // 채팅
  socket.on("MSG", async (nickname, msg) => {
    try {
      let roomName = socket.roomName;
      Array.from(getListOfSocketsInRoom(roomName)).forEach(id => {
        if (id !== socket.id) {
          const otherUser = io.sockets.sockets.get(id);
          if (otherUser.campus === socket.campus) socket.to(id).emit("_MSG", nickname, msg)
        }
      });
    } catch (error) {
      console.log(error)
    }
  });
  socket.on('CHECK_MSG', async (msg) => {
    let flags = await cheat(msg)
    socket.emit('_CHECK_MSG', flags, msg);
  })

  socket.on('CHECK_GUEST_MSG', async (msg) => {
    let flags = await cheat(msg)
    socket.emit('_CHECK_GUEST_MSG', flags, msg);
  })

  socket.on('CHECK_WISH_MSG', async (inputs, sendWishLabel)=> {
    let flags_1 = await cheat(inputs.title);
    let flags_2 = await cheat(inputs.descript);
    console.log(flags_1)
    console.log(flags_2)
    let flags = (flags_1.flag === true && flags_2.flag === true) ? true : false
    socket.emit('_CHECK_WISH_MSG', flags, inputs, sendWishLabel);
  })

  socket.on("TELEPORT_LOCAL", (poz) => {
    try {
      socket.userInfo.position = {
        ...poz
      }
      socket.userInfo.rotation = {
        ...socket.userInfo.rotation,
        y: poz.rotY
      }
      let roomName = socket.roomName;
      Array.from(getListOfSocketsInRoom(roomName)).forEach(id => {
        if (id !== socket.id) {
          const otherUser = io.sockets.sockets.get(id);
          if (otherUser.campus === socket.campus) socket.to(id).emit("_TELEPORT_LOCAL", {
            id: socket.id,
            x: poz.x,
            y: poz.y,
            z: poz.z,
            rotY: poz.rotY
          })
        }
      });
    } catch (error) {
      console.log(error)
    }
  });


  socket.on("DANCE_ANI", (aniCount) => {
    try {
      let roomName = socket.roomName;
      Array.from(getListOfSocketsInRoom(roomName)).forEach(id => {
        if (id !== socket.id) {
          const otherUser = io.sockets.sockets.get(id);
          if (otherUser.campus === socket.campus) socket.to(id).emit("_DANCE_ANI", {
            id: socket.id,
            aniCount: aniCount.aniCount
          })
        }
      });
    } catch (error) {
      console.log(error)
    }
  });


  socket.on("CHAT_EMOTION", (word) => {
    socket.emit("_CHAT_EMOTION", {
      id: socket.id,
      word: word
    });
    try {
      Array.from(getListOfSocketsInRoom(socket.roomName)).forEach(id => {
        const otherUser = io.sockets.sockets.get(id);
        if (otherUser.campus === socket.campus)
          socket.to(id).emit("_CHAT_EMOTION", {
            id: socket.id,
            word: word
          }
          )
      });
    } catch (error) {
      console.log(error)
    }
  });


  socket.on("GUEST_BOOK", (id, text, date, nickname) => {
    // console.log(id, text, date)
    io.emit('_GUEST_BOOK', id, text, date, nickname)
  })


  


  socket.on("disconnect", function () {
    if (socket.device && socket.roomName) {
      try {
        console.log(socket.roomName)
        let roomName = socket.roomName;
        Array.from(getListOfSocketsInRoom(roomName)).forEach(id => {
          if (id !== socket.id) {
            const otherUser = io.sockets.sockets.get(id);
            if (otherUser.campus === socket.campus) socket.to(id).emit("OUT_USER", {
              id: socket.id,
            })
          }
        });
        socket.leave(socket.roomName);
      } catch (error) {
        console.log(error);
      }
    }
  });

});
