export function setupAudio() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let blowIntensity = 0;
    let analyser, microphone, scriptProcessor;
    
    // Sound effects
    const sounds = {
        blow: new Audio('assets/sounds/blow.mp3'),
        birthday: new Audio('assets/sounds/birthday.mp3'),
        fire: new Audio('assets/sounds/fire.mp3')
    };
    
    sounds.birthday.loop = true;
    sounds.fire.loop = true;
    
    // Setup microphone
    function setupMicrophone() {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(stream => {
                microphone = audioContext.createMediaStreamSource(stream);
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                
                scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
                
                microphone.connect(analyser);
                analyser.connect(scriptProcessor);
                scriptProcessor.connect(audioContext.destination);
                
                scriptProcessor.onaudioprocess = () => {
                    const array = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(array);
                    
                    let total = 0;
                    for (let i = 0; i < array.length; i++) {
                        total += array[i];
                    }
                    
                    blowIntensity = Math.min(1, total / (array.length * 100));
                };
                
                sounds.birthday.play();
                sounds.fire.play();
            })
            .catch(err => {
                console.error('Microphone access denied:', err);
                // Fallback to keyboard/mouse interaction
                document.addEventListener('keydown', (e) => {
                    if (e.code === 'Space') blowIntensity = 1;
                });
                
                document.addEventListener('keyup', () => {
                    blowIntensity = 0;
                });
            });
    }
    
    setupMicrophone();
    
    return {
        get blowIntensity() { return blowIntensity; },
        playRelightSound() {
            sounds.fire.currentTime = 0;
            sounds.fire.play();
        }
    };
}
