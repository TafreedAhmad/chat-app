import React, { useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [currentMessage, setcurrentMessage] = useState("");
  const [messageList, setmessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      var date = new Date();
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: date.getHours() + ":" + date.getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setmessageList((arr) => [...arr, messageData]);
      setcurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setmessageList((arr) => [...arr, data]);
    });
    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="hey..."
          onChange={(event) => {
            setcurrentMessage(event.target.value);
          }}
          onKeyDown={(event) => {
            event.code === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
