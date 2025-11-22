
export function speakText(text, lang = "en-US") {
    if (!text || text.trim() === "") {
        alert("No text to speak!");
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;      
    utterance.rate = 1.0;      
    utterance.pitch = 1.0;      
    
    speechSynthesis.speak(utterance);
}


export function createSpeechRecognition(onResultCallback, lang = "en-US") {
    let recognition = null;

 
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Speech Recognition not supported on this device.");
        return null;
    }

    recognition = new SpeechRecognition();
    recognition.lang = lang;         
    recognition.continuous = true;    
    recognition.interimResults = true; 

    recognition.onresult = (event) => {
        let text = "";
        for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
        }
        onResultCallback(text); 
    };

    recognition.onstart = () => console.log("Speech recognition started...");
    recognition.onend = () => console.log("Speech recognition ended.");

    return recognition;
}

