function mostrarSeccion(seccion) {
    document.getElementById('colores').style.display = 'none';
    document.getElementById('animales').style.display = 'none';
    document.getElementById('ingenio').style.display = 'none';
    document.getElementById('pacman').style.display = 'none';
    document.getElementById(seccion).style.display = 'block';
    if (seccion === 'pacman') {
        iniciarPacman(1);
    }
}

// Función para reproducir el nombre del color con voz sintética
function reproducirSonidoColor(color) {
    let mensaje = '';
    switch(color) {
        case 'rojo': mensaje = 'Rojo'; break;
        case 'azul': mensaje = 'Azul'; break;
        case 'amarillo': mensaje = 'Amarillo'; break;
        case 'verde': mensaje = 'Verde'; break;
        case 'naranja': mensaje = 'Naranja'; break;
        case 'morado': mensaje = 'Morado'; break;
    }
    if ('speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(mensaje);
        utter.lang = 'es-ES';
        utter.rate = 0.85; // Más lento y amigable para niños
        let voces = window.speechSynthesis.getVoices();
        // Buscar voz femenina en español
        const vozFemenina = voces.find(v => v.lang.startsWith('es') && (
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('mujer') ||
            v.name.toLowerCase().includes('paulina') ||
            v.name.toLowerCase().includes('soledad') ||
            v.name.toLowerCase().includes('español')
        ));
        if (vozFemenina) utter.voice = vozFemenina;
        window.speechSynthesis.speak(utter);
    } else {
        alert(mensaje);
    }
}

// Función para reproducir el sonido real de un animal
function reproducirSonidoAnimal(animal) {
    const sonidos = {
        leon: 'sonidos/leon.mp3',
        perro: 'sonidos/perro.mp3',
        gato: 'sonidos/gato.mp3',
        cerdito: 'sonidos/cerdito.mp3',
        pato: 'sonidos/pato.mp3',
        vaca: 'sonidos/vaca.mp3',
        pollito: 'sonidos/pato.mp3',
        gallina: 'sonidos/pato.mp3',
        oveja: 'sonidos/vaca.mp3',
        caballo: 'sonidos/vaca.mp3'
    };
    let sonido = sonidos[animal] || sonidos['vaca'];
    console.log('Intentando reproducir sonido:', animal, sonido);
    try {
        const audio = new Audio(sonido);
        audio.play().catch(e => {
            alert('No se pudo reproducir el sonido de ' + animal);
        });
    } catch(e) {
        alert('No se pudo reproducir el sonido de ' + animal);
    }
}


// Juego de Memoria de Animales
const animalesMemoria = [
    { emoji: '🦁', nombre: 'León' },
    { emoji: '🐶', nombre: 'Perro' },
    { emoji: '🐱', nombre: 'Gato' },
    { emoji: '🐷', nombre: 'Cerdito' },
    { emoji: '🦆', nombre: 'Pato' },
    { emoji: '🐮', nombre: 'Vaca' }
];
let cartasMemoria = [];
let cartaVolteada = null;
let bloqueoMemoria = false;

function iniciarMemoria() {
    const tablero = document.getElementById('memoria-tablero');
    tablero.innerHTML = '';
    // Duplicar y mezclar
    cartasMemoria = [...animalesMemoria, ...animalesMemoria]
        .map((a, i) => ({...a, id: i + '-' + Math.random()}))
        .sort(() => Math.random() - 0.5);
    cartaVolteada = null;
    bloqueoMemoria = false;
    cartasMemoria.forEach((carta, idx) => {
        const div = document.createElement('div');
        div.className = 'memoria-carta';
        div.dataset.idx = idx;
        div.onclick = () => voltearCarta(idx, div);
        tablero.appendChild(div);
    });
}
function voltearCarta(idx, div) {
    if (bloqueoMemoria) return;
    const carta = cartasMemoria[idx];
    if (div.classList.contains('volteada') || div.classList.contains('encontrada')) return;
    div.textContent = carta.emoji;
    div.classList.add('volteada');
    if (!cartaVolteada) {
        cartaVolteada = { idx, div };
    } else {
        bloqueoMemoria = true;
        setTimeout(() => {
            const carta1 = cartasMemoria[cartaVolteada.idx];
            const carta2 = carta;
            if (carta1.emoji === carta2.emoji) {
                div.classList.add('encontrada');
                cartaVolteada.div.classList.add('encontrada');
                if (document.querySelectorAll('.memoria-carta.encontrada').length === cartasMemoria.length) {
                    setTimeout(() => alert('¡Muy bien! ¡Encontraste todos los pares!'), 200);
                }
            } else {
                div.textContent = '';
                cartaVolteada.div.textContent = '';
                div.classList.remove('volteada');
                cartaVolteada.div.classList.remove('volteada');
            }
            cartaVolteada = null;
            bloqueoMemoria = false;
        }, 900);
    }
}

