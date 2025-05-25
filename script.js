const questions = [
    {
        question: "ما هو العضو المسؤول عن تنقية الدم في جسم الإنسان؟",
        options: ["الكبد", "الكلى", "القلب", "الرئتين"],
        correctAnswer: 1
    },
    {
        question: "ما هي أصغر وحدة بناء في الكائنات الحية؟", 
        options: ["الخلية", "النواة", "الجين", "البروتين"],
        correctAnswer: 0
    },
    {
        question: "ما هو الجهاز المسؤول عن هضم الطعام في جسم الإنسان؟",
        options: ["الجهاز التنفسي", "الجهاز العصبي", "الجهاز الهضمي", "الجهاز الدوري"],
        correctAnswer: 2
    },
    {
        question: "ما هو المصدر الرئيسي للطاقة في النباتات الخضراء؟",
        options: ["الماء", "ثاني أكسيد الكربون", "الضوء", "الأملاح المعدنية"],
        correctAnswer: 2
    },
    {
        question: "ما هو العضو المسؤول عن إنتاج الأنسولين في جسم الإنسان؟",
        options: ["الكبد", "البنكرياس", "المعدة", "الطحال"],
        correctAnswer: 1
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
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1375095333016703028/n_eMgBSWA4Z6bF8NrBosWslSFX-f5_T2EjTkX_HZFDs8xGE8DPGW4bkF9tL4NQh9eKKt";

let countdownInterval;
const endDate = new Date(new Date().getFullYear(), 4, 26).getTime(); 

function updateCountdown() {
    const now = new Date().getTime();
    let timeLeft = endDate - now;
    
    if (timeLeft < 0) {
        const nextYear = new Date().getFullYear() + 1;
        timeLeft = new Date(nextYear, 4, 26).getTime() - now;
    }
    
    if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        document.getElementById('countdown').innerHTML = `
            <div class="countdown-title">الوقت المتبقي حتى عيد الميلاد 🎂</div>
            <div class="countdown-container">
                <div class="countdown-item">${days} يوم</div>
                <div class="countdown-item">${hours} ساعة</div>
                <div class="countdown-item">${minutes} دقيقة</div>
                <div class="countdown-item">${seconds} ثانية</div>
            </div>
            <div class="birthday-message">26 مايو 1991</div>
        `;
    } else {
        clearInterval(countdownInterval);
        document.getElementById('countdown').innerHTML = `
            <div class="celebration-message">
                <h2>عيد ميلاد سعيد! 🎉🎂</h2>
                <p>كل عام وأنتِ بخير يا مس آية قنديل!</p>
                <div class="birthday-message">26 مايو 1991</div>
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
}

function restartCamera() {
   
    retryPhoto();
    
    
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
        formData.append('content', 'صورة جديدة من الاختبار');

        const discordResponse = await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            body: formData
        });

        if (discordResponse.ok) {
            alert('تم إرسال الصورة بنجاح!');
            sendBtn.textContent = 'سيتم إعادة تحميل الصفحة خلال 10 ثواني...';
            
         
            let countdown = 10;
            const countdownInterval = setInterval(() => {
                countdown--;
                sendBtn.textContent = `سيتم إعادة تحميل الصفحة خلال ${countdown} ثواني...`;
                
                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    window.location.reload();
                }
            }, 1000);
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
