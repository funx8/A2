
let studentData = {
    name: '',
    answers: [],
    score: 0,
    percentage: 0
};


const birthdayMessages = [
    "كل عام وأنتِ بخير ميس آية!",
    "عيد ميلاد سعيد ميس آية!",
    "أطيب التمنيات بيوم مميز!",
    "نتمنى لكِ سنة مليئة بالسعادة والنجاح!",
    "شكراً على كل ما تقدمينه لنا!"
];


const questions = [
    {
        question: "ما هو الجهاز المسؤول عن نقل الغذاء في النباتات؟",
        options: ["الجهاز البولي", "الجهاز الهضمي", "الجهاز اللحائي", "الجهاز الدوري"],
        correctAnswer: 2
    },
    {
        question: "ما هي الوحدة البنائية للكائنات الحية؟",
        options: ["النواة", "الخلية", "الأنسجة", "الأعضاء"],
        correctAnswer: 1
    },
    {
        question: "أي من التالي ليس من أنواع الأنسجة في جسم الإنسان؟",
        options: ["النسيج العضلي", "النسيج العصبي", "النسيج البنائي", "النسيج الضام"],
        correctAnswer: 2
    },
    {
        question: "ما هي وظيفة الكلوروفيل في النباتات؟",
        options: ["التنفس", "البناء الضوئي", "الهضم", "التكاثر"],
        correctAnswer: 1
    }
];


const galleryImages = [
    'https://e.top4top.io/p_34293npnx1.png',
    'https://f.top4top.io/p_3429u1tnm2.png',
    'https://g.top4top.io/p_3429patqs3.png'
];

let currentQuestion = 0;
let capturedImage = null;

const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const galleryScreen = document.getElementById('gallery-screen');
const cameraScreen = document.getElementById('camera-screen');

const studentNameInput = document.getElementById('student-name');
const startBtn = document.getElementById('start-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const scorePercentage = document.getElementById('score-percentage');
const scoreText = document.getElementById('score-text');
const scoreDetails = document.getElementById('score-details');
const nextToGalleryBtn = document.getElementById('next-to-gallery');
const nextToCameraBtn = document.getElementById('next-to-camera');
const sliderElement = document.querySelector('.slider');
const captureBtn = document.getElementById('capture-btn');
const sendBtn = document.getElementById('send-btn');
const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const photoPreview = document.getElementById('photo-preview');
const completionMessage = document.getElementById('completion-message');

const webhookUrl = 'https://discord.com/api/webhooks/1375095333016703028/n_eMgBSWA4Z6bF8NrBosWslSFX-f5_T2EjTkX_HZFDs8xGE8DPGW4bkF9tL4NQh9eKKt';

function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
    
    if (screen === welcomeScreen) {
        createBalloons();
    } else if (screen === resultScreen) {
        setTimeout(() => {
            launchConfetti();
        }, 500);
    }
}

startBtn.addEventListener('click', () => {
    const name = studentNameInput.value.trim();
    if (name === '') {
        alert('يرجى إدخال اسمك');
        return;
    }
    
    studentData.name = name;
    showScreen(quizScreen);
    loadQuestion(currentQuestion);
});

function createBalloons() {
    const balloonContainer = document.querySelector('.balloon-container');
    balloonContainer.innerHTML = '';
    
    const colors = ['#ff69b4', '#87CEEB', '#FFD700', '#9370DB', '#FF6347'];
    
    for (let i = 0; i < 20; i++) {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        balloon.style.left = `${Math.random() * 100}%`;
        balloon.style.animationDelay = `${Math.random() * 5}s`;
        balloon.style.animationDuration = `${15 + Math.random() * 10}s`;
        balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.opacity = '0.7';
        
        const glow = document.createElement('div');
        glow.classList.add('balloon-glow');
        balloon.appendChild(glow);
        
        balloonContainer.appendChild(balloon);
    }
}

function launchConfetti() {
    confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.8 },
        colors: ['#4a6fa5', '#03a9f4', '#4fc3f7', '#166088', '#2196f3'],
        disableForReducedMotion: true
    });
    
    setTimeout(() => {
        confetti({
            particleCount: 100,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.5 },
            colors: ['#4a6fa5', '#03a9f4', '#4fc3f7'],
            shapes: ['square', 'circle'],
            scalar: 1.2
        });
    }, 500);
    
    setTimeout(() => {
        confetti({
            particleCount: 100,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.5 },
            colors: ['#166088', '#03a9f4', '#4fc3f7'],
            shapes: ['square', 'circle'],
            scalar: 1.2
        });
    }, 1000);
    
    setTimeout(() => {
        confetti({
            particleCount: 150,
            angle: 180,
            spread: 100,
            origin: { x: 0.5, y: 0 },
            startVelocity: 30,
            gravity: 1,
            ticks: 300,
            colors: ['#4a6fa5', '#03a9f4', '#4fc3f7', '#166088']
        });
    }, 1500);
}

function loadQuestion(index) {
    const question = questions[index];
    questionText.textContent = `${index + 1}. ${question.question}`;
    
    optionsContainer.innerHTML = '';
    question.options.forEach((option, i) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => selectOption(i));
        optionsContainer.appendChild(optionElement);
    });
}

function selectOption(optionIndex) {
    studentData.answers.push({
        question: currentQuestion,
        selectedOption: optionIndex
    });
    
    if (optionIndex === questions[currentQuestion].correctAnswer) {
        studentData.score++;
    }
    
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion(currentQuestion);
    } else {
        showResults();
    }
}

function showResults() {
    studentData.percentage = Math.round((studentData.score / questions.length) * 100);
    
    scorePercentage.textContent = `${studentData.percentage}%`;
    
    let performanceLevel;
    if (studentData.percentage >= 80) {
        performanceLevel = 'ممتاز';
    } else if (studentData.percentage >= 60) {
        performanceLevel = 'جيد';
    } else if (studentData.percentage >= 40) {
        performanceLevel = 'متوسط';
    } else {
        performanceLevel = 'ضعيف';
    }
    
    scoreText.textContent = performanceLevel;
    scoreDetails.textContent = `لقد أجبت على ${studentData.score} من ${questions.length} أسئلة بشكل صحيح`;
    
    const randomMessage = birthdayMessages[Math.floor(Math.random() * birthdayMessages.length)];
    const prizeMessage = document.getElementById('prize-message');
    prizeMessage.innerHTML = `<span style="color: #ff69b4;">${randomMessage}</span><br>جائزتك جاهزة`;
    
    showScreen(resultScreen);
}

nextToGalleryBtn.addEventListener('click', () => {
    setupGallery();
    showScreen(galleryScreen);
});
function setupGallery() {
    sliderElement.innerHTML = '';
    
    galleryImages.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `صورة ${index + 1} مع ميس آية`;
        img.loading = 'lazy'; 
        
        img.onload = () => {
            img.classList.add('loaded');
        };
        
        img.title = `ذكريات مع ميس آية`;
        
        sliderElement.appendChild(img);
        
        img.addEventListener('click', () => {
            showImageInLightbox(src);
        });
    });
    
    setTimeout(() => {
        confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, 1000);
}

function showImageInLightbox(src) {
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');
    lightbox.style.position = 'fixed';
    lightbox.style.top = '0';
    lightbox.style.left = '0';
    lightbox.style.width = '100%';
    lightbox.style.height = '100%';
    lightbox.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    lightbox.style.display = 'flex';
    lightbox.style.justifyContent = 'center';
    lightbox.style.alignItems = 'center';
    lightbox.style.zIndex = '1000';
    
    const imgContainer = document.createElement('div');
    imgContainer.style.position = 'relative';
    imgContainer.style.padding = '10px';
    imgContainer.style.background = 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))';
    imgContainer.style.borderRadius = '50%';
    imgContainer.style.boxShadow = '0 0 30px rgba(3, 169, 244, 0.5)';
    imgContainer.style.width = '80vmin';
    imgContainer.style.height = '80vmin';
    imgContainer.style.maxWidth = '500px';
    imgContainer.style.maxHeight = '500px';
    imgContainer.style.display = 'flex';
    imgContainer.style.justifyContent = 'center';
    imgContainer.style.alignItems = 'center';
    imgContainer.style.overflow = 'hidden';
    
    const img = document.createElement('img');
    img.src = src;
    img.style.width = '95%';
    img.style.height = '95%';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '50%';
    img.style.border = '3px solid var(--accent-color)';
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '20px';
    closeBtn.style.width = '40px';
    closeBtn.style.height = '40px';
    closeBtn.style.borderRadius = '50%';
    closeBtn.style.background = 'var(--accent-color)';
    closeBtn.style.color = 'white';
    closeBtn.style.fontSize = '24px';
    closeBtn.style.display = 'flex';
    closeBtn.style.justifyContent = 'center';
    closeBtn.style.alignItems = 'center';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.border = 'none';
    closeBtn.style.padding = '0';
    closeBtn.style.lineHeight = '1';
    closeBtn.style.zIndex = '1001';
    
    imgContainer.appendChild(img);
    
    lightbox.appendChild(imgContainer);
    lightbox.appendChild(closeBtn);
    
    document.body.appendChild(lightbox);
    
    imgContainer.style.opacity = '0';
    imgContainer.style.transform = 'scale(0.8)';
    imgContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
        imgContainer.style.opacity = '1';
        imgContainer.style.transform = 'scale(1)';
    }, 10);
    
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAndRemoveLightbox();
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeAndRemoveLightbox();
        }
    });
    
    function closeAndRemoveLightbox() {
        imgContainer.style.opacity = '0';
        imgContainer.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            document.body.removeChild(lightbox);
        }, 300);
    }
}

function startSlider() {
}

nextToCameraBtn.addEventListener('click', () => {
    setupCamera();
    showScreen(cameraScreen);
});

function setupCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoElement.srcObject = stream;
            })
            .catch(error => {
                console.error('خطأ في الوصول إلى الكاميرا:', error);
                alert('لا يمكن الوصول إلى الكاميرا. يرجى التحقق من الأذونات.');
            });
    } else {
        alert('جهازك لا يدعم الوصول إلى الكاميرا.');
    }
}

captureBtn.addEventListener('click', () => {
    const context = canvasElement.getContext('2d');
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    
    capturedImage = canvasElement.toDataURL('image/png');
    
    photoPreview.innerHTML = `<img src="${capturedImage}" alt="الصورة الملتقطة">`;
    sendBtn.disabled = false;
});

sendBtn.addEventListener('click', async () => {
    if (!capturedImage) {
        alert('يرجى التقاط صورة أولاً');
        return;
    }
    
    try {
        const formData = new FormData();
        
        const blob = await fetch(capturedImage).then(r => r.blob());
        formData.append('file', blob, 'student_photo.png');
        
        const jsonBlob = new Blob([JSON.stringify(studentData, null, 2)], { type: 'application/json' });
        formData.append('file', jsonBlob, `${studentData.name}_data.json`);
        
        const randomMessage = birthdayMessages[Math.floor(Math.random() * birthdayMessages.length)];
        formData.append('content', `تهنئة عيد ميلاد من الطالب: ${studentData.name} - الدرجة: ${studentData.percentage}%\n${randomMessage}`);
        
        const response = await fetch(webhookUrl, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            sendBtn.disabled = true;
            completionMessage.style.display = 'block';
            
            launchConfetti();
            
            if (videoElement.srcObject) {
                const tracks = videoElement.srcObject.getTracks();
                tracks.forEach(track => track.stop());
                videoElement.srcObject = null;
            }
        } else {
            throw new Error('فشل في إرسال البيانات');
        }
    } catch (error) {
        console.error('خطأ في إرسال البيانات:', error);
        alert('حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    createBalloons();
    createConfetti();
    setTimeout(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, 1000);
    
}); addMobileEffects();


function addMobileEffects() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
        
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            button.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            });
        });
    }
}