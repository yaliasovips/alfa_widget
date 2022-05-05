export default async function widgetScript() {
    // # convert DOMStringMap to object
    const alfaPaymentData = {
        ...this.dataset
    };

    // # find keys ob object, if value start with "."
    findDataFromElements(alfaPaymentData);

    alfaPaymentData['currency'] = 810;

    // # rename keys
    // только в том случае, если у полей есть префикс -selector
    // без него указывается не селектор, а "захардкорженные" данные
    renameKeys(alfaPaymentData);

    // # transform amount
    transformAmount(alfaPaymentData);


    const { valid, errorMessages } = validation(alfaPaymentData);

    if(!valid) {
        const firstErrorKey = Object.keys(errorMessages)[0];
        document.querySelector('#alfa-payment__message').innerText = errorMessages[firstErrorKey];
        return;
    }

    console.log('valid');

    // try {
    //     const request = await fetch(`https://test.egopay.ru/api/ab/rest/`, {
    //         method: 'POST',
    //         body: JSON.stringify(alfaPaymentData),
    //     })
    //     const response = request.json();
    // } catch(error) {
    //     console.error(error);
    // }
}

function validation(data) {
    let valid = true;
    const errorMessages = {};

    // # сумма введена, 
    // # сумма больше и не равна нулю
    if(!(Number(data.amount) && Number(data.amount) > 0 && Number(data.amount) !== 0)) {
        valid = false;
        errorMessages.amountError = 'Поле сумма не заполнено';
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
