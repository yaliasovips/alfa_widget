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
            alfaPaymentData[element] = foundSelector.value || foundSelector.innerText;
        }
    }

    // #transform amount
    alfaPaymentData.amountSelector = alfaPaymentData.amountSelector.replace(/ /g, '');
    alfaPaymentData.amountSelector = alfaPaymentData.amountSelector.replace(/,/g, '.');
    if(alfaPaymentData.amountSelector.includes('руб')) {
        const regExp = new RegExp(/([0-9 ]+)+руб(лей|ля|ль|\.|\s\d)(\s*(\d+)+коп(еек|ейки|йка|\.|\s\d))?/g);
        alfaPaymentData.amountSelector = alfaPaymentData.amountSelector.replace(regExp, (match, rubles, rub_ending, copecks_match, copecks) =>  {
            return rubles + rub_ending + copecks;
        })
    }

    // #covert amount by amount format
    if(alfaPaymentData.amountFormat === 'kopeyki') {
        alfaPaymentData.amountSelector *= 100;
    }

    const params = new URLSearchParams(alfaPaymentData).toString();

    console.log('>>params', params)

    const request = await fetch(`https://test.egopay.ru/api/ab/rest/?${params}`, {
        method: 'POST',
    });
    const response = await request;
}

// при передачи варианта "1234.56" в рублях получим сумму "1234.56 руб.",
//   при передачи варианта "1 234 , 56" в копейках получим сумму "1234.56 руб.",
//   при передачи варианта "1234 руб. 56 коп." в копейках получим сумму "1234.56 руб.".
//   Если необходимо, то можно указать в явном виде, что используется формат в рублях без указания копеек, то в этом случае нужно добавить элемент data-amount-format='rubli'. Пробелы и другие нечисловые символы система игнорирует.
//   Например,
//   при передачи варианта "1234" получим сумму "1234.00 руб.",
//   при передачи варианта "1 234 руб." получим сумму "1234.00 руб.".
