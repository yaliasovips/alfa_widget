export default async function widgetScript() {
    // # convert DOMStringMap to object
    const alfaPaymentData = { ...this.dataset };

    // # find keys ob object, if value start with "."
    for(const element in alfaPaymentData) {
        if(alfaPaymentData[element].indexOf('.') === 0) {
            const foundSelector = document.querySelector(alfaPaymentData[element]);
            alfaPaymentData[element] = foundSelector.value || foundSelector.innerText;
        }
    }

    // # rename keys
    alfaPaymentData['orderNumber'] = alfaPaymentData['orderNumberSelector'];
    delete alfaPaymentData['orderNumberSelector'];
    alfaPaymentData['amount'] = alfaPaymentData['amountSelector'];
    delete alfaPaymentData['amountSelector'];
    alfaPaymentData['description'] = alfaPaymentData['descriptionSelector'];
    delete alfaPaymentData['descriptionSelector'];
    alfaPaymentData['email'] = alfaPaymentData['addEmailSelector'];
    delete alfaPaymentData['addEmailSelector'];
    alfaPaymentData['phone'] = alfaPaymentData['addPhoneSelector'];
    delete alfaPaymentData['addPhoneSelector'];
    alfaPaymentData['clientInfo'] = alfaPaymentData['clientInfoSelector'];
    delete alfaPaymentData['clientInfoSelector'];

    // # transform amount
    alfaPaymentData.amount = alfaPaymentData.amount.replace(/ /g, '');
    alfaPaymentData.amount = alfaPaymentData.amount.replace(/,/g, '.');

    if(alfaPaymentData.amount.includes('руб')) {
        const regExp = new RegExp(/(\d+)+руб(лей|ля|ль|\.|\d)(\d+)+коп(еек|ейки|йка|\.|\s)?/g);
        alfaPaymentData.amount = alfaPaymentData.amount.replace(regExp, (match, rubles, rub_ending, copecks) =>  {
            return rubles + rub_ending + copecks;
        })
    }
    alfaPaymentData.amount = Number(alfaPaymentData.amount).toFixed(2);

    // # covert amount by amount format
    if(alfaPaymentData.amountFormat === 'kopeyki') {
        alfaPaymentData.amount *= 100;
    }

    const params = new URLSearchParams(alfaPaymentData).toString();

    const request = await fetch(`https://test.egopay.ru/api/ab/rest/?${params}`, {
        method: 'POST',
    }).then(res => res.json()).then(data => console.log(data)).catch(error => console.log(error));
    const response = await request;
}

