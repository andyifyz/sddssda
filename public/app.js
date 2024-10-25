const subscribeButton = document.getElementById('subscribe-btn');

if ('serviceWorker' in navigator && 'PushManager' in window) {
    subscribeButton.addEventListener('click', async () => {
        console.log('Subscribe button clicked');
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered');

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: 'BPZugiwG545YwybFdgMuQMy9eTmoePuXafsYzv5wFSI6mipYE1a848y8wBB4g5WL8ojG8gknq-e3DfFRiAFpR_A'
            });

            console.log('User is subscribed:', subscription);

            await fetch('/subscribe', {
                method: 'POST',
                body: JSON.stringify(subscription),
                headers: { 'Content-Type': 'application/json' }
            });

            alert('Subscribed!');
        } catch (error) {
            console.error('Subscription failed: ', error);
            alert('Failed to subscribe: ' + error);
        }
    });
} else {
    console.log('Service Worker or PushManager not supported');
}
