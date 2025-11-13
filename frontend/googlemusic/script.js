document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const playIcon = document.getElementById('play-icon');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const volumeSlider = document.getElementById('volume-slider');
    const songTitle = document.getElementById('song-title');
    const artistName = document.getElementById('artist-name');
    const albumArt = document.getElementById('album-art');
    const queueList = document.getElementById('queue-list');
    
    // Music library
    const songs = [
        {
            title: "Love Story x Golden Brown",
            artist: "ilblu",
            src: "https://condemned-beige-te8zfwksnl.edgeone.app/love%20story%20x%20golden%20brown%20-%20cover%20(ilblu).mp3",
            cover: "https://i.scdn.co/image/ab67616d00001e022ff8e7ddcedf9076522e8cd7",
            duration: "3:20"
        },
        {
            title: "Die With A Smile",
            artist: "Lady Gaga, Bruno Mars",
            src: "https://influential-white-utj3j0xj3z.edgeone.app/Lady%20Gaga,%20Bruno%20Mars%20-%20Die%20With%20A%20Smile%20(Official%20Music%20Video).mp3",
            cover: "https://images.genius.com/abe185baf2b9fd84ebb5d493ffe715b3.1000x1000x1.png",
            duration: "3:35"
        },
        {
            title: "cheri cheri lady",
            artist: "Modern Talking",
            src: "https://optimistic-violet-wagcttfwc4.edgeone.app/Lady%20Gaga,%20Bruno%20Mars%20-%20Die%20With%20A%20Smile%20(Official%20Music%20Video).mp3",
            cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVV0SIVMXyjTpUiM39U9SkYJbP5EMpJx9kmg&s",
            duration: "3:23"
        },
        {
            title: "Ed Sheeran - Shape of You",
            artist: "Ed Sheeran",
            src: "https://patient-red-nlbn3jtrtu.edgeone.app/Ed%20Sheeran%20-%20Shape%20of%20You%20(Official%20Music%20Video).mp3",
            cover: "https://upload.wikimedia.org/wikipedia/en/b/b4/Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png",
            duration: "2:21"
        },
        {
            title: "Let Me Down Slowly x Main Dhoondne Ko Zamaane Mein (Gravero Mashup)",
            artist: "Gravero",
            src: "https://intact-fuchsia-tanizit5ua.edgeone.app/Let%20Me%20Down%20Slowly%20x%20Main%20Dhoondne%20Ko%20Zamaane%20Mein%20(Gravero%20Mashup)%20_%20Full%20Version.mp3",
            cover: "https://i.ytimg.com/vi/wqUFuZyR-xA/maxresdefault.jpg",
            duration: "3:46"
        }
    ];
    
    // Player state
    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffled = false;
    let isRepeated = false;
    let originalQueue = [...songs];
    let shuffledQueue = [...songs].sort(() => Math.random() - 0.5);
    
    // Initialize player
    function initPlayer() {
        loadSong(currentSongIndex);
        renderQueue();
        updatePlayerState();
    }
    
    // Load song
    function loadSong(index) {
        const song = isShuffled ? shuffledQueue[index] : originalQueue[index];
        songTitle.textContent = song.title;
        artistName.textContent = song.artist;
        albumArt.src = song.cover;
        audioPlayer.src = song.src;
        durationEl.textContent = song.duration;
        
        // Add active class to current song in queue
        const queueItems = document.querySelectorAll('.queue-item');
        queueItems.forEach(item => item.classList.remove('active'));
        if (queueItems[index]) {
            queueItems[index].classList.add('active');
        }
    }
    
    // Play song
    function playSong() {
        isPlaying = true;
        audioPlayer.play();
        playIcon.classList.replace('fa-play', 'fa-pause');
        document.querySelector('.player-container').classList.add('playing');
        updatePlayerState();
    }
    
    // Pause song
    function pauseSong() {
        isPlaying = false;
        audioPlayer.pause();
        playIcon.classList.replace('fa-pause', 'fa-play');
        document.querySelector('.player-container').classList.remove('playing');
        updatePlayerState();
    }
    
    // Previous song
    function prevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = (isShuffled ? shuffledQueue : originalQueue).length - 1;
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
    }
    
    // Next song
    function nextSong() {
        currentSongIndex++;
        if (currentSongIndex >= (isShuffled ? shuffledQueue : originalQueue).length) {
            if (isRepeated) {
                currentSongIndex = 0;
            } else {
                currentSongIndex--;
                pauseSong();
                return;
            }
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
    }
    
    // Update progress bar
    function updateProgress() {
        const { currentTime, duration } = audioPlayer;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.setProperty('--progress', `${progressPercent}%`);
        
        // Format time
        const formatTime = (time) => {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        };
        
        currentTimeEl.textContent = formatTime(currentTime);
        
        // Auto-play next song when current ends
        if (currentTime >= duration - 0.5 && duration > 0) {
            nextSong();
        }
    }
    
    // Set progress
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickX / width) * duration;
    }
    
    // Set volume
    function setVolume() {
        audioPlayer.volume = this.value;
    }
    
    // Toggle shuffle
    function toggleShuffle() {
        isShuffled = !isShuffled;
        shuffleBtn.classList.toggle('active', isShuffled);
        
        if (isShuffled) {
            // Find current song in shuffled queue
            const currentSong = originalQueue[currentSongIndex];
            currentSongIndex = shuffledQueue.findIndex(song => song.title === currentSong.title);
        } else {
            // Find current song in original queue
            const currentSong = shuffledQueue[currentSongIndex];
            currentSongIndex = originalQueue.findIndex(song => song.title === currentSong.title);
        }
        
        updatePlayerState();
    }
    
    // Toggle repeat
    function toggleRepeat() {
        isRepeated = !isRepeated;
        repeatBtn.classList.toggle('active', isRepeated);
        updatePlayerState();
    }
    
    // Render queue
    function renderQueue() {
        queueList.innerHTML = '';
        const queue = isShuffled ? shuffledQueue : originalQueue;
        
        queue.forEach((song, index) => {
            const queueItem = document.createElement('div');
            queueItem.className = `queue-item ${index === currentSongIndex ? 'active' : ''}`;
            queueItem.innerHTML = `
                <div class="queue-item-img">
                    <img src="${song.cover}" alt="${song.title}">
                </div>
                <div class="queue-item-info">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
                <div class="queue-item-duration">${song.duration}</div>
            `;
            
            queueItem.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                if (isPlaying) {
                    playSong();
                }
            });
            
            queueList.appendChild(queueItem);
        });
    }
    
    // Update player state (for UI feedback)
    function updatePlayerState() {
        // Update active song in queue
        const queueItems = document.querySelectorAll('.queue-item');
        queueItems.forEach((item, index) => {
            item.classList.toggle('active', index === currentSongIndex);
        });
        
        // Update button states
        shuffleBtn.classList.toggle('active', isShuffled);
        repeatBtn.classList.toggle('active', isRepeated);
    }
    
    // Event listeners
    playBtn.addEventListener('click', () => {
        isPlaying ? pauseSong() : playSong();
    });
    
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', nextSong);
    
    progressBar.addEventListener('click', setProgress);
    volumeSlider.addEventListener('input', setVolume);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                isPlaying ? pauseSong() : playSong();
                break;
            case 'ArrowLeft':
                audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 5);
                break;
            case 'ArrowRight':
                audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + 5);
                break;
            case 'ArrowUp':
                volumeSlider.value = Math.min(1, parseFloat(volumeSlider.value) + 0.1);
                setVolume.call(volumeSlider);
                break;
            case 'ArrowDown':
                volumeSlider.value = Math.max(0, parseFloat(volumeSlider.value) - 0.1);
                setVolume.call(volumeSlider);
                break;
        }
    });
    
    // Initialize the player
    initPlayer();
    
    // Add animation to album art on load
    albumArt.addEventListener('load', function() {
        this.style.opacity = 1;
    });
});