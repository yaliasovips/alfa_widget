export default async function widgetScript() {
    // # convert DOMStringMap to object
    const alfaPaymentData = { ...this.dataset };

    // # find keys ob object, if value start with "."
    findDataFromElements(alfaPaymentData);

    alfaPaymentData['currency'] = 810;

    // # rename keys
    renameKeys(alfaPaymentData);

    console.log('>>alfaPaymentData', alfaPaymentData);

    // # transform amount
    transformAmount(alfaPaymentData);

    const params = new URLSearchParams(alfaPaymentData).toString();
    console.log('>>params', params);

    try {
        const request = await fetch(`https://test.egopay.ru/api/ab/rest/?${params}`, {
            method: 'POST',
        })
        const response = request.json();
    } catch(error) {
        console.error(error);
    }
}

function findDataFromElements(data) {
    for(const element in data) {
        if(data[element].indexOf('.') === 0) {
            const foundSelector = document.querySelector(data[element]);
            data[element] = foundSelector.value || foundSelector.innerText;
        }
    }
}

function renameKeys(data) {
    data['orderNumber'] = data['orderNumberSelector'];
    delete data['orderNumberSelector'];
    data['amount'] = data['amountSelector'];
    delete data['amountSelector'];
    data['description'] = data['descriptionSelector'];
    delete data['descriptionSelector'];
    data['email'] = data['emailSelector'];
    delete data['emailSelector'];
    data['phone'] = data['phoneSelector'];
    delete data['phoneSelector'];
    data['clientInfo'] = data['clientInfoSelector'];
    delete data['clientInfoSelector'];
}

function transformAmount(data) {
    data.amount = data.amount.replace(/ /g, '');
    data.amount = data.amount.replace(/,/g, '.');

    if(data.amount.includes('руб')) {
        const regExp = new RegExp(/(\d+)+руб(лей|ля|ль|\.|\d)(\d+)+коп(еек|ейки|йка|\.|\s)?/g);
        data.amount = data.amount.replace(regExp, (match, rubles, rub_ending, copecks) =>  {
            return rubles + rub_ending + copecks;
        })
    }
    data.amount = Number(data.amount).toFixed(2);

    // # covert amount by amount format
    if(data.amountFormat === 'kopeyki') {
        data.amount *= 100;
    }
}