document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('card');
    const playBtn = document.getElementById('playBtn');
    const bgMusic = document.getElementById('bgMusic');
    const petalsContainer = document.getElementById('petals-container');
    let isPlaying = false;

    // --- Logika Halaman 1 (Intro & Kata Sandi) ---
    const introPage = document.getElementById('intro-page');
    const btnOpen = document.getElementById('btn-open');
    const introStep1 = document.getElementById('intro-step1');
    const introStep2 = document.getElementById('intro-step2');
    const passInput = document.getElementById('pass-input');
    const btnUnlock = document.getElementById('btn-unlock');
    const passError = document.getElementById('pass-error');

    // Klik pertama: Tampilkan input password
    btnOpen.addEventListener('click', () => {
        introStep1.classList.add('hidden-step');
        introStep2.classList.remove('hidden-step');
        passInput.focus();
    });

    // Klik kedua: Cek password
    btnUnlock.addEventListener('click', () => {
        // Ambil input user, hilangkan spasi lebih & jadikan huruf kecil untuk verifikasi
        const password = passInput.value.trim().toLowerCase();

        // Verifikasi kata sandi
        if (password === 'aku sayang zen') {
            // Berhasil! Buka hadiah
            introPage.classList.add('hidden');

            // Putar audio secara otomatis tanpa di-block oleh browser!
            bgMusic.volume = 0.4;
            bgMusic.play().catch(err => console.log('Audio error:', err));
            isPlaying = true;
            playBtn.textContent = '⏸ Pause Lagu';
        } else {
            // Gagal: Semburan animasi getar
            passError.textContent = 'Kata sandi salah, coba lagi! 😛';
            passInput.value = '';

            introStep2.style.animation = 'shake 0.5s ease';
            setTimeout(() => { introStep2.style.animation = 'none'; }, 500);
        }
    });

    // Dukung tekan Enter untuk submit
    passInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            btnUnlock.click();
        }
    });

    // Fungsi balik kartu
    card.addEventListener('click', (e) => {
        // Jangan putar kartu jika yang diklik adalah tombol play musik
        if (e.target.id === 'playBtn') return;
        card.classList.toggle('is-open');
    });

    // Kontrol Auto Play / Pause
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            playBtn.textContent = '🎵 Mainkan Lagu';
        } else {
            bgMusic.volume = 0.4;
            bgMusic.play().catch(err => console.log('Audio error:', err));
            playBtn.textContent = '⏸ Pause Lagu';
        }
        isPlaying = !isPlaying;
    });

    // Animasi bunga jatuh + Kilauan (sparkle)
    const decorations = ['🌸', '🌺', '🌷', '💮', '💖', '✨', '🎀'];

    function createDecoration() {
        const deco = document.createElement('div');
        deco.classList.add('petal');

        deco.textContent = decorations[Math.floor(Math.random() * decorations.length)];

        const size = Math.random() * 1.5 + 0.8; // Ukuran dari 0.8em ke 2.3em
        const left = Math.random() * 100; // Posisi x acak
        const duration = Math.random() * 5 + 6; // Waktu jatuh 6-11 detik

        deco.style.fontSize = `${size}em`;
        deco.style.left = `${left}vw`;
        deco.style.animationDuration = `${duration}s`;

        petalsContainer.appendChild(deco);

        // Hapus dari memori ketika animasi selesai
        setTimeout(() => {
            deco.remove();
        }, duration * 1000);
    }

    // Buat lebih banyak bunga
    setInterval(createDecoration, 300);

    // Inisialisasi dekorasi pertama yang langsung jatuh
    for (let i = 0; i < 25; i++) {
        setTimeout(createDecoration, Math.random() * 4000);
    }

    // --- Logika Halaman 3 (Tebak-tebakan / Kuis) ---
    const quizPage = document.getElementById('quiz-page');
    const btnQuiz = document.getElementById('btn-quiz');
    const btnNextQuiz = document.getElementById('btn-next-quiz');
    const btnCloseQuiz = document.getElementById('btn-close-quiz');
    const quizContent = document.getElementById('quiz-content');
    const quizResult = document.getElementById('quiz-result');
    const questionText = document.getElementById('question-text');
    const questionDesc = document.getElementById('question-desc');
    const quizAnswer = document.getElementById('quiz-answer');
    const quizFeedback = document.getElementById('quiz-feedback');
    const scoreCircle = document.getElementById('score-circle');
    const scoreText = document.getElementById('score-text');

    let currentQuestion = 0;
    let correctAnswers = 0;

    // Data Pertanyaan (5 Soal yang diminta)
    const questions = [
        { q: "Pacar Kamu Umur Berapa?", a: ["15"], exact: true },
        { q: "Pacar Kamu Suka Makanan Apa?", a: ["mie ayam", "mi ayam", "mieayam"], exact: false },
        { q: "Pacar Kamu Suka Main Game Apa?", a: ["epep", "free fire", "freefire", "ff", "efef"], exact: false },
        { q: "Tinggi Pacar Kamu Berapa?", a: ["160", "160cm", "160 cm"], exact: true },
        { q: "Tanggal Lahir Pacar Kamu?", a: ["4 februari", "04 februari", "4 feb", "04 feb"], exact: false }
    ];

    btnQuiz.addEventListener('click', (e) => {
        // Hentikan fungsi kartu berbalik jika tombol ini ditekan (opsional precaution)
        e.stopPropagation();
        quizPage.classList.remove('hidden');
        startQuiz();
    });

    function startQuiz() {
        currentQuestion = 0;
        correctAnswers = 0;
        quizContent.classList.remove('hidden-step');
        quizResult.classList.add('hidden-step');
        showQuestion();
    }

    function showQuestion() {
        quizAnswer.value = '';
        quizFeedback.textContent = '';
        questionText.textContent = `Pertanyaan ${currentQuestion + 1}/5`;
        questionDesc.textContent = questions[currentQuestion].q;
        quizAnswer.focus();
    }

    btnNextQuiz.addEventListener('click', () => {
        const userAns = quizAnswer.value.trim().toLowerCase();

        if (userAns === '') {
            quizFeedback.textContent = 'Harap diisi dulu dong jawabannya! 🥺';
            quizContent.style.animation = 'shake 0.5s ease';
            setTimeout(() => { quizContent.style.animation = 'none'; }, 500);
            return;
        }

        // Cek jawaban
        let isCorrect = false;
        const correctOptions = questions[currentQuestion].a;
        const exactMatch = questions[currentQuestion].exact;

        for (let ans of correctOptions) {
            if (exactMatch) {
                if (userAns === ans) isCorrect = true;
            } else {
                if (userAns.includes(ans) || userAns === ans) isCorrect = true;
            }
        }

        if (isCorrect) correctAnswers++;

        currentQuestion++;
        if (currentQuestion >= questions.length) {
            showResults();
        } else {
            showQuestion();
        }
    });

    function showResults() {
        quizContent.classList.add('hidden-step');
        quizResult.classList.remove('hidden-step');

        const percentage = Math.round((correctAnswers / questions.length) * 100);

        // Buat animasi angka persentase bergerak dari 0
        let currentPercent = 0;
        scoreCircle.textContent = "0%";
        const interval = setInterval(() => {
            currentPercent += 5;
            if (currentPercent >= percentage) {
                currentPercent = percentage;
                clearInterval(interval);
            }
            scoreCircle.textContent = `${currentPercent}%`;
        }, 50);

        // Beri pesan sesuai persentase
        if (percentage === 100) {
            scoreText.textContent = "Dihh kok kamu tau semua?! 😍 Beneran cinta mati ya!";
        } else if (percentage >= 80) {
            scoreText.textContent = "Hampir bener semua! Lumayan ingat juga kamu ya! 🥰";
        } else if (percentage >= 40) {
            scoreText.textContent = "Hmm.. nilai kamu pas-pasan! Kurang-kurangin lupanya! 😤";
        } else {
            scoreText.textContent = "Aduhhhh, pacar apaan nih lupa banyak hal?! Sini dijewer! 😡👂";
        }
    }

    btnCloseQuiz.addEventListener('click', () => {
        quizPage.classList.add('hidden');
    });

    // Otomatis kirim saat tekan enter
    quizAnswer.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') btnNextQuiz.click();
    });

    // --- Logika Halaman 4 (Liat Bunga Tumbuh & I LOVE U FALISHH) ---
    const btnFlower = document.getElementById('btn-flower');
    const flowerPage = document.getElementById('flower-page');
    const mainContent = document.querySelector('.main-content');
    const btnBackFlower = document.getElementById('btn-back-flower');
    const falishText = document.getElementById('falish-text');

    btnFlower.addEventListener('click', (e) => {
        e.stopPropagation(); // hentikan biar kartu nggak muter bolak balik

        // Sembunyikan konten utama
        mainContent.classList.add('hidden-step');

        // Tampilkan overlay bunga
        flowerPage.classList.remove('hidden-step');
        btnBackFlower.classList.remove('hidden-step');

        // Restart animasi CSS dari bunga untuk memicu efek tumbuh dari awal
        const oldContainer = document.querySelector('.css-flower-container');
        const newContainer = oldContainer.cloneNode(true);
        oldContainer.parentNode.replaceChild(newContainer, oldContainer);

        // Sembunyikan dan Munculkan teks Falish setelah bunga mekar (delay 3 detik)
        // dengan efek mengetik (typewriter effect)
        falishText.classList.add('hidden-step');
        falishText.innerHTML = "";

        setTimeout(() => {
            falishText.classList.remove('hidden-step');
            // Teks yang ingin diketik
            const textToType = "I LOVE U FALISH";
            let i = 0;

            function typeWriter() {
                if (i < textToType.length) {
                    const char = textToType.charAt(i);
                    if (char === '\n') {
                        falishText.innerHTML += '<br>';
                    } else {
                        falishText.innerHTML += char;
                    }
                    i++;
                    setTimeout(typeWriter, 150);
                }
            }
            typeWriter();
        }, 3000);
    });

    btnBackFlower.addEventListener('click', () => {
        mainContent.classList.remove('hidden-step');
        flowerPage.classList.add('hidden-step');
        btnBackFlower.classList.add('hidden-step');
        falishText.classList.add('hidden-step');
        falishText.innerHTML = ""; // Bersihkan teks untuk next click
    });
});
