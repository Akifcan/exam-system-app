const questionScreens = document.querySelectorAll('.question-screen')
const ruleScreens = document.querySelectorAll('.rule-items')

const rules = document.getElementById('rules')
const acceptRules = document.getElementById('accept-rules')
const totalTime = document.getElementById('total-time')
const remainTime = document.getElementById('remain-time')
const askPermission = document.getElementById('ask-permission')

const nextButton = document.getElementById('next-question')
const backButton = document.getElementById('back-question')

const camera = document.querySelector('.camera video')

let cameraStreamData
let screenStremData
let currentQuestion = 0
const totalQuestion = parseInt(document.querySelector('.questions-wrapper').getAttribute('total-question'))
let mockTotalTime = 600000
let mediaRecorder
let chunks = [];
let faceInterval


//source: https://www.codegrepper.com/code-examples/javascript/how+to+convert+milliseconds+to+minutes+javascript
function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}


function showQuestion() {
    document.querySelectorAll('.question-item').forEach(item => item.classList.add('d-none'))
    document.getElementById(`question-item-${currentQuestion}`).classList.remove('d-none')
}


askPermission.addEventListener('click', _ => {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(cameraStream => {
            navigator.mediaDevices.getDisplayMedia({ video: { cursor: 'always' } })
                .then(async screenStream => {
                    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
                    cameraStreamData = cameraStream
                    screenStremData = screenStream
                    document.getElementById('permission').classList.add('d-none')
                    ruleScreens.forEach(item => item.classList.remove('d-none'))
                    mediaRecorder = new MediaRecorder(screenStream)
                    mediaRecorder.start()


                    console.log(mediaRecorder.state);
                })
        })
})

acceptRules.addEventListener('click', _ => {
    acceptRules.classList.add('d-none')
    rules.classList.add('d-none')
    questionScreens.forEach(screen => screen.classList.remove('d-none'))
    camera.srcObject = cameraStreamData
    camera.play()
    startExam()
    catchTab()
    detectFaces()

    showQuestion()

    const interval = setInterval(() => {
        mockTotalTime -= 1000
        remainTime.innerText = millisToMinutesAndSeconds(mockTotalTime)
        if (mockTotalTime === 0) {
            clearInterval(interval)
            finishExam(true)
        }
    }, 1000)
})


function detectFaces() {

    let counter = 0
    let cancelCount = 1


    function faces() {
        counter++

        faceInterval = setInterval(async () => {
            const detections = await faceapi.detectAllFaces(camera)
            if (!detections.length) {
                Snackbar.show({ text: 'Lütfen kendinizi gösterin' });
            }
            if (detections.length > 1) {
                Snackbar.show({ text: 'Kamerada birden fazla kişi gözüküyor' });
            }
            console.log(detections.length);
            if (!detections.length || detections.length >= 2) {
                counter++
                console.log('counter' + counter);
                if (counter >= 5) {
                    console.log('cancel' + cancelCount);
                    counter = 0
                    cancelCount++
                    if (cancelCount === 3) {
                        clearInterval(faceInterval)
                        finishExam(false)
                    }
                }
            }
        }, 1000)
    }
    faces()

}

function catchTab() {
    window.addEventListener('blur', () => finishExam(false))
}

function finishExam(success) {
    clearInterval(faceInterval)
    cameraStreamData.getTracks().forEach(track => track.stop())
    screenStremData.getTracks().forEach(track => track.stop())
    mediaRecorder.stop()

    mediaRecorder.addEventListener('stop', _ => {
        const blob = new Blob(chunks, { 'type': 'video/webm' });
        const formData = new FormData()
        formData.append('video', new File([blob], 'exam-student'))
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        if (success) {
            window.location.href = '/exam-end'
        } else {
            window.location.href = '/exam-cancelled'
        }

        chunks = []
    })

    mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
    }


}

function startExam() {

    nextButton.addEventListener('click', _ => {
        if (currentQuestion < totalQuestion - 1) {
            currentQuestion++
            showQuestion()
        } else {
            var confirmModal = new bootstrap.Modal(document.getElementById('confirm-exam'))
            confirmModal.show()
            document.getElementById('confirm').addEventListener('click', _ => {
                finishExam(true)
            })
        }
    })

    backButton.addEventListener('click', _ => {
        if (currentQuestion > 0) {
            currentQuestion--
            showQuestion()
        }
    })






    totalTime.innerText = millisToMinutesAndSeconds(mockTotalTime)
}

