document.addEventListener("DOMContentLoaded", () => {
    // ── WOW SEQUENCE (once per session) ────────────────────────────────
    const wowOverlay = document.getElementById("wow-sequence");
    const wowLogs = document.getElementById("wow-logs");
    const wowAlert = document.getElementById("wow-alert");
    const wowSkip = document.getElementById("wow-skip");
    let wowTimers = [];
    let wowClosed = false;

    function clearWowTimers() {
        wowTimers.forEach(clearTimeout);
        wowTimers = [];
    }

    function closeWowSequence() {
        if (wowClosed || !wowOverlay) return;
        wowClosed = true;
        clearWowTimers();
        wowOverlay.classList.add("closing");
        wowOverlay.classList.remove("active");
        document.body.classList.remove("wow-active");
        sessionStorage.setItem("wowPlayed", "1");
        setTimeout(() => {
            wowOverlay.hidden = true;
            wowOverlay.setAttribute("aria-hidden", "true");
        }, 650);
    }

    function appendWowLog(text, cls, delay) {
        wowTimers.push(setTimeout(() => {
            if (wowClosed || !wowLogs) return;
            const line = document.createElement("div");
            line.className = cls ? `wow-log-line ${cls}` : "wow-log-line";
            line.textContent = text;
            wowLogs.appendChild(line);
        }, delay));
    }

    function showWowAlert(html, delay) {
        wowTimers.push(setTimeout(() => {
            if (wowClosed || !wowAlert) return;
            wowAlert.innerHTML = html;
        }, delay));
    }

    function startWowSequence() {
        if (!wowOverlay || sessionStorage.getItem("wowPlayed")) return;

        wowOverlay.hidden = false;
        wowOverlay.setAttribute("aria-hidden", "false");
        requestAnimationFrame(() => {
            wowOverlay.classList.add("active");
            document.body.classList.add("wow-active");
        });

        appendWowLog("[SYS] Perimeter taraması başlatılıyor...", "", 300);
        appendWowLog("[SYS] Bellek imza analizi çalışıyor...", "", 800);
        appendWowLog("[WARN] Anomali deseni: 0x8F4A-C2", "warn", 1300);
        appendWowLog("[WARN] Şüpheli paket akışı tespit edildi", "warn", 1800);

        showWowAlert('<div class="wow-alert-box threat">⚠ TEHDİT TESPİT EDİLDİ — IR-2026-01</div>', 2400);
        showWowAlert('<div class="wow-alert-box neutral">✓ TEHDİT NEUTRALİZE EDİLDİ</div>', 3600);
        appendWowLog("[SYS] Perimeter güvenli. Hoş geldin.", "ok", 4000);

        wowTimers.push(setTimeout(closeWowSequence, 5000));
    }

    wowSkip?.addEventListener("click", closeWowSequence);
    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && wowOverlay?.classList.contains("active")) {
            closeWowSequence();
        }
    });

    if (!sessionStorage.getItem("wowPlayed")) {
        wowTimers.push(setTimeout(startWowSequence, 1400));
    }

    // ── MOBILE NAV ─────────────────────────────────────────────────────
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const navbar = document.getElementById("navbar");

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            mobileMenuBtn.classList.toggle("active");
            const bars = mobileMenuBtn.querySelectorAll(".bar");
            const open = mobileMenuBtn.classList.contains("active");
            bars[0].style.transform = open ? "rotate(-45deg) translate(-4px, 5px)" : "none";
            bars[1].style.opacity = open ? "0" : "1";
            bars[2].style.transform = open ? "rotate(45deg) translate(-4px, -5px)" : "none";
        });
    }

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navMenu?.classList.remove("active");
            mobileMenuBtn?.classList.remove("active");
            if (mobileMenuBtn) {
                mobileMenuBtn.querySelectorAll(".bar").forEach((bar, i) => {
                    bar.style.transform = "none";
                    bar.style.opacity = i === 1 ? "1" : "";
                });
            }
        });
    });

    // ── NAV SCROLL STATE ───────────────────────────────────────────────
    window.addEventListener("scroll", () => {
        navbar?.classList.toggle("scrolled", window.scrollY > 40);

        let current = "";
        document.querySelectorAll("section, header").forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute("id") || "";
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
        });
    });

    // ── TYPING EFFECT ──────────────────────────────────────────────────
    const typingText = document.querySelector(".typing-text");
    const phrases = [
        "Sızma Testi Uzmanı",
        "Güvenli Yazılım Geliştirici",
        "Otomasyon Mühendisi",
        "Tehdit Avcısı",
        "Algoritmik Ticaret Geliştiricisi"
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;

    function typeLoop() {
        if (!typingText) return;
        const phrase = phrases[phraseIdx];

        if (deleting) {
            typingText.textContent = phrase.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typingText.textContent = phrase.substring(0, charIdx + 1);
            charIdx++;
        }

        let delay = deleting ? 40 : 80;

        if (!deleting && charIdx === phrase.length) {
            deleting = true;
            delay = 2200;
        } else if (deleting && charIdx === 0) {
            deleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            delay = 400;
        }

        setTimeout(typeLoop, delay);
    }

    typeLoop();

    // ── HUD CLOCK & UPTIME ─────────────────────────────────────────────
    const hudClock = document.getElementById("hud-clock");
    const uptimeCounter = document.getElementById("uptime-counter");
    const sessionStart = Date.now();

    function updateClock() {
        const now = new Date();
        if (hudClock) {
            hudClock.textContent = now.toUTCString().split(" ")[4] + " UTC";
        }
        if (uptimeCounter) {
            const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
            const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
            const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
            const s = String(elapsed % 60).padStart(2, "0");
            uptimeCounter.textContent = `${h}:${m}:${s}`;
        }
    }

    updateClock();
    setInterval(updateClock, 1000);

    // ── GRID BACKGROUND ────────────────────────────────────────────────
    const canvas = document.getElementById("grid-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let w, h;

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }

        resize();
        window.addEventListener("resize", resize);

        const gridSize = 48;
        let offset = 0;

        function drawGrid() {
            ctx.clearRect(0, 0, w, h);
            ctx.strokeStyle = "rgba(34, 197, 94, 0.04)";
            ctx.lineWidth = 1;

            for (let x = offset % gridSize; x < w; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            for (let y = 0; y < h; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }

            offset += 0.15;
            requestAnimationFrame(drawGrid);
        }

        drawGrid();
    }

    // ── SCROLL REVEAL ──────────────────────────────────────────────────
    const revealEls = document.querySelectorAll(
        ".about-card, .skill-category, .project-card, .contact-card, .hud-panel"
    );
    revealEls.forEach(el => el.classList.add("reveal"));

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(el => observer.observe(el));

    // ── VISUAL BANNER SLIDESHOW ────────────────────────────────────────
    const slides = document.querySelectorAll(".visual-slide");
    const dots = document.querySelectorAll(".visual-dot");
    const visualTitle = document.getElementById("visual-title");
    const visualDesc = document.getElementById("visual-desc");
    let slideIndex = 0;
    let slideTimer;

    function goToSlide(index) {
        if (!slides.length) return;
        slideIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => slide.classList.toggle("active", i === slideIndex));
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === slideIndex);
            dot.setAttribute("aria-selected", i === slideIndex ? "true" : "false");
        });

        const active = slides[slideIndex];
        if (visualTitle && visualDesc && active) {
            visualTitle.classList.add("fade");
            visualDesc.classList.add("fade");
            setTimeout(() => {
                visualTitle.textContent = active.dataset.label || "";
                visualDesc.textContent = active.dataset.desc || "";
                visualTitle.classList.remove("fade");
                visualDesc.classList.remove("fade");
            }, 350);
        }
    }

    function startSlideshow() {
        clearInterval(slideTimer);
        slideTimer = setInterval(() => goToSlide(slideIndex + 1), 6000);
    }

    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            goToSlide(Number(dot.dataset.index));
            startSlideshow();
        });
    });

    if (slides.length) startSlideshow();

    // ── INTERACTIVE TERMINAL ───────────────────────────────────────────
    const terminalInput = document.getElementById("terminal-input");
    const terminalBody = document.getElementById("terminal-body");

    const fortunes = [
        '"Gerçekten güvenli olan tek sistem, fişi çekilmiş olandır." — Gene Spafford',
        '"Yeterince göz baktığında tüm hatalar sığdır." — Linus Torvalds',
        '"Amatörler sistemleri hackler. Profesyoneller insanları." — Kevin Mitnick',
        '"Paranoia, yetersiz şifrelemenin başka bir adıdır."',
        '"İki tür şirket vardır: hacklenmiş olanlar ve henüz farkında olmayanlar."',
        '"Şifreler iç çamaşır gibidir: paylaşma, sık değiştir, masada bırakma."',
    ];

    const jokes = [
        "Programcılar neden karanlık modu sever? Çünkü ışık böcekleri çeker.",
        "Bir SQL sorgusu bara girer, iki masaya gider: 'JOIN olabilir miyiz?'",
        "İnsanlar ikiye ayrılır: binary anlayanlar ve anlamayanlar.",
        "Sana bir UDP şakası anlatırdım ama belki ulaşmaz.",
        "Hacker neden klavyesinden ayrıldı? Çok fazla kötü tuş vardı.",
    ];

    const commands = {
        help: () => `Kullanılabilir komutlar:
  <span class="term-highlight">whoami</span>     Profil özeti
  <span class="term-highlight">skills</span>     Teknik envanter
  <span class="term-highlight">projects</span>   Aktif projeler
  <span class="term-highlight">contact</span>    İletişim kanalları
  <span class="term-highlight">scan</span>       Hızlı çevre taraması
  <span class="term-highlight">nmap</span>       Ağ keşfi
  <span class="term-highlight">status</span>     Sistem sağlık kontrolü
  <span class="term-highlight">neofetch</span>   Sistem bilgi banner'ı
  <span class="term-highlight">fortune</span>    Güvenlik sözü
  <span class="term-highlight">joke</span>       Rastgele şaka
  <span class="term-highlight">matrix</span>     Matrix'e gir
  <span class="term-highlight">hack</span>       Hack sekansını başlat
  <span class="term-highlight">ping</span>       Host ping at
  <span class="term-highlight">sudo</span>       Yetki yükselt
  <span class="term-highlight">coffee</span>     Kahve demle
  <span class="term-highlight">banner</span>     ASCII sanat
  <span class="term-highlight">cowsay</span>     İnek konuştur
  <span class="term-highlight">exploit</span>    Exploit kontrolü
  <span class="term-highlight">reboot</span>     Sistemi yeniden başlat
  <span class="term-highlight">weather</span>    Hava durumu
  <span class="term-highlight">motd</span>       Günün mesajı
  <span class="term-highlight">clear</span>      Ekranı temizle
  <span class="term-highlight">secret</span>     Gizli mesaj`,

        whoami: () => `<span class="term-info">Deniz Karayığit</span> — Siber güvenlik mühendisi & geliştirici.
Odak: ofansif güvenlik, güvenli otomasyon, algoritmik sistemler.
Konum: Türkiye | Durum: İş birliğine açık`,

        skills: () => `<span class="term-warn">[OFANSİF]</span>  Pentest, OWASP Top 10, Burp Suite, Nmap, Metasploit
<span class="term-info">[DEFANSİF]</span>  Sertleştirme, Log Analizi, Tehdit Modelleme, CSP/HSTS
<span class="term-highlight">[DEV]</span>       Python, JavaScript, Go, C++, Bash, SQL, REST API
<span class="term-warn">[ALTYAPI]</span>   Linux, Docker, Nginx, TCP/IP, Git
<span class="term-info">[ARAÇLAR]</span>   Wireshark, Scapy, Playwright, OWASP ZAP`,

        projects: () => `<span class="term-highlight">[AKTİF]</span> Borsa & Varant Bot Pro — Telegram RSI/EMA alarmları
<span class="term-highlight">[AKTİF]</span> Visa-Bot — Otomatik vize randevu takibi
<span class="term-warn">[ÖZEL]</span>   Siber Güvenlik Kit — Zafiyet tarayıcı & ağ analizörü`,

        contact: () => `E-Posta   → deniz2780karayigit@gmail.com
GitHub    → github.com/deniz2780-pixel
Instagram → @deniz_kry05`,

        scan: () => `<span class="term-dim">denizkarayigit.com üzerinde hızlı tarama başlatılıyor...</span>
<span class="term-highlight">[✓]</span> HTTPS/TLS .............. OK
<span class="term-highlight">[✓]</span> Güvenlik Başlıkları .... OK
<span class="term-highlight">[✓]</span> CSP Politikası ......... OK
<span class="term-highlight">[✓]</span> X-Frame-Options ........ DENY
<span class="term-info">[i]</span> Açık portlar: 443 (HTTPS)
<span class="term-highlight">Tarama tamamlandı. Kritik bulgu yok.</span>`,

        nmap: () => `<span class="term-dim">Nmap 7.94 taraması: denizkarayigit.com</span>
PORT    DURUM   SERVİS
22/tcp  kapalı  ssh
80/tcp  kapalı  http
443/tcp açık    https
<span class="term-info">Nmap bitti: 1 IP adresi 0.42 saniyede tarandı</span>`,

        status: () => `<span class="term-highlight">SİSTEM DURUMU: OPERASYONEL</span>
Tehdit Seviyesi ....... DÜŞÜK
Aktif Projeler ........ 3
Güvenli Bağlantı ...... TLS 1.3
Son Kontrol ........... ${new Date().toLocaleString("tr-TR")}`,

        neofetch: () => `<span class="term-art">       ▄▄▄▄▄▄▄    <span class="term-info">guest@denizkarayigit</span>
   ▄███████████▄  ──────────────────
  ████░░░░░░░████ <span class="term-highlight">OS:</span> DenizSec Linux x86_64
  ███░░░░░░░░░███ <span class="term-highlight">Host:</span> MacBook Pro
  ███░░░▄▄▄░░░███ <span class="term-highlight">Kernel:</span> 6.5.0-sec-hardened
  ███░░░███░░░███ <span class="term-highlight">Uptime:</span> ${Math.floor((Date.now() - sessionStart) / 60000)} dk
  ███░░░░░░░░░███ <span class="term-highlight">Shell:</span> bash 5.2
  ████░░░░░░░████ <span class="term-highlight">Rol:</span> Siber Güvenlik Mühendisi
   ▀███████████▀  <span class="term-highlight">Stack:</span> Python, C++, Go, JS</span>`,

        fortune: () => fortunes[Math.floor(Math.random() * fortunes.length)],

        joke: () => jokes[Math.floor(Math.random() * jokes.length)],

        matrix: () => `<span class="term-art"><span class="term-highlight">Uyan Neo...</span>
Matrix seni ele geçirdi.
Beyaz tavşanı takip et.
Tak tak, ${["Deniz", "Neo", "misafir"][Math.floor(Math.random() * 3)]}.

01001110 01000101 01001111
<span class="term-dim">█ █ ░ █ ░ ░ █ ░ █ █ ░ ░ █</span></span>`,

        hack: () => `<span class="term-dim">[*] İhlal protokolü başlatılıyor...</span>
<span class="term-warn">[!]</span> Firewall atlanıyor ............. <span class="term-highlight">TAMAM</span>
<span class="term-warn">[!]</span> Şifreleme kırılıyor ............ <span class="term-highlight">TAMAM</span>
<span class="term-warn">[!]</span> Payload enjekte ediliyor ....... <span class="term-highlight">TAMAM</span>
<span class="term-warn">[!]</span> Ana sisteme erişiliyor ....... <span class="term-highlight">TAMAM</span>
<span class="term-error">[✗]</span> Şaka yaptım. Burası bir portfolyo sitesi.
<span class="term-info">Gerçek hacking yetkilendirme gerektirir. Her zaman.</span>`,

        ping: (args) => {
            const host = args || "denizkarayigit.com";
            return `<span class="term-dim">PING ${host} (93.184.216.34): 56 veri baytı</span>
64 bayt ${host}'dan: icmp_seq=0 ttl=54 süre=12.4 ms
64 bayt ${host}'dan: icmp_seq=1 ttl=54 süre=11.8 ms
64 bayt ${host}'dan: icmp_seq=2 ttl=54 süre=12.1 ms
<span class="term-highlight">--- ${host} ping istatistikleri ---</span>
3 paket iletildi, 3 alındı, %0 paket kaybı`;
        },

        sudo: () => `<span class="term-error">[sudo] guest parolası:</span> <span class="term-dim">********</span>
<span class="term-warn">Güzel deneme.</span> guest sudoers dosyasında değil.
<span class="term-dim">Bu olay raporlanacak. (aslında hayır)</span>`,

        "rm": (args) => {
            if (args.includes("-rf") || args.includes("-fr")) {
                return `<span class="term-error">ENGELLENDİ:</span> rm -rf / kalıcı olarak devre dışı.
<span class="term-info">Simüle edilmiş yıkımın bile sınırı olmalı.</span>`;
            }
            return `<span class="term-warn">Kullanım:</span> rm bu sandbox'ta kapalı. <span class="term-highlight">clear</span> dene.`;
        },

        coffee: () => `<span class="term-dim">☕ Kahve demleniyor...</span>
<span class="term-warn">[=====>    ]</span> Çekirdekler öğütülüyor...
<span class="term-warn">[========> ]</span> Su ısıtılıyor...
<span class="term-highlight">[==========]</span> Hazır!
<span class="term-info">Sistem kafein seviyesi: MAKSİMUM</span>
Verimlilik artışı: +%42`,

        banner: () => `<span class="term-art">
  ██████╗ ███████╗███╗   ██╗██╗███████╗
  ██╔══██╗██╔════╝████╗  ██║██║╚══███╔╝
  ██║  ██║█████╗  ██╔██╗ ██║██║  ███╔╝
  ██║  ██║██╔══╝  ██║╚██╗██║██║ ███╔╝
  ██████╔╝███████╗██║ ╚████║██║███████╗
  ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚═╝╚══════╝
       <span class="term-info">GÜVENLİ · GELİŞTİR · OTOMATİKLEŞTİR</span></span>`,

        cowsay: (args) => {
            const msg = args || "Möö! Güvenlik herkesin işi.";
            return `<span class="term-art"> ${"-".repeat(msg.length + 2)}
&lt; ${msg} &gt;
 ${"-".repeat(msg.length + 2)}
        \\   ^__^
         \\  (${"•".repeat(Math.min(msg.length, 8))})
            (__)\\       )\\/\\
             ||----w |
             ||     ||</span>`;
        },

        exploit: () => `<span class="term-dim">[*] Exploit veritabanı taranıyor...</span>
<span class="term-warn">[!]</span> CVE-2024-XXXX .............. YAMALANDI
<span class="term-warn">[!]</span> CVE-2023-YYYY .............. YAMALANDI
<span class="term-warn">[!]</span> CVE-2025-ZZZZ .............. UYGUN DEĞİL
<span class="term-highlight">[✓]</span> Bu uç noktada istismar edilebilir zafiyet bulunamadı.
<span class="term-info">Bağımlılıklarını yine de güncel tut.</span>`,

        reboot: () => `<span class="term-warn">[!] Sistem yeniden başlatılıyor...</span>
<span class="term-dim">Servisler durduruluyor... tamam
Dosya sistemleri ayrılıyor... tamam
Yeniden başlatılıyor...</span>
<span class="term-highlight">...şaka yaptım. Hâlâ buradasın.</span>`,

        weather: () => `<span class="term-info">İstanbul, TR</span> — ${new Date().toLocaleDateString("tr-TR", { weekday: "long" })}
Durum: Parçalı bulutlu (simüle)
Sıcaklık: 24°C
Nem: %58
Rüzgar: 12 km/s KB
<span class="term-dim">* Gerçek hava verisi değil. Ara sıra dışarı çık.</span>`,

        motd: () => `<span class="term-highlight">╔══════════════════════════════════════╗
║   DENIZ.K SEC_OPS TERMİNALİNE HOŞ GELDİN   ║
╚══════════════════════════════════════╝</span>
Bugün: Zafiyet avla. Güvenli kod yaz.
İpucu: Sinematik hissetmek için <span class="term-highlight">hack</span> yaz.`,

        hackerman: () => `<span class="term-art"><span class="term-warn">İÇERİDEYİM.</span>
<span class="term-dim">*kapüşonu düzeltir*</span>
<span class="term-info">Klavye yazma hızı artıyor...</span>
<span class="term-highlight">Erişim verildi: kesinlikle hiçbir şeye.</span></span>`,

        uname: () => `DenizSec Linux guest-portfolio 6.5.0-sec x86_64 GNU/Linux`,

        uptime: () => {
            const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
            const h = Math.floor(elapsed / 3600);
            const m = Math.floor((elapsed % 3600) / 60);
            const s = elapsed % 60;
            return `up ${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}, 1 kullanıcı, load average: 0.00, 0.01, 0.00`;
        },

        history: () => `<span class="term-dim">  1  whoami
  2  scan
  3  neofetch
  4  hack
  5  coffee
  6  fortune</span>
<span class="term-info">* Simüle geçmiş. Gerçek komutların burada kaydı tutulmuyor.</span>`,

        secret: () => `<span class="term-warn">[GİZLİ]</span>
"Güvenlik bir ürün değil, bir süreçtir."
— Bruce Schneier

Tüm sistemler nominal. Çevreye hoş geldin.`,

        ls: () => `hakkimda.md  projeler/  yetenekler.json  iletisim.txt  assets/  README`,
        pwd: () => `/home/guest/denizkarayigit`,
        date: () => new Date().toLocaleString("tr-TR"),
        echo: (args) => args || "",
    };

    if (terminalInput && terminalBody) {
        terminalInput.addEventListener("keydown", e => {
            if (e.key !== "Enter") return;

            const raw = terminalInput.value.trim();
            terminalInput.value = "";

            const echoLine = document.createElement("div");
            echoLine.className = "terminal-line";
            echoLine.innerHTML = `<span class="terminal-prompt">guest@deniz:~$</span> ${raw || " "}`;
            terminalBody.insertBefore(echoLine, terminalInput.parentElement);

            if (!raw) return;

            const parts = raw.split(/\s+/);
            const cmd = parts[0].toLowerCase();
            const args = parts.slice(1).join(" ");

            if (cmd === "clear") {
                terminalBody.querySelectorAll(".terminal-line").forEach(l => l.remove());
                terminalBody.scrollTop = terminalBody.scrollHeight;
                return;
            }

            let output = "";
            if (commands[cmd]) {
                output = typeof commands[cmd] === "function" ? commands[cmd](args) : commands[cmd];
            } else {
                output = `<span class="term-error">komut bulunamadı:</span> ${parts[0]}. Komutlar için <span class="term-highlight">help</span> yazın.`;
            }

            if (output) {
                const outLine = document.createElement("div");
                outLine.className = "terminal-line";
                outLine.innerHTML = output;
                terminalBody.insertBefore(outLine, terminalInput.parentElement);
            }

            terminalBody.scrollTop = terminalBody.scrollHeight;
        });

        terminalBody.addEventListener("click", () => terminalInput.focus());
    }
});
