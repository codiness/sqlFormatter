let input = document.querySelector("#input");
let output = document.querySelector("#output");
let loadFile = document.querySelector("#loadfile");
let loadurl = document.querySelector("#loadfile");
let language = document.querySelector("#lang");
let tabWidth = document.querySelector("#width");
let keywordCase = document.querySelector("#case");
let options = {
    language: "sql",
    keywordCase: "upper",
    tabWidth: 2
};
const config = {
        styleActiveLine: !0,
        lineNumbers: !0,
        mode: "sql"
    },
    editorInput = CodeMirror.fromTextArea(document.getElementById("input"), config),
    editorOutput = CodeMirror.fromTextArea(document.getElementById("output"), config);
let filename = "query"

function getOptions() {
    options.language = language.value;
    options.keywordCase = keywordCase.value;
    options.tabWidth = parseInt(tabWidth.value);
    return options;
}

function format(data, options) {
    return sqlFormatter.format(data, options);
}

function onSaveClicked() {
    let url = "data:x-application/text," + escape(editorOutput.getValue());
    dl.href = url;
    dl.download = filename;
    dl.click();
}

function onCopyClicked() {
    navigator.clipboard.writeText(editorOutput.getValue());
}

function getFilenameFromUrl(url) {
    const pathname = new URL(url).pathname;
    const index = pathname.lastIndexOf('/');
    return pathname.substring(index + 1)
}

function onLoadFromUrlClicked() {
    let url = prompt("Url:");
    if (url == null || url == "") {
        return;
    }
    fetch(url)
        .then((response) => response.text())
        .then((data) => editorInput.setValue(data))
        .catch((e) => alert("Couldn't send request!"));
    filename = `${getFilenameFromUrl(url).split('.').slice(0, -1).join('.')}`;
}

function onLoadFromFileClicked() {
    var reader = new FileReader();
    reader.readAsText(loadFile.files[0], "UTF-8");
    reader.onload = function (evt) {
        editorInput.setValue(evt.target.result);
    }
    reader.onerror = function (evt) {
        alert("Couldn't read the file");
    }
    filename = `${loadFile.files[0].name.split('.').slice(0, -1).join('.')}`;
}

function onFormatClicked() {
    const newOptions = getOptions();
    const formatted = format(editorInput.getValue(), newOptions);
    editorOutput.setValue(formatted);
    filename += "-formatted.sql";
}
