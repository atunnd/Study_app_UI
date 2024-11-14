import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Study_page.css';
import { GoogleGenerativeAI } from "@google/generative-ai";
import useSound from 'use-sound';
import breakEndSound from '../audios/mixkit-cinematic-church-bell-hit-619.mp3';
import focusEndSound from '../audios/mixkit-happy-bells-notification-937.mp3';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const Study_page = () => {
  const navigate = useNavigate();
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
  //const [isVisible1, setIsVisible1] = useState(false); // for to-do-list table
  const [isVisible1, setIsVisible1] = useState(() => {
    // Retrieve initial state from localStorage or default to false
    const savedVisibility = localStorage.getItem('isVisible1');
    return savedVisibility ? JSON.parse(savedVisibility) : false;
  });
  // For Chatbot
  const [isVisible2, setIsVisible2] = useState(false); // for chat-bot

  // Helper to convert minutes to seconds
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

  const addLabel = (e) => {
    e.preventDefault();
    if (formHeight >= 50) {
      alert("No more task!");
    } else {
      const newLabel = { description: '', time: '', completed: false };
      const updatedLabels = [...labels, newLabel];

      setLabels(updatedLabels);
      localStorage.setItem('labels', JSON.stringify(updatedLabels)); // Save updated labels to localStorage

      // setFormHeight(formHeight + 3);
      const newFormHeight = formHeight + 3;
      setFormHeight(newFormHeight);
      localStorage.setItem('formHeight', JSON.stringify(newFormHeight));
    }
  };

  const handleLabelChange = (index, field, value) => {
    const updatedLabels = labels.map((label, i) =>
      i === index ? { ...label, [field]: value } : label
    );
    setLabels(updatedLabels);
    localStorage.setItem('labels', JSON.stringify(updatedLabels)); // Save changes to localStorage
  };

  // Log out handler
  const logOut = () => {
    alert("Goodbye");
    navigate('/');
  };

  // Gemini API key
  const genAI = new GoogleGenerativeAI("AIzaSyBoRr8S8UEnBPKJt0NY0xPERoAaq3-OwHs");
  const chatWithGemini = async (userInput) => {
    try {
      // Retrieve the Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Generate content with the user input as the prompt
      const response = await model.generateContent(userInput);

      // Return the generated text
      return response.response.text().trim();
    } catch (error) {
      console.error("Error communicating with the Gemini API:", error.message);
      return '';
    }
  };

  // Chatbot submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { text: input, user: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const aiMessage = { text: '...', user: false };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
    const response = await chatWithGemini(input);
    const newAiMessage = { text: response, user: false };
    setMessages((prevMessages) => [...prevMessages.slice(0, -1), newAiMessage]);
    setInput('');
  };

  useEffect(() => {
    // Save the current state to localStorage whenever it changes
    localStorage.setItem('isVisible1', JSON.stringify(isVisible1));
  }, [isVisible1]);

  const handleDeleteTask = (index) => {
    const updatedLabels = labels.filter((label, i) => i !== index); // Remove task at the given index
    setLabels(updatedLabels); // Update state
    localStorage.setItem('labels', JSON.stringify(updatedLabels)); // Save updated labels to localStorage

    const newFormHeight = formHeight - 3;
    setFormHeight(newFormHeight);
    localStorage.setItem('formHeight', JSON.stringify(newFormHeight));
  };
  

  const clearLocalStorage = () => {
    localStorage.clear(); // Or use localStorage.removeItem('key') for specific items
    alert('Local storage cleared!');
  };

  return (
    <div className="app-container">
       <button onClick={clearLocalStorage}>Clear Local Storage</button>
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
                onChange={(e) => handleLabelChange(index, 'completed', e.target.checked)}
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
                onChange={(e) => handleLabelChange(index, 'reminded', e.target.checked)}
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
          className="countdown-input"
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
          className="countdown-input"
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
          className="countdown-input"
          type="number"
          min="1"
          placeholder="Enter number of sessions"
          value={sessions > 0 ? sessions : ''}
          onChange={(e) => setSessions(Number(e.target.value))}
        />
      </label>
      <label className="time-remain-label">
        <h4>
          Remaining time: {formatTime(timeRemaining)} - {isFocusSession ? 'Focus' : 'Break'} Session
        </h4>
        <h4>Current Session: {currentSession} of {sessions}</h4>
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


        {/* Sign out btn */}
        <button className='log-out-btn' onClick={logOut}>Log out</button>
      </div>
    </div>
  );
};

export default Study_page;
