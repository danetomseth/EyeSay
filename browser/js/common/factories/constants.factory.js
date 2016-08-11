core.factory('ConstantsFactory', function($rootScope, SettingsFactory, Session) {
	let calibrateVal = {};
	let blinkValues = {};

	$rootScope.$on("userThreshold", (event, data) => {
		console.log('user threshold emmitted');
		blinkValues = {
			zero: data.zero,
			ratio: data.ratio
		}
    });

	if(Session.user) {
	
		blinkValues = {
			zero: Session.user.blinkZero,
			ratio: Session.user.blinkRatio
		}
	}
	else {
		blinkValues = {
			zero: 49,
			ratio: 0.74
		}
	}

	let settings = {
		blinkZero: {label: 'Blink Zero', value: blinkValues.zero, number: true},
		blinkRatio: {label: 'Blink Ratio', value: blinkValues.ratio, number: true},
		cursorDelay: {label: 'Cursor Delay', value: 750, number: true},
		blinkActive: {label: 'Blink Active', value: true, number: false},
		doubleBlink: {label: 'Double Blink Function', value: false, number: false},
		webcamActive: {label: 'Webcam Status', value: true, number: false}
	}







	///Settings

	calibrateVal.settings = settings;

	calibrateVal.setValues = (settings) => {
		calibrateVal.settings = settings;
		calibrateVal.blinkRatio = settings[0].value;
		calibrateVal.blinkZero = settings[1].value;
	}


	calibrateVal.blinkCalibrated = false;

	calibrateVal.setBlink = (ratio, zero) => {
		calibrateVal.settings.blinkZero.value = zero;
		calibrateVal.settings.blinkRatio.value = ratio;
		calibrateVal.blinkRatio = ratio;
		calibrateVal.blinkZero = zero;
		calibrateVal.blinkCalibrated = true;
		console.log('ratio', calibrateVal.settings.blinkRatio.value);
		console.log('zero', calibrateVal.settings.blinkZero);
	}



	calibrateVal.increaseZero = () => {
		calibrateVal.blinkZero = calibrateVal.blinkZero + 1;
		return calibrateVal.blinkZero
	}

	calibrateVal.decreaseZero = () => {
		calibrateVal.blinkZero = calibrateVal.blinkZero - 1;
		return calibrateVal.blinkZero
	}


	calibrateVal.increaseRatio = () => {
		calibrateVal.blinkRatio = calibrateVal.blinkRatio + 0.02;
		return calibrateVal.blinkRatio

	}

	calibrateVal.decreaseRatio = () => {
		calibrateVal.blinkRatio = calibrateVal.blinkRatio - 0.02
		return calibrateVal.blinkRatio
	}


	return calibrateVal;

});
