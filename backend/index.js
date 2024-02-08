const apiKey = "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"
const OpenAI = require('openai');
const express = require('express')
var cors = require('cors')
const app = express()

const openai = new OpenAI({
    apiKey: apiKey, // defaults to process.env["OPENAI_API_KEY"]
});

app.use(cors());

//POST 요청 받을 수 있게 만듬
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// POST method route
app.post('/fortuneTell', async function (req, res) {
    let { myDateTime, userMessage, threadId, sex } = req.body;
    let todayDateTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

    try {
        if (threadId == '') {
            const emptyThread = await openai.beta.threads.create();
            threadId = emptyThread.id;
            await openai.beta.threads.messages.create(
                threadId,
                { role: "user", content: `저의 생년월일과 태어난 시간은 ${myDateTime}입니다.
                내성별은${sex}입니다. 오늘은 ${todayDateTime}입니다.` }
            ); 
        }
        await openai.beta.threads.messages.create(
            threadId,
            { role: "user", content: userMessage }
        );

        let run = await openai.beta.threads.runs.create(
            threadId,
            { assistant_id: "asst_YRAFz6uRYrSCJrWMNePFgApz" } // Ensure this ID is correct
        );

        while (run.status != "completed") {
            run = await openai.beta.threads.runs.retrieve(
                threadId,
                run.id
            );
            await new Promise((resolve) => setTimeout(resolve, 500));
        }

        const threadMessages = await openai.beta.threads.messages.list(threadId);
        const assistantLastMsg = threadMessages.data[0].content[0].text.value;

        res.json({ "assistant": assistantLastMsg, "threadId": threadId });
    } catch (error) {
        console.error("Error during OpenAI API call:", error);
        res.status(500).send("Error processing your request");
    }
});

app.listen(3000);
