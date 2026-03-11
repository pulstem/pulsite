/* JavaScript Document

TemplateMo 605 Xmas Countdown

https://templatemo.com/tm-605-xmas-countdown

*/

function createParticles() {
   const container = document.getElementById('particles');

   let W = container.clientWidth, H = container.clientHeight;
   window.addEventListener('resize', () => {
      const newW = container.clientWidth, newH = container.clientHeight;
      const scaleX = newW / W, scaleY = newH / H;
      dots.forEach(dot => { dot.x *= scaleX; dot.y *= scaleY; });
      W = newW; H = newH;
   }, { passive: true });

   const dots = [];
   const N = W <= 920 ? 60 : 140;
   const cols = Math.round(Math.sqrt(N * (W / Math.max(H, 1))));
   const rows = Math.ceil(N / cols);
   for (let i = 0; i < N; i++) {
      const el = document.createElement('div');
      el.className = 'snowflake';
      el.textContent = '•';
      el.style.fontSize = (0.3 + Math.random() * 1.0) + 'rem';
      container.appendChild(el);
      const col = i % cols;
      const row = Math.floor(i / cols);
      dots.push({
         el,
         x: (col + Math.random()) * (W / cols),
         y: (row + Math.random()) * (H / rows),
         vx: (Math.random() - 0.5) * 0.15,
         vy: (Math.random() - 0.5) * 0.15,
         maxOpacity: 0.3 + Math.random() * 0.5,
         visible: false,
         timer: Math.random() * 3000,
         fadeDuration: 1000 + Math.random() * 1500,
         visibleDuration: 5000 + Math.random() * 8000,
         hiddenDuration: 500 + Math.random() * 3000,
         parallaxFactor: 0.2 + Math.random() * 1.6,
      });
   }

   let scrollDelta = 0, lastScrollY = window.scrollY;
   window.addEventListener('scroll', () => {
      const y = window.scrollY;
      scrollDelta += y - lastScrollY;
      lastScrollY = y;
   }, { passive: true });

   let lastTs = null;
   function animateDots(ts) {
      if (lastTs === null) { lastTs = ts; requestAnimationFrame(animateDots); return; }
      const dt = Math.min(ts - lastTs, 50);
      lastTs = ts;

      const scrollImpulse = scrollDelta * 0.18;
      scrollDelta = 0;
      const scrolling = Math.abs(scrollImpulse) > 0.01;

      dots.forEach(dot => {
         dot.vy -= scrollImpulse * dot.parallaxFactor;

         dot.vx += (Math.random() - 0.5) * 0.02;
         dot.vy += (Math.random() - 0.5) * 0.02;

         dot.vx *= 0.97;
         dot.vy *= 0.97;

         if (scrolling) {
            const speed = Math.sqrt(dot.vx * dot.vx + dot.vy * dot.vy);
            const maxSpeed = 8 * dot.parallaxFactor;
            if (speed > maxSpeed) { dot.vx *= maxSpeed / speed; dot.vy *= maxSpeed / speed; }
         }

         dot.x += dot.vx * dt * 0.05;
         dot.y += dot.vy * dt * 0.05;
         if (dot.x < -10) dot.x = W + 10;
         if (dot.x > W + 10) dot.x = -10;
         if (dot.y < -10) dot.y = H + 10;
         if (dot.y > H + 10) dot.y = -10;
         dot.el.style.transform = `translate3d(${dot.x}px,${dot.y}px,0)`;

         dot.timer -= dt;
         if (dot.timer <= 0) {
            dot.visible = !dot.visible;
            dot.el.style.transition = `opacity ${dot.fadeDuration}ms ease`;
            dot.el.style.opacity = dot.visible ? dot.maxOpacity : 0;
            dot.timer = (dot.visible ? dot.visibleDuration : dot.hiddenDuration) + dot.fadeDuration;
         }
      });
      requestAnimationFrame(animateDots);
   }
   requestAnimationFrame(animateDots);
}

// Cached DOM references
const _header = document.getElementById('header');
const _sections = Array.from(document.querySelectorAll('section[id]'));
const _navLinks = Array.from(document.querySelectorAll('nav a'));

function handleScroll() {
   const scrollY = window.scrollY;
   _header.classList.toggle('scrolled', scrollY > 50);

   const scrollPosition = scrollY + 150;
   let currentSection = '';
   _sections.forEach(section => {
      if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
         currentSection = section.getAttribute('id');
      }
   });
   _navLinks.forEach(link => {
      link.classList.toggle('nav-active', link.getAttribute('href') === '#' + currentSection);
   });
}

function setupNavigation() {
   const toggle = document.getElementById('navToggle');
   const nav = document.getElementById('nav');

   function closeNav() {
      toggle.classList.remove('active');
      nav.classList.remove('active');
      document.body.classList.remove('nav-open');
   }

   toggle.addEventListener('click', () => {
      const opening = !nav.classList.contains('active');
      toggle.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.classList.toggle('nav-open', opening);
      if (opening) nav.scrollTop = 0;
   });

   nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
      link.addEventListener('touchend', closeNav, { passive: true });
   });

   document.addEventListener('click', e => {
      if (nav.classList.contains('active') && !nav.contains(e.target) && !toggle.contains(e.target)) {
         closeNav();
      }
   });
}

function setupNewsletter() {
   const form = document.getElementById('newsletterForm');
   form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button[type="submit"]');
      const email = input.value.trim();
      const originalText = btn.textContent;
      btn.textContent = '...';
      btn.disabled = true;
      try {
         const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json',
               'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiZDAyNjY3ZGM0MzZjYTNmYTc1NGIwM2VlMTBhZTY2NzYxYjE0YzIxOWNhNDRjYmRjODQ3ZjliMTgzMDNjNjE3OTc0YmNmYWQ1YTBkMzJiYmEiLCJpYXQiOjE3NzIzOTI5OTIuMTQ4ODU4LCJuYmYiOjE3NzIzOTI5OTIuMTQ4ODYsImV4cCI6NDkyODA2NjU5Mi4xNDQ2MDEsInN1YiI6IjE4NDA1MjQiLCJzY29wZXMiOltdfQ.ajq5zU4kShqLQ31QOiYxIShq-8hzqHFd7cono6MMBhhlg4YgKCJ_I-5Jc2p4zZWRDKy5y82XeJdRl1xGaSsTbrQSFXVW-330ONqXXHatD1ROQX76k79DShFBCpLq5j6Qt9afhiEK-kVeG6NIojl-u9oP3VE38PATKnRJOQkcQi5wEIl45gPk4HWCGigapU3M9h89LPlRRxYuAV61pulqG_kDWrAzZ8i48m4U7bNmEc_HtpYlnCTOiYQ9yOhz49TmFYVRSXqlno77Z26DUppM0zRv3TwvdGRtESY5a3X7ypyapMvi-R_Kx3_szSWRdXGytIXPIdZPtBlxXoPnv_T29WxEu19hSa-BldaWCHEfaFU7Y9OdoqNozIB7ZV7IucNN_zS_YMKs8lT4on80WUgdPE5uInjdX1SDNLpAsfblVuHP4xvqUtuLrx7HSoMUvfS3tSPgA-nMk9rfY-7yIfphMJJN6eNytGWS_aMpY1xPh6IldDjozi83NvNxvcRsqch5K5LF2C-tLtRWr4FO-h8C12ze-vtps9pqbO4egH17xgkBx75MiCtIHESTeQUD7u1NFp3y7mKv0SrZqmSMblxgzxboUDi95EnqQ7gJPw06wpzzyutGOnxCMt2ZxXqmeGu2rcF9XDRJ6c6TN2im6GWgLWCI8u7eIB_Z7_HsuL7stFM'
            },
            body: JSON.stringify({ email, groups: ['180767113275769899'] })
         });
         if (response.status === 200 || response.status === 201) {
            btn.textContent = '✓ Inscrit !';
            input.value = '';
            setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 3000);
         } else {
            throw new Error();
         }
      } catch {
         btn.textContent = 'Erreur, réessaie';
         setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 3000);
      }
   });
}

function setupContactForm() {
   const form = document.getElementById('contactForm');
   form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const t = translations[currentLang];
      const btn = form.querySelector('.contact-submit');
      const originalText = btn.textContent;
      btn.textContent = t['contact-sending'];
      btn.disabled = true;
      try {
         const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: new FormData(form)
         });
         const data = await response.json();
         if (data.success) {
            btn.textContent = t['contact-success'];
            btn.style.opacity = '0.7';
            setTimeout(() => {
               form.reset();
               btn.textContent = t['contact-send'];
               btn.disabled = false;
               btn.style.opacity = '';
            }, 4000);
         } else {
            btn.textContent = t['contact-error'];
            setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 3000);
         }
      } catch {
         btn.textContent = t['contact-error'];
         setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 3000);
      }
   });
}

const translations = {
   fr: {
      'nav-home': 'Accueil',
      'nav-about': 'À propos',
      'nav-events': 'Événements',
      'nav-stations': 'Stations',
      'nav-traditions': 'Rejoins-nous',
      'nav-contact': 'Contact',
      'nav-join-dj': 'Candidature DJ',
      'nav-join-volunteer': 'Candidature bénévoles',
      'scroll': 'Scroll',
      'hero-sub': "VIS L'EXPÉRIENCE",
      'hero-bottom': '',
      'about-title': 'QUI SOMMES-NOUS ?',
      'about-h3': "L'<span class=\"text-gradient-light\">harmonie</span> dans le <span class=\"text-gradient-dark\">chaos</span>",
      'about-p1': "Pulsar System, c'est l'énergie d'une association bordelaise née fin 2024 avec l'ambition de redéfinir la fête et faire vibrer la France entière. Notre spécialité ? Investir des lieux atypiques pour transformer chaque set Techno en une expérience immersive unique.",
      'about-p2': "Notre ADN repose sur une organisation millimétrée, saine et 100% safe. Que vous soyez puristes ou simples curieux, nous créons des espaces où le son rencontre l'humain. Chaque programmation est pensée pour être une ascension progressive, explorant une large palette de textures sonores. Cette diversité de styles nous permet de rassembler un public hétérogène et passionné, où chaque profil trouve sa place sur le dancefloor.",
      'about-p3': "Mais nous ne nous arrêtons pas là. Notre futur s'écrit entre fête intelligente et médiation scientifique, pour nourrir vos oreilles autant que votre esprit.",
      'events-title': 'Prochains Events',
      'events-subtitle': 'Marque ton agenda pour nos prochains atterrissages.',
      'event1-title': 'Soirée Chorale',
      'event1-desc': "Une soirée de chants de Noël classiques interprétés par notre chorale communautaire sous les étoiles.",
      'event2-title': 'Échange de Biscuits',
      'event2-desc': "Apportez vos gourmandises préférées et échangez vos recettes lors de notre rassemblement annuel.",
      'event3-title': 'Veillée aux Bougies',
      'event3-desc': "Une célébration paisible de la veille de Noël avec des bougies, de la réflexion et l'esprit des fêtes.",
      'trad-title': 'Rejoins-nous',
      'trad-subtitle': "Vivre l'événement, c'est bien. Le créer, c'est mieux.",
      'trad1-title': 'Candidature bénévole',
      'trad1-desc': "Pulsar System, c'est avant tout une aventure humaine. Tu veux vivre l'expérience de l'intérieur et nous aider à rendre la fête plus belle ? On t'attend !",
      'trad2-title': 'Candidature DJ',
      'trad2-desc': "Tu es DJ et tu souhaites mixer pour Pulsar System ? Ce formulaire est pour toi. Nous sommes régulièrement en recherche de nouveaux talents pour enflammer nos événements !",
      'trad3-title': 'Partenariat',
      'trad3-desc': "Tu représentes une marque, une structure ou un lieu et tu souhaites collaborer avec Pulsar System ? Contacte-nous pour explorer ensemble les opportunités de partenariat.",
      'learn-more': 'En savoir plus',
      'newsletter-title': 'Entre dans le système',
      'newsletter-desc': "Intercepte le signal avant tout le monde. En rejoignant le Système, tu accèdes aux ouvertures de billetterie avant l'annonce officielle ainsi qu'à d'autres surprises exclusives.",
      'newsletter-placeholder': 'Ton adresse email',
      'newsletter-btn': "S'abonner",
      'footer-desc': "Une association bordelaise qui redéfinit l'expérience techno partout en France.",
      'footer-nav-title': 'Navigation',
      'footer-contact-title': 'Contact',
      'footer-copy': '© 2026 Pulsar System. Tous droits réservés.',
      'contact-title': 'Contacte-nous',
      'contact-subtitle': 'Une question, une proposition ?',
      'contact-name': 'Nom',
      'contact-name-ph': 'Ton nom',
      'contact-email-label': 'Email',
      'contact-email-ph': 'Ton email',
      'contact-subject': 'Sujet',
      'contact-subject-ph': 'Sujet de ton message',
      'contact-message': 'Message',
      'contact-message-ph': 'Ton message...',
      'contact-send': 'Envoyer',
      'contact-sending': 'Envoi en cours...',
      'contact-success': 'Message envoyé !',
      'contact-error': "Erreur lors de l'envoi, veuillez réessayer.",
      'stations-title': 'Stations',
      'stations-subtitle': 'Quelques-uns des atterissages notables du vaisseau Pulsar System.',
      'station1-short': "Organisation d'un open air en partenariat avec l'UBB.",
      'station2-short': 'La fusion entre patrimoine bordelais et musique électronique.',
      'station3-short': "Fêter la nouvelle année dans un lieu d'exception.",
      'station4-title': 'Ancien Bunker',
      'station4-short': 'Un ancien bunker de la Seconde Guerre mondiale transformé en temple de la techno.',
   },
   en: {
      'nav-home': 'Home',
      'nav-about': 'About',
      'nav-events': 'Events',
      'nav-stations': 'Stations',
      'nav-traditions': 'Join Us',
      'nav-contact': 'Contact',
      'nav-join-dj': 'DJ Application',
      'nav-join-volunteer': 'Volunteer Application',
      'scroll': 'Scroll',
      'hero-sub': 'LIVE THE',
      'hero-bottom': 'EXPERIENCE',
      'about-title': 'WHO ARE WE?',
      'about-h3': '<span class="text-gradient-light">Harmony</span> in <span class="text-gradient-dark">chaos</span>',
      'about-p1': "Pulsar System is a Bordeaux-based association born in late 2024, with the ambition to redefine the party and make all of France vibrate. Our specialty? Taking over unique venues to transform every Techno set into a one-of-a-kind immersive experience.",
      'about-p2': "Our DNA is built on precision-led, healthy, and 100% safe organisation. Whether you are a techno purist or simply curious, we create spaces where sound meets human connection. Each lineup is crafted as a progressive ascent, exploring a wide palette of sonic textures. This stylistic diversity brings together a passionate and diverse crowd, where everyone finds their place on the dancefloor.",
      'about-p3': "But we don't stop there. Our future lies between intelligent celebration and scientific outreach, feeding your ears as much as your mind.",
      'events-title': 'Upcoming Events',
      'events-subtitle': 'Mark your calendar for our upcoming landings.',
      'event1-title': 'Soirée Chorale',
      'event1-desc': "An evening of classic Christmas carols performed by our community choir under the stars.",
      'event2-title': 'Échange de Biscuits',
      'event2-desc': "Bring your favourite treats and swap recipes with fellow attendees at our annual gathering.",
      'event3-title': 'Veillée aux Bougies',
      'event3-desc': "A peaceful celebration with candlelight, reflection, and the spirit of the season.",
      'trad-title': 'Join Us',
      'trad-subtitle': "Experiencing the event is great. Creating it is better.",
      'trad1-title': 'Volunteer Application',
      'trad1-desc': "Pulsar System is above all a human adventure. Want to experience it from the inside and help make the party even better? We're waiting for you!",
      'trad2-title': 'DJ Application',
      'trad2-desc': "Are you a DJ looking to play for Pulsar System? This form is for you. We're always on the lookout for new talent to ignite our events!",
      'trad3-title': 'Partnership',
      'trad3-desc': "Do you represent a brand, an organisation, or a venue and want to collaborate with Pulsar System? Get in touch to explore partnership opportunities together.",
      'learn-more': 'Learn More',
      'newsletter-title': 'Enter the System',
      'newsletter-desc': "Intercept the signal before anyone else. By joining the System, you gain early access to ticket releases before the official announcement, as well as other exclusive surprises.",
      'newsletter-placeholder': 'Your email address',
      'newsletter-btn': 'Subscribe',
      'footer-desc': "A Bordeaux-based association redefining the techno experience across France.",
      'footer-nav-title': 'Navigation',
      'footer-contact-title': 'Contact',
      'footer-copy': '© 2026 Pulsar System. All rights reserved.',
      'contact-title': 'Contact Us',
      'contact-subtitle': 'A question, a proposal?',
      'contact-name': 'Name',
      'contact-name-ph': 'Your name',
      'contact-email-label': 'Email',
      'contact-email-ph': 'Your email',
      'contact-subject': 'Subject',
      'contact-subject-ph': 'Subject of your message',
      'contact-message': 'Message',
      'contact-message-ph': 'Your message...',
      'contact-send': 'Send',
      'contact-sending': 'Sending...',
      'contact-success': 'Message sent! We will get back to you shortly.',
      'contact-error': 'Error sending message, please try again.',
      'stations-title': 'Stations',
      'stations-subtitle': 'Some of the notable landings of the Pulsar System spaceship.',
      'station1-short': 'Partnership with UBB for an open-air event.',
      'station2-short': "The fusion of Bordeaux's heritage and electronic music.",
      'station3-short': 'Welcoming the new year in a unique venue.',
      'station4-title': 'Historic Bunker',
      'station4-short': 'A former World War II bunker transformed into a techno temple.',
   }
};

let currentLang = 'fr';

function switchLang(lang) {
   currentLang = lang;
   document.documentElement.lang = lang;
   const t = translations[lang];
   const els = Array.from(document.querySelectorAll('[data-i18n]'));
   const animate = !!revealObserver;

   if (animate) {
      els.forEach(el => {
         el.style.transition = 'opacity 0.15s ease';
         el.style.opacity = '0';
      });
   }

   const update = () => {
      els.forEach(el => {
         const key = el.getAttribute('data-i18n');
         if (t[key] !== undefined) el.innerHTML = t[key];
         if (animate) el.style.opacity = '';
      });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
         const key = el.getAttribute('data-i18n-placeholder');
         if (t[key] !== undefined) el.placeholder = t[key];
      });
      document.querySelectorAll('.lang-btn').forEach(btn => {
         btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
      });
      resetReveal();
      if (animate) setTimeout(() => els.forEach(el => { el.style.transition = ''; }), 180);
   };

   if (animate) setTimeout(update, 160);
   else update();
}

function setupLangToggle() {
   document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => switchLang(btn.getAttribute('data-lang')));
   });
   switchLang('fr');
}

let revealObserver = null;

function resetReveal() {
   if (!revealObserver) return;
   document.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('visible');
      revealObserver.observe(el);
   });
}

function setupVideo() {
   const video = document.querySelector('.hero-video');
   if (!video) return;
   const tryPlay = () => video.play().catch(() => {});
   video.addEventListener('ended', () => { video.currentTime = 0; tryPlay(); });
   document.addEventListener('visibilitychange', () => { if (!document.hidden && video.paused) tryPlay(); });
   window.addEventListener('focus', () => { if (video.paused) tryPlay(); });
   setInterval(() => { if (video.paused && !document.hidden) tryPlay(); }, 1000);
}

function setupScrollReveal() {
   const targets = document.querySelectorAll(
      '.section-header, .about-image, .about-content, ' +
      '.event-card, .tradition-card, ' +
      '.newsletter-container, .footer-grid, .footer-bottom'
   );
   targets.forEach(el => {
      el.classList.add('reveal');
      const siblings = el.parentElement
         ? el.parentElement.querySelectorAll('.event-card, .tradition-card')
         : [];
      if (siblings.length > 1) {
         const idx = Array.from(siblings).indexOf(el);
         if (idx > 0) el.style.transitionDelay = (idx * 0.12) + 's';
      }
   });
   revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
         if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add('visible');
            revealObserver.unobserve(el);
            const delay = parseFloat(el.style.transitionDelay) || 0;
            setTimeout(() => { el.style.transitionDelay = '0s'; }, delay * 1000 + 700);
         }
      });
   }, { threshold: 0.12 });
   targets.forEach(el => revealObserver.observe(el));
}

const stationsData = {
   destiny3: {
      title: 'UBB x Pulsar System',
      location: 'Stade Chaban-Delmas, Bordeaux',
      images: [
         'https://res.cloudinary.com/dimmeavlk/video/upload/v1772447029/ubb3_yenxxt.mp4',
         'images/ubb.webp',
         'images/ubb2.webp',
         'images/ubb4.webp'
      ],
      credits: [null, null, '@armel.hiconi', null],
      desc: {
         fr: "À l'occasion de l'affiche monumentale UBB - Stade Rochelais, Pulsar System a pris les commandes de l'ambiance sonore pour un open-air dans l'enceinte du stade Chaban-Delmas. Intégrer notre esthétique sonore à l'effervescence du rugby bordelais fut une expérience riche en partage. Une preuve supplémentaire que le Système sait investir tous les terrains, des lieux secrets aux plus grandes enceintes sportives.",
         en: "To mark the monumental clash between UBB and Stade Rochelais, Pulsar System took over the soundscape for an open-air event within the iconic Chaban-Delmas stadium. Blending our sonic aesthetic with the fervor of Bordeaux rugby was a profound experience. It further proves that the 'System' can conquer any ground—from underground venues to the most prestigious sporting arenas."
      }
   },
   eotu: {
      title: "Espace Mably",
      location: 'Espace Mably, Bordeaux',
      images: [
         'https://res.cloudinary.com/dimmeavlk/video/upload/v1772448275/EOTU-_20211115_a746435_18_qhcei6.mp4',
         'images/mably1.webp',
         'images/mably.webp',
         'images/mably2.webp'
      ],
      credits: ['@_papillondenuit_', '@_papillondenuit_', null, null],
      desc: {
         fr: "Investir un lieu de culture institutionnel comme l'Espace Mably a été une étape clé de notre ascension. Pulsar System a transformé ce temple de l'art en un sanctuaire éphémère de la techno à l'occasion d'Echoes Of The Universe. Un défi acoustique et logistique a dû être relevé pour offrir une expérience où chaque kick venait souligner la beauté de l'architecture.",
         en: "Taking over an institutional cultural landmark like Espace Mably was a pivotal milestone in our journey. For Echoes Of The Universe, Pulsar System transformed this temple of art into a fleeting sanctuary of techno. We overcame complex acoustic and logistical challenges to deliver an experience where every kick drum enhanced the architectural beauty of the venue."
      }
   },
   spacecastle: {
      title: 'Château de Seguin',
      location: 'Château de Seguin, Bordeaux',
      images: [
         'https://res.cloudinary.com/dimmeavlk/video/upload/f_mp4/v1773257716/copy_9E2A3FFF-DF64-47DE-8FFB-31E89C0FD3A0_x0wjjt.mp4',
         'images/seguin.webp',
         'https://res.cloudinary.com/dimmeavlk/video/upload/f_mp4/v1772449355/PXL_20260101_011255904_b3lvln.mp4',
         'images/seguin3.webp',
         'images/seguin4.webp'
      ],
      credits: ['@noxa.prod', '@samuel.lephotographe', null, null, null],
      desc: {
         fr: "Pour le Nouvel An 2026, nous avons investi un château viticole d'exception à l'occasion de Space Castle. La grande salle de réception du domaine s'est transformée en cockpit immersif façon boiler room (scène 360°), avec une acoustique précise et une proximité unique avec les artistes.\n\nÀ l'extérieur, la cour du château est devenue un coin chill abrité, parfait pour respirer et profiter du cadre majestueux avant de replonger dans le vaisseau.",
         en: "To ring in New Year's Eve 2026, we took over an exceptional wine estate for Space Castle. The domain's grand reception hall was reimagined as an immersive 'boiler room' style (360° stage) dancefloor, featuring razor-sharp acoustics and unparalleled proximity to the artists.\n\nOutside, the castle's courtyard became a sheltered chill-out zone, offering a moment to breathe in the majestic surroundings before re-boarding the spaceship."
      }
   },
   station4: {
      title: { fr: 'Ancien Bunker', en: 'Historic Bunker' },
      location: 'Moon Harbour, Bordeaux',
      images: [
         'https://res.cloudinary.com/dimmeavlk/video/upload/v1772458834/SB-_Wolverave_15_n4exdk.mp4',
         'images/bunker4.webp',
         'images/bunker.webp',
         'images/bunker2.webp',
         'images/bunker1.webp'
      ],
      credits: ['@nicolasnourrit_visuals', '@nicolasnourrit_visuals', '@nicolasnourrit_visuals', '@oliversmith.prod', '@oliversmith.prod'],
      desc: {
         fr: "Le bunker de la distillerie Moon Harbour, construit lors de la Seconde Guerre mondiale à côté de la Base sous-marine, a accueilli nos deux éditions Space Bunker.\n\nEntre jeux de lumière immersifs, système son de pointe, line up soigneusement pensée et progressive, nous avons fait de cet événement une expérience inédite.",
         en: "The Moon Harbour distillery bunker, a WWII vestige located next to the Submarine Base, played host to both editions of Space Bunker. Through immersive light shows, a cutting-edge sound system, and a meticulously curated progressive line-up, we transformed this historic site into a groundbreaking experience."
      }
   }
};

function createCreditBadge(handle) {
   const badge = document.createElement('div');
   badge.className = 'photo-credit';
   badge.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg><span>${handle.replace(/^@/, '')}</span>`;
   return badge;
}

function setupStations() {
   const modal = document.getElementById('stationModal');
   const backdrop = document.getElementById('stationBackdrop');
   const closeBtn = document.getElementById('stationClose');
   const modalTitle = document.getElementById('stationModalTitle');
   const modalDesc = document.getElementById('stationModalDesc');
   const modalGallery = document.getElementById('stationModalGallery');
   const modalMain = document.querySelector('.station-modal-main');
   const navPrev = document.getElementById('stationNavPrev');
   const navNext = document.getElementById('stationNavNext');
   const stationKeys = Object.keys(stationsData);
   let currentKey = null;

   function isVideo(src) {
      return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(src);
   }

   function setMainMedia(src, title, credit) {
      modalMain.innerHTML = '';
      if (isVideo(src)) {
         const video = document.createElement('video');
         video.src = src;
         video.autoplay = true;
         video.loop = true;
         video.muted = true;
         video.playsInline = true;
         video.preload = 'auto';
         video.style.width = '100%';
         video.style.borderRadius = '12px';
         modalMain.appendChild(video);
         video.play().catch(() => {});
      } else {
         const img = document.createElement('img');
         img.id = 'stationModalImg';
         img.src = src;
         img.alt = title;
         modalMain.appendChild(img);
      }
      if (credit) modalMain.appendChild(createCreditBadge(credit));
   }

   function openStation(key) {
      const data = stationsData[key];
      if (!data) return;
      currentKey = key;
      const idx = stationKeys.indexOf(key);
      if (navPrev) navPrev.disabled = idx <= 0;
      if (navNext) navNext.disabled = idx >= stationKeys.length - 1;
      const title = typeof data.title === 'object' ? (data.title[currentLang] || data.title.fr) : data.title;
      setMainMedia(data.images[0], title, data.credits?.[0]);
      modalTitle.textContent = title;
      modalDesc.innerHTML = (data.desc[currentLang] || data.desc.fr).replace(/\n\n/g, '<br><br>');
      const locEl = document.querySelector('#stationModalLocation span span');
      if (locEl) locEl.textContent = data.location || '';
      modalGallery.innerHTML = '';
      data.images.forEach((src, i) => {
         const vid = isVideo(src);
         const wrap = document.createElement('div');
         wrap.className = 'gallery-thumb-wrap';
         const thumb = document.createElement('img');
         if (vid && src.includes('cloudinary.com')) {
            // Use Cloudinary poster image (strip transformations, change ext to .jpg)
            thumb.src = src.replace(/\/upload\/[^v]*v/, '/upload/v').replace(/\.[^.]+$/, '.jpg');
         } else if (vid) {
            thumb.src = '';
         } else {
            thumb.src = src;
         }
         thumb.alt = typeof data.title === 'object' ? (data.title[currentLang] || data.title.fr) : data.title;
         wrap.style.animationDelay = `${i * 0.08}s`;
         wrap.appendChild(thumb);
         if (vid) {
            const playIcon = document.createElement('div');
            playIcon.className = 'gallery-play-icon';
            wrap.appendChild(playIcon);
         }
         wrap.addEventListener('click', () => setMainMedia(src, data.title, data.credits?.[i]));
         modalGallery.appendChild(wrap);
      });
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
   }

   function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      currentKey = null;
   }

   if (navPrev) navPrev.addEventListener('click', () => {
      const idx = stationKeys.indexOf(currentKey);
      if (idx > 0) openStation(stationKeys[idx - 1]);
   });
   if (navNext) navNext.addEventListener('click', () => {
      const idx = stationKeys.indexOf(currentKey);
      if (idx < stationKeys.length - 1) openStation(stationKeys[idx + 1]);
   });

   const grid = document.getElementById('stationsGrid');
   const prevBtn = document.getElementById('stationsPrev');
   const nextBtn = document.getElementById('stationsNext');
   const carousel = grid ? grid.closest('.stations-carousel') : null;
   let scrollingLeft = false;

   function getScrollAmount() {
      const card = grid.querySelector('.event-card');
      return card ? card.offsetWidth + 24 : 300;
   }

   function setGradient(leftVisible, leftInstant, rightHidden, rightInstant) {
      if (!carousel) return;
      carousel.classList.toggle('left-instant', leftInstant);
      carousel.classList.toggle('left-visible', leftVisible);
      carousel.classList.toggle('right-instant', rightInstant);
      carousel.classList.toggle('right-hidden', rightHidden);
   }

   function updateArrows() {
      if (!prevBtn || !nextBtn) return;
      prevBtn.disabled = grid.scrollLeft <= 0;
      nextBtn.disabled = grid.scrollLeft + grid.offsetWidth >= grid.scrollWidth - 1;
      if (scrollingLeft) {
         if (grid.scrollLeft <= 0) scrollingLeft = false;
         return;
      }
      if (grid.scrollLeft > 0) carousel && carousel.classList.add('right-hidden');
   }

   if (prevBtn && nextBtn && grid) {
      prevBtn.addEventListener('click', () => {
         scrollingLeft = true;
         setGradient(false, true, true, true);
         carousel.offsetHeight;
         setGradient(false, false, false, false);
         grid.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
      });
      nextBtn.addEventListener('click', () => {
         scrollingLeft = false;
         setGradient(true, true, false, false);
         carousel.offsetHeight;
         setGradient(true, false, false, false);
         grid.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      });
      grid.addEventListener('scroll', updateArrows);
      updateArrows();
   }

   document.querySelectorAll('[data-station]').forEach(card => {
      card.addEventListener('click', () => {
         if (grid) {
            const cardRect = card.getBoundingClientRect();
            const gridRect = grid.getBoundingClientRect();
            if (cardRect.left < gridRect.left || cardRect.right > gridRect.right) {
               const goingRight = cardRect.right > gridRect.right;
               const amount = getScrollAmount();
               scrollingLeft = !goingRight;
               if (goingRight) {
                  setGradient(true, true, false, false);
                  carousel.offsetHeight;
                  setGradient(true, false, false, false);
               } else {
                  setGradient(false, true, true, true);
                  carousel.offsetHeight;
                  setGradient(false, false, false, false);
               }
               grid.scrollBy({ left: goingRight ? amount : -amount, behavior: 'smooth' });
               return;
            }
         }
         openStation(card.dataset.station);
      });
   });

   closeBtn.addEventListener('click', closeModal);
   backdrop.addEventListener('click', closeModal);
   backdrop.addEventListener('pointerup', closeModal);
   modal.addEventListener('pointerup', e => {
      if (!e.target.closest('.station-modal-card') && !e.target.closest('.station-modal-nav')) {
         closeModal();
      }
   });
   document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
      if (!currentKey) return;
      if (e.key === 'ArrowLeft' && navPrev) navPrev.click();
      if (e.key === 'ArrowRight' && navNext) navNext.click();
   });
}

document.addEventListener('DOMContentLoaded', () => {
   createParticles();
   setupNavigation();
   setupNewsletter();
   setupContactForm();
   setupLangToggle();
   setupScrollReveal();
   setupVideo();
   setupStations();
   handleScroll();
   let scrollTicking = false;
   window.addEventListener('scroll', () => {
      if (!scrollTicking) {
         requestAnimationFrame(() => { handleScroll(); scrollTicking = false; });
         scrollTicking = true;
      }
   }, { passive: true });

   document.querySelectorAll('img[data-credit], video[data-credit]').forEach(el => {
      el.parentElement.appendChild(createCreditBadge(el.getAttribute('data-credit')));
   });

   // Custom scrollbar
   const scrollThumb = document.createElement('div');
   scrollThumb.id = 'scroll-thumb';
   document.body.appendChild(scrollThumb);
   let scrollHideTimer;
   const navbarEl = document.querySelector('header');
   function updateScrollThumb() {
      const navH = navbarEl ? navbarEl.offsetHeight : 0;
      const trackH = window.innerHeight - navH;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = total > 0 ? window.scrollY / total : 0;
      const thumbH = Math.max(40, (window.innerHeight / document.documentElement.scrollHeight) * trackH);
      scrollThumb.style.top = navH + 'px';
      scrollThumb.style.height = thumbH + 'px';
      scrollThumb.style.transform = `translateY(${ratio * (trackH - thumbH)}px)`;
      scrollThumb.classList.add('visible');
      clearTimeout(scrollHideTimer);
      scrollHideTimer = setTimeout(() => scrollThumb.classList.remove('visible'), 1000);
   }
   function showScrollThumb() {
      scrollThumb.classList.add('visible');
      clearTimeout(scrollHideTimer);
      scrollHideTimer = setTimeout(() => { if (!isDragging) scrollThumb.classList.remove('visible'); }, 1000);
   }
   window.addEventListener('scroll', updateScrollThumb, { passive: true });
   window.addEventListener('resize', updateScrollThumb);
   window.addEventListener('mousemove', showScrollThumb, { passive: true });
   updateScrollThumb();

   // Drag scrollbar
   let isDragging = false, dragStartY = 0, dragStartScrollY = 0;
   scrollThumb.style.pointerEvents = 'auto';
   scrollThumb.addEventListener('mousedown', e => {
      isDragging = true;
      dragStartY = e.clientY;
      dragStartScrollY = window.scrollY;
      scrollThumb.classList.add('visible');
      e.preventDefault();
   });
   window.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const thumbH = parseFloat(scrollThumb.style.height);
      const trackH = window.innerHeight - thumbH;
      const delta = (e.clientY - dragStartY) / trackH * total;
      window.scrollTo({ top: dragStartScrollY + delta, behavior: 'instant' });
   });
   window.addEventListener('mouseup', () => {
      isDragging = false;
   });

   document.querySelectorAll('img').forEach(img => { img.draggable = false; });
   new MutationObserver(() => {
      document.querySelectorAll('img').forEach(img => { img.draggable = false; });
   }).observe(document.body, { childList: true, subtree: true });

   document.addEventListener('contextmenu', e => {
      if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') e.preventDefault();
   });
   document.addEventListener('dragstart', e => {
      if (e.target.tagName === 'IMG') e.preventDefault();
   });
});
