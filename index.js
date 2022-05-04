"use strict";

document.addEventListener('DOMContentLoaded', () => {
    // # find widget <button>
    const alfaPaymentButton = document.getElementById('alfa-payment-button');
    const body = document.body;

    // # generate payment button
    const paymentButton = document.createElement("button");
    paymentButton.id = "alfa-payment__button";
    paymentButton.classList.add("theme_alfa-on-color", "alfa-payment__button_size_xl");
    paymentButton.onclick = widgetScript.bind(alfaPaymentButton);
    paymentButton.innerText = alfaPaymentButton.dataset.buttonText || 'Оплатить по карте';
    alfaPaymentButton.append(paymentButton);

    // # generate message span
    const paymentMessage = document.createElement("span");
    paymentMessage.id = "alfa-payment__message";
    paymentMessage.classList.add("alfa-payment__message");
    alfaPaymentButton.append(paymentMessage);

    // # generate payment modal
    const paymentModal = document.createElement("div");
    paymentModal.classList.add("alfa-payment__modal", "alfa-payment__modal_hidden");
    body.append(paymentModal);

    // # generate frame modal
    const frameModal = document.createElement("div");
    frameModal.id = "alfa-payment";
    frameModal.classList.add("alfa-payment__rbs-frame-modal", "alfa-payment__rbs-frame-modal_hidden");
    body.append(frameModal);

    // # generate frame modal header
    const frameModalHeader = document.createElement('div');
    frameModalHeader.classList.add("alfa-payment__rbs-frame-header");
    frameModal.append(frameModalHeader);

    // # generate close button in frame modal header
    const frameModalCloseButton = document.createElement('span');
    frameModalCloseButton.classList.add("alfa-payment__payment-close-button");
    frameModalHeader.append(frameModalCloseButton);

    // # generate frame modal body
    const frameModalBody = document.createElement('div');
    frameModalBody.classList.add("alfa-payment__rbs-frame-body")
    frameModal.append(frameModalBody);

    // # generate frame spinner
    const frameModalSpinner = document.createElement('div');
    frameModalSpinner.classList.add('alfa-payment__spinner');
    frameModalBody.append(frameModalSpinner);

    const frame = document.createElement("iframe");
    frame.allow = "payment";
    frame.classList.add("alfa-payment__rbs-iframe", "alfa-payment__rbs-iframe_hidden");
    frameModalBody.append(frame);
})

async function widgetScript() {
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

