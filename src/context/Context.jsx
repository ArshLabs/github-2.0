import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [allChats, setAllChats] = useState([]);
    const [darkMode, setDarkMode] = useState(false);

    const onSent = async (prompt) => {
        let conversationPrompt = prompt || input;

        setChatHistory(prev => [...prev, { role: 'user', text: conversationPrompt }]);
        setRecentPrompt(conversationPrompt);

        if (!showResult) {
            setPrevPrompts(prev => [...prev, conversationPrompt]);
        }

        setResultData("");
        setShowResult(true);
        setLoading(true);

        try {
            const formattedHistory = chatHistory.map(message => ({
                role: message.role === 'user' ? 'user' : 'model',
                parts: [{ text: message.text }]
            }));

            const response = await runChat(conversationPrompt, formattedHistory);

            const responseArray = response.split('**');
            let formattedResponse = "";
            for (let i = 0; i < responseArray.length; i++) {
                if (i === 0 || i % 2 !== 1) {
                    formattedResponse += responseArray[i];
                } else {
                    formattedResponse += "<b>" + responseArray[i] + "</b>";
                }
            }
            formattedResponse = formattedResponse.split('*').join("</br>");

            setChatHistory(prev => [...prev, { role: 'gemini', text: formattedResponse }]);
            setResultData(formattedResponse);

        } catch (error) {
            console.error("Gemini API Error:", error);
            const errorMessage = "Sorry, an error occurred. Please try again.";
            setChatHistory(prev => [...prev, { role: 'gemini', text: errorMessage }]);
        } finally {
            setLoading(false);
            setInput("");
        }
    };

    const newChat = () => {
        if (chatHistory.length > 0) {
            setAllChats(prev => [...prev, chatHistory]);
        }
        setChatHistory([]);
        setLoading(false);
        setShowResult(false);
        setInput("");
        setRecentPrompt("");
    };

    const loadChat = (prompt) => {
        const chatToLoad = allChats.find(chat => chat[0].text === prompt);
        if (chatToLoad) {
            setChatHistory(chatToLoad);
            setRecentPrompt(prompt);
            setShowResult(true);
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        chatHistory,
        loadChat,
        darkMode,
        toggleDarkMode
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;