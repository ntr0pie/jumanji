async function generateEvent(userInput)
{
    const gameTextBody = document.getElementById('game-text');
    const gameOptions = [
        document.getElementById('option-one'),
        document.getElementById('option-two'),
        document.getElementById('option-three'),
        document.getElementById('option-four')
    ]
    const gameImage = document.getElementById('game-image');

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
    await generateEvent(-1);
}

main();



const selectForm = document.getElementById('game-select');

selectForm.addEventListener('submit', onFormSubmit);
async function onFormSubmit(event){
    event.preventDefault();
    const option = event.submitter.value;
    console.log(`Option ${option} was selected`);
    await generateEvent(option);
}

