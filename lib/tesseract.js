

export async function recognizeImage(imageFile, lang = "eng") {
   
    const { createWorker } = Tesseract;
    const worker = await createWorker({
        logger: m => console.log(m) 
    });

    try {
      
        await worker.loadLanguage(lang);
        await worker.initialize(lang);

       
        const result = await worker.recognize(imageFile);

        return result.data.text; 
    } catch (err) {
        console.error("OCR Error:", err);
        return "❌ OCR Error: " + err.message;
    } finally {
        
        await worker.terminate();
    }
}
