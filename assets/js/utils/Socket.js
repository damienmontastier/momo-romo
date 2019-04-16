import io from "socket.io-client";

const url = "https://blooming-garden-58138.herokuapp.com/";

function ID() {
  return (
    "_" +
    Math.random()
    .toString(36)
    .substr(2, 9)
  );
}

export default class Socket {
  constructor() {
    this.ID = "TESTID";
    this.socket = io(url, {
      query: {
        type: "desktop",
      },
    });
    console.log('ok')
    this.addEvent();
    this.createRoom();
  }

  createRoom() {
    this.socket.emit("create room", {
      id: this.ID,
      type: "desktop",
    });
  }

  addEvent() {
    this.socket.on("time", t => {
      console.log(t);
    });
  }
}