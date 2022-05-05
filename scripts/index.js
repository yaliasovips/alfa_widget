"use strict";

import generateElements from "./generateElements.js";
import widgetScript from "./widgetScript.js";

document.addEventListener('DOMContentLoaded', () => {
    const returnedPaymentButton = generateElements();
    returnedPaymentButton.onclick = widgetScript.bind(returnedPaymentButton);
})
