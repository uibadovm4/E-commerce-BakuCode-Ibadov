window.addEventListener('scroll', () => {
  const navDis = document.querySelector('.nav-dis');
  if (window.scrollY > 50) {
    navDis.classList.add('scrolled');
  } else {
    navDis.classList.remove('scrolled');
  }
});
document.documentElement.style.scrollbarWidth = 'none';
// document.documentElement.style.scrollBehavior = 'smooth';
const style = document.createElement('style');
style.textContent = `
    html::-webkit-scrollbar {
        display: none;
    }
`;

document.head.appendChild(style);
let velocity = 0;          
let targetVelocity = 0; // Tekerlekten gelen ham güç
let currentScrollY = window.scrollY;

// --- YAĞ GİBİ AKMA AYARLARI ---
const friction = 0.90;       // Bıraktığında ne kadar kayacağı (0.90 çok dengelidir)
const sensitivity = 0.25;    // Tekerlek hassasiyeti (Zorlanıyorsa bunu 0.35 yapabilirsin)
const lerpFactor = 0.15;     // Hızın devreye girme yumuşaklığı (Zorlanma hissini yok eden ayar)
// ------------------------------

window.addEventListener('wheel', (e) => {
  e.preventDefault(); 
  // Tekerlek hareketini hedef hıza dönüştür
  targetVelocity += e.deltaY * sensitivity;
}, { passive: false });

function smoothPhysicsScroll() {
  // Zorlanma hissini bitiren yer: Anlık hızı, hedef hıza yumuşakça yaklaştırıyoruz
  velocity += (targetVelocity - velocity) * lerpFactor;

  // Hedef hızı da kendi içinde sürekli sürtünmeyle eritiyoruz
  targetVelocity *= friction;

  // Mikro takılmaları engellemek için sıfırlama
  if (Math.abs(velocity) < 0.05) {
    velocity = 0;
    targetVelocity = 0;
  }

  if (velocity !== 0) {
    currentScrollY += velocity;

    const maxScroll = document.body.scrollHeight - window.innerHeight;
    if (currentScrollY < 0) {
      currentScrollY = 0;
      velocity = 0;
      targetVelocity = 0;
    } else if (currentScrollY > maxScroll) {
      currentScrollY = maxScroll;
      velocity = 0;
      targetVelocity = 0;
    }

    window.scrollTo(0, currentScrollY);
  }

  requestAnimationFrame(smoothPhysicsScroll);
}

smoothPhysicsScroll();

