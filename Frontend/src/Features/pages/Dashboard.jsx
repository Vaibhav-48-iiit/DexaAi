import { useState } from 'react';
import { Bot, Mic, MicOff, LogOut } from 'lucide-react';
import { generateAiResponse, executeAiCommand, searchFiles } from '../Ai/ai.service';
import { ChatMessage } from '../Ai/components/ChatMessage';
import { ChatInput } from '../Ai/components/ChatInput';
import { VoiceOrb } from '../Ai/components/VoiceOrb';
import { useVoiceAssistant } from '../Auth/hooks/VoiceAssistant'; 
import { Authuse } from '../Auth/hooks/useAuth';

const Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { handleLogout } = Authuse();

  // --- 1. CONNECT THE VOICE ASSISTANT ---
  const handleVoiceCommand = (transcript) => {
     processCommand(transcript);
  };

  // Pulling in the functions you just built in Step 1!
  const { isListening, isAwake, liveTranscript, startListening, stopListening, speak } = useVoiceAssistant(handleVoiceCommand);

  // Start listening to the microphone manually via the UI button (Fixes Browser Auto-start blocking)

  // --- 2. REFACTORED SEND LOGIC (Works for typing AND voice) ---
  const processCommand = async (commandText) => {
    if (!commandText.trim()) return;

    const newMessages = [...messages, { role: 'user', content: commandText }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const aiResponse = await generateAiResponse(commandText);
      const replyText = aiResponse.aidecision?.reply || aiResponse.message;
      
      // Dexa Speaks Out Loud!
      if (aiResponse.requires_approval) {
        speak("I need your approval to run this command.");
      } else {
        speak(replyText);
      }

      setMessages([...newMessages, { 
        role: 'ai', 
        content: aiResponse.requires_approval ? "I need permission to run a command." : replyText,
        requires_approval: aiResponse.requires_approval,
        action: aiResponse.action,
        proposed_command: aiResponse.proposed_command,
        search_query: aiResponse.search_query,
        search_drive: aiResponse.search_drive,
        ai_thought: aiResponse.ai_thought || (aiResponse.aidecision && aiResponse.aidecision.thought),
        status: 'pending'
      }]);
    } catch (error) {
      console.log(error)
      setMessages([...newMessages, { role: 'ai', content: "Sorry, I encountered an error." }]);
      speak("Sorry, I encountered an error communicating with the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    processCommand(input);
  };

  // --- 3. MULTI-STEP APPROVAL NARRATION ---
  const handleApproveAction = async (index, msg) => {
    setMessages(prev => prev.map((m, i) => i === index ? { ...m, status: 'executing' } : m));
    
    // Dexa speaks when you click approve!
    speak("Executing command now.");

    try {
      if (msg.action === 'search_files') {
        const searchResult = await searchFiles(msg.search_query, msg.search_drive);
        setMessages(prev => prev.map((m, i) => i === index ? { ...m, status: 'approved', searchResults: searchResult.files } : m));
        speak(`Found ${searchResult.files.length} files.`);
      } else {
        const execResult = await executeAiCommand(msg.proposed_command);
        setMessages(prev => prev.map((m, i) => i === index ? { ...m, status: 'approved', executionOutput: execResult.output || "Success" } : m));
        speak("Execution successful.");
      }
    } catch (error) {
      setMessages(prev => prev.map((m, i) => i === index ? { ...m, status: 'failed', executionOutput: error.response?.data?.error || "Execution failed" } : m));
      speak("Execution failed.");
    }
  };

  const handleDenyCommand = (index) => {
    setMessages(prev => prev.map((msg, i) => i === index ? { ...msg, status: 'denied' } : msg));
    speak("Command denied.");
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#090A0F] text-white font-sans overflow-hidden">
      
      {/* Top Right Logout Button */}
      <button 
        onClick={handleLogout}
        className="absolute top-8 right-8 z-50 flex items-center space-x-2 px-4 py-2 bg-neutral-900/50 hover:bg-neutral-800 border border-white/10 rounded-full text-sm font-bold text-neutral-400 hover:text-white transition-all backdrop-blur-md"
      >
        <span>Logout</span>
        <LogOut className="w-4 h-4" />
      </button>

      {/* ================= LEFT PANEL: VOICE ASSISTANT ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center p-12 border-r border-neutral-800/50 bg-linear-to-b from-neutral-950/40 to-neutral-900/20">
         
         {/* Status Header */}
         <div className="absolute top-8 left-8 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
            <Bot className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-300">Dexa AI</h1>
            <p className={`text-xs font-bold ${isAwake ? 'text-green-400' : 'text-neutral-500'}`}>
              {isAwake ? 'ONLINE & LISTENING' : 'WAITING FOR WAKE WORD'}
            </p>
          </div>
        </div>

        {/* The 3D WebGL Orb */}
        <div className="relative w-80 h-80 flex items-center justify-center mb-6 mt-4">
            {/* Ambient Background Glow */}
            <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-1000 ${isAwake ? 'bg-cyan-500/20' : 'bg-white/5'}`} />
            
            <VoiceOrb isAwake={isAwake} isListening={isListening} />
        </div>

        <p className="text-neutral-400 text-sm mt-8 max-w-sm text-center font-mono">
          {isAwake ? "Listening to your voice..." : "Say 'dexa initialize my setup' to begin."}
        </p>

        {/* LIVE SUBTITLES */}
        <div className="h-12 mt-2 w-full max-w-sm flex items-center justify-center">
            {liveTranscript && (
               <p className="text-white text-lg font-bold text-center animate-pulse">
                  "{liveTranscript}"
               </p>
            )}
        </div>
        
        {/* Mic Toggle Button */}
        <button 
          onClick={isListening ? stopListening : startListening}
          className={`mt-6 px-6 py-3 rounded-full flex items-center space-x-2 font-bold transition-all ${isListening ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-white text-black hover:bg-neutral-200'}`}
        >
          {isListening ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4" />}
          <span>{isListening ? 'Microphone Active' : 'Microphone Paused'}</span>
        </button>

      </div>

      {/* ================= RIGHT PANEL: TEXT CHAT ================= */}
      <div className="flex-1 flex flex-col h-full bg-neutral-900/50 relative z-10">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-neutral-500 mt-20">
              <p>Chat history will appear here.</p>
            </div>
          )}
          
          {messages.map((msg, index) => (
            <ChatMessage 
              key={index} 
              msg={msg} 
              onApprove={() => handleApproveAction(index, msg)}
              onDeny={() => handleDenyCommand(index)}
              onOpenFile={async (filePath) => {
                try {
                  await executeAiCommand(`explorer "${filePath}"`);
                } catch (e) {
                  console.error("Failed to open file", e);
                }
              }}
            />
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-neutral-800 rounded-lg p-3 text-sm animate-pulse text-neutral-400">Dexa is thinking...</div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <ChatInput input={input} setInput={setInput} onSend={handleSend} loading={loading} />
      </div>

    </div>
  );
};

export default Dashboard;
