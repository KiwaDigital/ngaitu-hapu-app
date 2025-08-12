/* * ██╗  ██╗██╗██╗    ██╗ █████╗       ██████╗ ██╗ ██████╗ ██╗████████╗ █████╗ ██╗      
 * ██║ ██╔╝██║██║    ██║██╔══██╗     ██╔══██╗██║██╔════╝ ██║╚══██╔══╝██╔══██╗██║      
 * █████╔╝ ██║██║ █╗ ██║███████║     ██║  ██║██║██║ ███╗██║    ██║   ███████║██║      
 * ██╔═██╗ ██║██║███╗██║██╔══██║     ██║  ██║██║██║   ██║██║    ██║   ██╔══██║██║      
 * ██║  ██╗██║╚███╔███╔╝██║  ██║     ██████╔╝██║╚██████╔╝██║    ██║   ██║  ██║███████╗
 * ╚═╝  ╚═╝╚═╝ ╚══╝╚══╝ ╚═╝  ╚═╝      ╚═════╝ ╚═╝ ╚═════╝ ╚═╝    ╚═╝   ╚═╝  ╚═╝╚══════╝
 * DIGITAL SOLUTIONS FOR INDIGENOUS LANGUAGES | © ${new Date().getFullYear()} KIWA Digital Ltd.
 */
 

let currentPageIndex = 0; // Tracks the current page displayed
let currentLanguage = 'en'; // Default language is English

// Get DOM elements
const pageContentDiv = document.getElementById('pageContent');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentPageNumSpan = document.getElementById('currentPageNum');
const totalPagesNumSpan = document.getElementById('totalPagesNum');
const languageSelector = document.getElementById('languageSelector'); // Get the language selector

// Custom Play/Stop Button elements
const playStopBtn = document.getElementById('playStopBtn'); // Get the button element
const playStopIcon = document.getElementById('playStopIcon'); // Get the image element inside the button

// Native Audio Player elements
const audioPlayerContainer = document.getElementById('audioPlayerContainer');
const audioPlayer = document.getElementById('audioPlayer'); // This is your <audio> tag

// Constants for image paths
const PLAY_ICON_PATH = 'images/play-icon.png';
const PAUSE_ICON_PATH = 'images/pause-icon.png';

// Function to render the current page's content based on selected language
function renderPage() {
    // Get the data for the current page and selected language
    const currentPageData = bookData[currentPageIndex]; // Get the entire page object
    const pageContentForLanguage = currentPageData.content[currentLanguage]; // Content specific to language

    // Safely get the title, checking if it exists and if the specific language title exists
    // and if it's not 'nil'.
    let pageTitle = null;
    if (currentPageData.title && currentPageData.title[currentLanguage] && currentPageData.title[currentLanguage] !== 'nil') {
        pageTitle = currentPageData.title[currentLanguage];
    }
    
    const imageSrc = currentPageData.image; // Image is language-agnostic

    // Update page number display
    currentPageNumSpan.textContent = currentPageIndex + 1;
    totalPagesNumSpan.textContent = bookData.length;

    // Clear previous content
    pageContentDiv.innerHTML = ''; 

    // Create and append title element ONLY if pageTitle is not null
    if (pageTitle) {
        const titleElement = document.createElement('h2'); 
        titleElement.textContent = pageTitle;
        titleElement.className = 'page-title'; 
        pageContentDiv.appendChild(titleElement);
    }

    const imgElement = document.createElement('img');
    imgElement.src = imageSrc;
    imgElement.alt = `Page ${currentPageIndex + 1} image`;
    imgElement.className = 'page-image';
    // Fallback for image loading error: hide the image and adjust layout
    imgElement.onerror = function() {
        this.style.display = 'none'; // Hide the image
        pageContentDiv.classList.add('image-not-found'); // Add class to parent for styling text to take more space
    };
    // If the image loads successfully, ensure it's visible and the class is removed (in case it was previously hidden)
    imgElement.onload = function() {
        this.style.display = ''; // Ensure image is visible
        pageContentDiv.classList.remove('image-not-found'); // Remove the class
    };
    pageContentDiv.appendChild(imgElement); // Append image after title (if title exists)

    const textElement = document.createElement('p');
    textElement.textContent = pageContentForLanguage.text;
    textElement.className = 'page-text'; // Apply base text styles
    textElement.id = 'currentPageText'; // Add an ID for easy targeting
    pageContentDiv.appendChild(textElement); // Append text after image

// Update the audio player's source and reset
if (audioPlayer) {
    audioPlayer.src = pageContentForLanguage.audio; // Set the audio source
    audioPlayer.pause(); // Pause any currently playing audio
    audioPlayer.currentTime = 0; // Rewind to the beginning
    audioPlayer.play(); // 👈 ADD THIS LINE TO AUTOPLAY THE NEW AUDIO
}

// Update the custom play/stop button icon initially
if (playStopIcon) {
    playStopIcon.src = PLAY_ICON_PATH; // Reset custom button icon to play when page changes
    playStopIcon.alt = 'Play Audio';
}

// Update button states (disabled/enabled)
prevBtn.disabled = currentPageIndex === 0;
nextBtn.disabled = bookData.length - 1 === currentPageIndex;

// Remove previous listeners from the audioPlayer to prevent duplicates
audioPlayer.removeEventListener('play', handleAudioPlay);
audioPlayer.removeEventListener('pause', handleAudioPause);
audioPlayer.removeEventListener('ended', handleAudioEnded);

// Add event listeners for audio playback to highlight text and synchronize custom button
audioPlayer.addEventListener('play', handleAudioPlay);
audioPlayer.addEventListener('pause', handleAudioPause);
audioPlayer.addEventListener('ended', handleAudioEnded);

}

// Event handler for audio play
function handleAudioPlay() {
    const textElement = document.getElementById('currentPageText');
    if (textElement) {
        textElement.classList.add('highlighted-text');
    }
    // Synchronize custom play/stop button
    if (playStopIcon) {
        playStopIcon.src = PAUSE_ICON_PATH; // Change icon to pause
        playStopIcon.alt = 'Pause Audio';
    }
}

// Event handler for audio pause
function handleAudioPause() {
    const textElement = document.getElementById('currentPageText');
    if (textElement) {
        textElement.classList.remove('highlighted-text');
    }
    // Synchronize custom play/stop button
    if (playStopIcon) {
        playStopIcon.src = PLAY_ICON_PATH; // Change icon back to play
        playStopIcon.alt = 'Play Audio';
    }
}

// Event handler for audio ended
function handleAudioEnded() {
    const textElement = document.getElementById('currentPageText');
    if (textElement) {
        textElement.classList.remove('highlighted-text');
    }
    // Synchronize custom play/stop button
    if (playStopIcon) {
        playStopIcon.src = PLAY_ICON_PATH; // Change icon back to play
        playStopIcon.alt = 'Play Audio';
        audioPlayer.currentTime = 0; // Rewind to the beginning when ended
    }
}

// Function to toggle play/stop for the custom button
function togglePlayStop() {
    if (audioPlayer) {
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    }
}

// Function to navigate to the previous page
function goToPreviousPage() {
    if (currentPageIndex > 0) {
        // Pause audio before changing page
        if (audioPlayer) {
            audioPlayer.pause();
            const textElement = document.getElementById('currentPageText');
            if (textElement) {
                textElement.classList.remove('highlighted-text');
            }
        }

        // Add hidden class for transition, then change content and remove class
        pageContentDiv.classList.add('hidden');
        setTimeout(() => {
            currentPageIndex--;
            renderPage();
            pageContentDiv.classList.remove('hidden');
        }, 500); // Match this with CSS transition duration
    }
}

// Function to navigate to the next page
function goToNextPage() {
    if (currentPageIndex < bookData.length - 1) {
        // Pause audio before changing page
        if (audioPlayer) {
            audioPlayer.pause();
            const textElement = document.getElementById('currentPageText');
            if (textElement) {
                textElement.classList.remove('highlighted-text');
            }
        }

        // Add hidden class for transition, then change content and remove class
        pageContentDiv.classList.add('hidden');
        setTimeout(() => {
            currentPageIndex++;
            renderPage();
            pageContentDiv.classList.remove('hidden');
        }, 500); // Match this with CSS transition duration
    }
}

// Function to switch the language
function switchLanguage(event) {
    currentLanguage = event.target.value;
    // Pause current audio before switching language to avoid sound overlap
    if (audioPlayer) {
        audioPlayer.pause();
        const textElement = document.getElementById('currentPageText');
        if (textElement) {
            textElement.classList.remove('highlighted-text');
        }
    }
    renderPage(); // Re-render the current page with the new language
}

// Event Listeners for navigation buttons
prevBtn.addEventListener('click', goToPreviousPage);
nextBtn.addEventListener('click', goToNextPage);

// Event listener for the custom play/stop button
if (playStopBtn) {
    playStopBtn.addEventListener('click', togglePlayStop);
}

// Event listener for language selector
languageSelector.addEventListener('change', switchLanguage);

// Keyboard navigation (left/right arrow keys)
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        goToPreviousPage();
    } else if (event.key === 'ArrowRight') {
        goToNextPage();
    }
});

// Initial render when the page loads
document.addEventListener('DOMContentLoaded', renderPage);


// Toggle mobile menu
document.getElementById("menuIcon").addEventListener("click", () => {
    document.getElementById("navLinks").classList.toggle("active");
});

function playBackgroundMusic(pageIndex) {
  const currentPageData = bookData[pageIndex];
  const newMusicPath = currentPageData.backgroundMusic;

  if (newMusicPath && bgmPlayer.src !== newMusicPath) {
    // If there's new music and it's different from the current track,
    // stop the old one and play the new one.
    bgmPlayer.pause();
    bgmPlayer.src = newMusicPath;
    bgmPlayer.play();
  } else if (!newMusicPath) {
    // If the page doesn't have background music, stop the current one.
    bgmPlayer.pause();
    bgmPlayer.src = ''; // Clear the source to prevent it from playing again
  }
}