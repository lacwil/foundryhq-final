// src/foundryAI.js

// Listen for the preview event
window.addEventListener('foundrybot-preview', async () => {
  try {
    const response = await fetch('/generated/latest.html');

    if (!response.ok) {
      throw new Error('Failed to load preview.');
    }

    const html = await response.text();

    const canvasOutput = document.querySelector('div[style*="Canvas Output"]')
      ?.nextElementSibling;

    if (canvasOutput) {
      canvasOutput.innerHTML = html;
    } else {
      console.error('❌ Canvas output area not found.');
    }
  } catch (err) {
    console.error('❌ Preview error:', err.message);
    alert('Preview failed.');
  }
});
