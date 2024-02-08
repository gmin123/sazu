const apiKey = "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";
const OpenAI = require('openai');
const express = require('express');
var cors = require('cors');
const app = express();

const openai = new OpenAI({
    apiKey: apiKey, // defaults to process.env["OPENAI_API_KEY"]
});

app.use(cors());

// POST 요청 받을 수 있게 만듦
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// POST method route for '/sazuTell'
app.post('/sazuTell', async function(req, res) {
    let { myDateTime, sazuuserMessage, sazuthreadId } = req.body;
    let todayDateTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

    try {
        if (sazuthreadId == '') {
            const emptyThread = await openai.beta.threads.create();
            sazuthreadId = emptyThread.id;
            await openai.beta.threads.messages.create(
                sazuthreadId,
                { role: "user", content: `저의 생년월일과 태어난 시간은 ${myDateTime}입니다. 오늘은 ${todayDateTime}입니다.` }
            ); 
        }
        await openai.beta.threads.messages.create(
            sazuthreadId,
            { role: "user", content: sazuuserMessage }
        );

        let run = await openai.beta.threads.runs.create(
            sazuthreadId,
            { assistant_id: "asst_YRAFz6uRYrSCJrWMNePFgApz" }
        );

        while (run.status != "completed") {
            run = await openai.beta.threads.runs.retrieve(
                sazuthreadId,
                run.id
            );
            await new Promise((resolve) => setTimeout(resolve, 500));
        }

        const threadMessages = await openai.beta.threads.messages.list(sazuthreadId);
        console.log(JSON.stringify(threadMessages, null, 2));

        let assistantLastMsg = "";
        threadMessages.data.forEach((message, index) => {
            console.log(`Message ${index}:`, message);
            if (message.role === 'assistant') {
                console.log(`Message ${index} Content:`, message.content);
                assistantLastMsg = message.content[0].text.value;
            }
        });

        res.json({ "sazuassistant": assistantLastMsg, "sazuthreadId": sazuthreadId });
    } catch (error) {
        console.error("Error in '/sazuTell' route:", error);
        res.status(500).send("Error processing your request");
    }
});

// POST method route for '/fortuneTell'
app.post('/fortuneTell', async function (req, res) {
    let { myDateTime, userMessage, threadId } = req.body;
    let todayDateTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

    try {
        if (threadId == '') {
            const emptyThread = await openai.beta.threads.create();
            threadId = emptyThread.id;
            await openai.beta.threads.messages.create(
                threadId,
                { role: "user", content: `저의 생년월일과 태어난 시간은 ${myDateTime}입니다. 오늘은 ${todayDateTime}입니다.` }
            ); 
        }
        await openai.beta.threads.messages.create(
            threadId,
            { role: "user", content: userMessage }
        );

        let run = await openai.beta.threads.runs.create(
            threadId,
            { assistant_id: "asst_JbjkLxNGbQWBplAG4oubvArZ" }
        );

        while (run.status != "completed") {
            run = await openai.beta.threads.runs.retrieve(
                threadId,
                run.id
            );
            await new Promise((resolve) => setTimeout(resolve, 500));
        }

        const threadMessages = await openai.beta.threads.messages.list(threadId);
        console.log(JSON.stringify(threadMessages, null, 2));

        let assistantLastMsg = "";
        threadMessages.data.forEach((message, index) => {
            console.log(`Message ${index}:`, message);
            if (message.role === 'assistant') {
                console.log(`Message ${index} Content:`, message.content);
                assistantLastMsg = message.content[0].text.value;
            }
        });

        res.json({ "assistant": assistantLastMsg, "threadId": threadId });
    } catch (error) {
        console.error("Error in '/fortuneTell' route:", error);
        res.status(500).send("Error processing your request");
    }
});

// 서버 시작
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
