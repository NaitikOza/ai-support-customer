"use client";

import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm EchoBot, the next-gen personalized chatbot. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);

    if (!message.trim()) return; // Don't send empty messages

    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message }, // Add the user's message to the chat
      { role: "assistant", content: "" }, // Add a placeholder for the assistant's response
    ]);

    try {
      // Send the message to the server
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader(); // Get a reader to read the response body
      const decoder = new TextDecoder(); // Create a decoder to decode the response text

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]; // Get the last message (assistant's placeholder)
          let otherMessages = messages.slice(0, messages.length - 1); // Get all other messages
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text }, // Append the decoded text to the assistant's message
          ];
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content:
            "I'm sorry, but I encountered an error. Please try again later.",
        },
      ]);
    }
    setIsLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      bgcolor="background.default"
      sx={{
        background: "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.8))",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.3))",
          opacity: 0.4,
          zIndex: -1,
          filter: "blur(15px)",
        },
      }}
    >
      <Box p={2} sx={{ backgroundColor: "rgba(0, 0, 0, 0.7)", borderBottom: "1px solid rgba(255, 255, 255, 0.2)" }}>
        <Typography
          variant="h4"
          color="white"
          align="center"
          fontWeight="bold"
        >
          EchoBot
        </Typography>
      </Box>
      <Stack
        direction="column"
        flexGrow={1}
        spacing={3}
        p={2}
        overflow="hidden"
        sx={{
          position: "relative",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: "20px",
          boxShadow: "0 0 20px rgba(0, 153, 255, 0.6)",
        }}
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
            >
              <Box
                bgcolor={
                  message.role === "assistant"
                    ? "primary.main"
                    : "brown" // Changed from purple to red for user messages
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "transparent", // Transparent background
                borderRadius: "50px", // Rounded corners
                width: "500px", // Fixed width
                "& fieldset": {
                  borderColor: "white", // White border color
                },
                "&:hover fieldset": {
                  borderColor: "white", // White border color on hover
                },
              },
              "& .MuiInputLabel-root": {
                color: "white", // White label text color
              },
              "& .MuiInputBase-input": {
                color: "white", // White text color inside the input
              },
              "& .MuiInputBase-input::placeholder": {
                color: "white", // White placeholder text color
              },
            }}
            variant="outlined" // Ensure the variant is outlined for proper styling
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={isLoading}
            sx={{ flexShrink: 0 }} // Prevent the button from shrinking
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}




