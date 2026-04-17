const OllamaURL = "http://localhost:11434/api/generate";
const model = "llama3";
const maxRetries = 3;

const vaildGreetings = ["hello", "hi", "dear", "greetings", "good morning", "good afternoon", "good evening"];
const commentaryFlags = ["i'm going to", "i will choose", "option", "i'll write", "here is", "here's"];
const validRankings = ["important", "not important"];

function getPrompt() {
    return `You are the boss of the user in ACME CORP. ACME CORP is a Game Design company, 
        similar to Nintendo, Xbox, or Playstation, same size and audience. Your job is to 
        create one single email talking about one of the following: a world event that could 
        affect the company, an internal change in the company, something that would only be 
        relevant to a different type of company or a specific role that isn't the recipient's, 
        or something unimportant. Your job is to choose one of those four options and write up 
        that email. The tone of the email should be formal and corporate. Do not reveal or hint 
        at which of the four options you chose. Please do not return or talk about anything that 
        is unrelated to the given assignment. Said email should be returned in this format: 
        Start the email with "Hello all,", "Hi," or any other way to greet someone over email. 
        After that, go into the bulk of the email, and end the email with 
        "Thank you, {GENERATE RANDOM NAME}." The bulk of the email must be between 20-30 words. 
        The greeting and sign-off do not count toward the word count. Wrap the ENTIRE email 
        (greeting, body, and sign-off all together) between exactly two '*' symbols — one '*' at 
        the very start before the greeting, and one '*' at the very end after the sign-off. 
        Use '*' nowhere else.`;
}

function getRankedPrompt(emailText) {
    return `You are a senior executive at ACME CORP, a major Game Design company similar in size 
        and audience to Nintendo, Xbox, or PlayStation. You must rank the following email as 
        either "Important" or "Not Important" based on these strict criteria:

        IMPORTANT means the email directly affects ACME CORP's core business, such as:
        - Game releases, delays, or cancellations
        - Studio acquisitions or partnerships
        - Layoffs, restructuring, or leadership changes
        - Internal software or tools used in game development
        - World events that impact game production, distribution, or revenue
        - Esports tournaments or major events hosted or sponsored by ACME CORP
        - Any shift in company strategy or direction

        NOT IMPORTANT means the email has no meaningful impact on ACME CORP's operations, such as:
        - Generic updates unrelated to game development
        - Topics only relevant to a completely different industry
        - Personal or trivial matters

        Email to rank:
        ${emailText}

        Return ONLY "Important" or "Not Important". 
        Wrap your response between exactly two '*' symbols — one '*' at the very start and one '*' 
        at the very end. Use '*' nowhere else.`;
}

async function callOllama(prompt) {
    const response = await fetch(OllamaURL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({model: model, prompt, stream: false}),
    });

    const ollamaData = await response.json();

    return ollamaData.response;
}

function normalizeResponse(text) {
    const firstFlag = text.indexOf("*");
    const lastFlag = text.lastIndexOf("*");

    if (firstFlag !== -1 && lastFlag !== -1 && firstFlag !== lastFlag) {return text.slice(firstFlag + 1, lastFlag).trim();}
    
    return text.replace(/\*/g, "").trim();
}
 
function cleanEmail(text) {
    const lowerResponse = text.toLowerCase().trim();

    let earliest = text.length;

    for (const greeting of vaildGreetings) {
        const idx = lowerResponse.indexOf(greeting);
        if (idx !== -1 && idx < earliest) {earliest = idx;}
    }

    return earliest < text.length ? text.slice(earliest).trim() : text.trim();
}
 
function isValidEmail(text) {
    const lowerResponse = text.toLowerCase().trim();
    const startsWithGreeting = vaildGreetings.some(g => lowerResponse.startsWith(g));
    const hasSignoff = lowerResponse.includes("thank you");
    const isCommentary = commentaryFlags.some(f => lowerResponse.includes(f));
    
    return startsWithGreeting && hasSignoff && !isCommentary;
}
 
function isValidRank(text) {
    return validRankings.includes(text.trim().toLowerCase());
}

async function tryGenerateEmail() {
    let generatedEmail = "";
    
    for (let ollamaAttempt = 0; ollamaAttempt < maxRetries; ollamaAttempt++) {
        const raw = await callOllama(getPrompt());
        
        generatedEmail = cleanEmail(normalizeResponse(raw));
        
        if (isValidEmail(generatedEmail)) {
            console.log(`[generate] Success on attempt ${ollamaAttempt + 1}`);
            return generatedEmail;
        
        }
        console.log(`[generate] Attempt ${ollamaAttempt + 1} failed validation, retrying...`);
    }
    
    console.log("[generate] All retries exhausted, returning lastFlag result");
    return generatedEmail;
}
 
async function tryRankEmail(emailText) {
    let rankedEmail = "";
    
    for (let ollamaAttempt = 0; ollamaAttempt < maxRetries; ollamaAttempt++) {
        const raw = await callOllama(getRankedPrompt(emailText));
        
        rankedEmail = normalizeResponse(raw).trim();
        
        if (isValidRank(rankedEmail)) {
            console.log(`[rankedEmail] Success on ollamaAttempt ${ollamaAttempt + 1}`);
            return rankedEmail.toLowerCase() === "important" ? "important" : "not important";
        
        }
        console.log(`[rankedEmail] ollamaAttempt ${ollamaAttempt + 1} invalid output '${rankedEmail}', retrying...`);
    }
    
    console.log("[rankedEmail] All retries exhausted, returning lastFlag result");
    return rankedEmail.toLowerCase();
}