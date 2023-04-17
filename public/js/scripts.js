// const { reset } = require("nodemon");

// Document elements
const gameTextBody = document.getElementById('game-text');
const gameOptions = [
    document.getElementById('option-one'),
    document.getElementById('option-two'),
    document.getElementById('option-three'),
    document.getElementById('option-four')
]
const gameImage = document.getElementById('game-image');
const selectForm = document.getElementById('game-select');

const loremIpsumLong = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos ipsam quae adipisci quis illum quibusdam ipsum incidunt enim vel, est mollitia molestias ut velit quo, hic illo, officiis deleniti dolor? Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos ipsam quae adipisci quis illum quibusdam ipsum incidunt enim vel, est mollitia molestias ut velit quo, hic illo, officiis deleniti dolor?'
const loremIpsumShort = 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.'
const loremIpsumURL = 'https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ddyz8qnOhFeFKY-_c3tleQ.jpeg'

// Generate event functions
async function generateEvent(userInput)
{

    try {
        
        const requestObj = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'choice': userInput}),
        };  

        const genEveEP = '/openai/generateEvent'

        console.log("Client: Requesting GPT to initalize game");

        const response = await fetch(genEveEP, requestObj);

        if(!response.ok)
        {
            throw new Error("Client: The event couldn't be generated"); 
        }

        const data = await response.json();
        console.log("Client: Event generated successfully");

        // Update frontend
        gameTextBody.textContent = data.output.description;
        gameOptions[0].textContent = data.output.options.a || data.output.options.A;
        gameOptions[1].textContent = data.output.options.b || data.output.options.B;
        gameOptions[2].textContent = data.output.options.c || data.output.options.C;
        gameOptions[3].textContent = data.output.options.d || data.output.options.D;
        gameImage.src = data.output.image_url;

    } catch (error) {
        console.log(error);
    }

}

async function main(){
    console.log("Client: Fresh session")
    await generateEvent(-1);
}

main();

selectForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const option = event.submitter.value;
    console.log(`Option ${option} was selected`);
    await generateEvent(option);
});

function toggleLoadingAnimation(){
    // TODO
}