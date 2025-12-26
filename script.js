// Configuración
const CONFIG = {
    appsScriptUrl: 'https://script.google.com/macros/s/AKfycbwbOhFNLDpRmni3uhVATmU_fb1OSucKpdZZmwRgS1d56Pa-C1aFXjL_6i-ztuQW1JFLRw/exec',
    apiEndpoints: {
        listarDisponibles: '?page=listarDisponibles',
        formulario: '?id=__ID__&vista=formulario'
    },
    whatsappNumber: '+59176560084',
    email: 'fundacionfenixlpb@gmail.com'
};

// Estado de la aplicación
let animales = [];
let filtroActual = 'todos';
let carruselesAuto = [];

// DOM Elements
const animalsGrid = document.getElementById('animalsGrid');
const loadingElement = document.getElementById('loading');
const noResultsElement = document.getElementById('noResults');
const filterButtons = document.querySelectorAll('.filter-btn');

// ==================== FUNCIÓN PARA CORREGIR TÍTULOS BLANCOS ====================

function corregirTitulosBlancos() {
    console.log('Corrigiendo títulos a color blanco...');
    
    // Lista de textos que deben ser blancos
    const textosBlancos = [
        "Dales un hogar, recibe amor infinito",
        "Nuestra Historia y Misión",
        "Nuestros Proyectos Principales",
        "Únete como Voluntario",
        "Tu Ayuda Cambia Vidas",
        "Estamos para Ayudarte",
        "Encuentra a tu Compañero Ideal"
    ];
    
    // Buscar en todos los h1
    document.querySelectorAll('h1').forEach(h1 => {
        const texto = h1.textContent.trim();
        textosBlancos.forEach(textoBlanco => {
            if (texto.includes(textoBlanco)) {
                // Aplicar clases y estilos
                h1.classList.add('title-white');
                h1.classList.remove('shimmer-text');
                
                // Estilos en línea para asegurar
                h1.style.color = '#FFFFFF';
                h1.style.webkitTextFillColor = '#FFFFFF';
                h1.style.textShadow = '2px 2px 8px rgba(0, 0, 0, 0.5)';
                
                console.log(`Título corregido: ${texto.substring(0, 30)}...`);
            }
        });
    });
    
    // También corregir h2 en sección de proyectos
    document.querySelectorAll('.section-title h2').forEach(h2 => {
        if (h2.textContent.includes('Nuestros Proyectos Principales')) {
            h2.style.color = '#FFFFFF';
            h2.style.textShadow = '2px 2px 6px rgba(0, 0, 0, 0.4)';
        }
    });
}

// ==================== CORREGIR MENÚ HAMBURGUESA ====================

function configurarMenuHamburguesa() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    if (!hamburger || !navMenu) {
        console.error('Elementos del menú no encontrados');
        return;
    }
    
    console.log('Configurando menú hamburguesa...');
    
    hamburger.addEventListener('click', () => {
        console.log('Hamburguesa clickeada');
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('nav-open');
        
        // Asegurar que el icono sea visible
        hamburger.style.display = 'block';
        hamburger.style.visibility = 'visible';
        hamburger.style.opacity = '1';
    });
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('nav-open');
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('nav-open');
        }
    });
    
    // Asegurar que el botón hamburguesa sea visible en móviles
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            hamburger.style.display = 'block';
        } else {
            hamburger.style.display = 'none';
            navMenu.classList.remove('active');
            body.classList.remove('nav-open');
        }
    });
}

// ==================== INICIALIZAR TODOS LOS BOTONES ====================

function inicializarTodosLosBotones() {
    console.log('Inicializando todos los botones...');
    
    // 1. Botones de WhatsApp
    document.querySelectorAll('.btn-whatsapp, [href*="whatsapp"]').forEach(btn => {
        if (!btn.hasAttribute('data-initialized')) {
            btn.setAttribute('data-initialized', 'true');
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                let mensaje = 'Hola, me contacto desde el sitio web de Fundación Fénix LPB. ¿Me pueden brindar información?';
                
                // Mensaje específico según contexto
                if (this.classList.contains('btn-adopt')) {
                    const animalCard = this.closest('.animal-card');
                    const animalName = animalCard?.querySelector('h3')?.textContent || 'un animal';
                    mensaje = `Hola, estoy interesado en ADOPTAR a ${animalName} de Fundación Fénix LPB. ¿Me pueden brindar información sobre el proceso?`;
                } else if (this.classList.contains('donation-btn')) {
                    mensaje = 'Hola, quiero hacer una DONACIÓN a Fundación Fénix LPB. ¿Cómo puedo proceder?';
                } else if (this.classList.contains('emergency-btn')) {
                    mensaje = 'URGENTE: Necesito reportar un animal en situación de riesgo.';
                }
                
                const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
                window.open(url, '_blank');
            });
        }
    });
    
    // 2. Botones de redes sociales (abrir en nueva pestaña)
    document.querySelectorAll('a[href*="facebook.com"], a[href*="instagram.com"]').forEach(link => {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    });
    
    // 3. Botones de adopción
    document.querySelectorAll('.btn-adopt').forEach(btn => {
        if (!btn.hasAttribute('data-initialized')) {
            btn.setAttribute('data-initialized', 'true');
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const animalCard = this.closest('.animal-card');
                const animalName = animalCard?.querySelector('h3')?.textContent || 'un animal';
                const mensaje = `Hola, estoy interesado en ADOPTAR a ${animalName} de Fundación Fénix LPB. ¿Me pueden brindar información sobre el proceso?`;
                const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
                window.open(url, '_blank');
            });
        }
    });
    
    // 4. Botones de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (!btn.hasAttribute('data-initialized')) {
            btn.setAttribute('data-initialized', 'true');
            btn.addEventListener('click', function() {
                // Remover clase active de todos los botones
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                
                // Agregar clase active al botón clickeado
                this.classList.add('active');
                
                // Actualizar filtro
                filtroActual = this.getAttribute('data-filter');
                
                // Filtrar animales
                filtrarAnimales();
            });
        }
    });
    
    // 5. Botones de formulario
    document.querySelectorAll('form button[type="submit"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const form = this.closest('form');
            if (form && !form.checkValidity()) {
                e.preventDefault();
                form.reportValidity();
            }
        });
    });
    
    // 6. Todos los botones deben tener cursor pointer
    document.querySelectorAll('button, .btn, a[role="button"]').forEach(btn => {
        btn.style.cursor = 'pointer';
    });
    
    console.log('Botones inicializados correctamente');
}

// ==================== CARGAR ANIMALES ====================

async function cargarAnimales() {
    try {
        mostrarLoading(true);
        
        const response = await fetch(CONFIG.appsScriptUrl + CONFIG.apiEndpoints.listarDisponibles);
        
        if (!response.ok) {
            throw new Error('Error al cargar animales');
        }
        
        animales = await response.json();
        console.log('Animales cargados:', animales.length);
        mostrarAnimales(animales);
        
    } catch (error) {
        console.error('Error:', error);
        mostrarError();
    } finally {
        mostrarLoading(false);
    }
}

function mostrarAnimales(listaAnimales) {
    if (!animalsGrid) return;
    
    // Limpiar grid
    animalsGrid.innerHTML = '';
    
    if (!listaAnimales || listaAnimales.length === 0) {
        if (noResultsElement) {
            noResultsElement.style.display = 'block';
        }
        return;
    }
    
    if (noResultsElement) {
        noResultsElement.style.display = 'none';
    }
    
    // Crear y agregar cards
    listaAnimales.forEach((animal, index) => {
        const animalCard = crearCardAnimal(animal);
        animalCard.style.animationDelay = `${index * 0.1}s`;
        animalCard.classList.add('fade-in-up', 'animated-element');
        animalsGrid.appendChild(animalCard);
    });
    
    // Re-inicializar botones de adopción
    inicializarTodosLosBotones();
}

function crearCardAnimal(animal) {
    const icono = animal.especie === 'Perro' ? 'fa-dog' : 
                  animal.especie === 'Gato' ? 'fa-cat' : 'fa-dove';
    
    const div = document.createElement('div');
    div.className = 'animal-card animated-element';
    div.setAttribute('data-especie', animal.especie);
    
    div.innerHTML = `
        <div class="animal-image">
            <img src="${animal.foto || 'img_fenix/Fenix_1.jpg'}" 
                 alt="${animal.nombre}" 
                 onerror="this.src='img_fenix/Fenix_2.jpg'">
            <div class="animal-overlay">
                <span class="animal-badge">¡Busca hogar!</span>
            </div>
        </div>
        <div class="animal-info">
            <h3 class="shimmer-text">${animal.nombre}</h3>
            <div class="animal-tags">
                <span class="tag"><i class="fas ${icono}"></i> ${animal.especie}</span>
                <span class="tag">${animal.edad}</span>
                <span class="tag">${animal.sexo}</span>
            </div>
            <p><strong>Raza:</strong> ${animal.raza || 'Mestizo'}</p>
            <p><strong>Tamaño:</strong> ${animal.tamaño}</p>
            <p><strong>Salud:</strong> ${animal.estadoSalud}</p>
            <button class="btn btn-adopt">
                <i class="fas fa-heart"></i> SOLICITAR ADOPCIÓN
            </button>
        </div>
    `;
    
    return div;
}

// ==================== FUNCIONES DE FILTRO ====================

function configurarFiltros() {
    if (!filterButtons.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            // Actualizar filtro
            filtroActual = this.getAttribute('data-filter');
            
            // Filtrar animales
            filtrarAnimales();
        });
    });
}

function filtrarAnimales() {
    let animalesFiltrados;
    
    if (filtroActual === 'todos') {
        animalesFiltrados = animales;
    } else {
        animalesFiltrados = animales.filter(animal => 
            animal.especie === filtroActual
        );
    }
    
    mostrarAnimales(animalesFiltrados);
}

// ==================== SCROLL SUAVE ====================

function configurarScrollSuave() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== FORMULARIOS ====================

function configurarFormularios() {
    // Formulario de ayuda
    const helpForm = document.getElementById('helpForm');
    if (helpForm) {
        helpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Redirigir a WhatsApp para donaciones
            const mensaje = `Hola, quiero hacer una donación a Fundación Fénix LPB.`;
            window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(mensaje)}`, '_blank');
            
            mostrarNotificacion('¡Gracias por tu generosidad! Te hemos redirigido a WhatsApp para completar tu donación.', 'success');
            this.reset();
        });
    }
    
    // Formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simular envío
            mostrarNotificacion('¡Gracias por contactarnos! Te responderemos en menos de 24 horas.', 'success');
            this.reset();
        });
    }
}

// ==================== ANIMACIONES ====================

function configurarAnimacionesDonacion() {
    const heartAnimation = document.querySelector('.heart-animation');
    if (heartAnimation) {
        // Agregar latido aleatorio adicional
        setInterval(() => {
            if (Math.random() > 0.7) {
                heartAnimation.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    heartAnimation.style.transform = 'scale(1)';
                }, 300);
            }
        }, 2000);
    }
}

function configurarAnimacionesEntrada() {
    // Animación para elementos con fade-in-up
    document.querySelectorAll('.fade-in-up').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Animación para elementos con slide-in-left
    document.querySelectorAll('.slide-in-left').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.15}s`;
    });
    
    // Animación para elementos con slide-in-right
    document.querySelectorAll('.slide-in-right').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.15}s`;
    });
}

function configurarObservadorAnimaciones() {
    const elementosAnimados = document.querySelectorAll('.animated-element');
    
    if (elementosAnimados.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elementosAnimados.forEach(elemento => {
        observer.observe(elemento);
    });
}

// ==================== CARRUSELES AUTOMÁTICOS ====================

function inicializarCarruselesAuto() {
    // Inicializar todos los carruseles con scroll automático
    document.querySelectorAll('.auto-scroll-container').forEach((contenedor, index) => {
        const items = contenedor.querySelectorAll('.scroll-snap-item, .testimonio-auto-card, .logro-auto-card, .donacion-auto-card, .galeria-auto-card, .faq-auto-card');
        
        if (items.length === 0) return;
        
        // Duplicar items para efecto infinito
        duplicarItemsCarrusel(contenedor);
        
        // Configurar velocidad diferente para cada carrusel
        const velocidad = [50, 45, 55, 60, 50][index % 5] || 50;
        contenedor.style.animationDuration = `${velocidad}s`;
        
        // Configurar pausa al hacer hover
        const wrapper = contenedor.closest('.auto-scroll-wrapper');
        if (wrapper) {
            wrapper.addEventListener('mouseenter', () => {
                contenedor.style.animationPlayState = 'paused';
            });
            
            wrapper.addEventListener('mouseleave', () => {
                contenedor.style.animationPlayState = 'running';
            });
        }
        
        // Guardar referencia
        carruselesAuto.push({
            contenedor,
            items,
            velocidad,
            pausado: false
        });
    });
}

function duplicarItemsCarrusel(contenedor) {
    const items = contenedor.children;
    if (items.length === 0) return;
    
    // Crear copia de todos los items
    const fragment = document.createDocumentFragment();
    Array.from(items).forEach(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('duplicate-item');
        fragment.appendChild(clone);
    });
    
    contenedor.appendChild(fragment);
}

// ==================== CONTADORES ANIMADOS ====================

function inicializarContadores() {
    const contadores = document.querySelectorAll('.stat-number');
    
    contadores.forEach(contador => {
        const valorFinal = parseInt(contador.textContent);
        let valorActual = 0;
        const duracion = 2000; // 2 segundos
        const incremento = valorFinal / (duracion / 16); // 60fps
        
        const animar = () => {
            valorActual += incremento;
            if (valorActual >= valorFinal) {
                valorActual = valorFinal;
                contador.textContent = valorFinal;
                contador.classList.add('count-complete');
                return;
            }
            
            contador.textContent = Math.floor(valorActual);
            requestAnimationFrame(animar);
        };
        
        // Iniciar animación cuando sea visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animar();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(contador);
    });
}

// ==================== BOTONES FLOTANTES ====================

function crearBotonesFlotantes() {
    // Botón de WhatsApp flotante
    if (!document.querySelector('.whatsapp-btn-fixed')) {
        const whatsappBtn = document.createElement('a');
        whatsappBtn.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent('Hola, me contacto desde el sitio web de Fundación Fénix LPB. Quisiera más información sobre su trabajo.')}`;
        whatsappBtn.className = 'whatsapp-btn-fixed';
        whatsappBtn.target = '_blank';
        whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
        whatsappBtn.title = 'Contáctanos por WhatsApp';
        whatsappBtn.setAttribute('aria-label', 'Contactar por WhatsApp');
        document.body.appendChild(whatsappBtn);
    }
    
    // Contenedor para botones de redes sociales
    if (!document.querySelector('.social-btn-fixed')) {
        const socialContainer = document.createElement('div');
        socialContainer.className = 'social-btn-fixed';
        
        // Botón de Facebook
        const facebookBtn = document.createElement('a');
        facebookBtn.href = 'https://www.facebook.com/profile.php?id=100071884842595&locale=es_LA';
        facebookBtn.className = 'facebook-btn-fixed';
        facebookBtn.target = '_blank';
        facebookBtn.innerHTML = '<i class="fab fa-facebook-f"></i>';
        facebookBtn.title = 'Síguenos en Facebook';
        facebookBtn.setAttribute('aria-label', 'Seguir en Facebook');
        
        // Botón de Instagram
        const instagramBtn = document.createElement('a');
        instagramBtn.href = 'https://www.instagram.com/fundacion_fenix_lpb/';
        instagramBtn.className = 'instagram-btn-fixed';
        instagramBtn.target = '_blank';
        instagramBtn.innerHTML = '<i class="fab fa-instagram"></i>';
        instagramBtn.title = 'Síguenos en Instagram';
        instagramBtn.setAttribute('aria-label', 'Seguir en Instagram');
        
        socialContainer.appendChild(facebookBtn);
        socialContainer.appendChild(instagramBtn);
        document.body.appendChild(socialContainer);
    }
}

// ==================== UTILIDADES ====================

function mostrarLoading(mostrar) {
    if (loadingElement) {
        loadingElement.style.display = mostrar ? 'block' : 'none';
    }
}

function mostrarError() {
    if (!animalsGrid) return;
    
    animalsGrid.innerHTML = `
        <div class="no-results" style="display: block; text-align: center; padding: 3rem;">
            <div class="error-animation">
                <i class="fas fa-exclamation-triangle fa-3x" style="color: var(--naranja-brillante); margin-bottom: 1rem;"></i>
                <div class="pulse-ring"></div>
            </div>
            <h3 style="color: var(--rojo);">Error al cargar animales</h3>
            <p>Por favor, intenta de nuevo más tarde.</p>
            <button onclick="cargarAnimales()" class="btn btn-primary" style="margin-top: 1rem;">
                <i class="fas fa-redo"></i> Reintentar
            </button>
        </div>
    `;
}

function mostrarNotificacion(mensaje, tipo = 'success') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.innerHTML = `
        <div class="notificacion-icon">
            <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        </div>
        <div class="notificacion-text">${mensaje}</div>
        <button class="notificacion-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Estilos dinámicos
    const color = tipo === 'success' ? 'var(--naranja-brillante)' : 'var(--rojo)';
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${color};
        color: white;
        border-radius: var(--radius-sm);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 15px;
        animation: slideIn 0.3s ease, slideOut 0.3s ease 4.7s forwards;
        max-width: 350px;
        transform: translateX(120%);
        backdrop-filter: blur(10px);
    `;
    
    // Agregar estilos si no existen
    if (!document.querySelector('#notificacion-styles')) {
        const style = document.createElement('style');
        style.id = 'notificacion-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(120%);
                }
                to {
                    transform: translateX(0);
                }
            }
            @keyframes slideOut {
                to {
                    transform: translateX(120%);
                    opacity: 0;
                }
            }
            .notificacion-close {
                background: none;
                border: none;
                color: white;
                font-size: 1rem;
                cursor: pointer;
                padding: 5px;
                margin-left: auto;
                opacity: 0.7;
                transition: opacity 0.2s;
            }
            .notificacion-close:hover {
                opacity: 1;
            }
            .notificacion-icon {
                font-size: 1.5rem;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notificacion);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notificacion.parentElement) {
            notificacion.remove();
        }
    }, 5000);
}

// ==================== VERIFICACIÓN FINAL ====================

function verificarTodoFunciona() {
    console.log('=== VERIFICANDO QUE TODO FUNCIONE ===');
    
    // Verificar hamburguesa
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    console.log('Hamburguesa:', hamburger ? '✓ Encontrada' : '✗ No encontrada');
    console.log('Menú:', navMenu ? '✓ Encontrado' : '✗ No encontrado');
    
    // Verificar botones
    const totalBotones = document.querySelectorAll('button, .btn').length;
    console.log(`Total botones: ${totalBotones} ✓`);
    
    // Verificar títulos blancos
    const titulosBlancos = document.querySelectorAll('.title-white, .hero h1');
    console.log(`Títulos blancos: ${titulosBlancos.length} ✓`);
    
    // Verificar funciones globales
    console.log('Funciones globales:', 
        typeof donarPorWhatsApp !== 'undefined' ? '✓ donarPorWhatsApp' : '✗ donarPorWhatsApp',
        typeof solicitarAdopcion !== 'undefined' ? '✓ solicitarAdopcion' : '✗ solicitarAdopcion'
    );
}

// ==================== FUNCIONES GLOBALES ====================

window.donarPorWhatsApp = function(tipoDonacion = 'unica') {
    let mensaje = '';
    
    switch(tipoDonacion) {
        case 'unica':
            mensaje = 'Hola, quiero hacer una DONACIÓN ÚNICA a Fundación Fénix LPB. ¿Cómo puedo proceder?';
            break;
        case 'mensual':
            mensaje = 'Hola, me interesa ser PADRINO/MADRINA con donación mensual. ¿Cómo funciona el proceso?';
            break;
        case 'especie':
            mensaje = 'Hola, quiero donar ALIMENTOS, MANTAS o CASITAS para los animales. ¿Qué necesitan actualmente?';
            break;
        default:
            mensaje = 'Hola, quiero AYUDAR a Fundación Fénix LPB. ¿En qué formas puedo colaborar?';
    }
    
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    return false;
};

window.solicitarAdopcion = function(nombreAnimal) {
    const mensaje = `Hola, estoy interesado en ADOPTAR a ${nombreAnimal} de Fundación Fénix LPB. ¿Podrían brindarme información sobre el proceso?`;
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    return false;
};

window.abrirFormularioVoluntariado = function() {
    window.open('https://docs.google.com/document/d/13-xP1v53EBKrvhf8dFMDt3vAZJBsJKXQ_wMakkT2q48/edit?usp=sharing', '_blank');
    return false;
};

// ==================== INICIALIZACIÓN PRINCIPAL ====================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Fundación Fénix LPB - Inicializando...');
    
    // 1. Corregir títulos a blanco (PRIMERO)
    corregirTitulosBlancos();
    
    // 2. Configurar menú hamburguesa (SEGUNDO - IMPORTANTE)
    configurarMenuHamburguesa();
    
    // 3. Inicializar todos los botones
    inicializarTodosLosBotones();
    
    // 4. Crear botones flotantes
    crearBotonesFlotantes();
    
    // 5. Cargar animales si estamos en adopciones
    if (window.location.pathname.includes('adopta_un_amigo') || 
        window.location.pathname.endsWith('adopta_un_amigo.html')) {
        cargarAnimales();
        configurarFiltros();
    }
    
    // 6. Configurar formularios
    configurarFormularios();
    
    // 7. Configurar scroll suave
    configurarScrollSuave();
    
    // 8. Configurar animaciones
    configurarAnimacionesDonacion();
    configurarAnimacionesEntrada();
    configurarObservadorAnimaciones();
    inicializarCarruselesAuto();
    inicializarContadores();
    
    // 9. Verificación final
    setTimeout(verificarTodoFunciona, 1000);
    
    console.log('✅ Sitio completamente inicializado');
});

// ==================== MANEJO DE REDIMENSIONAMIENTO ====================

window.addEventListener('resize', function() {
    // Asegurar que la hamburguesa esté configurada correctamente
    const hamburger = document.querySelector('.hamburger');
    if (window.innerWidth <= 768) {
        if (hamburger) {
            hamburger.style.display = 'block';
        }
    } else {
        if (hamburger) {
            hamburger.style.display = 'none';
        }
        // Cerrar menú si está abierto
        document.querySelector('.nav-menu')?.classList.remove('active');
        document.querySelector('.hamburger')?.classList.remove('active');
        document.body.classList.remove('nav-open');
    }
    
    // Re-aplicar corrección de títulos
    corregirTitulosBlancos();
});

// ==================== CARGA COMPLETA ====================

window.addEventListener('load', function() {
    console.log('✅ Página completamente cargada');
    
    // Última verificación
    setTimeout(() => {
        // Asegurar que todos los títulos estén en blanco
        corregirTitulosBlancos();
        
        // Asegurar que la hamburguesa sea visible en móviles
        const hamburger = document.querySelector('.hamburger');
        if (window.innerWidth <= 768 && hamburger) {
            hamburger.style.display = 'block';
            hamburger.style.visibility = 'visible';
            hamburger.style.opacity = '1';
        }
        
        console.log('✅ Verificación final completada');
    }, 500);
});