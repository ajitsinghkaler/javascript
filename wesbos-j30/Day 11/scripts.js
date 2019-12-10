/* Get Our Elements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

function toggleVideo() {
    if (video.paused) { video.play(); }
    else { video.pause(); }
}

function toggleButton() {
    const buttonicon = this.paused ? '►' : '❚ ❚';
    toggle.textContent = buttonicon;
}

function skipTime() {
    video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeChange() {
    video[this.name] = this.value;

}

function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

video.addEventListener('click', toggleVideo);
video.addEventListener('pause', toggleButton);
video.addEventListener('play', toggleButton);
toggle.addEventListener('click', toggleVideo);
skipButtons.forEach(skipButton => {
    skipButton.addEventListener('click', skipTime);
})
ranges.forEach(range => range.addEventListener('change', handleRangeChange));
video.addEventListener('timeupdate', handleProgress);
let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

