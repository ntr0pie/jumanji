const openai = require("./oaiConfig");

const STORY_CHAR_LIMIT = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos ipsam quae adipisci quis illum quibusdam ipsum incidunt enim vel, est mollitia molestias ut velit quo, hic illo, officiis deleniti dolor? Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos ipsam quae adipisci quis illum quibusdam ipsum incidunt enim vel, est mollitia molestias ut velit quo, hic illo, officiis deleniti dolor?".length;
const OPTION_CHAR_LIMIT = "Lorem ipsum dolor, sit amet consectetur adipisicing elit.".length;

const systemPrompt = "I want you to act as a text based choose your own adventure game. The plot will be the same as the famous board game Jumanji. Your reply should ONLY be a json object of the following format: {description: value, options: {option1: value, option2: value, option3: value, option4: value}, image_prompt: value} The json object contains the following fields: 1. description: this field should contain a description of current scene. Do not include options in this field. End this field with a user prompt to choose from the following options. 2. options: this field contains four options that the user can take based on the scenario 3. image_prompt: this field should contain a prompt for generating an image using Dall e based on the scenario described, be as descriptive as possible to make sure that dall e generates an accurate image of whats being described in the scene. Further, the character count of the description field should ALWAYS be a minimum of 400 and a maximum of 450 characters. Similarly, for every option, the character count should be a minimum of 40 and a maximum of 50 characters. Make sure you follow this json output format and adhere to the character constraints for all fields of the json object. Furthermore, I want you to only reply with the game output in the given json format and nothing else. Do not write explanations. The player's choice will be in the following format {User chose: option 1} which should be one of the options that player chooses. Do not ever make decisions for the player. Do not add new line character or any such special characters. The output object should contain pure strings."

const generateEvent = async(req, res) => {
  try {
    console.log("Server: Generating event");
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt }, 
        // { role: "user", content: text }, 
      ],
    });

    const outputString = response.data.choices[0].message.content;
    const outputJSON = JSON.parse(outputString);
    console.log("Server: Event description and options generated");
    console.log(outputJSON);

    // Add DALL E image url
    const imageUrl = await generateImage(outputJSON.image_prompt);
    outputJSON.image_url = imageUrl;

    res.status(200).json({ output: outputJSON});

  } catch (error) {
    console.error("Error", error.response.data.error);
    res.status(500).json({ error: error.message });
  }
};

async function generateImage(prompt){
  try{
    console.log("Server: Generating image");
    const request = {prompt: prompt, n: 1, size: '256x256'}
    const response = await await openai.createImage(request);
    const imageUrl = response.data.data[0].url;
    console.log("Server: Generated image successfully");
    return imageUrl;
  } catch(error) {
    console.log(error.response.status);
    console.log(error.response.data);
    return "error";
  }
}

module.exports = generateEvent;