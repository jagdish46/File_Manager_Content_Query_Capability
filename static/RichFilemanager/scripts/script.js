'use strict';

function createDownloadLink(blob) {
    const url = URL.createObjectURL(blob);
    const au = document.createElement('audio');
    const li = document.createElement('li');
    const link = document.createElement('a');
    //add controls to the <audio> element
    au.controls = true;
    au.src = url;
    //link the a element to the blob
    link.href = url;
    link.download = 'sample' + '.wav';
    link.innerHTML = link.download;
    //add the new audio and a elements to the li element
    li.appendChild(au);
    li.appendChild(link);
    //add the li element to the ordered list
    link.click()
}

document.querySelector('button').addEventListener('click', () => {
(async () => {
   navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          const audioContext = new AudioContext;
          const input = audioContext.createMediaStreamSource(stream);
          const recorder =  new Recorder(input, {numChannels: 1});
          recorder.record();
  setTimeout(async () => {
    await recorder.stop();
    await recorder.exportWAV(createDownloadLink);
    const url = 'http://localhost:5000/speechtotext';
    var response = await fetch(url);
    response = await response.json()
    await console.log(response);
    await console.log(response.textout);
    const outputYou = await document.querySelector('.output-you');
    outputYou.textContent = await response.textout;
    const data1 = await { question: response.textout };
    const outputBot =  document.querySelector('.output-bot');
    const url1 =  'http://localhost:5000/getanswer';
    var response1 = await fetch(url1, {
                                  headers: {
                                 'Content-Type': 'application/json',
                                            },
                                  method: 'POST',
                                  body: JSON.stringify(data1),
                                });
    response1 = await response1.json();
    await console.log(response1);
    outputBot.textContent = await response1.answer;
    await recorder.clear();
    //audio.play();
  }, 4000);
});
})();;

});

/*
const recordAudio = () => {
  return new Promise(resolve => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });

        const start = () => {
          mediaRecorder.start();
        };

        const stop = () => {
          return new Promise(resolve => {
            mediaRecorder.addEventListener("stop", () => {
               console.log("Chunks")
              console.log(audioChunks)
              const audioBlob = new Blob(audioChunks);
              const audioUrl = URL.createObjectURL(audioBlob);
              console.log(audioUrl);
              const audio = new Audio(audioUrl);
              console.log("Audio")
              console.log(audio)
              const a = document.createElement("a");
              a.style = "display: none";
              a.href = audioUrl;
              a.download = 'sample.wav';
              a.click();
              const data = { path: '/Users/Selva/Downloads/output.wav' };
              const url = 'http://localhost:5000/speechtotext';
              const response = fetch(url)
              console.log(response);
              const data1 = { question: response[0].textout };
              const outputYou = document.querySelector('.output-you');
              const outputBot = document.querySelector('.output-bot');
              const url1 = 'http://localhost:5000/getanswer';
              const response1 = fetch(url1, {
                                  headers: {
                                 'Content-Type': 'application/json',
                                            },
                                  method: 'POST',
                                  body: data1,
                                });
              console.log(response1);
              outputYou.textContent = response[0].textout;
              outputBot.textContent = response1[0].answer;
              //document.getElementById("demo").innerHTML = response;
              
              const play = () => {
                audio.play();
              };

              resolve({ audioBlob, audioUrl, play });
            });

            mediaRecorder.stop();
          });
        };

        resolve({ start, stop });
      });
  });
};

document.querySelector('button').addEventListener('click', () => {
(async () => {
  const recorder = await recordAudio();
  recorder.start();

  setTimeout(async () => {
    const audio = await recorder.stop();
    //audio.play();
  }, 5000);
})();;
});
*/

/*document.querySelector('button').addEventListener('click', () => {
  recordAudio();
});
*/
/*
const socket = io();

const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
//const recognition = new new webkitSpeechRecognition();

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

document.querySelector('button').addEventListener('click', () => {
  recognition.start();
});

recognition.addEventListener('speechstart', () => {
  console.log('Speech has been detected.');
});

recognition.addEventListener('result', (e) => {
  console.log('Result has been detected.');

  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;

  outputYou.textContent = text;
  console.log('Confidence: ' + e.results[0][0].confidence);

  socket.emit('chat message', text);
});

recognition.addEventListener('speechend', () => {
  recognition.stop();
});

recognition.addEventListener('error', (e) => {
  outputBot.textContent = 'Error: ' + e.error;
});

function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  synth.speak(utterance);
}

socket.on('bot reply', function(replyText) {
  synthVoice(replyText);

  if(replyText == '') replyText = '(No answer...)';
  outputBot.textContent = replyText;
});
*/
