document.addEventListener("DOMContentLoaded", () => {
    // ── MOBILE MENU TOGGLE ─────────────────────────────────────────────
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            mobileMenuBtn.classList.toggle("active");
            
            // Toggle hamburger animation
            const bars = mobileMenuBtn.querySelectorAll(".bar");
            if (mobileMenuBtn.classList.contains("active")) {
                bars[0].style.transform = "rotate(-45deg) translate(-5px, 6px)";
                bars[1].style.opacity = "0";
                bars[2].style.transform = "rotate(45deg) translate(-5px, -6px)";
            } else {
                bars[0].style.transform = "none";
                bars[1].style.opacity = "1";
                bars[2].style.transform = "none";
            }
        });
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navMenu && navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
                mobileMenuBtn.classList.remove("active");
                const bars = mobileMenuBtn.querySelectorAll(".bar");
                bars[0].style.transform = "none";
                bars[1].style.opacity = "1";
                bars[2].style.transform = "none";
            }
        });
    });

    // ── ACTIVE NAV LINKS ON SCROLL ─────────────────────────────────────
    const sections = document.querySelectorAll("section, header");
    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").slice(1) === current) {
                link.classList.add("active");
            }
        });
    });

    // ── AUTO TYPING EFFECT ─────────────────────────────────────────────
    const typingText = document.querySelector(".typing-text");
    const phrases = [
        "Yazılım Geliştirici",
        "Siber Güvenlik Analisti",
        "Algoritmik Ticaret Uzmanı",
        "Sızma Testi Uzmanı"
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let delay = 100;

    function type() {
        if (!typingText) return;
        const currentPhrase = phrases[phraseIdx];
        
        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
            delay = 50;
        } else {
            typingText.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
            delay = 120;
        }

        if (!isDeleting && charIdx === currentPhrase.length) {
            isDeleting = true;
            delay = 2000; // Pause at end of phrase
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            delay = 500; // Pause before typing next
        }

        setTimeout(type, delay);
    }
    
    type();

    // ── CANVA DIGITAL PARTICLES/MATRIX BACKGROUND ──────────────────────
    const canvas = document.getElementById("cyber-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Binary code drops
        const fontSize = 14;
        const columns = Math.floor(width / fontSize);
        const drops = Array(columns).fill(1);
        
        function drawMatrix() {
            ctx.fillStyle = "rgba(6, 8, 19, 0.05)";
            ctx.fillRect(0, 0, width, height);
            
            ctx.fillStyle = "#00ff80";
            ctx.font = `${fontSize}px 'Fira Code', monospace`;
            
            for (let i = 0; i < drops.length; i++) {
                const text = Math.random() > 0.5 ? "1" : "0";
                const x = i * fontSize;
                const y = drops[i] * fontSize;
                
                // Random brightness
                const alpha = Math.random() * 0.5 + 0.1;
                ctx.fillStyle = `rgba(0, 255, 128, ${alpha})`;
                
                ctx.fillText(text, x, y);
                
                if (y > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(drawMatrix, 40);
    }

    // ── INTERACTIVE TERMINAL WIDGET ─────────────────────────────────────
    const terminalInput = document.getElementById("terminal-input");
    const terminalBody = document.getElementById("terminal-body");

    // Command registry
    const commands = {
        help: () => {
            return `Mevcut komutlar listesi:
  <span class="term-highlight">about</span>      : Hakkımdaki bilgileri gösterir.
  <span class="term-highlight">skills</span>     : Kullandığım teknolojileri listeler.
  <span class="term-highlight">projects</span>   : Geliştirdiğim projeleri gösterir.
  <span class="term-highlight">contact</span>    : İletişim bilgilerini gösterir.
  <span class="term-highlight">clear</span>      : Terminal ekranını temizler.
  <span class="term-highlight">secret</span>     : Özel sistem notunu gösterir.`;
        },
        about: () => {
            return `Deniz Karayığit:
Yazılım ve siber güvenlik alanında çalışan, otomasyon sistemleri ve veri koruma konularında uzmanlaşmış geliştirici. Python, JavaScript ve penetrasyon testlerine odaklanmaktadır.`;
        },
        skills: () => {
            return `Teknoloji Envanteri:
  - Diller  : Python, JavaScript, Go, HTML, CSS, SQL, Bash
  - Sistem  : Linux (Arch, Debian), Docker, Nginx, Systemd
  - Araçlar : Git, Playwright, Nmap, Metasploit, Scapy`;
        },
        projects: () => {
            return `Projeler:
  - Borsa & Varant Botu Pro: RSI & EMA Trend alarm Telegram Botu (Aktif)
  - Visa-Bot               : Otomatik randevu takip sistemi (Aktif)
  - Siber Güvenlik Kit     : Ağ ve sunucu açık tarama araçları (Özel)`;
        },
        contact: () => {
            return `İletişim Kanalları:
  - Instagram : @deniz_kry05 (https://www.instagram.com/deniz_kry05)
  - GitHub    : deniz2780-pixel (https://github.com/deniz2780-pixel)
  - E-Posta   : deniz2780karayigit@gmail.com`;
        },
        secret: () => {
            return `<span style="color:#bd00ff">[SİSTEM MESAJI]</span>
"Güvenlik bir ürün değil, bir süreçtir."
Tüm sistemler aktiftir. Loglar denizkarayigit.com üzerinde şifrelenmiştir.`;
        }
    };

    if (terminalInput && terminalBody) {
        // Handle input submit
        terminalInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const fullInput = terminalInput.value.trim();
                const cmd = fullInput.toLowerCase();
                terminalInput.value = "";

                // Echo the input command
                const echoLine = document.createElement("div");
                echoLine.className = "terminal-line";
                echoLine.innerHTML = `<span class="terminal-prompt">guest@denizkarayigit:~$</span> ${fullInput}`;
                terminalBody.insertBefore(echoLine, terminalInput.parentElement);

                let outputText = "";
                if (cmd === "") {
                    // Do nothing
                } else if (cmd === "clear") {
                    // Clear all lines except input
                    const lines = Array.from(terminalBody.querySelectorAll(".terminal-line"));
                    lines.forEach(line => line.remove());
                } else if (commands[cmd]) {
                    outputText = commands[cmd]();
                } else {
                    outputText = `Hata: komut bulunamadı: <span style="color:#ff5f56">${fullInput}</span>. Komutların listesi için <span class="term-highlight">help</span> yazın.`;
                }

                if (outputText) {
                    const outputLine = document.createElement("div");
                    outputLine.className = "terminal-line";
                    outputLine.innerHTML = outputText;
                    terminalBody.insertBefore(outputLine, terminalInput.parentElement);
                }

                // Scroll to bottom
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }
        });

        // Click terminal body to focus input
        terminalBody.addEventListener("click", () => {
            terminalInput.focus();
        });
    }
});
