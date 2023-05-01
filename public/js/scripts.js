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
const gameWrapper = document.getElementsByClassName('game-wrapper')[0];
const loadingWrapper = document.getElementsByClassName('loading-wrapper')[0];
const errorWrapper = document.getElementsByClassName('error-wrapper')[0];

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

        if (userInput == -1){
            console.log("Client: Requesting GPT to initalize game");
        }
        else{
            console.log("Client: Requesting GPT to generate next event");
        }

        setGameState(1);
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
        setGameState(0);

    } catch (error) {
        console.log(error);
        setGameState(-1);
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
    console.log(`Client: Option ${option} was selected`);
    await generateEvent(option);
});

function setGameState(state){
    if (state == 1){
        errorWrapper.classList.add('hide');
        gameWrapper.classList.add('hide');
        loadingWrapper.classList.remove('hide');
        selectForm.classList.add('no-click')
    }
    if(state == 0){
        errorWrapper.classList.add('hide');
        loadingWrapper.classList.add('hide');
        gameWrapper.classList.remove('hide');
        selectForm.classList.remove('no-click')

    }
    if(state == -1){
        gameWrapper.classList.add('hide');
        loadingWrapper.classList.add('hide');
        errorWrapper.classList.remove('hide');
    }
}