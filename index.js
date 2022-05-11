"use strict";

document.addEventListener('DOMContentLoaded', () => {
    const { paymentButton, paymentDataWrapper } = generateElements();
    paymentButton.onclick = widgetScript.bind(paymentDataWrapper);
})

// NOT_PAYED - заказ не оплачен
// ERROR_MESSAGE - оплата картой временно невозможна, обратитесь к администратору магазина

function generateElements() {
	// # find widget <button>
	const paymentDataWrapper = document.getElementById('alfa-payment-button');
	const body = document.body;

	// # generate payment button
	const paymentButton = document.createElement("button");
	paymentButton.id = "alfa-payment__button";
	paymentButton.classList.add("theme_alfa-on-color", "alfa-payment__button_size_xl");
	paymentButton.innerText = paymentDataWrapper.dataset.buttonText || 'Оплатить по карте';
	paymentDataWrapper.append(paymentButton);

	// # generate message span
	const paymentMessage = document.createElement("span");
	paymentMessage.id = "alfa-payment__message";
	paymentMessage.classList.add("alfa-payment__message");
	paymentDataWrapper.append(paymentMessage);

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
	// frame.sandbox = 'allow-top-navigation-by-user-activation allow-same-origin allow-scripts';
	// frame.sandbox = 'allow-scripts allow-popups allow-top-navigation';
	frame.sandbox = 'allow-top-navigation-by-user-activation allow-same-origin allow-scripts';
	frame.classList.add("alfa-payment__rbs-iframe", "alfa-payment__rbs-iframe_hidden");
	frameModalBody.append(frame);
	return { 
		paymentButton,
		paymentDataWrapper,
	};
}

async function widgetScript() {
    // # convert DOMStringMap to object
    const alfaPaymentData = {
        ...this.dataset
    };

    // # find keys ob object, if value start with "."
    findDataFromElements(alfaPaymentData);

    alfaPaymentData['currency'] = 810;

    // # rename keys
    // # только в том случае, если у полей есть префикс -selector
    // # без него указывается не селектор, а "захардкорженные" данные
    renameKeys(alfaPaymentData);

    // # transform amount
    transformAmount(alfaPaymentData);

    const { valid, errorMessages } = validation(alfaPaymentData);

    if(!valid) {
        const firstErrorKey = Object.keys(errorMessages)[0];
        document.querySelector('#alfa-payment__message').innerText = errorMessages[firstErrorKey];
        return;
    }

    // try {
    //     const request = await fetch(`https://test.egopay.ru/api/ab/rest/register.do`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(alfaPaymentData),
    //     })
    //     console.log('>>request', request);
    //     const response = request.json();
    //     console.log('>>response', response);
    // } catch(error) {
    //     console.error(error);
    // }

    document.querySelector('.alfa-payment__rbs-iframe').src = 'https://test.egopay.ru/payments/request?session=6e5dbca36ae1460abf0a0823d7faa8c8';
}

function validation(data) {
    let valid = true;
    const errorMessages = {};

    // # сумма не введена,
    // # сумма должна быть больше и не равна нулю
    // # ERROR_REQUIRE_AMOUNT
    if(!(Number(data.amount) && Number(data.amount) > 0 && Number(data.amount) !== 0)) {
        valid = false;
        errorMessages.amountError = 'Поле сумма не заполнено';
    }

    // # не пустые номер заказа, урл, сумма и токен
    // # ERROR_REQUIRE
    if(!data.orderNumber || !data.returnUrl || !data.amount || !data.token) {
        valid = false;
        errorMessages.requireFiled = 'Необходимо заполнить обязательные поля';
    }

    return {
        valid,
        errorMessages
    };
}

function findDataFromElements(data) {
    for (const element in data) {
        if (data[element].indexOf('.') === 0) {
            const foundSelector = document.querySelector(data[element]);
            data[element] = foundSelector.value || foundSelector.innerText;
        }
    }
}

function renameKeys(data) {
    const selectorKeys = Object.keys(data).filter(data_item => data_item.includes('Selector'));

    selectorKeys.forEach(key => {
        const stringWithSelectorRemoved = key.slice(0, -8);
        if(data[key]) {
            data[stringWithSelectorRemoved] = data[key]
            delete data[key];
        }
    })
}

function transformAmount(data) {
    data.amount = data.amount.replace(/ /g, '');
    data.amount = data.amount.replace(/,/g, '.');

    if (data.amount.includes('руб')) {
        const regExp = new RegExp(/(\d+)+руб(лей|ля|ль|\.|\d)((\d+)+коп(еек|ейки|йка|\.|\s)|)?/g);
        data.amount = data.amount.replace(regExp, (match, rubles, rub_ending, copecks_match, copecks) => {
            const copecks_end = copecks || '';
            return rubles + '.' + copecks_end;
        })
    }
    data.amount = Number(data.amount).toFixed(2);

    // # covert amount by amount format
    if (data.amountFormat === 'kopeyki') {
        data.amount *= 100;
    }
}

