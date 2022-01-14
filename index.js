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
            const findedSelector = document.querySelector(alfaPaymentData[element]);
            if(findedSelector === null) {
                console.error(`Element with ${findedSelector} class not found`);
                throw new Error(`Element with ${findedSelector} class not found`);
            } else {
                alfaPaymentData[element] = findedSelector.value
            }
        }
    }

    const dataToSend = {
        order: {
            // INTEGER && should not be empty
            token: alfaPaymentData.token,
            // must be shorter than or equal to 128 characters && STRING && should not be empty
            number: alfaPaymentData.orderNumberSelector,
        },
        cost: {
            // must be a number conforming to the specified constraints && should not be empty
            amount: formatCostAmount(alfaPaymentData.amountSelector),
        },
        customer: {
            name: alfaPaymentData.clientInfoSelector,
            email: alfaPaymentData.emailSelector,
        },
        description: {}
    }


    // testing request to register (https://test.egopay.ru/send_link/api/register)
    try {
        const request = await fetch('https://test.egopay.ru/send_link/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(dataToSend)
        })
        const response = await request.json();
    } catch(error) {
        console.error(error);
        throw new Error(error);
    }

}
