window.addEventListener('scroll', () => {
  const navDis = document.querySelector('.nav-dis');
  if (window.scrollY > 50) {
    navDis.classList.add('scrolled');
  } else {
    navDis.classList.remove('scrolled');
  }
});
document.documentElement.style.scrollbarWidth = 'none';

const style = document.createElement('style');
style.textContent = `
    html::-webkit-scrollbar {
        display: none;
    }
`;

document.head.appendChild(style);
let velocity = 0;          
let targetVelocity = 0; 
let currentScrollY = window.scrollY;


const friction = 0.90;       
const sensitivity = 0.25;    
const lerpFactor = 0.15;     


window.addEventListener('wheel', (e) => {
  e.preventDefault(); 
  
  targetVelocity += e.deltaY * sensitivity;
}, { passive: false });

function smoothPhysicsScroll() {
  
  velocity += (targetVelocity - velocity) * lerpFactor;

  
  targetVelocity *= friction;

  
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

