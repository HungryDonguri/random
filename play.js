const titleDiv = document.getElementById("d-title");
const instrDiv = document.getElementById("instr");
const memocreDiv = document.getElementById("memocre");
const instrText = document.getElementById("instr-text");
const memocreText = document.getElementById("memocre-text");
const pList = [
    322341152,
    843162693,
    443603478,
];

let currentProjectID = null;
let usrname = null;
function reload(generateNew) {
    if (generateNew) {
        currentProjectID = pList[Math.floor(Math.random() * pList.length)];
    }
    if (usrname && usrname.length > 0) {
        document.querySelector('iframe').src = 'https://turbowarp.org/' + currentProjectID + '/embed?settings-button&username=' + usrname;
    } else {
        document.querySelector('iframe').src = 'https://turbowarp.org/' + currentProjectID + '/embed?settings-button';
    }
    let apiUrl = "https://trampoline.turbowarp.org/proxy/projects/" + currentProjectID;
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        titleDiv.textContent = data.title;
        titleDiv.href = "https://scratch.mit.edu/projects/" + currentProjectID;
        if (data.instructions) {
            instrText.innerHTML = data.instructions.replace(/\n/g, '<br>');
            instrDiv.removeAttribute('hidden');
            instrText.removeAttribute('hidden')
        } else {
            instrDiv.setAttribute('hidden', '');
            instrText.setAttribute('hidden', '');
        }
        if (data.description) {
            memocreText.innerHTML = data.description.replace(/\n/g, '<br>');
            memocreDiv.removeAttribute('hidden');
            memocreText.removeAttribute('hidden');
        } else {
            memocreDiv.setAttribute('hidden', '');
            memocreText.setAttribute('hidden', '');
        }
    })
    .catch(error => console.error("Error fetching data:", error));
}

reload(true);

document.querySelector('#reload-button').addEventListener('click', () => {
    reload(true);
});

document.querySelector('.user-input').addEventListener('input', (event) => {
    usrname = event.target.value;
    reload(false);
});

