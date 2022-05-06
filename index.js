"use strict";

import generateElements from "./scripts/generateElements.js";
import widgetScript from "./scripts/widgetScript.js";

document.addEventListener('DOMContentLoaded', () => {
    const { paymentButton, paymentDataWrapper } = generateElements();
    paymentButton.onclick = widgetScript.bind(paymentDataWrapper);
})

// NOT_PAYED - заказ не оплачен
// ERROR_MESSAGE - оплата картой временно невозможна, обратитесь к администратору магазина
