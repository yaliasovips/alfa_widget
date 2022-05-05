export default function generateElements() {
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
	frame.classList.add("alfa-payment__rbs-iframe", "alfa-payment__rbs-iframe_hidden");
	frameModalBody.append(frame);
	return { 
		paymentButton,
		paymentDataWrapper,
	};
}
