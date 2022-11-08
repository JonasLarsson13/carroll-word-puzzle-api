const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';
const printOutRightWord = document.querySelector('#rightGuess');
const input = document.querySelector('input');
const button = document.querySelector('#submit');
const restartBtn = document.querySelector('#restartBtn');
const refreshBtn = document.querySelector('#refresh');
const p = document.querySelector('p');
const winBox = document.querySelector('#win');
const words = [
    {
        word: 'FOUR',
        doneWord: 'FIVE',
        show: 'Raise FOUR to FIVE'
    },
    {
        word: 'EYE',
        doneWord: 'LID',
        show: 'Cover EYE with LID'
    },
    {
        word: 'TIGER',
        doneWord: 'ROSES',
        show: 'Crown TIGER with ROSES'
    },
    {
        word: 'WHEAT',
        doneWord: 'BREAD',
        show: 'Make WHEAT into BREAD'
    },
];
let currentWord = {};
let currentGuess;

function randomizeWord() {
    const h3 = document.querySelector('h3');
    const index = Math.floor(Math.random() * words.length);
    currentWord = {...words[index]};
    h3.innerText = currentWord.show;
    document.querySelector('#word').innerText = currentWord.word;
    document.querySelector('#done').innerText = currentWord.doneWord;
};

async function wordCheck(word) {
    const response = await fetch(`${BASE_URL}/${word}`);
    const data = response.json();
    return data;
}

function checkIfValidWord(word) {
    if(!currentGuess) {
        let currentCount;
        [...word].forEach((letter, index) => {
            [...currentWord.word].forEach((let, i) => {
                if(letter === let && index === i) {
                    !currentCount ? currentCount = 1 : currentCount += 1;
                }
            });
        });
        if(currentCount === (currentWord.word.length - 1)) {
            currentGuess = word;
            printOutRightWord.innerHTML = `<span>${word}</span><b>></b>`;
            input.value = '';
        } else {
            input.value = '';
            p.style.color = 'red';
            return p.innerText = `${word} must match ${currentWord.word} with at least ${currentWord.word.length - 1} letters`;
        }
    } else {
        let currentCount;
        [...word].forEach((letter, index) => {
            [...currentGuess].forEach((let, i) => {
                if(letter === let && index === i) {
                    !currentCount ? currentCount = 1 : currentCount += 1;
                }
            });
        });
        if(currentCount === (currentWord.word.length - 1)) {
            if(word === currentWord.doneWord) {
                document.querySelector('i').innerText = '';
                input.value = '';
                winBox.style.opacity = '1';
                winBox.style.pointerEvents = 'all';
                document.querySelector('#walkTheLine').innerHTML = `${currentWord.word}<b>></b>${printOutRightWord.innerHTML}<span>${word}</span>`;
            } else {
                currentGuess = word;
                printOutRightWord.innerHTML = `${printOutRightWord.innerHTML}<span>${word}</span><b>></b>`;
                input.value = '';
            }
        } else {
            input.value = '';
            p.style.color = 'red';
            return p.innerText = `${word} must match ${currentGuess ? currentGuess : currentWord.word} with at least ${currentGuess ? (currentGuess.length - 1) : (currentWord.word.length - 1)} letters`;
        }
    }
};

function handleSubmit() {
    p.innerText = '';
    const word = input.value.toUpperCase();
    if(word.length === 0 || !/^[a-z]+$/i.test(word)) {
        p.style.color = 'red';
        input.value = '';
        return p.innerText = 'You must enter a word..'
    }

    wordCheck(word)
    .then((res) => {
        if(res.title?.includes('No Definitions Found')) {
            input.value = '';
            p.style.color = 'red';
            return p.innerText = `${word} was not found in dictionary, try another word..`;
        } else {
            if(word === currentWord.word) {
                input.value = '';
                p.style.color = 'red';
                return p.innerText = `${word} is the same word as ${currentWord.word}, guess again`;
            } else {
                return checkIfValidWord(word);
            }
        }
    });
}

function refreshGame() {
    printOutRightWord.innerHTML = '';
    document.querySelector('i').innerText = '?...';
    currentWord = {};
    currentGuess = '';
    winBox.style.opacity = '0';
    winBox.style.pointerEvents = 'none';
    p.innerText = '';
    document.querySelector('#walkTheLine').innerHTML = '';
    randomizeWord();
};

button.addEventListener('click', handleSubmit);

window.addEventListener('keypress', (e) => {
    if(e.code === 'Enter') {
        handleSubmit();
    } else {
        return;
    }
});

restartBtn.addEventListener('click', refreshGame);
refreshBtn.addEventListener('click', refreshGame);

randomizeWord();