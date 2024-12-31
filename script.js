let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15; // Initial random rotation between -15 and 15 degrees
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Mouse Events
    paper.addEventListener('mousedown', (e) => this.startInteraction(e, paper, false));
    document.addEventListener('mousemove', (e) => this.handleInteraction(e, false));
    window.addEventListener('mouseup', () => this.endInteraction());

    // Touch Events
    paper.addEventListener('touchstart', (e) => this.startInteraction(e, paper, true));
    document.addEventListener('touchmove', (e) => this.handleInteraction(e, true));
    window.addEventListener('touchend', () => this.endInteraction());
  }

  startInteraction(e, paper, isTouch) {
    e.preventDefault(); // Prevent default behavior (e.g., scrolling)
    if (this.holdingPaper) return;

    this.holdingPaper = true;
    paper.style.zIndex = highestZ;
    highestZ += 1;

    const point = isTouch ? e.touches[0] : e; // Get the touch or mouse point
    this.mouseTouchX = point.clientX;
    this.mouseTouchY = point.clientY;
    this.prevMouseX = point.clientX;
    this.prevMouseY = point.clientY;

    if (!isTouch && e.button === 2) {
      this.rotating = true; // Right-click for rotation on desktop
    }
  }

  handleInteraction(e, isTouch) {
    if (!this.holdingPaper) return;

    const point = isTouch ? e.touches[0] : e;
    this.mouseX = point.clientX;
    this.mouseY = point.clientY;

    if (this.rotating) {
      // Rotation logic
      const dirX = this.mouseX - this.mouseTouchX;
      const dirY = this.mouseY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      this.rotation = (180 * angle / Math.PI + 360) % 360;
    } else {
      // Dragging logic
      this.velX = this.mouseX - this.prevMouseX;
      this.velY = this.mouseY - this.prevMouseY;
      this.currentPaperX += this.velX;
      this.currentPaperY += this.velY;
    }

    // Make sure `currentPaperX` and `currentPaperY` are defined
    this.currentPaperX = this.currentPaperX || 0;
    this.currentPaperY = this.currentPaperY || 0;
    this.rotation = this.rotation || 0;

    // Construct the transform string correctly using template literals
    const transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotate(${this.rotation}deg)`;

    // Apply the transform to the paper
    const paper = e.target.closest('.paper');
    if (paper) {
      paper.style.transform = transform;
    }

    this.prevMouseX = this.mouseX;
    this.prevMouseY = this.mouseY;
  }

  endInteraction() {
    this.holdingPaper = false;
    this.rotating = false;
  }
}

// Initialize for all papers
const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});