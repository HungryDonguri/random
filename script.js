document.querySelector('title').innerText = 'Redirecting...';
document.querySelector('h1').innerText = 'Redirecting...';
const userLang = navigator.language || navigator.userLanguage;
if (userLang.startsWith('ja')) {
    document.querySelector('p').innerHTML = 'If you cannot redirect, click <a>here</a>.';
    document.querySelector('a').href = '/ja';
    window.location.href = '/ja';
} else {
    document.querySelector('p').innerHTML = 'If you cannot redirect, click <a>here</a>.';
    document.querySelector('a').href = '/ja';
    window.location.href = '/en';
}