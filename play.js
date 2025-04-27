const pList = [
    322341152,
    843162693,
    443603478,
];

let currentProjectID = null; // グローバル変数として現在のプロジェクトIDを保持
let usrname = null;
function reload(generateNew) {
    if (generateNew) {
        currentProjectID = pList[Math.floor(Math.random() * pList.length)];
    }
    if (usrname && usrname.length > 0) {
        document.querySelector('iframe').src = 'https://turbowarp.org/' + currentProjectID + '/embed?username=' + usrname;
    } else {
        document.querySelector('iframe').src = 'https://turbowarp.org/' + currentProjectID + '/embed';
    }
}

reload(true);

document.querySelector('#reload-button').addEventListener('click', () => {
    reload(true);
});

document.querySelector('.user-input').addEventListener('input', (event) => {
    usrname = event.target.value;
    reload(false);
});