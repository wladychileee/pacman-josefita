// Juego Pacman de Frutas para Josefita
// Usando Phaser.js

let game;

function iniciarPacman(nivel = 1) {
    if (game && game.scene && game.scene.keys && game.scene.keys['Nivel'+nivel]) {
        game.scene.start('Nivel'+nivel, {nivel});
    } else {
        if (game) game.destroy(true);
        const config = {
            type: Phaser.AUTO,
            width: 480,
            height: 600,
            parent: 'pacman-juego',
            backgroundColor: '#e3f7ff',
            physics: { default: 'arcade' },
            scene: [PacmanNivel]
        };
        game = new Phaser.Game(config);
    }
}

class PacmanNivel extends Phaser.Scene {
    constructor() {
        super({ key: 'Nivel' });
        this.nivel = 1;
        this.frutasRestantes = 0;
    }
    preload() {
        this.load.image('jugador', 'josefita.jpg');
        for (let i = 1; i <= 2; i++) {
            this.load.audio('musica' + i, 'sonidos/musica' + i + '.mp3');
        }
        this.load.on('filecomplete', function (key, type) {
            console.log('Archivo cargado:', key, type);
        });
        this.animales = [
            {nombre: 'perro', emoji: '🐶'},
            {nombre: 'gato', emoji: '🐱'},
            {nombre: 'caballo', emoji: '🐴'},
            {nombre: 'vaca', emoji: '🐮'},
            {nombre: 'cerdito', emoji: '🐷'},
            {nombre: 'pato', emoji: '🦆'},
            {nombre: 'oveja', emoji: '🐑'},
            {nombre: 'gallina', emoji: '🐔'},
            {nombre: 'conejo', emoji: '🐇'},
            {nombre: 'pollito', emoji: '🐣'},
        ];
    }
    create(data) {
        // Permitir pasar el nivel como parámetro en scene.restart
        this.nivel = (data && data.nivel) ? data.nivel : this.nivel || 1;
        // Música de fondo según el nivel, sin recargar si es la misma pista
        const totalMusicas = 2;
        const musicaNivel = 'musica' + (((this.nivel - 1) % totalMusicas) + 1);
        if (!this.musicaFondo || this.musicaFondo.key !== musicaNivel) {
            if (this.musicaFondo && this.musicaFondo.isPlaying) {
                this.musicaFondo.stop();
            }
            this.musicaFondo = this.sound.add(musicaNivel, { loop: true, volume: 0.4 });
            this.musicaFondo.play();
        }

        // --- Laberintos variados por nivel ---
        // Definir diferentes patrones de paredes
        const laberintos = [
            // Laberinto 1: Tres líneas horizontales con dos huecos cada una
            [
                // Línea 1 (y=120): huecos en x=160 y x=320
                {x:80, y:120, w:140, h:16}, // izquierda
                {x:400, y:120, w:140, h:16}, // derecha
                // Línea 2 (y=220): huecos en x=80 y x=400
                {x:160, y:220, w:120, h:16},
                {x:320, y:220, w:120, h:16},
                // Línea 3 (y=320): huecos en x=240 y x=400
                {x:80, y:320, w:140, h:16},
                {x:320, y:320, w:120, h:16},
                // Paredes verticales decorativas, no bloquean el centro
                {x:120, y:420, w:16, h:120},
                {x:360, y:480, w:16, h:120},
            ],
            // Laberinto 2: Líneas horizontales alternadas, dos huecos
            [
                // Línea 1 (y=150): huecos en x=240 y x=400
                {x:80, y:150, w:140, h:16},
                {x:320, y:150, w:120, h:16},
                // Línea 2 (y=250): huecos en x=160 y x=320
                {x:80, y:250, w:60, h:16},
                {x:180, y:250, w:120, h:16},
                {x:320, y:250, w:80, h:16},
                // Línea 3 (y=350): huecos en x=80 y x=240
                {x:160, y:350, w:120, h:16},
                {x:320, y:350, w:120, h:16},
                // Verticales decorativas
                {x:120, y:480, w:16, h:120},
                {x:360, y:420, w:16, h:120},
            ],
            // Laberinto 3: Líneas horizontales con huecos desplazados
            [
                // Línea 1 (y=180): huecos en x=80 y x=320
                {x:160, y:180, w:120, h:16},
                {x:400, y:180, w:60, h:16},
                // Línea 2 (y=280): huecos en x=160 y x=400
                {x:80, y:280, w:60, h:16},
                {x:240, y:280, w:120, h:16},
                // Línea 3 (y=380): huecos en x=240 y x=400
                {x:80, y:380, w:140, h:16},
                {x:320, y:380, w:120, h:16},
                // Verticales decorativas
                {x:120, y:500, w:16, h:80},
                {x:360, y:500, w:16, h:80},
            ],
            // Laberinto 4: Más líneas, huecos alternos
            [
                // Línea 1 (y=120): huecos en x=160 y x=320
                {x:80, y:120, w:140, h:16},
                {x:400, y:120, w:140, h:16},
                // Línea 2 (y=200): huecos en x=80 y x=400
                {x:160, y:200, w:120, h:16},
                {x:320, y:200, w:120, h:16},
                // Línea 3 (y=280): huecos en x=240 y x=320
                {x:80, y:280, w:140, h:16},
                {x:400, y:280, w:60, h:16},
                // Línea 4 (y=360): huecos en x=160 y x=400
                {x:80, y:360, w:60, h:16},
                {x:240, y:360, w:120, h:16},
                // Verticales decorativas
                {x:120, y:500, w:16, h:100},
                {x:360, y:500, w:16, h:100},
            ],
            // Laberinto 5: Líneas horizontales con dos huecos cada una
            [
                // Línea 1 (y=150): huecos en x=160 y x=320
                {x:80, y:150, w:140, h:16},
                {x:400, y:150, w:140, h:16},
                // Línea 2 (y=250): huecos en x=80 y x=400
                {x:160, y:250, w:120, h:16},
                {x:320, y:250, w:120, h:16},
                // Línea 3 (y=350): huecos en x=240 y x=400
                {x:80, y:350, w:140, h:16},
                {x:320, y:350, w:120, h:16},
                // Verticales decorativas
                {x:120, y:500, w:16, h:100},
                {x:360, y:500, w:16, h:100},
            ]
        ];
        let lab = laberintos[(this.nivel-1)%laberintos.length];
        this.walls = this.physics.add.staticGroup();
        // Bordes exteriores
        this.walls.create(240, 10, null).setDisplaySize(460, 20).refreshBody(); // Arriba
        this.walls.create(240, 590, null).setDisplaySize(460, 20).refreshBody(); // Abajo
        this.walls.create(10, 300, null).setDisplaySize(20, 580).refreshBody(); // Izquierda
        this.walls.create(470, 300, null).setDisplaySize(20, 580).refreshBody(); // Derecha
        // Paredes internas según patrón
        for(let p of lab) {
            this.walls.create(p.x, p.y, null).setDisplaySize(p.w, p.h).refreshBody();
        }
        // Dibujar visualmente las paredes
        let graphics = this.add.graphics();
        graphics.lineStyle(6, 0x00bfff, 1);
        // Bordes
        graphics.strokeRect(20, 20, 440, 560);
        // Paredes internas
        for(let p of lab) {
            graphics.strokeRect(p.x-p.w/2, p.y-p.h/2, p.w, p.h);
        }

        // Animales dentro del laberinto
        this.animalesGroup = this.add.group();
        let animalObj = this.animales[(this.nivel-1) % this.animales.length];
        let animalesColocados = 0;
        let maxAnimales = 5 + this.nivel;
        let intentosMax = 30;
        this.animalEmojis = [];
        while (animalesColocados < maxAnimales && intentosMax > 0) {
            let x = Phaser.Math.Between(40, 440);
            let y = Phaser.Math.Between(40, 560);
            // Crear emoji como texto
            let emoji = this.add.text(x, y, animalObj.emoji, { font: '36px Arial', color: '#333', align: 'center' });
            emoji.setOrigin(0.5);
            // Usar un círculo invisible para colisiones
            let collider = this.physics.add.image(x, y, null).setCircle(20).setImmovable(false).setVisible(false);
            collider.emoji = emoji;
            // Normalizar nombre para sonidos Phaser
            let nombreSonido = animalObj.nombre;
            if (nombreSonido === 'pollito') nombreSonido = 'pato';
            if (nombreSonido === 'gallina') nombreSonido = 'pato';
            if (nombreSonido === 'oveja') nombreSonido = 'vaca';
            if (nombreSonido === 'caballo') nombreSonido = 'vaca';
            collider.animalNombre = nombreSonido; // Usado para sonido en Phaser
            // Movimiento aleatorio inicial con velocidad según nivel
            let speed = 60 + this.nivel * 6 + Phaser.Math.Between(0, 20);
            let angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
            collider.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
            collider.body.setBounce(1, 1);
            collider.body.setCollideWorldBounds(true);
            // No permitir que el animal quede sobre una pared ni sobre otro animal
            if (this.physics.overlap(collider, this.walls) || this.animalEmojis.some(e => Phaser.Math.Distance.Between(e.x, e.y, x, y) < 40)) {
                emoji.destroy();
                collider.destroy();
                intentosMax--;
                continue;
            }
            this.animalesGroup.add(collider);
            this.animalEmojis.push(emoji);
            animalesColocados++;
        }
        this.animalesRestantes = this.animalesGroup.getChildren().length;
        // Hacer que los animales reboten en los muros
        this.physics.add.collider(this.animalesGroup, this.walls, (animal) => {
            if (animal.emoji) {
                // Mantener el emoji encima del collider
                animal.emoji.x = animal.x;
                animal.emoji.y = animal.y;
            }
        });
        this.jugador = this.physics.add.sprite(60, 60, 'jugador').setScale(1).setDepth(1);
        this.jugador.setDisplaySize(44, 44); // Ajuste para que el jugador no se distorsione
        this.physics.add.collider(this.jugador, this.walls);
        this.cursors = this.input.keyboard.createCursorKeys();
        // Colisión: si el jugador toca el círculo invisible, elimina el emoji y el círculo y reproduce el sonido
        this.physics.add.overlap(this.jugador, this.animalesGroup, (jugador, collider) => {
            if (collider.emoji) collider.emoji.destroy();
            // Ya no se reproduce sonido al comer animal
            collider.destroy();
            this.animalesRestantes--;
            if (this.animalesRestantes <= 0) this.pasarNivel();
        }, null, this);
        this.physics.add.collider(this.jugador, this.walls);
        this.add.text(10, 10, 'Nivel: ' + this.nivel, { font: '18px Arial', fill: '#333' });
    }
    update() {
        // Movimiento del jugador
        this.jugador.setVelocity(0);
        if (this.cursors.left.isDown) this.jugador.setVelocityX(-120);
        else if (this.cursors.right.isDown) this.jugador.setVelocityX(120);
        if (this.cursors.up.isDown) this.jugador.setVelocityY(-120);
        else if (this.cursors.down.isDown) this.jugador.setVelocityY(120);
        // Mantener los emojis encima de sus colliders
        if (this.animalEmojis && this.animalesGroup) {
            this.animalesGroup.getChildren().forEach(collider => {
                if (collider.emoji) {
                    collider.emoji.x = collider.x;
                    collider.emoji.y = collider.y;
                }
            });
        }
    }
    comerAnimal(jugador, animal) {
        animal.disableBody(true, true);
        this.animalesRestantes--;
        if (this.animalesRestantes <= 0) {
            this.pasarNivel();
        }
    }
    pasarNivel() {
        // Luces y sonido al pasar nivel
        if (this.nivel < 20) {
            // Efecto de luces (destellos de colores)
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    let color = Phaser.Display.Color.RandomRGB().rgba;
                    this.cameras.main.setBackgroundColor(color);
                }, i * 120);
            }
            this.add.text(70, 180, '¡Muy bien!', { font: '22px Arial', fill: '#28a745' });
            setTimeout(() => {
                this.scene.restart({nivel: this.nivel + 1});
            }, 1100);
        } else {
            this.add.text(50, 220, '¡Ganaste todos los niveles!', { font: '32px Arial', fill: '#e84118' });
            setTimeout(() => this.scene.restart({nivel: 1}), 1100);
            this.add.text(10, 120, '¡Felicidades, Josefita! Completaste todos los niveles.', { font: '22px Arial', fill: '#ff00cc', fontStyle: 'bold' });
            // Mostrar botón para reiniciar o mensaje especial
            let botonSi = this.add.text(60, 220, '¿Quieres comenzar de nuevo?\n\n[ SÍ ]', { font: '28px Arial', fill: '#28a745', backgroundColor: '#fff', padding: { x: 16, y: 8 } })
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => {
                    this.cameras.main.setBackgroundColor('#39ff14');
                    this.add.text(40, 320, '¡Vamos otra vez!', { font: '28px Arial', fill: '#fff', backgroundColor: '#39ff14' });
                    setTimeout(() => iniciarPacman(1), 1100);
                });
            let botonNo = this.add.text(300, 260, '[ NO ]', { font: '28px Arial', fill: '#fff', backgroundColor: '#ff4b5c', padding: { x: 12, y: 8 } })
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => {
                    this.cameras.main.setBackgroundColor('#ff4b5c');
                    this.add.text(20, 400, 'Josefa Andrea Saldias Retamal\neres la más hermosa del mundo\ny que wa', { font: '26px Arial', fill: '#fff', backgroundColor: '#ff4b5c', align: 'center' });
                });
        }
    }
}

// Para iniciar el juego desde el botón
window.iniciarPacman = iniciarPacman;
