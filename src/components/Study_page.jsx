import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Study_page.css';
import { GoogleGenerativeAI } from "@google/generative-ai";
import useSound from 'use-sound';
import breakEndSound from '../audios/mixkit-cinematic-church-bell-hit-619.mp3';
import focusEndSound from '../audios/mixkit-happy-bells-notification-937.mp3';
import useToken from '../hooks/useToken';
import axios from 'axios';
import { marked } from 'marked';

const Study_page = () => {
  document.title = 'Study With Me';

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [focusTime, setFocusTime] = useState(0); // in minutes
  const [breakTime, setBreakTime] = useState(0); // in minutes
  const [sessions, setSessions] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [isFocusSession, setIsFocusSession] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);

  const [playBreakSound] = useSound(breakEndSound);
  const [playFocusSound] = useSound(focusEndSound);

  // For To-Do List
  const [labels, setLabels] = useState([]);
  const [formHeight, setFormHeight] = useState(25);
  const [isVisible1, setIsVisible1] = useState(() => {
    // Retrieve initial state from localStorage or default to false
    const savedVisibility = localStorage.getItem('isVisible1');
    return savedVisibility ? JSON.parse(savedVisibility) : false;
  });
  // For Chatbot
  const [isVisible2, setIsVisible2] = useState(false); // for chat-bot

  // Convert minutes to seconds
  const toSeconds = (minutes) => minutes * 60;

  // Start button click handler
  const handleStart = () => {
    if (!focusTime || !breakTime || !sessions) {
      alert("Please set all input values.");
      return;
    }
    setTimeRemaining(toSeconds(focusTime));
    setIsFocusSession(true);
    setIsRunning(true);
  };

  // Stop button click handler
  const handleStop = () => {
    setIsRunning(false);
  };

  // Continue button click handler
  const handleContinue = () => {
    setIsRunning(true);
  };

  // Restart button click handler
  const handleRestart = () => {
    setIsRunning(false);
    setCurrentSession(1);
    setIsFocusSession(true);
    setTimeRemaining(toSeconds(focusTime));
  };

  // Countdown timer logic
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (isRunning && timeRemaining === 0) {
      if (isFocusSession) {
        if (currentSession < sessions) {
          setIsFocusSession(false);
          setTimeRemaining(toSeconds(breakTime));
          playBreakSound(); // Play break sound
        } else {
          playBreakSound();
          handleStop();
        }
      } else {
        setIsFocusSession(true);
        setCurrentSession((prev) => prev + 1);
        setTimeRemaining(toSeconds(focusTime));
        playFocusSound(); // Play focus sound
      }
    }
  }, [isRunning, timeRemaining, isFocusSession, currentSession, sessions, focusTime, breakTime]);

  // Display time in mm:ss format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleToDoList = () => {
    setIsVisible1((prev) => {
      const newState = !prev;
      localStorage.setItem("isVisible1", JSON.stringify(newState)); // Save visibility to localStorage
      return newState;
    });
  };

  // Toggle chat-bot visibility
  const toggleChatBot = () => {
    setIsVisible2((prev) => {
      const newState = !prev;
      localStorage.setItem("isVisible2", newState); // Save state to localStorage
      return newState;
    });
  };

  useEffect(() => {
    // Load initial visibility state from localStorage
    const savedVisibility = localStorage.getItem('isVisible1');
    if (savedVisibility !== null) {
      setIsVisible1(JSON.parse(savedVisibility));
    }

    // Load initial labels from localStorage
    const savedLabels = localStorage.getItem('labels');
    if (savedLabels) {
      setLabels(JSON.parse(savedLabels));
    }

    // Load initial formHeight from localStorage
    const savedFormHeight = localStorage.getItem('formHeight');
    if (savedFormHeight) {
      setFormHeight(JSON.parse(savedFormHeight));
    }
  }, []);

// Set up an Axios instance with default headers
  const axiosInstance = axios.create({
    baseURL: 'https://study-app-be-2.onrender.com', 
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const tokenString = localStorage.getItem('token'); // Retrieve token from localStorage
      const token = tokenString ? JSON.parse(tokenString) : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Add Authorization header
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tokenString = localStorage.getItem('token');
        const token = tokenString ? JSON.parse(tokenString) : null;
        const userid = localStorage.getItem('user_id')
        if (token) {
          const response = await axiosInstance.get(`/tasks/${userid}`, userid, {
            headers: {
              'Accept': 'application/json', 
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            const fetchedLabels = response.data.data;
            // console.log(fetchedLabels)
            setLabels(fetchedLabels);
            const newFormHeight = 25 +  fetchedLabels.length * 3;
            setFormHeight(newFormHeight);

            // Save to localStorage
            localStorage.setItem('labels', JSON.stringify(fetchedLabels));
            localStorage.setItem('formHeight', JSON.stringify(newFormHeight))
          }
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);


  const addLabel = async (e) => {
    e.preventDefault();
    if (labels.length >= 8) {
      alert("No more task!");
    } else {
      const newIndex = labels.length;
      try {
        const tokenString = localStorage.getItem('token'); // Retrieve token from localStorage
        const token = tokenString ? JSON.parse(tokenString) : null;
        const response = await axiosInstance.post('/task', 
          { 
            index: newIndex.toString(),
            description: '', 
            remind_noti: false,
            checked: false,
            user_id: localStorage.getItem('user_id').toString() 
          },
          {
            headers: 
            {
              'Accept': 'application/json', 
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          const new_label = {
            id: response.data.data,  
            index: newIndex.toString(),
            description: '', 
            remind_noti: false,
            checked: false,
            user_id: localStorage.getItem('user_id').toString() 
          };
      
          // Update the labels state with the new label
          const updatedLabels = [...labels, new_label]; // Corrected variable name to 'labels'
      
          setLabels(updatedLabels); // Update state with the new label
      
          const newFormHeight = formHeight + 3;
          setFormHeight(newFormHeight); // Update form height
      
          // Save the updated labels and form height to localStorage
          localStorage.setItem('labels', JSON.stringify(updatedLabels));
          localStorage.setItem('formHeight', JSON.stringify(newFormHeight));
        }
      } catch (error) {
        console.error('Error adding label:', error);
        // alert('Failed to add the label. Please try again.');
      }
    }
  };

  const handleLabelChange = async (index, field, value) => {
    try {

      const updatedLabels = labels.map((label, i) =>
        i === index ? { ...label, [field]: value } : label
      );
      
      const updatedLabel = updatedLabels[index];

      const temp = {index: updatedLabel.index.toString(),
        description: updatedLabel.description.toString(), 
        remind_noti: updatedLabel.remind_noti,
        checked: updatedLabel.checked,
        user_id: updatedLabel.user_id.toString()}
      
      
      // Make an API call to update the label
      const response = await axiosInstance.put(`/task/${updatedLabel.id}`, 
        {
          id: updatedLabel.id.toString(),
          index: updatedLabel.index.toString(),
          description: updatedLabel.description.toString(), 
          remind_noti: Boolean(updatedLabel.remind_noti),
          checked: Boolean(updatedLabel.checked),
          user_id: updatedLabel.user_id.toString()
        }, 
        {
        headers: 
          {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
      });

      if (response.status === 200) {
        setLabels(updatedLabels);
        localStorage.setItem('labels', JSON.stringify(updatedLabels));
      } else {
        console.error('Failed to update label');
      }
    } catch (error) {
      console.error('Error updating label:', error);
    }
  };

  const handleDeleteTask = async (index) => {
    try {
      const token = localStorage.getItem('token'); 
      const taskId = labels[index].id; 
      const response = await axiosInstance.delete(`/task/${taskId}`, taskId.toString(), {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
      });
  
      if (response.status === 200) {
        const updatedLabels = labels.filter((label, i) => i !== index); 
        setLabels(updatedLabels); 
        localStorage.setItem('labels', JSON.stringify(updatedLabels)); 
  
        // Update the form height
        const newFormHeight = formHeight - 3;
        setFormHeight(newFormHeight);
        localStorage.setItem('formHeight', JSON.stringify(newFormHeight));
      } else {
        console.error("Error deleting task:", response.data);
      }
    } catch (error) {
      console.error('Error deleting label:', error);
    }
  };

  useEffect(() => {
    // Save the current state to localStorage whenever it changes
    localStorage.setItem('isVisible1', JSON.stringify(isVisible1));
  }, [isVisible1]);

   // Gemini API key
  // const gemini_key = import.meta.env.VITE_GEMINI_API_KEY
  

  const fetchGeminiKey = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      const tokenString = localStorage.getItem('token'); 
      const token = tokenString ? JSON.parse(tokenString) : null;
      const response = await axiosInstance.get(`/user/${userId}/chatbot-api`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
      });
      if(!response.data.data)
      {
         alert("Your Chatbot API has not been set up correctly!")
      }
      return response.data.data
    } catch (error) {
      console.error("Error fetching Gemini API key:", error);
      return null;
    }
  };

  const maxHistory = 5; // max number of past messages to include in context
  const chatHistory = useRef([]); // useRef to store history outside of render cycle

  const updateHistory = (userMessage, aiMessage) => {
    // Update the history with the latest user and AI messages
    chatHistory.current.push({ user: userMessage, bot: aiMessage });
    
    // Keep history length within maxHistory
    if (chatHistory.current.length > maxHistory) {
      chatHistory.current.shift(); // remove the oldest message
    }
  };
   
  const chatWithGemini = async (userInput) => {
     try {

      const geminiKey = await fetchGeminiKey();
      if (!geminiKey) {
        throw new Error("Gemini API key is missing");
      }

      const genAI = new GoogleGenerativeAI(geminiKey);
       // Retrieve the Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      let prompt = "The conversation so far:\n";
      chatHistory.current.forEach((entry) => {
        prompt += `User: ${entry.user}\nBot: ${entry.bot}\n`;
      });
      prompt += `User: ${userInput}\n`;
      prompt += "Give only 1 answer for user question"
      

    // Generate content with the user input and history as the prompt
      const response = await model.generateContent(prompt);


 
       // Generate content with the user input as the prompt
      // const response = await model.generateContent(userInput);
 
       // Return the generated text
      return response.response.text();
      } catch (error) {
        console.error("Error communicating with the Gemini API:", error.message);
        return '';
     }
  };

   const messagesEndRef = useRef(null);
   useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

   // Chatbot submit handler
  //  const handleSubmit = async (e) => {
  //    e.preventDefault();
  //    if (!input.trim()) return;
  //    const userMessage = { text: input, user: true };
  //    setMessages((prevMessages) => [...prevMessages, userMessage]);
  //    const aiMessage = { text: '...', user: false };
  //    setMessages((prevMessages) => [...prevMessages, aiMessage]);
  //    const response = await chatWithGemini(input);
  //    const newAiMessage = { text: response, user: false };
  //    setMessages((prevMessages) => [...prevMessages.slice(0, -1), newAiMessage]);
  //    setInput('');
  //  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = { text: input, user: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
  
    const aiMessage = { text: '...', user: false };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
  
    // Send user input with the conversation history
    const response = await chatWithGemini(input);
    const newAiMessage = { text: response, user: false };
  
    // Update messages and history
    setMessages((prevMessages) => [...prevMessages.slice(0, -1), newAiMessage]);
    updateHistory(input, response); // Update history with the latest exchange
  
    setInput(''); // Clear the input field
  };
  

   
  const { setToken } = useToken();
  // Log out handler
  const logOut = () => {
    setToken("");
    localStorage.removeItem('token');
    localStorage.clear();
    window.location.href = '/';
  };

  const [clientId] = useState(Date.now()); 
  const [chatmessages, setChatMessages] = useState([]); 
  const [inputValue, setInputValue] = useState(''); 
  const ws = useRef(null); 

  function isValidJSON(str) {
    try {
          JSON.parse(str); 
          return true; 
    } catch (e) {
          return false; 
    }
  }
  const chatmessagesEndRef = useRef(null);
  useEffect(() => {
   chatmessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [chatmessages]);


 useEffect(() => {
  const fetchChatHistory = async () => {
      try {
          const token = localStorage.getItem('token'); 
          const response = await axiosInstance.get('/messages', 
            {
              headers: 
              {
                'Accept': 'application/json', 
                'Authorization': `Bearer ${token}`,
              },
            }
          );
          if (response.data.status === 200) {
            const messages = response.data.data;

            // Retrieve user names for each client_id
            const history = await Promise.all(
                messages.map(async (msg) => {
                    const token = localStorage.getItem('token'); 
                    const response = await axiosInstance.get(`user/${msg.client_id}/name`, 
                      {
                        headers: 
                        {
                          'Accept': 'application/json', 
                          'Authorization': `Bearer ${token}`,
                        },
                      }
                    );
                    const userName = response.data.data;

                    return {
                        text: `${userName}: ${msg.data}`,
                        user: msg.client_id !== localStorage.getItem('user_id'), // Broadcast if not the same user
                    };
                })
            );

            setChatMessages(history);
          }
      } catch (error) {
          console.error('Failed to fetch chat history:', error);
      }
  };

  fetchChatHistory();
}, []);


  useEffect(() => {
      // ws.current = new WebSocket(`wss://study-app-be-4.onrender.com/ws/${localStorage.getItem('user_id')}`); 
      ws.current = new WebSocket(`wss://study-app-be-2.onrender.com/ws/${localStorage.getItem('user_id')}`); 
      ws.current.onmessage = async (event) => {
  
          let processedMessage = event.data; 
          let isBroadcast = false;
          // Check if the message is JSON
          if(isValidJSON(processedMessage))
          {   const message = JSON.parse(event.data); // Parse message as JSON
              const userId = message.id; // Extract user ID
              const token = localStorage.getItem('token'); 
              const response = await axiosInstance.get(`user/${userId}/name`, 
                {
                  headers: 
                  {
                    'Accept': 'application/json', 
                    'Authorization': `Bearer ${token}`,
                  },
                }
              );
              const userName = response.data.data;
  
              // Format the message
              if (message.data == "has left the chat")
                processedMessage = `${userName} ${message.data}`;
              else
                processedMessage = `${userName}: ${message.data}`;
              isBroadcast = true;
          } 

          const new_processedMessage = {text: processedMessage, user: isBroadcast}
          setChatMessages((prevMessages) => [...prevMessages, new_processedMessage]);
      };
  
      // Cleanup WebSocket on component unmount
      return () => {
          if (ws.current) ws.current.close();
      };
  }, [clientId]);

    // Handle message send
    const sendChatMessage = (event) => {
        event.preventDefault();
        if (ws.current && inputValue.trim()) {
            ws.current.send(inputValue.trim());
            setInputValue(''); 
        }
    };

  const [isOpen, setIsOpen] = useState(false);
  function toggleChatRoom() {
    setIsOpen((isOpen) => !isOpen);
  }
  
  const navigate = useNavigate();
  const handleSettingsClick = () => {
    navigate('/Setting_page');
  };

  return (
    <div className="app-container">
      <div id="leaves">
        {/* Falling leaves animation */}
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </div>

      <div className="to-do-list-table">
        <button className='hide-to-do-task-btn' onClick={toggleToDoList}>
          Todo lists
        </button>
         {isVisible1 && (
        <div className="to-do-task" style={{ height: `${formHeight}vh` }}>
          <h1 className="table-title">Todo lists</h1>
          {labels.map((label, index) => (
            <div className="each-task" key={index} style={{ marginTop: '10px' }}>
              <input
                className="task-done-check-box"
                type="checkbox"
                checked={label.completed}
                onChange={(e) => handleLabelChange(index, 'checked', e.target.checked)}
              />
              Task {index + 1}
              <input
                className="task-description"
                value={label.description}
                onChange={(e) => handleLabelChange(index, 'description', e.target.value)}
              />
              <button className='task-delete-btn'  onClick={() => handleDeleteTask(index)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="10" height="10">
                  <path d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z"/>
                </svg>
              </button>
              Remind Later
              <input
                className="remind-later-check-box"
                type="checkbox"
                checked={label.reminded}
                onChange={(e) => handleLabelChange(index, 'remind_noti', e.target.checked)}
              />
              
            </div>
          ))}
          <button className="add-task-btn" onClick={addLabel}>Add more</button>
        </div>
      )}
      </div>
      
      {/* Countdown Clock in the center */}
      <div className="countdown-clock">
      <label className="focus-time-label">
        Focus time
        <input
          className="countdown-input-1"
          type="number"
          min="1"
          placeholder="Enter focus time"
          value={focusTime > 0 ? focusTime : ''}
          onChange={(e) => setFocusTime(Number(e.target.value))}
        />
      </label>
      <label className="focus-time-label">
        Break time
        <input
          className="countdown-input-2"
          type="number"
          min="1"
          placeholder="Enter break time"
          value={breakTime > 0 ? breakTime : ''}
          onChange={(e) => setBreakTime(Number(e.target.value))}
        />
      </label>
      <label className="focus-time-label">
        Sessions
        <input
          className="countdown-input-3"
          type="number"
          min="1"
          placeholder="Enter number of sessions"
          value={sessions > 0 ? sessions : ''}
          onChange={(e) => setSessions(Number(e.target.value))}
        />
      </label>
      <label className="time-remain-label">
        <h5>
          Remaining time: {formatTime(timeRemaining)} - {isFocusSession ? 'Focus' : 'Break'} Session
        </h5>
        <h5>Current Session: {currentSession} of {sessions}</h5>
      </label>
      <div className="clock-table-btns">
        <button className="start-clock-btn" onClick={handleStart}>Start</button>
        <button className="stop-clock-btn" onClick={handleStop}>Stop</button>
        <button className="continue-clock-btn" onClick={handleContinue}>Continue</button>
        <button className="restart-clock-btn" onClick={handleRestart}>Restart</button>
      </div>
    </div>
      
      {/* Chatbot */}
      <div className='chatbot-table'>
        <div className='hide-chatbot-btn' onClick={toggleChatBot}>
          Chatbot
        </div>
        {isVisible2 &&
        (<div className="chatbot-container">
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.user ? 'user-message' : 'ai-message'}`}
              >
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>)}

        
      </div>
      {/* Sign out btn */}
      <button className='log-out-btn' onClick={logOut}>Log out</button>

      {/* Chatroom */}
      {isOpen &&
      (<div className="chat-room-container">
        <h3>Chat Room</h3>
        <div className="chat-room-form">
            {chatmessages.map((chatmessage, index) => (
              <div
                  key = {index}
                  className={`${chatmessage.user ? 'broadcast-msg' : 'my-msg'}`}
                >
                  {chatmessage.text}
                </div>
            ))}
            <div ref={chatmessagesEndRef} />
            </div>
            <form className="chat-room-input" onSubmit={sendChatMessage}>
              <input
                    type="text"
                    className="form-control"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a message..."
                    autoComplete="off"
              />
              <button className="chat-room-btn" type="submit">Send</button>
            </form>            
       </div>)}
        <button className='hide-chat-room-btn' onClick={toggleChatRoom}>Chatroom</button>
        <button className='settings-btn' onClick={handleSettingsClick}>Settings</button>
    </div>
  );
};

export default Study_page;
