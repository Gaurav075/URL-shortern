document.getElementById('shorten-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const longUrlInput = document.getElementById('long-url');
    const submitButton = e.target.querySelector('button');
    const resultDiv = document.getElementById('result');
    const originalButtonText = submitButton.innerText;

    submitButton.innerText = 'Shortening...';
    submitButton.disabled = true;
    resultDiv.innerHTML = ''; 

    try {
        const response = await fetch('/api/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ originalUrl: longUrlInput.value })
        });

        const data = await response.json();

        if (response.ok && (data.shortUrl || data.shortCode)) {
            
            let uniqueCode = data.shortCode;
            if (!uniqueCode && data.shortUrl) {
                const urlParts = data.shortUrl.split('/');
                uniqueCode = urlParts[urlParts.length - 1];
            }

            // 1. The URL the browser actually needs to click to make it work
            const workingUrl = `${window.location.origin}/${uniqueCode}`;
            
            // 2. The beautiful, professional "vanity" URL we show on the screen
            const displayUrl = `min.io/${uniqueCode}`; // You can change 'min.io' to any brand name you want!

            resultDiv.innerHTML = `
                <p style="margin-bottom: 10px; font-weight: 600;">✨ Success! Here is your short link:</p>
                <a href="${workingUrl}" target="_blank">${displayUrl}</a>
            `;
            
            longUrlInput.value = ''; 
        } else {
            resultDiv.innerHTML = `<p style="color: #ff7675; font-weight: 600;">Error: ${data.error || 'Something went wrong'}</p>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<p style="color: #ff7675; font-weight: 600;">Network error. Make sure your Node.js server is running!</p>`;
    } finally {
        submitButton.innerText = originalButtonText;
        submitButton.disabled = false;
    }
});