const selectField = document.getElementById('selectField');
let apiLink = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=AAPL&interval=60min&apikey=593BL1911ZXDQAZ4';
const button = document.getElementById('requestButton');
const errorElement = document.getElementById('error');
const textBoxElement = document.getElementById('results');

let ticker = selectField.options[selectField.selectedIndex].text;

function setTicker(newTicker) {
    ticker = newTicker;
}

function setApi(option) {
    apiLink = apiLink.substr(0, 71) + option + apiLink.substr(apiLink.search(/&interval/));
}

selectField.addEventListener('change', (e) => {
    setTicker(e.target.options[e.target.selectedIndex].text);
    setApi(ticker);
    console.log(ticker);
    console.log(apiLink);
});

function requestServer(url) {
    return new Promise(((resolve, reject) => {
        const xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);

    xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) {
            return;
        }

        if (xhr.status !== 200) {
            const error = new Error(`Ошибка ${xhr.status}`);

            error.code = xhr.statusText;
            reject(error);
        } else {
            resolve(xhr.responseText);
        }
    };

    xhr.send();
    }));
}

function parseJsonAndShow(request) {
    let data;

    try {
        data = JSON.parse(request);
    } catch (err) {
        showError(new Error('Ошибка при чтении из json'));
    }

    if (data) {
        hideError();
        const entries = data["Time Series (60min)"];
        let arrayOfClosings = [];
        for (let prop in entries) {
            if (entries.hasOwnProperty(prop)) {
                arrayOfClosings.push(entries[prop]["4. close"]);
            }
        }
        textBoxElement.innerText = '{\n' + JSON.stringify(arrayOfClosings) + '\n}';
        console.log(textBoxElement.innerText);
    }
}

function showError(err) {
    errorElement.textContent = err;
    errorElement.classList.remove('hidden');
    textBoxElement.classList.add('hidden');
}

function hideError() {
    errorElement.classList.add('hidden');
    textBoxElement.classList.remove('hidden');
}



button.addEventListener('onclick', () => {
    requestServer(apiLink)
        .then(parseJsonAndShow)
        .catch(showError);
});



