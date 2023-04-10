async function generateEvent()
{
    const gameTextBody = document.getElementById('game-text');
    const gameOptions = [
        document.getElementById('option-one'),
        document.getElementById('option-two'),
        document.getElementById('option-three'),
        document.getElementById('option-four')
    ]
    const gameImage = document.getElementById('game-image')

    try {
        
        const requestObj = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: null
        };  

        const genEveEP = '/openai/generateEvent'

        console.log("Client: Requesting GPT to initalize game");

        const response = await fetch(genEveEP, requestObj);

        if(!response.ok)
        {
            throw new Error("The story couldn't be generated"); 
        }

        const data = await response.json();
        console.log("Client: Success, game initiatlized");

        // Update frontend
        gameTextBody.textContent = data.output.description;
        gameOptions[0].textContent = data.output.options.option1;
        gameOptions[1].textContent = data.output.options.option2;
        gameOptions[2].textContent = data.output.options.option3;
        gameOptions[3].textContent = data.output.options.option4;
        gameImage.src = data.output.image_url;

    } catch (error) {
        console.log(error);
    }

}

async function setupGame(){
    await generateEvent();
}

setupGame();

const selectForm = document.getElementById('game-select');

selectForm.addEventListener('submit', onFormSubmit);
function onFormSubmit(event){
    event.preventDefault();
    const option = event.submitter.value;
    console.log(`Option ${option} was selected`);
}

