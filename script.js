//local storage: best score saved with name. the least number of wrong guesses counts as the best score. 

async function start() {
  //takes random word from getRandomWord function and puts it into "secret" variable. splits the word into individual letters. start at image = 0 (no man yet)
  let secret = await getRandomWord()
  let secretArr = secret.split("")
  let imageIndex = 0

  console.log(secret)

  //creates a blank array that will hold the user's guesses for as long as the secret word. 
  let blankArr = []
  for (let i = 0; i < secretArr.length; i++) {
    blankArr[i] = "_"
  }

  //creates a variable "letters" that holds only letter values. used later
  let letters = /^[a-zA-Z]+$/

  //prompts user to input their name to keep track of who has the best score
  let person = prompt("What is your name?", "Hangman");

  //set up to later code. 
  let correctGuesses = document.querySelector("#correct-guesses")
  let rightLetter = blankArr.join(" ")
  correctGuesses.innerHTML = rightLetter
  let incorrectGuesses = document.querySelector("#incorrect-guesses")
  let letterElem = document.querySelector("#letter")

  //creates a blank array that will store the user's wrong guessees
  let wrongGuessesArr = []

  //on first play: because there's no value for "score," it takes the value of "null"
  //on additional plays: gets the current score from local storage
  let score = localStorage.getItem("score")

  //adds an event listener to the input box. when the user presses a certain key, the following code will run
  letterElem.addEventListener('keydown', (event) => {

    //input must match values of "letters" variable, which are only letters (ie only allows letters to be entered as guesses)
    if (letterElem.value.match(letters)) {

      //if the user presses enter, the following code will run.
      if (event.key == "Enter") {

        //checks to see if the letter the user entered matches any letter in the secret word. if yes, following code will run
        if (secretArr.includes(letterElem.value)) {

          //for loop that checks if each letter of the secret word matches the user's input letter
          for (let i = 0; i < secretArr.length; i++) {

            //if the user's input letter matches a letter of the secret, will put the correct guess in the correct letter place
            if (secretArr[i] == letterElem.value) {
              blankArr[i] = secretArr[i]
            }
          }

          //correct guesses are printed to the screen in the correct place
          rightLetter = blankArr.join(" ")
          correctGuesses.innerHTML = rightLetter
          console.log(blankArr)

          //once all the letters are correctly guessed, tells user they won, tells them the word, and disables input boxes. 
          if (secretArr.join("") == blankArr.join("")) {
            correctGuesses.innerHTML = "YOU WIN! :)"
            incorrectGuesses.innerHTML = "Word: " + secretArr.join("")
            letterElem.disabled = true
            wordGuess.disabled = true

            //if the there is no score, it will update the latest score as the best score so far
            if (score == null) {
              score = wrongGuessesArr.length
              localStorage.setItem('score', score)

              //if the person's name has a value, it will store their name in local storage
              if (person != null) {
                localStorage.setItem('userName', person)
              }
            }

            //if the user's number of incorrect guess (ie the score) is less than the current score, it will update to show the latest, lowest (best) score
            else if (wrongGuessesArr.length < score) {
              score = wrongGuessesArr.length
              localStorage.setItem('score', score)

              //if the person's name has a value, it will store their name in local storage
              if (person != null) {
                localStorage.setItem('userName', person)
              }
            }
          }
        }

        //if the user's inputted letter does not match any of the secret word's letters, the following code will run
        else {

          //if the user has not guessed a letter and it isn't in the secret word, the following code will run
          if (!wrongGuessesArr.includes(letterElem.value)) {

            //user input letter is pushed into the array that holds incorrect guesses. it then prints this letter to the screen. ie displays letters not in secret word
            wrongGuessesArr.push(letterElem.value)
            incorrectGuesses.innerHTML = "Guesses: " + wrongGuessesArr.join(" ")

            //increments the hangman image by one (ie add more "limbs")
            imageIndex++
            let hangmanImageElem = document.querySelector("#hangman-img")
            hangmanImageElem.src = "Assets/Images/hangman" + imageIndex + ".png"

            //if the "hangman" picture completes, ie the user runs out of attempts, tells user they lost and disables the input boxes
            if (imageIndex >= 7) {
              incorrectGuesses.innerHTML = "Word: " + secretArr.join("")
              correctGuesses.innerHTML = "YOU LOSE :("
              letterElem.disabled = true
              wordGuess.disabled = true
            }

          }
        }
        //clears input box
        letterElem.value = ""
      }
    }
  })

  //the following code allows the user to attempt and guess the word in full
  let wordGuess = document.querySelector("#word")

  //if they hit enter in the word guess box, the following code will run
  wordGuess.addEventListener('keydown', (event => {

    //following code only runs if the input word are letters
    if (wordGuess.value.match(letters)) {
      if (event.key == "Enter") {

        //if the word they guess equals the secret word, gives user feedback and tells them they win. also displays the secret word and disables input boxes
        if (secretArr.join("") == wordGuess.value) {
          correctGuesses.innerHTML = "YOU WIN! :)"
          letterElem.disabled = true
          wordGuess.disabled = true
          incorrectGuesses.innerHTML = "Word: " + secretArr.join("")

          //if the there is no score, it will update the latest score as the best score so far
          if (score == null) {
            score = wrongGuessesArr.length
            localStorage.setItem('score', score)

            //if the person's name has a value, it will store their name in local storage
            if (person != null) {
              localStorage.setItem('userName', person)
            }
          }

          //if the user's number of incorrect guess (ie the score) is less than the current score, it will update to show the latest, lowest score
          else if (wrongGuessesArr.length < score) {
            score = wrongGuessesArr.length
            localStorage.setItem('score', score)

            //if the person's name has a value, it will store their name in local storage
            if (person != null) {
              localStorage.setItem('userName', person)
            }
          }
        }

        //if the word does not equal the secret word, the following code will run (user loses the game)
        else {
          let hangmanImageElem = document.querySelector("#hangman-img")
          hangmanImageElem.src = "Assets/Images/hangman7.png"
          correctGuesses.innerHTML = "YOU LOSE :("
          incorrectGuesses.innerHTML = "Word: " + secretArr.join("")
          letterElem.disabled = true
          wordGuess.disabled = true
        }

        //clears input box after hitting enter
        wordGuess.value = ""
      }
    }
  }))
}

//local storage. when the page is reloaded, the user with the best score will be displayed on the screen
window.addEventListener('load', () => {
  let savedScore = localStorage.getItem('score')
  let savedName = localStorage.getItem('userName')
  document.getElementById("name").innerHTML = "Best score: " + savedName + " with " + savedScore + " guesses!"
})

//start a new game by pressing a button which reloads the page
let newGame = document.querySelector("#new")
newGame.addEventListener('click', () => {
  location.reload()
})


start()
//this function gets all the words from github and keeps only the words that are 5-8 letters
async function getRandomWord() {
  const wordsGit = await fetch("https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-no-swears.txt")
  const wordsTxt = await wordsGit.text()
  const wordsList = wordsTxt.split("\n")
  console.log(wordsList)

  //blank array to hold all the words to be filtered
  let filteredWords = []

  //this for statement only puts the words that are 5-8 letters into the filteredWords array
  for (let i = 0; i < wordsList.length; i++) {
    let word = wordsList[i]
    if (word.length >= 5 && word.length <= 8) {
      filteredWords.push(word)
    }
  }

  //uses a random number to select a random "secret" word and returns it
  const randomNum = Math.floor(Math.random() * filteredWords.length)
  console.log(randomNum)
  const randomWord = filteredWords[randomNum]
  return (randomWord)
}