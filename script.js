const questions = [
    {
        question: "مين الي عرف اسم كنزي؟",
        options: ["مس شيماء", "فارس", "عمر هاني", "عمر عادل"],
        correctAnswer: 0 // مس شيماء هي الإجابة الصحيحة
    },
    {
        question: "مين الي بدأ بالكلام مع تاني (عمر و كنزي)؟",
        options: ["عمر عادل", "كنزي", "عمر هاني الي قال له", "فارس الي قال له"],
        correctAnswer: 1 // كنزي هي الإجابة الصحيحة
    },
    {
        question: "مين أكبر واحد في شلتنا؟",
        options: ["عمر هاني", "عمر عادل", "فارس", "سارة"],
        correctAnswer: 0 // عمر هاني هي الإجابة الصحيحة
    },
    {
        question: "مين أغبى واحد فينا؟",
        options: ["فارس", "عمر عادل", "عمر هاني", "سارة"],
        correctAnswer: 0 // فارس هي الإجابة الصحيحة
    },
    {
        question: "أكمل اسم سارة في....",
        options: ["البيت", "السلم", "الجراچ", "المدرسة"],
        correctAnswer: 1 // السلم هي الإجابة الصحيحة
    },
    {
        question: "من هي صاحبة أغنية بتمني انساك؟",
        options: ["شرين", "سارة", "كنزي", "سلمي"],
        correctAnswer: 0 // شرين هي الإجابة الصحيحة
    }
];
const images = [
    'image1.jpg',
    'image2.jpg', 
    'image3.jpg',
    'image4.jpg',
    'image5.jpg'
];
let currentQuestion = 0;
let score = 0;
let currentImage = 0;
let isFlipped = false;
let stream = null;
let isCameraFlipped = false;
let facingMode = "user";
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1376272541093593212/Y_yjQC_Urr0nkQKHV47kDcMGWM1shXj0kbJx9yAfqEWjLe6bkpfvFHPy2G6jnPP2__lr";
let countdownInterval;
const endDate = new Date(new Date().getFullYear(), 4, 26).getTime(); 
function updateCountdown() {
    const now = new Date().getTime();
    const birthDate = new Date(1991, 4, 26).getTime(); // شهر 5 (مايو) يبدأ من 4 في JavaScript
    
    // حساب العمر
    const ageMillis = now - birthDate;
    const years = Math.floor(ageMillis / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((ageMillis % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
    const days = Math.floor((ageMillis % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ageMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ageMillis % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ageMillis % (1000 * 60)) / 1000);

    // حساب الوقت المتبقي حتى عيد الميلاد القادم
    const nextBirthday = new Date(new Date().getFullYear(), 4, 26);
    if (nextBirthday.getTime() < now) {
        nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    const timeLeft = nextBirthday.getTime() - now;

    const countdownHTML = document.getElementById('countdown');
    
    // التحقق مما إذا كنا في صفحة الصور
    const isGalleryScreen = document.getElementById('gallery-screen').style.display === 'block';
    
    if (!isGalleryScreen) {
        countdownHTML.style.display = 'none';
        return;
    } else {
        countdownHTML.style.display = 'block';
    }

    if (timeLeft > 0) {
        const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);

        countdownHTML.innerHTML = `
            <div class="countdown-section">
                <div class="countdown-title">الوقت المتبقي حتى عيد الميلاد 🎂</div>
                <div class="countdown-container">
                    <div class="countdown-item">${daysLeft}<br/>يوم</div>
                    <div class="countdown-item">${hoursLeft}<br/>ساعة</div>
                    <div class="countdown-item">${minutesLeft}<br/>دقيقة</div>
                    <div class="countdown-item">${secondsLeft}<br/>ثانية</div>
                </div>
                <div class="birthday-message">
                    العمر الحالي: ${years} سنة و 
                    <br>
                    ${hours} ساعة و ${minutes} دقيقة و ${seconds} ثانية
                </div>
            </div>
        `;
    } else {
        countdownHTML.innerHTML = `
            <div class="countdown-section">
                <div class="celebration-message">
                    <h2>عيد ميلاد سعيد! 🎉🎂</h2>
                    <p>كل عام وأنتِ بخير يا مس آية قنديل!</p>
                    <div class="birthday-message">
                        العمر: ${years} سنة و ${months} شهر و ${days} يوم
                        <br>
                        ${hours} ساعة و ${minutes} دقيقة و ${seconds} ثانية
                    </div>
                </div>
            </div>
        `;
    }
}
function startCountdown() {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}
function startQuiz() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    showQuestion();
    startCountdown(); 
}
function showQuestion() {
    const question = questions[currentQuestion];
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('current-question').textContent = currentQuestion + 1;  
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(button);
    });
}
function checkAnswer(selectedAnswer) {
    const question = questions[currentQuestion];
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(button => {
        button.disabled = true;
    });
    if (selectedAnswer === question.correctAnswer) {
        score++;
    }
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }, 500);
}
function createCelebration() {
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    document.querySelector('.score-container').appendChild(celebration); 
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        const colors = ['#6366f1', '#4f46e5', '#10b981', '#f59e0b', '#ef4444'];
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.width = confetti.style.height = Math.random() * 8 + 6 + 'px';
        confetti.style.animation = `confettiFall ${Math.random() * 2 + 1}s linear forwards`;
        confetti.style.opacity = '1';
        celebration.appendChild(confetti);
    }
}
function showResult() {
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
    const scorePercentage = (score / questions.length) * 100;
    const scoreElement = document.getElementById('score');
    const scoreContainer = document.querySelector('.score-container');
    const progressRing = document.createElement('div');
    progressRing.className = 'progress-ring';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '150');
    svg.setAttribute('height', '150');
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'gradient');
    gradient.innerHTML = `
        <stop offset="0%" stop-color="#6366f1" />
        <stop offset="100%" stop-color="#4f46e5" />
    `;
    defs.appendChild(gradient);
    svg.appendChild(defs);
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('class', 'progress-ring-circle');
    circle.setAttribute('cx', '75');
    circle.setAttribute('cy', '75');
    circle.setAttribute('r', '65');
    svg.appendChild(circle);
    progressRing.appendChild(svg);
    const message = document.createElement('div');
    message.className = 'score-message';
    if (scorePercentage >= 80) {
        message.textContent = 'ممتاز! أداء رائع 🌟';
        scoreContainer.classList.add('completed');
    } else if (scorePercentage >= 60) {
        message.textContent = 'جيد جداً! استمر في التحسن 💪';
    } else {
        message.textContent = 'حاول مرة أخرى، أنت قادر على الأفضل ✨';
    }
    scoreContainer.insertBefore(progressRing, scoreContainer.firstChild);
    scoreElement.textContent = '0';
    scoreContainer.appendChild(message);
    const circumference = 2 * Math.PI * 65;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;
    let currentScore = 0;
    const duration = 2000;
    const steps = 60;
    const increment = score / steps;
    const stepDuration = duration / steps;
    const scoreAnimation = setInterval(() => {
        currentScore += increment;
        if (currentScore >= score) {
            currentScore = score;
            clearInterval(scoreAnimation);
            scoreElement.style.transform = 'scale(1.2)';
            setTimeout(() => {
                scoreElement.style.transform = 'scale(1)';
                createCelebration();
            }, 200);
        }
        scoreElement.textContent = Math.round(currentScore);
        
            const currentPercentage = (currentScore / questions.length) * 100;
        circle.style.strokeDashoffset = circumference - (currentPercentage / 100) * circumference;
    }, stepDuration);
}
function showGallery() {
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('gallery-screen').style.display = 'block';
    updateGalleryImage();
    startCountdown(); 
}
function updateGalleryImage() {
    const img = document.getElementById('current-gallery-image');
    img.src = images[currentImage];
    img.className = 'gallery-image' + (isFlipped ? ' flipped' : '');
}
function nextImage() {
    currentImage = (currentImage + 1) % images.length;
    updateGalleryImage();
}
function prevImage() {
    currentImage = (currentImage - 1 + images.length) % images.length;
    updateGalleryImage();
}
function flipImage() {
    isFlipped = !isFlipped;
    updateGalleryImage();
}
function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    currentImage = 0;
    isFlipped = false;
    document.getElementById('gallery-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
}
function showCamera() {
    clearInterval(countdownInterval); 
    document.getElementById('gallery-screen').style.display = 'none';
    document.getElementById('camera-screen').style.display = 'block';
    startCamera();
}
async function startCamera() {
    try {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: facingMode
            },
            audio: false
        });
        const video = document.getElementById('camera-preview');
        video.srcObject = stream;
        video.className = "";
    } catch (err) {
        console.error('خطأ في تشغيل الكاميرا:', err);
        alert('لا يمكن الوصول إلى الكاميرا');
    }
}
async function flipCamera() {
    facingMode = facingMode === "user" ? "environment" : "user";
    await startCamera();
}
function capturePhoto() {
    const video = document.getElementById('camera-preview');
    const canvas = document.getElementById('camera-canvas');
    const capturedImage = document.getElementById('captured-image');
    const captureBtn = document.querySelector('.control-btn[onclick="capturePhoto()"]');
    const retryBtn = document.querySelector('.control-btn[onclick="retryPhoto()"]');
    const sendBtn = document.getElementById('send-btn');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d'); 
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    capturedImage.src = canvas.toDataURL('image/jpeg');
    capturedImage.className = "";
    video.style.display = 'none';
    capturedImage.style.display = 'block';
    captureBtn.style.display = 'none';
    retryBtn.style.display = 'block';
    sendBtn.style.display = 'block';
}
function retryPhoto() {
    const video = document.getElementById('camera-preview');
    const capturedImage = document.getElementById('captured-image');
    const captureBtn = document.querySelector('.control-btn[onclick="capturePhoto()"]');
    const retryBtn = document.querySelector('.control-btn[onclick="retryPhoto()"]');
    const sendBtn = document.getElementById('send-btn');
    
    video.style.display = 'block';
    capturedImage.style.display = 'none';
    captureBtn.style.display = 'block';
    retryBtn.style.display = 'none';
    sendBtn.style.display = 'none';
    
    // إعادة تعيين حالة زر الإرسال
    sendBtn.disabled = false;
    sendBtn.textContent = 'ابعت الصورة';
}
function restartCamera() {
    const video = document.getElementById('camera-preview');
    const capturedImage = document.getElementById('captured-image');
    const captureBtn = document.querySelector('.control-btn[onclick="capturePhoto()"]');
    const retryBtn = document.querySelector('.control-btn[onclick="retryPhoto()"]');
    const sendBtn = document.getElementById('send-btn');
    
    video.style.display = 'block';
    capturedImage.style.display = 'none';
    captureBtn.style.display = 'block';
    retryBtn.style.display = 'none';
    sendBtn.style.display = 'none';
    
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    facingMode = "user";
    startCamera();
}
async function sendToDiscord() {
    const capturedImage = document.getElementById('captured-image');
    const sendBtn = document.getElementById('send-btn');
    sendBtn.disabled = true;
    sendBtn.textContent = 'جاري الإرسال...';
    try {
        const response = await fetch(capturedImage.src);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append('file', blob, 'captured_image.jpg');
        formData.append('content', '');
        const discordResponse = await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            body: formData
        });
        if (discordResponse.ok) {
            sendBtn.textContent = 'تم إرسال الصورة بنجاح!';
        } else {
            const errorText = await discordResponse.text();
            console.error('خطأ من Discord:', errorText);
            throw new Error('حدث خطأ أثناء إرسال الصورة');
        }
    } catch (err) {
        console.error('خطأ في إرسال الصورة:', err);
        alert('حدث خطأ أثناء إرسال الصورة');
        sendBtn.disabled = false;
        sendBtn.textContent = 'إرسال الصورة';
    }
}
