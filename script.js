const engine = Matter.Engine.create();
const render = Matter.Render.create({
    element: document.querySelector('.playground-container'),
    engine: engine,
    options: {
        width: 800,
        height: 400,
        wireframes: false,
        background: 'transparent',
        showAngleIndicator: false,
        showCollisions: false,
        showVelocity: false
    }
});

const playgroundSection = document.querySelector('.physics-playground');
const descriptionDiv = document.createElement('div');
descriptionDiv.className = 'playground-description glass';
descriptionDiv.innerHTML = `
    <h2>Interactive Feature Showcase</h2>
    <p>Experience PERM's features in this interactive playground! Our distraction-free reading mode transforms cluttered web pages into clean, focused content. Drag and interact with the objects below to explore the features mentioned in our proposal.</p>
    <div class="feature-tags">
        <span class="feature-tag">Content Extraction</span>
        <span class="feature-tag">Custom Themes</span>
        <span class="feature-tag">Offline Reading</span>
        <span class="feature-tag">Browser Extension</span>
    </div>
`;

playgroundSection.insertBefore(descriptionDiv, playgroundSection.firstChild);

// physics obejcts keliye
function createPhysicsObjects() {
    const world = engine.world;
    
    const ground = Matter.Bodies.rectangle(400, 410, 810, 20, { 
        isStatic: true,
        render: {
            fillStyle: '#ae8957'
        }
    });
    const leftWall = Matter.Bodies.rectangle(-10, 200, 20, 400, { 
        isStatic: true,
        render: {
            fillStyle: '#ae8957'
        }
    });
    const rightWall = Matter.Bodies.rectangle(810, 200, 20, 400, { 
        isStatic: true,
        render: {
            fillStyle: '#ae8957'
        }
    });
    
    const objects = [];
    const colors = ['#ae8957', '#d4af37', '#c69b68', '#8B4513'];
    const shapes = ['circle', 'rectangle', 'polygon'];
    
    for (let i = 0; i < 50; i++) {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const x = Math.random() * 700 + 50;
        const y = Math.random() * 200;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        let object;
        
        switch(shape) {
            case 'circle':
                object = Matter.Bodies.circle(x, y, 15, {
                    render: {
                        fillStyle: color,
                        strokeStyle: '#ffffff',
                        lineWidth: 1
                    }
                });
                break;
            case 'rectangle':
                object = Matter.Bodies.rectangle(x, y, 30, 30, {
                    render: {
                        fillStyle: color,
                        strokeStyle: '#ffffff',
                        lineWidth: 1
                    }
                });
                break;
            case 'polygon':
                object = Matter.Bodies.polygon(x, y, Math.random() * 3 + 3, 20, {
                    render: {
                        fillStyle: color,
                        strokeStyle: '#ffffff',
                        lineWidth: 1
                    }
                });
                break;
        }
        
        objects.push(object);
    }
    
    const features = [
        'Clean Reading',
        'Dark Mode',
        'Customization',
        'Article Saving',
        'Fast Loading',
        'Mobile Ready'
    ];
    
    features.forEach((feature, index) => {
        const textBody = Matter.Bodies.rectangle(
            Math.random() * 700 + 50,
            Math.random() * 200,
            120,
            40,
            {
                render: {
                    fillStyle: '#ae8957',
                    text: {
                        content: feature,
                        color: '#ffffff',
                        size: 14,
                        family: 'Poppins'
                    }
                }
            }
        );
        objects.push(textBody);
    });
    
    Matter.World.add(world, [ground, leftWall, rightWall, ...objects]);
}

// Initialize physics ka hai ye dekhlena mast chiz hai matter js
Matter.Engine.run(engine);
Matter.Render.run(render);
createPhysicsObjects();

const mouse = Matter.Mouse.create(render.canvas);
const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});
Matter.World.add(engine.world, mouseConstraint);
render.mouse = mouse;

const menuTrigger = document.querySelector('.menu-trigger');
const sideMenu = document.querySelector('.side-menu');
const pageOverlay = document.querySelector('.page-overlay');
const closeMenu = document.querySelector('.close-menu');

function toggleMenu() {
    menuTrigger.classList.toggle('active');
    sideMenu.classList.toggle('active');
    pageOverlay.classList.toggle('active');
    document.body.classList.toggle('menu-open');
}

menuTrigger.addEventListener('click', toggleMenu);
closeMenu.addEventListener('click', toggleMenu);
pageOverlay.addEventListener('click', toggleMenu);

// Welcome Popup
const welcomePopup = document.querySelector('.welcome-popup');
const popupClose = document.querySelector('.popup-close');

function showWelcomePopup() {
    setTimeout(() => {
        welcomePopup.classList.add('active');
        pageOverlay.classList.add('active');
    }, 1000);
}

popupClose.addEventListener('click', () => {
    welcomePopup.classList.remove('active');
    pageOverlay.classList.remove('active');
});

// first visit meh jo welcome msg tha
if (!localStorage.getItem('welcomed')) {
    showWelcomePopup();
    localStorage.setItem('welcomed', 'true');
}

const cursor = document.createElement('div');
cursor.classList.add('cursor-follower');
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX - 10,
        y: e.clientY - 10,
        duration: 0.1
    });
});

// background elements
document.querySelectorAll('.magnetic').forEach(element => {
    element.addEventListener('mousemove', (e) => {
        const bound = element.getBoundingClientRect();
        const mouseX = e.clientX - bound.left - bound.width / 2;
        const mouseY = e.clientY - bound.top - bound.height / 2;
        
        gsap.to(element, {
            x: mouseX * 0.3,
            y: mouseY * 0.3,
            duration: 0.3
        });
    });
    
    element.addEventListener('mouseleave', () => {
        gsap.to(element, {
            x: 0,
            y: 0,
            duration: 0.3
        });
    });
});

// tips ke liye
document.querySelectorAll('.tip-card').forEach(tip => {
    tip.addEventListener('click', () => {
        const tipNumber = tip.dataset.tip;
        showToast(`Tip ${tipNumber}: Here's a helpful tip about using PERM!`, 'success');
    });
});

// woh chote notification ka hai ye
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.classList.add('toast', type);
    toast.innerHTML = `
        <i class="bx ${type === 'success' ? 'bx-check' : 'bx-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.querySelector('.toast-container').appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// theme select ka hai ye
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-theme');
    themeToggle.classList.toggle('active');
});

// Particles.js ka hai ye
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#ae8957' },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#ae8957',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 6,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
        }
    },
    retina_detect: true
});


// ye hai tere floating objects
function createBlobs() {
    const colors = ['#ae8957', '#d4af37', '#c69b68'];
    const container = document.createElement('div');
    container.className = 'blob-container';
    
    for (let i = 0; i < 5; i++) {
        const blob = document.createElement('div');
        blob.className = 'blob';
        blob.style.background = colors[Math.floor(Math.random() * colors.length)];
        blob.style.left = `${Math.random() * 100}%`;
        blob.style.top = `${Math.random() * 100}%`;
        blob.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(blob);
    }
    
    document.body.appendChild(container);
}

createBlobs();


async function fetchContent() {
    const url = document.getElementById("urlInput").value.trim();
    if (!url) {
      alert("Please enter a valid URL.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/extract?url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error("Failed to fetch content");
  
      const data = await response.json();
      
      localStorage.setItem("extractedContent", JSON.stringify(data));
  
      window.location.href = "display.html";
    } catch (error) {
      console.error("Error fetching content:", error);
      alert("Failed to load content. Please try again.");
    }
  }
  
  
  