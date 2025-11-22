
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
let selectedImage = null;

imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;
    selectedImage = file;
    previewImage.src = URL.createObjectURL(file);
});


document.getElementById("btnOcr").addEventListener("click", async () => {
    if (!selectedImage) {
        alert("Please upload an image first!");
        return;
    }

    const ocrResult = document.getElementById("ocrResult");
    ocrResult.value = "Extracting text... Please wait ⏳";

    try {
        const { createWorker } = Tesseract;
        const worker = await createWorker({
            logger: m => console.log(m)
        });

        await worker.loadLanguage("eng");
        await worker.initialize("eng");

        const result = await worker.recognize(selectedImage);
        ocrResult.value = result.data.text;

        await worker.terminate();
    } catch (err) {
        ocrResult.value = "❌ OCR Error: " + err.message;
    }
});

document.getElementById("btnSummarize").addEventListener("click", () => {
    const text = document.getElementById("ocrResult").value.trim();
    const summary = document.getElementById("summaryResult");


    const sentences = text.split(/[.!?]/).filter(s => s.length > 10);
    if (sentences.length === 0) {
        summary.value = "Could not summarize.";
        return;
    }

    const first = sentences[0];
    const last = sentences.length > 1 ? sentences[sentences.length - 1] : "";
    summary.value = `• Main Idea: ${first.trim()}\n\n• Conclusion: ${last.trim()}`;
});


document.getElementById("btnSpeak").addEventListener("click", () => {
    const text = document.getElementById("summaryResult").value.trim() ||
                 document.getElementById("ocrResult").value.trim();
    if (!text) {
        alert("No text to speak!");
        return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 1;
    utter.pitch = 1;
    speechSynthesis.speak(utter);
});


const btnRecord = document.getElementById("btnRecord");
const recordStatus = document.getElementById("recordStatus");
const speechBox = document.getElementById("speechToText");

let recognition;
let isRecording = false;

if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
        let text = "";
        for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
        }
        speechBox.value = text;
    };

    recognition.onstart = () => recordStatus.innerText = "Recording... 🎙️";
    recognition.onend = () => recordStatus.innerText = "Not recording";
} else {
    alert("Speech Recognition not supported on this device.");
}

btnRecord.addEventListener("click", () => {
    if (!recognition) return;
    if (!isRecording) {
        recognition.start();
        isRecording = true;
        btnRecord.innerText = "Stop Recording";
    } else {
        recognition.stop();
        isRecording = false;
        btnRecord.innerText = "Start Recording";
    }
});
