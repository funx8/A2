// قائمة الأسئلة
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

// قائمة الصور
const images = [
    'image1.png',
    'image2.png', 
    'image3.png',
    'image4.png',
    'image5.png'
];

let currentQuestion = 0;
let score = 0;
let currentImage = 0;
let isFlipped = false;

// متغيرات الكاميرا
let stream = null;
let isCameraFlipped = false;
let facingMode = "user";
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1375095333016703028/n_eMgBSWA4Z6bF8NrBosWslSFX-f5_T2EjTkX_HZFDs8xGE8DPGW4bkF9tL4NQh9eKKt";

// بدء الاختبار
function startQuiz() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    showQuestion();
}

// عرض السؤال
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

// التحقق من الإجابة
function checkAnswer(selectedAnswer) {
    const question = questions[currentQuestion];
    const buttons = document.querySelectorAll('.option-btn');
    
    buttons.forEach(button => {
        button.disabled = true;
    });
    
    if (selectedAnswer === question.correctAnswer) {
        buttons[selectedAnswer].classList.add('correct');
        score++;
    } else {
        buttons[selectedAnswer].classList.add('wrong');
        buttons[question.correctAnswer].classList.add('correct');
    }
    
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }, 1500);
}

// عرض النتيجة
function showResult() {
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
    document.getElementById('score').textContent = score;
}

// عرض معرض الصور
function showGallery() {
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('gallery-screen').style.display = 'block';
    updateGalleryImage();
}

// تحديث الصورة الحالية
function updateGalleryImage() {
    const img = document.getElementById('current-gallery-image');
    img.src = images[currentImage];
    img.className = 'gallery-image' + (isFlipped ? ' flipped' : '');
}

// الانتقال للصورة التالية
function nextImage() {
    currentImage = (currentImage + 1) % images.length;
    updateGalleryImage();
}

// الانتقال للصورة السابقة
function prevImage() {
    currentImage = (currentImage - 1 + images.length) % images.length;
    updateGalleryImage();
}

// قلب الصورة
function flipImage() {
    isFlipped = !isFlipped;
    updateGalleryImage();
}

// إعادة الاختبار
function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    currentImage = 0;
    isFlipped = false;
    document.getElementById('gallery-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
}

// عرض صفحة الكاميرا
async function showCamera() {
    document.getElementById('gallery-screen').style.display = 'none';
    document.getElementById('camera-screen').style.display = 'block';
    await startCamera();
}

// بدء تشغيل الكاميرا
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

// تبديل الكاميرا
async function flipCamera() {
    facingMode = facingMode === "user" ? "environment" : "user";
    await startCamera();
}

// التقاط صورة
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

// إعادة المحاولة
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

// إرسال الصورة إلى Discord
async function sendToDiscord() {
    const capturedImage = document.getElementById('captured-image');
    const sendBtn = document.getElementById('send-btn');
    
    sendBtn.disabled = true;
    sendBtn.innerHTML = `
        <div class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            جاري الإرسال...
        </div>
    `;

    try {
        const response = await fetch(capturedImage.src);
        const blob = await response.blob();
        
        const formData = new FormData();
        formData.append('file', blob, 'captured_image.jpg');
        

        const discordResponse = await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            body: formData
        });

        if (discordResponse.ok) {
            sendBtn.innerHTML = `
                <div class="success-state">
                    <i class="fas fa-check"></i>
                    تم الإرسال بنجاح!
                </div>
            `;
            setTimeout(() => restartQuiz(), 2000);
        } else {
            const errorText = await discordResponse.text();
            console.error('خطأ من Discord:', errorText);
            sendBtn.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-times"></i>
                    فشل الإرسال
                </div>
            `;
        }
    } catch (err) {
        console.error('خطأ في إرسال الصورة:', err);
        sendBtn.innerHTML = `
            <div class="error-state">
                <i class="fas fa-times"></i>
                فشل الإرسال
            </div>
        `;
    } finally {
        setTimeout(() => {
            sendBtn.disabled = false;
            sendBtn.innerHTML = `
                <i class="fas fa-paper-plane"></i>
                إرسال الصورة
            `;
        }, 3000);
    }
}
