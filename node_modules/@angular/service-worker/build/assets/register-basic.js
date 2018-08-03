if ('serviceWorker' in navigator) {
  navigator
    .serviceWorker
    .register('worker-basic.js')
    .catch(function(err) {
      console.error('Error registering service worker:', err);
    });
}
