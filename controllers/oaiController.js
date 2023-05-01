const openai = require("./oaiConfig");
const systemPrompt = process.env.PROMPT;
const MODEL_NAME = "gpt-3.5-turbo";
let eventHistory = [];

function updateEventHistory(role, content){
  const newEvent = {
    role: role, content: content
  };
  eventHistory.push(newEvent);
  console.log(`Server: Updating eventHistory with new element: ${JSON.stringify(newEvent)}`);
}

const generateEvent = async(req, res) => {
  try {
    console.log("Server: Generating event");

    // Init request or user input
    if(req.body.choice != -1){
      console.log(`Server: User chose option ${req.body.choice}`);
      updateEventHistory('user', `{User chose: option ${req.body.choice}`);
    }
    else if(req.body.choice == -1){
      console.log("Server: Initializing game");
      eventHistory = [{ role: 'system', content: systemPrompt }];
    }

    console.log("Server: Requesting createChatCompletion method");

    const response = await openai.createChatCompletion({
      model: MODEL_NAME,
      messages: eventHistory,
    });

    const outputString = response.data.choices[0].message.content;
    const outputJSON = JSON.parse(outputString);

    console.log("Server: Event description and options generated");
    // console.log(outputJSON);

    // Update eventHistory
    updateEventHistory('assistant', JSON.stringify(outputJSON));

    // Add DALL E image url
    const imageUrl = await generateImage(outputJSON);
    outputJSON.image_url = imageUrl;


    res.status(200).json({ output: outputJSON});

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error });
  }
};

async function generateImage(outputJSON){
  try{
    console.log("Server: Generating image");
    // Update eventHistory
    updateEventHistory('assistant', JSON.stringify(outputJSON));
    const request = {prompt: outputJSON.image_prompt, n: 1, size: '256x256'}
    const response = await await openai.createImage(request);
    const imageUrl = response.data.data[0].url;
    console.log("Server: Generated image successfully");
    return imageUrl;
  } catch(error) {
    console.log(error)
    res.status(500).json({ error: error });
  }
}

module.exports = generateEvent;