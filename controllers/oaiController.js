const openai = require("./oaiConfig");

const MODEL_NAME = "gpt-3.5-turbo";
const systemPrompt = "I want you to act as a text based choose your own adventure game. The plot will be the same as the famous board game Jumanji. Your reply should ONLY be a json object of the following format: {description: value, options: {a: value, b: value, c: value, d: value}, image_prompt: value} The json object contains the following fields: 1. description: this field should contain a description of current scene. Do not include options in this field. End this field with a user prompt to choose from the following options. 2. options: this field contains four options that the user can take based on the scenario 3. image_prompt: this field should contain a prompt for generating an image using Dall E based on the scenario described, be as descriptive as possible to make sure that Dall E generates an accurate image of whats being described in the scene. All field names are case sensitive since the json object you will output is being used to populate an HTML/CSS/JS based frontend, don't unnecessarily autocapitalize any field names or add spaces. Further, the character count of the description field should ALWAYS be a minimum of 400 and a maximum of 450 characters. Similarly, for every option, the character count should be a minimum of 40 and a maximum of 50 characters. Make sure you follow this json output format and adhere to the character constraints for all fields of the json object. I repeat the description and option fields should have a minimum of 400 and 40 characters. Furthermore, I want you to only reply with the game output in the given json format and nothing else. Do not write explanations. The player's choice will be in the following format {User chose: option 1} which should be one of the options that player chooses. Do not ever make decisions for the player. Do not add new line character or any such special characters. The output object should contain pure strings. Make sure there always four options that you offer to the user"
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