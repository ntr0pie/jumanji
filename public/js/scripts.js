async function generateEvent()
{

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

