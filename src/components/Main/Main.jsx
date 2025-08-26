import React, { useContext } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    setInput,
    input,
    chatHistory,
    darkMode,
    toggleDarkMode
  } = useContext(Context);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input) {
      onSent(input);
      setInput("");
    }
  };

  const cardsData = [
    { text: "Suggest beautiful places to see on an upcoming road trip", icon: assets.compass_icon },
    { text: "Briefly summarize this concept: urban planning", icon: assets.bulb_icon },
    { text: "Brainstorm team bonding activities for our work retreat", icon: assets.message_icon },
    { text: "Improve the readability of the following code", icon: assets.code_icon }
  ];

  const handleCardClick = (prompt) => {
    onSent(prompt);
  };

  return (
    <div className={`main ${darkMode ? 'dark-mode' : ''}`}>
      <div className="nav">
        <p>Gemini 2.0</p>
        <div className="nav-right-icons">
          <img
            onClick={toggleDarkMode}
            src={darkMode ? assets.dark_mode_on_icon : assets.dark_mode_off_icon}
            alt="Toggle Dark Mode"
            className="dark-mode-icon"
          />
          <img src={assets.user_icon} alt="User Profile" className="user-profile-icon" />
        </div>
      </div>
      <div className="main-container">
        {showResult
          ? <div className="result">
            {chatHistory.map((item, index) => (
              <div key={index} className={`result-${item.role === 'user' ? 'title' : 'data'}`}>
                <img
                  src={item.role === 'user' ? assets.user_icon : assets.gemini_icon}
                  alt=""
                  className={item.role === 'user' ? 'user-icon-result' : 'gemini-icon-result'}
                />
                <p dangerouslySetInnerHTML={{ __html: item.text }}></p>
              </div>
            ))}
            {loading && (
              <div className="result-data">
                <img src={assets.gemini_icon} alt="" className="gemini-icon-result" />
                <div className="loader">
                  <hr className="animated-bg" />
                  <hr className="animated-bg" />
                  <hr className="animated-bg" />
                </div>
              </div>
            )}
          </div>
          : <>
            <div className="greet">
              <p><span>Hello, Dev.</span></p>
              <p>How can I help you today?</p>
            </div>
            <div className="cards">
              {cardsData.map((card, index) => (
                <div key={index} className="card" onClick={() => handleCardClick(card.text)}>
                  <p>{card.text}</p>
                  <img src={card.icon} alt="" className="card-icon" />
                </div>
              ))}
            </div>
          </>
        }

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              value={input}
              type="text"
              placeholder='Enter a prompt here'
            />
            <div>
              <img src={assets.gallery_icon} width={30} alt="" className="search-icon" />
              <img src={assets.mic_icon} width={30} alt="" className="search-icon" />
              {input ? <img onClick={() => onSent(input)} src={assets.send_icon} width={30} alt="" className="search-icon" /> : null}
            </div>
          </div>
          <p className="bottom-info">
            Gemini may display inaccurate info, including about people, so double-check its responses. Your privacy and Gemini Apps
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;