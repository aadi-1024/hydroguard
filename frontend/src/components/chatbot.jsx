// MyChatBot.js
import React from "react";
import ChatBot from "react-chatbotify";

const MyChatBot = () => {
  async function run(userQuery) {
    const response = await fetch("http://localhost:10000/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userQuery }),
    });
    const data = await response.json();
    return data.response;
  }

  const flow = {
    start: {
      message: "Hello, this is team Hydroguard, talk to us!",
      path: "model_loop",
    },
    model_loop: {
      message: async (params) => {
        return await run(params.userInput, params.streamMessage);
      },
      path: "model_loop"
    },
  }
return (
    <ChatBot flow={flow}/>
  );
};
export default MyChatBot;