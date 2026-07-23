import { useEffect, useState, useRef } from "react";

export const useVoiceAssistant = (onCommandReceived) => {
    const [isListening, setIsListening] = useState(false);
    const [isAwake, setisAwakeState] = useState(false); // control dexa activated or not
    const isAwakeRef = useRef(false);
    
    // Wrapper to update both state and ref
    const setisAwake = (val) => {
        isAwakeRef.current = val;
        setisAwakeState(val);
    };

    const [liveTranscript, setLiveTranscript] = useState(""); // Live subtitles!
    const recognitionRef = useRef(null);
    const onCommandReceivedRef = useRef(onCommandReceived);
    const isSpeakingRef = useRef(false); // Add flag to pause mic during speech
    const isListeningRef = useRef(false); // Ref for accurate closure access

    // Keep the callback ref updated without triggering re-renders
    useEffect(() => {
        onCommandReceivedRef.current = onCommandReceived;
    }, [onCommandReceived]);

    // Keep isListening ref synced
    useEffect(() => {
        isListeningRef.current = isListening;
    }, [isListening]);

    // 1. SETUP (TEXT TO SPEECH)
    const speak = (text, onEndCallback = null) => {
        window.speechSynthesis.cancel(); // stop anything currently playing

        // Abort mic immediately so it doesn't hear itself
        isSpeakingRef.current = true;
        if (recognitionRef.current) {
            recognitionRef.current.abort();
        }

        const utterance = new SpeechSynthesisUtterance(text);
         
        const voices = window.speechSynthesis.getVoices();
        const bestVoice = voices.find(v => v.name === 'Microsoft Aria Online (Natural) - English (United States)');

        if (bestVoice) utterance.voice = bestVoice;

        const handleEnd = () => {
            if (onEndCallback) {
                onEndCallback();
            }
            
            // Wait 500ms after speaking finishes before unpausing the mic.
            // This prevents the mic from catching the room echo of Dexa's own voice!
            setTimeout(() => {
                isSpeakingRef.current = false;
                
                if (isListeningRef.current) {
                    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
                        try { recognitionRef.current?.start(); } catch(e) { console.warn("Mic start error:", e); }
                        stream.getTracks().forEach(track => track.stop());
                    }).catch((e) => { console.warn("getUserMedia error:", e); });
                }
            }, 500);
        };

        utterance.onend = handleEnd;
        utterance.onerror = handleEnd;
        
        window.speechSynthesis.speak(utterance);
    }

    // 2. SETUP (SPEECH TO TEXT)
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.warn("Browser not support speech recognition");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognitionRef.current = recognition;

        recognition.onresult = (event) => {
            const current = event.resultIndex;
            const transcript = event.results[current][0].transcript.trim().toLowerCase();
            const isFinal = event.results[current].isFinal;

            // Instantly show what the computer is hearing!
            setLiveTranscript(transcript);

            // check word for awake (check both spellings just in case!)
            if (!isAwakeRef.current && (transcript.includes("dexa initialise") || transcript.includes("dexa initialize") || transcript.includes("initialize my setup"))) {
                setisAwake(true);
                speak("setup initialized. what should i do?");
                setLiveTranscript("");
                return;
            }

            // if awake and command is spoken, ONLY send it if it's the final sentence
            if (isAwakeRef.current && transcript && isFinal) {
                onCommandReceivedRef.current(transcript);
                setLiveTranscript("");
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech Recognition Error:", event.error);
        };

        recognition.onend = () => {
            console.log("Speech Recognition ENDED.");
            // auto-restart listening if it stops randomly AND dexa is NOT currently speaking
            if (isListeningRef.current && !isSpeakingRef.current) {
                // Force the browser to ask for Microphone permission!
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then((stream) => {
                        try { recognition.start(); } catch (e) { console.error(e); }
                        stream.getTracks().forEach(track => track.stop());
                    })
                    .catch(err => {
                        console.error("Microphone permission was denied or failed:", err);
                    });
            }
        };

        // START IT IF STATE IS LISTENING
        if (isListening) {
            // Force the browser to ask for Microphone permission!
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    // Start speech recognition once we know permission is granted
                    try { recognition.start(); } catch (e) { console.error(e); }
                    
                    // We don't actually need this stream (SpeechRecognition handles its own), so stop it
                    stream.getTracks().forEach(track => track.stop());
                })
                .catch(err => {
                    console.error("Microphone permission was denied or failed:", err);
                });
        }

        return () => {
            recognition.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isListening]);

    // 3. CONTROLS
    const startListening = () => {
        setIsListening(true);
    };

    const stopListening = () => {
        setIsListening(false);
    };

    return {
        isListening,
        isAwake,
        liveTranscript,
        startListening,
        stopListening,
        speak
    };
};
