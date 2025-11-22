
function splitIntoSentences(text) {
    // تقسيم باستخدام النقاط، التعجب، الاستفهام
    return text
        .split(/(?<=[.!?])\s+/)
        .map(sentence => sentence.trim())
        .filter(sentence => sentence.length > 0);
}


function scoreSentences(sentences) {
    const wordFreq = {};
    
    
    sentences.forEach(sentence => {
        const words = sentence.toLowerCase().match(/\b\w+\b/g) || [];
        words.forEach(word => {
            if (!wordFreq[word]) wordFreq[word] = 0;
            wordFreq[word]++;
        });
    });

    
    const scored = sentences.map(sentence => {
        const words = sentence.toLowerCase().match(/\b\w+\b/g) || [];
        let score = 0;
        words.forEach(word => {
            score += wordFreq[word];
        });
        return { sentence, score };
    });

    return scored;
}


export function summarizeText(text, maxSentences = 3) {
    const sentences = splitIntoSentences(text);

    if (sentences.length === 0) return "No text to summarize.";
    if (sentences.length <= maxSentences) return sentences.join(" ");

    const scored = scoreSentences(sentences);

    
    scored.sort((a, b) => b.score - a.score);

   
    const topSentences = scored.slice(0, maxSentences).map(s => s.sentence);

    topSentences.sort((a, b) => sentences.indexOf(a) - sentences.indexOf(b));

    return topSentences.join(" ");
}

