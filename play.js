// DOM要素の取得
const titleDiv = document.getElementById("d-title");
const instrDiv = document.getElementById("instr");
const memocreDiv = document.getElementById("memocre");
const instrText = document.getElementById("instr-text");
const memocreText = document.getElementById("memocre-text");

let currentProjectID = null;
let usrname = null;
let jdata = null;

// 現在のページのパスを取得して言語を判定
const currentPath = window.location.pathname;
const pageLang = currentPath.includes('/en') ? 'en' : 'ja'; // '/en'が含まれていれば英語、それ以外は日本語

// JSONファイルとプロジェクトデータを非同期で読み込む
async function loadJSON() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) {
            throw new Error('Failed to load data.json');
        }
        jdata = await response.json();
        reload(true); // 初回ロード
    } catch (error) {
        console.error("Error loading JSON:", error);
    }
}

// 指定されたプロジェクトのinstr.txtまたはmemocre.txtを取得
async function fetchProdataFile(projectKey, fileName) {
    const filePath = `./prodata/${projectKey}/${fileName}`;
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load ${filePath}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Error loading ${fileName} for project ${projectKey}:`, error);
        return null;
    }
}

// プロジェクトをリロード
function reload(generateNew) {
    if (!jdata) {
        console.error("JSON data is not loaded yet.");
        return;
    }

    if (generateNew) {
        const keys = Object.keys(jdata);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        currentProjectID = jdata[randomKey].id;

        // ページの言語に基づいて処理を分岐
        const projectLang = jdata[randomKey].lang;

        // instructionsの取得
        if (projectLang === 'multi' || pageLang === 'en') {
            // プロジェクトの言語が'multi'またはページが英語の場合はAPIから取得
            fetchAPIInstructions(currentProjectID);
        } else {
            // 日本語ページでプロジェクトの言語が'multi'以外の場合はprodataから取得
            fetchProdataFile(randomKey, 'instr.txt').then(data => {
                if (data) {
                    instrText.innerHTML = data.replace(/\n/g, '<br>');
                    instrDiv.removeAttribute('hidden');
                    instrText.removeAttribute('hidden');
                } else {
                    instrDiv.setAttribute('hidden', '');
                    instrText.setAttribute('hidden', '');
                }
            });
        }

        // memocreの取得
        if (projectLang === 'multi' || pageLang === 'en') {
            // プロジェクトの言語が'multi'またはページが英語の場合はAPIから取得
            fetchAPIDescription(currentProjectID);
        } else {
            // 日本語ページでプロジェクトの言語が'multi'以外の場合はprodataから取得
            fetchProdataFile(randomKey, 'memocre.txt').then(data => {
                if (data) {
                    memocreText.innerHTML = data.replace(/\n/g, '<br>');
                    memocreDiv.removeAttribute('hidden');
                    memocreText.removeAttribute('hidden');
                } else {
                    memocreDiv.setAttribute('hidden', '');
                    memocreText.setAttribute('hidden', '');
                }
            });
        }
    }

    const iframe = document.querySelector('iframe');
    if (usrname && usrname.length > 0) {
        iframe.src = `https://turbowarp.org/${currentProjectID}/embed?settings-button&username=${usrname}`;
    } else {
        iframe.src = `https://turbowarp.org/${currentProjectID}/embed?settings-button`;
    }

    // タイトルの取得と表示
    const apiUrl = `https://trampoline.turbowarp.org/proxy/projects/${currentProjectID}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.title) {
                titleDiv.textContent = data.title; // タイトルを設定
                titleDiv.href = `https://scratch.mit.edu/projects/${currentProjectID}`; // リンクを設定
                titleDiv.removeAttribute('hidden'); // 非表示を解除
            } else {
                console.error("Title not found in API response.");
                titleDiv.setAttribute('hidden', '');
            }
        })
        .catch(error => console.error("Error fetching project title from API:", error));
}

// APIからinstructionsを取得
function fetchAPIInstructions(projectID) {
    const apiUrl = `https://trampoline.turbowarp.org/proxy/projects/${projectID}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.instructions) {
                instrText.innerHTML = data.instructions.replace(/\n/g, '<br>');
                instrDiv.removeAttribute('hidden');
                instrText.removeAttribute('hidden');
            } else {
                instrDiv.setAttribute('hidden', '');
                instrText.setAttribute('hidden', '');
            }
        })
        .catch(error => console.error("Error fetching instructions from API:", error));
}

// APIからdescriptionを取得
function fetchAPIDescription(projectID) {
    const apiUrl = `https://trampoline.turbowarp.org/proxy/projects/${projectID}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.description) {
                memocreText.innerHTML = data.description.replace(/\n/g, '<br>');
                memocreDiv.removeAttribute('hidden');
                memocreText.removeAttribute('hidden');
            } else {
                memocreDiv.setAttribute('hidden', '');
                memocreText.setAttribute('hidden', '');
            }
        })
        .catch(error => console.error("Error fetching description from API:", error));
}

// イベントリスナーの設定
document.querySelector('#reload-button').addEventListener('click', () => {
    reload(true);
});

document.querySelector('.user-input').addEventListener('input', (event) => {
    usrname = event.target.value;
    reload(false);
});

// 初期化
loadJSON();