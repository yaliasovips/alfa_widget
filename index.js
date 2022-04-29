"use strict";

document.addEventListener('DOMContentLoaded', () => {
    // #find widget <button>
    const alfaPaymentButton = document.getElementById('alfa-payment-button');

    // #alfaPaymentButton on click event
    alfaPaymentButton.onclick = widgetScript.bind(alfaPaymentButton);
})

async function widgetScript() {
    // #convert DOMStringMap to object
    const alfaPaymentData = { ...this.dataset };

    // #find keys ob object, if value start with "."
    for(const element in alfaPaymentData) {
        if(alfaPaymentData[element].indexOf('.') === 0) {
            const foundSelector = document.querySelector(alfaPaymentData[element]);
            alfaPaymentData[element] = (foundSelector.value || foundSelector.innerText).replace(/ /g, '-');
        }
    }

    // #transform amount
    // TODO

    // #covert amount by amount format
    if(alfaPaymentData.amountFormat === 'kopeyki') {
        alfaPaymentData.amountSelector *= 100;
    }

    const params = new URLSearchParams(alfaPaymentData).toString();

    const request = await fetch(`https://test.egopay.ru/api/ab/rest/?${params}`, {
        method: 'POST',
    });
    const response = await request;
}
