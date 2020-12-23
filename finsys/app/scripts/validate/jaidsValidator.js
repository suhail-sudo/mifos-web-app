
/*
 * +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * @ Author Mr. Jaid.
 * Please read and understand code design structure before tampering with code base
 * +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */
function jaidsValidator() {

    var comFunc = new comFunction();
    return {
        formValidationInit: formValidationInit,
        genericFormInputValidator: genericFormInputValidator,
        valdateRegPassword: valdateRegPassword,
        flagElement: flagElement,
        validateNumbers: validateNumbers,
        validateMobileNo: validateMobileNo
    };

    function validateInitIndex(tagName) {
        for (var i = 0; i < tagName.length; ++i) {
            tagName[i].removeEventListener("change", valCallback, false);
            tagName[i].addEventListener("change", valCallback, false);
            function valCallback(ev) {
                try {
                    var elem = ev;
                    validateByDef(elem, elem.className);
                } catch (err) {
                    alert(err);
                }
            }
        }
    }

    function formValidationInit(formId, submitButtonId, successFunc) {
        validateInitIndex(document.getElementById(formId).getElementsByTagName('input'));
        validateInitIndex(document.getElementById(formId).getElementsByTagName('select'));
        validateInitIndex(document.getElementById(formId).getElementsByTagName('textarea'));
        if (submitButtonId !== undefined) {
            document.getElementById(submitButtonId).removeEventListener("click", function () {
                submitClickFunc(formId, successFunc);
            }, false);
            document.getElementById(submitButtonId).addEventListener("click", function () {
                submitClickFunc(formId, successFunc);
            }, false);
        }
    }

    function submitClickFunc(formId, successFunc) {
        genericFormInputValidator(formId, successFunc);
    }

    function userid_validation(uid, mx, my)
    {
        var uid_len = uid.value.length;
        if (uid_len === 0 || uid_len >= my || uid_len < mx)
        {
            flagElement(uid, italicAppend("User Id should not be empty / length be between " + mx + " to " + my));
            return false;
        }
        unFlagElement(uid);
        return true;
    }

    function allLetter(val)
    {
        var vali = val.value;
        var letters = /^[A-Za-z\s]+$/;
        if (vali.length > 0)
        {
            if (vali.match(letters))
            {
                unFlagElement(val);
                return true;
            } else
            {
                flagElement(val, "Alphabet characters only for " + val.title);
                return false;
            }

        }

        else
        {
            return true;
        }
    }

    function valLength(val, maxLenght, minlength) {
        var valvalue = val.value;
        if (valvalue.length < minlength) {
            flagElement(val, 'Must be more than ' + minlength + ' Characters');
            return false;
        }
        if (valvalue.length > maxLenght) {
            flagElement(val, 'Must not be more than ' + maxLenght + ' Characters');
            return false;
        }
        unFlagElement(val);
        return true;
    }

    function valLengthAlleters(val, maxLenght, minlength) {
//alert('next')
        if (allLetter(val)) {
            var valvalue = val.value;
            if (valvalue.length === 0) {
                if (valvalue.length < minlength) {
                    flagElement(val, 'Must be more than ' + minlength + ' Characters');
                    return false;
                }
                if (valvalue.length > maxLenght) {
                    flagElement(val, 'Must not be more than ' + maxLenght + ' Characters');
                    return false;
                }
                unFlagElement(val);
                return true;
            }
            return true;
        }
        return false;
    }

    function alphanumeric(element, minlenght, maxlenght)
    {  //alert("alphanumeric true.....")
        var value = element.value;
        var letters = /^[0-9a-zA-Z]+$/;
        if (value.match(letters))
        {
            //alert("alphanumeric true.....")
            unFlagElement(element);
            return valLength(element, maxlenght, minlenght);
        }
        else
        {  //alert("alphanumeric false.....")
            flagElement(element, element.title + " Field is Alphanumeric ");
            return false;
        }
    }

    function alphanumericOptional(element, maxlenght, minlenght)
    {
        var value = element.value;
        var letters = /^[0-9a-zA-Z]+$/;
        {
            if (value.length > 0) {
                if (value.match(letters))
                {
                    unFlagElement(element);
                    return valLength(element, maxlenght, minlenght);
                }
                else
                {  //alert("alphanumeric false.....")
                    flagElement(element, element.title + '  is alphanumeric');
                    return false;
                }
            } else {
                return true;
            }
        }
    }



    function validateEmail(uemail) {
        {
            if (uemail.value.length > 0) {
                var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if (uemail !== null && uemail.value.match(mailformat))
                {
                    unFlagElement(uemail);
                    return true;
                }
                else
                {
                    flagElement(uemail, "invalid email address!");
                    return false;
                }
            } else {
                unFlagElement(uemail);
                return true;
            }
        }
    }

    function ValidateUpdateEmail(emailval)
    {
        if (emailval.value.length === 0)
        {
            unFlagElement(emailval);
            return true;
        }
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (emailval !== null && emailval.value.match(mailformat))
        {
            unFlagElement(emailval);
            return true;
        }
        if (emailval.value.length === 0)
        {
            unFlagElement(emailval);
            return true;
        }
        else
        {
            flagElement(emailval, "invalid email address!");
            return false;
        }

    }

    function validateNumbers(element) {
        var numbers = "1234567890";
        var value = element.value;
        if (value.length > 0) {
            for (var i = 0; i < value.length; ++i) {
                if (numbers.indexOf(value.charAt(i)) === -1) {
                    value = valuesubstring(0, i - 1);
                    flagElement(element, element.title + ' is numeric');
                    return false;
                }
            }
        }
        return true;
    }

    function italicAppend(message) {
        return "<i style='color: red;'>" + message + "</i>";
    }

    function genericFormInputValidator(formId, successfunc) {
        try {
            if (formVlidator(formId, 'input')) {
                if (formVlidator(formId, 'select')) {
                    if (formVlidator(formId, 'textarea')) {
                        if (successfunc !== undefined) {
                            successfunc();
                        }
                        return true;
                    }
                }
            }
        } catch (err) {
            alert('and error ocured' + err);
        }
        return false;
    }

    function valdateRegPassword(passId, confirmPassId) {
        var password = document.getElementById(passId);
        var confrimPassword = document.getElementById(confirmPassId);
        if (validateNewPassword(password)) {
            if (password.value === confrimPassword.value) {
                unFlagElement(confrimPassword);
                return true;
            } else {
                flagElement(confrimPassword, "confirm password and password do not match");
                return false;
            }
        }
    }

    function formVlidator(formId, inputTag) {
        var tagName = document.getElementById(formId).getElementsByTagName(inputTag);
        var className;
        for (var i = 0; i < tagName.length; ++i) {
            unFlagElement(tagName[i]);
            className = tagName[i].className;
            if (!validateByDef(tagName[i], className)) {
                return false;
            }
        }
        return true;
    }

    function validateByDef(elem, className) {
        {
            if (elem.type === 'email') {
                if (!validateEmail(elem)) {
                    return false;
                }
            }

            if (elem.type === 'number') {
                if (!validateNumbers(elem)) {
                    return false;
                }
            }

            /* if (elem.type === 'tel') {
                if (!validateMobileNo(elem.id)) {
                    return false;
                }
            }

                        if (comFunc.containClassFuncClass(className, 'phone_Number')) {
                            if (!validateMobileNo(className)) {
                                return false;
                            }
                        }
                        */

            if (comFunc.containClassFuncClass(className, 'valName')) {
                if (!allLetter(elem)) {
                    return false;
                }
            }

            if (comFunc.containClassFuncClass(className, 'alphanumeric')) {
                if (!alphanumeric(elem, 3, 20)) {
                    return false;
                }
            }

            if (elem.required) {
                if (!valRequired(elem)) {
                    return false;
                }
            }
        }
        return true;
    }

    function valRequired(val) {
        var value = val.value;
        if (value.toString().trim().length === 0) {
            flagElement(val, (((val.placeholder === undefined) || (val.placeholder.length === 0)) ? 'Field' : val.placeholder) + ' is required');
            return false;
        }
        return true;
    }
	
    function flagElement(element, flagMessage) {
        
		swal({
			title: flagMessage,
			text: "Enter a Valid input on the highlighted field",
			icon: "error",
			button: "Ok"
		});
		//var tabIndex=parseInt(element.parentNode.parentNode.parentNode.parentNode.id.split("-")[1]);
		//tabIndex=tabIndex-1;
		//$('.tabs-container').tabs().tabs("option", "active", tabIndex);
		element.style.boxShadow = "2px 2px 3px red";
		//console.log(tabIndex);
		//alert(tabIndex);
        validationMessage(flagMessage);
		element.focus();
    }

    function unFlagElement(element) {
        element.style.boxShadow = "none";
    }

    function validationMessage(flagMessage) {
        //alert(flagMessage);
		console.log("false");
    }

    function validateMobileNo(Id) {
        var name = document.getElementById(Id);
        var checker = 0;
        var message = "";
        name.value = name.value.toUpperCase();
        var iChars = "+-()";
        var numbers = "1234567890";
        if (name.value.length > 0) {
            for (var i = 0; i < name.value.length; i++) {
                if ((iChars.indexOf(name.value.charAt(i)) == -1) && (numbers.indexOf(name.value.charAt(i)) == -1)) {
                    //  alert("checking...1")
                    message = "Invalid Phone Number";
                    alert(message);
                    //document.getElementById(validatorId).innerHTML = message;
                    ++checker;
                }
            }
            if (checker == 0) {
                // alert(name.value.length)
                {
                    if (name.value.length < 11) {
                        // alert('comparing ' +name.value.length+' with ' + 11)
                        message = "Must not be less than 11 Characters";
                        alert(message);
                        //document.getElementById(validatorId).innerHTML = message;
                        ++checker;
                    }
                    else if (name.value.length == 11) {
                        //alert('was equals to 11')
                        {
                            if (name.value.charAt(0) == '0') {
                                name.value = '+234' + name.value.substr(1, name.value.toString().length)
                            } else {
                                message = "Valid format +23480XXXXXXXX and 80XXXXXXXX";
                                alert(message);
                                //document.getElementById(validatorId).innerHTML = message;
                                ++checker;
                            }
                        }
                    }
                    else if (name.value.length == 10) {
                        name.value = '+234' + name.value
                    }
                    else if (name.value.length < 10) {
                        message = "Must not be less than 11 Characters";
                        alert(message);
                        //document.getElementById(validatorId).innerHTML = message;
                        ++checker;
                    }
                    else if (name.value.length > 11) {
                        //alert('greater than 11 ****** ' +name.value.length)
                        {
                            if (name.value.length == 14) {
                                // alert('equal to 14 **** ')
                                var val = name.value.toString()
                                if (!val.substring(0, 4) == '+234') {
                                    message = "Country code must begin Phone Number";
                                    alert(message);
                                    //document.getElementById(validatorId).innerHTML = message;
                                    ++checker;
                                    message = "Invalid Phone Number";
                                    alert(message);
                                    //document.getElementById(validatorId).innerHTML = message;
                                    ++checker;
                                }
                            } else if (name.value.length < 14) {
                                message = "Valid format +23480XXXXXXXX and 80XXXXXXXX";
                                alert(message);
                                //document.getElementById(validatorId).innerHTML = message;
                                ++checker;
                            } else if (name.value.length > 14) {
                                message = "Invalid format";
                                alert(message);
                                //document.getElementById(validatorId).innerHTML = message;
                                ++checker;
                            }
                        }
                    }

                }
            }
        }

        if (checker == 0) {
            //alert('true')
            message = "";
            alert(message);
            //document.getElementById(validatorId).innerHTML = message;
            return true;
        } else {
            name.focus();
            return false;
        }
    }

    function validateNewPassword(pwd) {
        var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).*$", "g");
        var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
        var enoughRegex = new RegExp("(?=.{6,}).*", "g");
        if (pwd.value.length === 0) {
            flagElement(pwd, 'Enter new password');
            pwd.focus();
            return false;
        } else if (false === enoughRegex.test(pwd.value)) {
            flagElement(pwd, 'password must not be less than six characters');
            pwd.focus();
            return false;
        } else if (strongRegex.test(pwd.value)) {
            unFlagElement(pwd);
            alert('Strong Password ');
            return true;
        } else if (mediumRegex.test(pwd.value)) {
            unFlagElement(pwd);
            alert('Password Strenght: Medium');
            return true;
        } else {
            flagElement(pwd, 'Weak Password !!(add mixture of text and numbers)');
            pwd.focus();
            return false;
        }
    }

}



function comFunction() {

    // initNativeBacker();
    initElementDelete();

    function  addEventListenerBackend(event, callback) {
        document.removeEventListener(event, callback, false);
        document.addEventListener(event, callback, false);
    }

    function initNativeBacker() {
        addEventListenerBackend("deviceready", addBackButtonListener);
    }

    function addBackButtonListener() {
        // Register the event listener
        addEventListenerBackend("backbutton", pageBacker);
    }

    function onSrollBottom(divID, callback) {
        $('#' + divID).unbind('scroll');
        $('#' + divID).on('scroll', function () {
            if ($('#' + divID).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                callback();
            }
        });
    }

    function onSrollTop(divID, callback) {
        $('#' + divID).unbind('scroll');
        $('#' + divID).on('scroll', function () {
            if ($('#' + divID).scrollTop() === 0) {
                callback();
            }
        });
    }


    function initElementDelete() {
        Element.prototype.remove = function () {
            this.parentElement.removeChild(this);
        }
        NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
            for (var i = this.length - 1; i >= 0; i--) {
                if (this[i] && this[i].parentElement) {
                    this[i].parentElement.removeChild(this[i]);
                }
            }
        }
    }

    function noRecFound(noSearchId, templateRenderId) {
        hideDivLeft('displayStatusMessage');
        displayDivLeft(noSearchId);
        if (document.getElementById(templateRenderId) !== null) {
            document.getElementById(templateRenderId).innerHTML = '';
        }
    }


    function inappInit() {
        //window.alert = nativealert;
        window.open = cordova.InAppBrowser.open;
        //DygitalME.deviceUUID = device.uuid;

    }

    function slideSubPage(page, callback) {
        loadPage('subPage', page, function () {
            slideLeft('mainScreenBodyContent', 'subPage');
            setTimeout(function () {
                insertPageBacker();
                callback();
            }, 600);
        });
    }

    function insertPageBacker() {
        var allbacker = document.getElementsByClassName('pageBackerButton');
        if (!isNullOrUnDefined(allbacker)) {
            for (var i = 0; i < allbacker.length; ++i) {
                allbacker[i].removeEventListener("click", pageBacker, false);
                allbacker[i].addEventListener("click", pageBacker, false);
            }
        }
    }

    function appendSlidePage() {

    }


    function loadformInputs(parentId, className, jsonObject) {
        var elementClass = document.getElementById(parentId).getElementsByClassName(className);
        var elementClass = document.getElementsByClassName(className);
        var dataBuild = {};
        if (jsonObject !== undefined) {
            for (var i = 0; i < elementClass.length; ++i) {
                var name = elementClass[i].name;
                if (jsonObject.hasOwnProperty(name)) {
                    elementClass[i].value = jsonObject[name];
                    elementClass[i].setAttribute('vaultsValue', jsonObject[name]);
                    dataBuild[elementClass[i].name] = {type: elementClass[i].type};
                    if (containClassFuncClass(elementClass[i].className, 'isMask')) {
                        maskCardNumber(elementClass[i], elementClass[i].id + 'Display');
                    }
                    if ('on' === elementClass[i].value) {
                        var elementType = elementClass[i].type;
                        switch (elementType) {
                            case 'checkbox':
                            {
                                elementClass[i].checked = true;
                                elementClass[i].value = 'on';
                                break;
                            }
                            case 'radio':
                            {
                                elementClass[i].checked = true;
                                break;
                            }
                        }

                    } else {
                        var elementType = elementClass[i].type;
                        switch (elementType) {
                            case 'checkbox':
                            {
                                elementClass[i].checked = false;
                                elementClass[i].value = 'on';
                                break;
                            }
                            case 'radio':
                            {
                                elementClass[i].checked = false;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }



    function pageBacker() {
        setTimeout(function () {
            slideLeft('subPage', 'mainScreenBodyContent');
            setTimeout(function () {
                reInitSwiper();
            }, 100);
        }, 100);
        //document.getElementById('subPage').innerHTML = '';
    }

// checks deploy state.. either running on developer machine or mobile to 
// decide whether or not to call device ready as device ready is only called on device


    function homeDeviceInit() {
        //load css according device plaform ios
        debugAlert('Device is ready');
        try {
            appHomeInit();
            // initPlaformStyle('page');
            //set photo speak objects for photo capture
            //photoSpeak.pictureSource = navigator.camera.PictureSourceType; // picture source
            //photoSpeak.destinationType = navigator.camera.DestinationType; // sets the format of returned value
            //document.addEventListener("resume", onResume, false);
            debugAlert('finished');
        } catch (err) {
            alert(err);
        }
    }

// temporal test for push notification, method to be moved to BO or another class

    var push;

    function pushNotificationInit() {
        debugAlert('initing push notification');
        try {
            push = PushNotification.init({
                android: {
                    senderID: "12345679"
                },
                ios: {
                    alert: "true",
                    badge: "true",
                    sound: "true"
                },
                windows: {}
            });

            push.on('registration', function (data) {
                var regId = data.registrationId;
                debugAlert('push notification registration successful reg id is ' + regId);

            });

            push.on('notification', function (data) {
                // data.message,
                // data.title,
                // data.count,
                // data.sound,
                // data.image,
                // data.additionalData
            });

            push.on('error', function (e) {
                // e.message
            });
        }
        catch (err) {
            debugAlert('push notification error' + err);
        }
    }

    function onResume() {
        //alert('On resume fired');
        if (isNullOrUnDefined(DygitalME.dmValidToken)) {
            alert('Session Expired');
            logout();
        } else {
            logout();
        }
    }

    var sessionOutInit = function () {
        var timeOutObject;
        initTimeOut();
        document.addEventListener("click", function () {
            initTimeOut();
        }, false);

        function teminate() {
            logout();
        }
        function initTimeOut() {
            clearTimeout(timeOutObject);
            timeOutObject = setTimeout(function () {
                teminate();
            }, 600000);
        }
    };

    function swapDivFade(slideOut, slideIn) {
        slide(slideOut, 'fadeOut', slideIn, 'fadeInDown');
    }

    function rightSlide(slideOut, slideIn) {
        slide(slideOut, 'slideOutLeft', slideIn, 'slideInLeft');
    }

    function swapDivRollLeft(slideOut, slideIn) {
        slideWithAnimation(slideOut, 'rotateOutUpRight', slideIn, 'rotateInDownLeft');
    }


    function display(slideIn) {
        $('#' + slideIn).removeClass('hiddenDiv');
        $('#' + slideIn).addClass('displayedDiv');
    }

    function hide(slideIn) {
        $('#' + slideIn).removeClass('displayedDiv');
        $('#' + slideIn).addClass('hiddenDiv');
    }

    function displayDivLeft(slideIn) {
        if (!isNullOrUnDefined(document.getElementById(slideIn))) {
            $('#' + slideIn).removeClass('hiddenDiv');
            $('#' + slideIn).removeClass('slideOutLeft');
            if (!containClassFunc(slideIn, 'slideInLeft')) {
                $('#' + slideIn).addClass('slideInLeft');
            }
        }
    }

    function hideDivLeft(slideIn) {
        if (!isNullOrUnDefined(document.getElementById(slideIn))) {
            $('#' + slideIn).removeClass('slideInLeft');
            $('#' + slideIn).removeClass('slideOutLeft');
            $('#' + slideIn).addClass('slideOutLeft');
            setTimeout(function () {
                $('#' + slideIn).addClass('hiddenDiv');
            }, 500);
        }
    }
    
    function hideVisibility(slideIn) {
        if (!isNullOrUnDefined(document.getElementById(slideIn))) {
            $('#' + slideIn).removeClass('slideInLeft');
            $('#' + slideIn).removeClass('slideOutLeft');
            $('#' + slideIn).addClass('slideOutLeft');
            setTimeout(function () {
                $('#' + slideIn).addClass('hiddenVisibility');
            }, 500);
        }
    }

    function cancelDefaultAction(e) {
        var evt = e ? e : window.event;
        if (evt.preventDefault)
            evt.preventDefault();
        evt.returnValue = false;
        return false;
    }

    function toggleDivDisPlay(slideIn, buttonId, buttonLabelOn, buttonLabelOff) {
        if (containClassFunc(slideIn, 'hiddenDiv')) {
            displayDivLeft(slideIn);
            if (isNullOrUnDefined(buttonLabelOn)) {
                document.getElementById(buttonId).innerHTML = buttonLabelOn;
            }
        } else {
            hideDivLeft(slideIn);
            if (isNullOrUnDefined(buttonLabelOff)) {
                document.getElementById(buttonId).innerHTML = buttonLabelOn;
            }
        }
    }

    function controledChildElementClick(childId, slideIn, slideInEffectClass) {
        //alert($(event.target).attr('class'));
        $('#' + slideIn).removeClass('hiddenDiv');
        $('#' + slideIn).addClass('displayedDiv');
        $('#' + slideIn).addClass(slideInEffectClass);
        $('#' + slideIn).draggable();
    }

    function hide(slideOut, slideOutEffectClass) {
        $('#' + slideOut).removeClass('displayedDiv');
        $('#' + slideOut).addClass(slideOutEffectClass);
        $('#' + slideOut).addClass('hiddenDiv');
    }

    function loadDeviceImei(runningSta) {
        switch (runningSta) {
            case runningState.development :
            {
                deviceImeiInit(device.uuid);
                while (isNullOrUnDefined(getDeviceImei())) {
                    //window.plugins.imeiplugin.getImei(deviceImeiInit);
                    deviceImeiInit(device.uuid);
                    if (!isNullOrUnDefined(getDeviceImei())) {
                        return true;
                    }

                }
            }
            case runningState.production :
            {
                deviceImeiInit(device.uuid);
                while (isNullOrUnDefined(getDeviceImei())) {
                    //window.plugins.imeiplugin.getImei(deviceImeiInit);
                    if (!isNullOrUnDefined(getDeviceImei())) {
                        return true;
                    }
                    deviceImeiInit(device.uuid);
                }
            }
            case runningState.localMachine :
            {
                deviceImeiInit('355033052734102');
                return true;
            }
        }
    }


    function deviceImeiInit(imei) {
        if (imei.toString().length !== 0) {
            debugAlert('gotten device imei *** ' + imei);
            setTemObject(objectDef.mobile_imei, imei);
        } else {
            debugAlert(' cannot save device UUID ** UUID is empty *** ');
        }
    }

    function getDeviceImei() {
        return getTemObject(objectDef.mobile_imei);
    }

    function loadLoginScreen() {
        var loginContent = document.getElementById('tempdisplayHold').innerHTML;
        document.getElementById('defaultScreen').innerHTML = loginContent;
    }

    function initPlaformStyle(page) {
        if ((typeof device !== 'undefined')) {
            var platform = device.platform;
            switch (platform) {
                case 'ios' :
                {
                    var loginContent;
                    {
                        if (page === 'login') {
                            loginContent = '<link rel="stylesheet" href="res/css/platformsCss/dygitalMe.ios.css">';
                        } else {
                            loginContent = '<link rel="stylesheet" href="../res/css/platformsCss/dygitalMe.ios.css">';
                        }
                    }

                    document.getElementById('platformCSS').innerHTML = loginContent;
                }
            }
        } else {
            //alert('device not loaded');
        }
    }

    function loginSreenInit() {
        //alert('device is ready...')
        if (loadDeviceImei(DygitalME.deployState)) {
            addImeiToForm('imeiAppend');
            loadLoginScreen();
            pushNotificationInit();
            // initPlaformStyle('login');
        }
    }

    function loginDevMachineSreenInit() {
        //alert('device is ready...')
        if (loadDeviceImei(DygitalME.deployState)) {
            addImeiToForm('imeiAppend');
            loadLoginScreen();
            initPlaformStyle('login');
        }
    }

    function addImeiToForm(imeiLoc) {
        document.getElementById(imeiLoc).innerHTML = getHiddenHTMLInput(objectDef.mobile_imei, DygitalME.deviceUUID);
    }

    function getHiddenHTMLInput(name, value) {
        return "<br/><input name='" + name.trim() + "' value='" + value.trim() + "' type='hidden'/><br/>";
    }

    function getScreenWithInpercentage(percentage) {
        return ((percentage / 100) * (screen.width));
    }

    function displayDialog(id) {
        var disname = '#' + id;
        $(disname).dialog({
            autoOpen: true,
            modal: true,
            width: getScreenWithInpercentage(80),
            draggable: true,
            resizable: true
        });
    }

    function displayDialog2(id, percentage) {
        var disname = '#' + id;
        $(disname).dialog({
            autoOpen: true,
            modal: true,
            width: 'auto',
            draggable: true,
            resizable: true
        });
    }

    function closeDialog() {
        $(this).closest('.ui-dialog-content').dialog('close');
    }

    function configureAlert() {
        window.old_alert = window.alert;
        window.alert = function (message, fallback) {
            if (fallback)
            {
                old_alert(message);
                return;
            }
            $(document.createElement('div'))
                    .attr({
                        title: 'Alert',
                        'class': 'alert'
                    })
                    .html(message)
                    .dialog({
                        buttons: {
                            OK: function () {
                                $(this).dialog('close');
                            }
                        },
                        close: function () {
                            $(this).remove();
                        },
                        draggable: true,
                        modal: true,
                        resizable: false,
                        width: 'auto'
                    });
        };
    }

    function slide(slideOut, slideOutEffectClass, slideIn, slideInEffectClass) {
        $('#' + slideOut).removeClass(slideInEffectClass);
        $('#' + slideOut).removeClass('displayedDiv');
        $('#' + slideOut).addClass('animated');
        $('#' + slideOut).addClass(slideOutEffectClass);
        $('#' + slideOut).addClass('hiddenDiv');
        $('#' + slideIn).removeClass('hiddenDiv');
        $('#' + slideIn).addClass('displayedDiv');
        $('#' + slideIn).removeClass(slideOutEffectClass);
        $('#' + slideIn).addClass(slideInEffectClass);
    }

    function slideByClass(slideOut, slideOutEffectClass, slideIn, slideInEffectClass) {
        $('.' + slideOut).removeClass(slideInEffectClass);
        $('.' + slideOut).removeClass('displayedDiv');
        $('.' + slideOut).addClass('animated');
        $('.' + slideOut).addClass(slideOutEffectClass);
        $('.' + slideOut).addClass('hiddenDiv');
        $('#' + slideIn).removeClass('hiddenDiv');
        $('#' + slideIn).addClass('displayedDiv');
        $('#' + slideIn).removeClass(slideOutEffectClass);
        $('#' + slideIn).addClass(slideInEffectClass);
    }

    function slideWithAnimation(slideOut, slideOutEffectClass, slideIn, slideInEffectClass) {
        slide(slideOut, slideOutEffectClass, slideIn, slideInEffectClass);
    }

    function zoomSlide(slideOut, slideIn) {
        slide(slideOut, 'zoomOut', slideIn, 'zoomIn');
    }

    function zoomSlideByClass(slideOut, slideIn) {
        slideByClass(slideOut, 'zoomOut', slideIn, 'zoomIn');
    }

    function filterUserDp(dp) {
        if (isNullOrUnDefined(dp)) {
            return '../packages/mygroupapp.assets/images/userPix.png';
        } else {
            return dp;
        }
    }

    function homeScreenSlideUp(slideOut, slideIn) {
        $('#defaultRegisterSection').removeClass('defaultScreenCenterAlign');
        $('#defaultRegisterSection').addClass('defaultScreenTopAlign');
        //hideDivLeft('defaultRegisterSection');
        //displayDivLeft('defaultRegisterSection');
        slideUp(slideOut, slideIn);
    }

    function homeScreenSlideDown(slideOut, slideIn) {
        $('#defaultRegisterSection').removeClass('defaultScreenTopAlign');
        $('#defaultRegisterSection').addClass('defaultScreenCenterAlign');
        // hideDivLeft('defaultRegisterSection');
        //displayDivLeft('defaultRegisterSection');
        slideUp(slideOut, slideIn);
    }

    function slideWithoutAnimation(slideOut, slideOutEffectClass, slideIn, slideInEffectClass) {
        slide(slideOut, slideOutEffectClass, slideIn, slideInEffectClass);
        $('#' + slideOut).removeClass('animated');
        $('#' + slideIn).removeClass('animated');
    }

    function slideLeft(slideOut, slideIn) {
        slide(slideOut, 'slideOutLeft', slideIn, 'slideInRight');
    }

    function slideUp(slideOut, slideIn) {
        slide(slideOut, 'slideOutDown', slideIn, 'slideInUp');
    }

    function slideDown(slideOut, slideIn) {
        slide(slideOut, 'slideOutUp', slideIn, 'slideInDown');
    }

    function simpleLeftSlide(slideOut, slideIn) {
        slideWithoutAnimation(slideOut, 'slideOutLeft', slideIn, 'slideInRight');
    }

    function delayedDivSwap(slideOut, slideIn) {
        $('#' + slideOut).hide();
        $('#' + slideIn).show();
    }

    function slideInSubMenu(slideInID) {
        // $('.sub-menu').addClass('slideOutRight');
        var closeThis = false;
        if (!(containClassFunc(slideInID, 'hiddenDiv'))) {
            closeThis = true;
        }
        $('.sub-menu').addClass('hiddenDiv');
        $('.sub-menu').removeClass('displayedDiv');
        $('.menuItem').removeClass("selectedmenuItem");
        $('#' + slideInID).removeClass('hiddenDiv');
        $('#' + slideInID).addClass('displayedDiv');
        $('#' + slideInID).addClass('flipInX');
        $('#sub-menu').addClass("selectedmenuItem");
        if (closeThis) {
            $('#' + slideInID).addClass('hiddenDiv');
        }
    }
    function hideAllSubMenu() {
        $('.sub-menu').addClass('hiddenDiv');
        $('.sub-menu').removeClass('displayedDiv');
    }
    function menuAccordionFunction(subMenuId) {
        if (containClassFunc(subMenuId, 'hiddenDiv')) {
            $('#' + subMenuId).removeClass('hiddenDiv');
            $('#' + subMenuId).addClass('displayedDiv');
            $('#' + subMenuId).addClass('animated');
            $('#' + subMenuId).addClass('flipInX');
        } else if (containClassFunc(subMenuId, 'displayedDiv')) {
            $('#' + subMenuId).removeClass('displayedDiv');
            $('#' + subMenuId).addClass('animated');
            $('#' + subMenuId).addClass('hiddenDiv');
        }
        $('#sub-menu').addClass("selectedmenuItem");
    }

    function tabItemClick(selectedID, slideInID) {
        $('.swiper-slide').addClass('slideOutRight');
        $('.swiper-slide').addClass('hiddenDiv');
        $('.swiper-slide').removeClass('displayedDiv');
        $('.dmtab').removeClass("activeTabIcon");
        $('#' + slideInID).removeClass('hiddenDiv');
        $('#' + slideInID).addClass('swiper-slide-active');
        $('#' + slideInID).addClass('slideInRight');
        $('#' + selectedID).addClass("activeTabIcon");
    }

    function activeTab(selectedID) {
        $('.dmtab').removeClass("activeTabIcon");
        $('.dmtab').removeClass("inActiveTabIcon");
        $('.dmtab').addClass("inActiveTabIcon");
        $('#' + selectedID).removeClass("inActiveTabIcon");
        $('#' + selectedID).addClass("activeTabIcon");
        setTimeout(function () {
            hideDivLeft(selectedID.substr(0, 1) + 'Alert');
        }, 100);
    }

    function getSwiperWithTabHeader() {
        try {
            return getNewSwiper();
        } catch (err) {
            alert(err);
        }
    }

    function getSwiperWithTabHeaderLoad(tabHeaderClass, triggeredFunction) {
        var swiper = getNewSwiper();
        setClickfunctionOnTabHeaderLoad(tabHeaderClass, swiper, setTabClickSwip, triggeredFunction);
        return swiper;
    }

    function reinitSwiper(swiper) {
        setTimeout(function () {
            swiper.reInit();
        }, 500);
    }

    function swipeEvent(id) {
        var elem = document.getElementById(id);
        if (elem.className === 'swiper-slide swiper-slide-active') {
            activeTab((id + '0'));
            setTimeout(function () {
                hideDivLeft(id + 'Alert');
            }, 100);
        }

    }

    function swipeEventLoad(id, triggerLoad) {
        var elem = document.getElementById(id);
        if (elem.className === 'swiper-slide swiper-slide-active') {
            activeTab((id + '0'));
            triggerLoad(id + '0');
        }

    }




    function setTabClickSwip(parentId, swiper) {
        activeTab(parentId);
        var index = parseInt(parentId.substr(0, 1));
        swiper.slideTo(index, 300, false);
        setTimeout(function () {
            hideDivLeft(index + 'Alert');
        }, 100);
    }

    function setTabClickSwipLoad(parentId, swiper, triggeredFunction) {
        var index = parseInt(parentId.substr(0, 1));
        swiper.slideTo(index, 300, false);
        triggeredFunction(parentId);
    }

    function setClickfunctionOnTabHeader(className, swiperObj, clickFunction) {
        $.each($('.swiper-slide'), function () {
            addClassNameListener(this.id, swipeEvent);
        });
        var classes = document.getElementsByClassName(className);
        for (var i = 0; i < classes.length; i++) {
            var aClass = classes[i];
            var idName = aClass.id.toString();
            var id = document.getElementById(idName);
            id.onclick = function () {
                clickFunction(this.id, swiperObj);
            };
        }
    }

    function setClickfunctionOnTabHeaderLoad(className, swiperObj, clickFunction, triggeredFuntion) {
        var classes = document.getElementsByClassName(className);
        for (var i = 0; i < classes.length; i++) {
            var aClass = classes[i];
            var idName = aClass.id.toString();
            var id = document.getElementById(idName);
            id.onclick = function () {
                clickFunction(this.id, swiperObj, triggeredFuntion);
            };
        }
    }

    function getNewSwiper() {
        var newSwiper = new Swiper('.swiper-container', {
            // pagination: '.swiper-pagination',
            //paginationClickable: true,
            spaceBetween: 30,
            autoHeight: true,
            observer: true,
            onSlideChangeStart: function (swiper) {
                var id = swiper.activeIndex;
                var tabId = id + '0';
                activeTab(tabId);
            }
        });
        function addlisteners(swiper) {
            var slides = swiper.slides;
            for (var i = 0; i < slides.length; ++i) {
                var tabId = i + '0';
                var tabElem = document.getElementById(tabId);
                tabElem.onclick = function () {
                    setTabClickSwip(this.id, swiper);
                };
            }
            initScreenOrientationListener(swiper);

        }
        function addEventListeners(id, event, callBack) {
            if (!isNullOrUnDefined(document.getElementById(id))) {
                document.getElementById(id).removeEventListener(event, callBack, false);
                document.getElementById(id).addEventListener(event, callBack, false);
            }
        }
        function initScreenOrientationListener(swiper) {
            try {
                screen.orientation.lock('any');
                window.addEventListener("orientationchange", function () {
                    reinitSwiper(swiper);
                });
                addEventListenerBackend("resume", function () {
                    reinitSwiper(swiper);
                });
                window.reInitSwiper = function () {
                    reinitSwiper(swiper);
                };
            } catch (err) {
                alert(err);
            }
        }

        function flipScreen() {
            try {
                var currentOrien = screen.orientation.type
                if (currentOrien === 'landscape') {
                    screen.orientation.lock('portrait');
                    screen.orientation.lock('landscape');
                    screen.orientation.lock('any');
                } else if (currentOrien === 'portrait') {
                    screen.orientation.lock('landscape');
                    screen.orientation.lock('portrait');
                    screen.orientation.lock('any');
                }
            } catch (err) {
                console.log(err);
            }
        }


        function reinitSwiper(swiper) {
            try {
                flipScreen();
                swiper.update(true);
                swiper.updateContainerSize();
                var tabId = '00';
                activeTab(tabId);
            } catch (err) {
                console.log(err);
            }
        }
        addlisteners(newSwiper);

        return newSwiper;
    }

    function addClassNameListenerWithTrigger(elemId, callback, triggerLoad) {
        var elem = document.getElementById(elemId);
        var lastClassName = elem.className;
        window.setInterval(function () {
            var className = elem.className;
            if (className !== lastClassName) {
                callback(elemId, triggerLoad);
                lastClassName = className;
            }
        }, 10);
    }

    function addClassNameListener(elemId, callback) {
        var elem = document.getElementById(elemId);
        var lastClassName = elem.className;
        window.setInterval(function () {
            var className = elem.className;
            if (className !== lastClassName) {
                callback(elemId);
                lastClassName = className;
            }
        }, 10);
    }

    function adSlideInit() {
        setInterval(function () {
            adSlideShow();
        }, 5000);
    }

    var adSlidCount = 1;

    function adSlideShow() {
        if (adSlidCount === 1) {
            slideLeft('promotion', 'Commercial');
            ++adSlidCount;
        } else if (adSlidCount === 2) {
            slideLeft('Commercial', 'productAndServices');
            ++adSlidCount;
        } else if (adSlidCount === 3) {
            slideLeft('productAndServices', 'promotion');
            adSlidCount = 1;
        }
    }


    function isNullOrUnDefined(str) {
        return ((str === undefined) || (str === null) || (str.toString().trim() === ''));
    }

    function filterNullOrUnDefined(str) {
        return ((str === undefined) || (str === null) || (str === '0')) ? '' : str;
    }


    function initDashBoard() {
        setTimeout(function () {
            dashboard1.render();
        }, 6000);
    }

    function addClass(className, selected) {
        $('.' + className).addClass(selected);
    }
    
    function removeClassByClass(className, selected) {
        $('.' + className).removeClass(selected);
    }

    function addClassById(id, selected) {
        $('#' + id).addClass(selected);
    }

    function menuClick(slideOut, slideIn) {
        loadPage('menu', 'menu.html');
        // loadPage('footer', 'footer.html');
        swapDivRollLeft(slideOut, slideIn);
    }

    function appHeaderInit() {
        printImage('small-display-picture', getStoredObject('displayPicture'), 'small-profilePix');
        printdisplayName('header-login-name', getStoredObject('displayname'));
    }

    function contactDemo() {
        printImage('myPix', getStoredObject('displayPicture'), 'medium-profilePix');
        printdisplayName('myName', getStoredObject('displayname'));
    }


//    function slideUp(slideOut, slideIn) {
//        $('#' + slideOut).hide('slide', {direction: 'up'}, 500);
//        $('#' + slideIn).show('slide', {direction: 'up'}, 500);
//    }

//    function slideDown(slideOut, slideIn) {
//        $('#' + slideOut).hide('slide', {direction: 'down'}, 500);
//        $('#' + slideIn).show('slide', {direction: 'down'}, 500);
//    }

    function fadedOut() {
        $('#' + slideOut).fadeOut();
    }

    function appInit(event, data) {
        $(window).on("navigate", function (event, data) {
            var direction = data.state.direction;
            if (!!direction) {
                location.reload();
            }
        });
    }

    function loadPageWithEffect(loadLoc, loadPageName) {
        loadPage(loadLoc, loadPageName);
    }

    function renderInputsActive(className) {
        var elementClass = document.getElementsByClassName(className);
        renderClassActive(elementClass);
    }

    function renderClassActive(elementClass) {
        for (var i = 0; i < elementClass.length; ++i) {
            elementClass[i].disabled = false;
            elementClass[i].style.backgroundColor = "#fbfafa";
        }
    }

    function disableElementInputs(className) {
        var elementClass = document.getElementsByClassName(className);
        disableClassElement(elementClass);
    }

    function disableClassElement(elementClass) {
        for (var i = 0; i < elementClass.length; ++i) {
            elementClass[i].disabled = true;
            elementClass[i].style.backgroundColor = "white";
        }
        elementClass[0].focus();
    }

    function getRequestParameter(Key) {
        var url = window.location.href;
        KeysValues = url.split(/[\?&]+/);
        for (i = 0; i < KeysValues.length; i++) {
            KeyValue = KeysValues[i].split("=");
            if (KeyValue[0] === Key) {
                return KeyValue[1];
            }
        }
    }

    function getRequestParameterFromURL(url, Key) {
        KeysValues = url.split(/[\?&]+/);
        for (i = 0; i < KeysValues.length; i++) {
            KeyValue = KeysValues[i].split("=");
            if (KeyValue[0] === Key) {
                return KeyValue[1];
            }
        }
    }

    function setUserSession() {
        DygitalME.dmValidToken = getRequestParameter('dmST');
        DygitalME.deployState = getRequestParameter('runningState');
        sessionOutInit();
    }

    function appHomeInit() {
        // set Dygital me param set with request after successful login from login success function
        loadPage('appHeader', 'appHeader.html');
        loadPage('leftHeader', 'defaultHeader.html');
        loadPage('dashboard', 'dashBoard.html');
        loadPage('proFilePixEdit', 'userProfile/displayPictureEdit.html');
        loadPage('docViewer', 'docViewer.html');
        fastClickInit();
        configureAlert();
        setTimeout(function () {
            slideLeft('spinnerInclude', 'home');
        }, 2000);
    }

    function fastClickInit() {
        window.addEventListener('load', function () {
            new FastClick(document.body);
        }, false);
    }

    function addClassFunc(elementId, className) {
        var element = document.getElementById(elementId);
        element.classList.add(className);
    }

    function removeClassFunc(elementId, className) {
        var element = document.getElementById(elementId);
        element.classList.remove(className);
    }

    function containClassFunc(elementId, cls) {
        var element = document.getElementById(elementId);
        if (!isNullOrUnDefined(element)) {
            return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
        } else {
            return false;
        }
    }

    function containClassFuncClass(className, cls) {
        return (' ' + className + ' ').indexOf(' ' + cls + ' ') > -1;

    }

    function contains(parent, search) {
        if ((!isNullOrUnDefined(parent) && (!isNullOrUnDefined(search)))) {
            return ((parent).indexOf(search) > -1);
        } else {
            return false;
        }
    }

    var LoginedUser = {
        displayPicture: '',
        displayname: ''
    };



    function logAlert() {
        console.log('alert called');
    }

    function loginSucess(json) {
        //genericSpinnerFuntion('spinnerBlock');
        if (json.status === 1) {
            setLoginParam(json);
            window.location = 'app/home.html?dmST=' + DygitalME.dmValidToken + '&runningState=' + DygitalME.deployState;
        } else {
            genericSpinnerFuntion('spinnerBlock');
            alert(json.message);
        }
    }

    function loginFailure(error) {
        genericSpinnerFuntion('spinnerBlock');
        console.log(error);
        alert('Connection failed : Please ensure you have internet access');
    }

    function postLoginForm(formId) {
        if (validatLogin()) {
            genericSpinnerFuntion('spinnerBlock');
            postAjaxForm(formId, loginSucess, loginFailure);
        }
    }

    function validatLogin() {
        var userName = document.getElementById('identity');
        var password = document.getElementById('credential');
        if (validateRequired(userName)) {
            if (valLoginUserName('identity')) {
                if (validateRequired(password)) {
                    return true;
                }
            }
        }
    }

    function flagElementByBoxShaddow(element) {
        element.style.boxShadow = "2px 2px 3px red";
    }

    function unFlagElementByBoxShaddow(element) {
        element.style.boxShadow = "none";
    }



    function validateRequired(element) {
        var elementLength = element.value.length;
        {
            if (elementLength !== 0) {
                element.style.boxShadow = "none";
                return true;
            } else {
                element.style.boxShadow = "2px 2px 3px red";
                element.focus();
                return false;
            }
        }
    }

    function loadHomePage() {
        var loginContent = document.getElementById('tempdisplayHold').innerHTML;
        document.getElementById('defaultScreen').innerHTML = loginContent;
    }
    function initHomePage() {
        $(function () {
            $('#tempdisplayHold').load('home.html');
            setTimeout(function () {
                loadHomePage();
            }, 10000);
        }
        );
    }

    function genericSpinnerFuntion(spinnerId) {
        if (containClassFunc(spinnerId, 'hiddenDiv')) {
            removeClassFunc(spinnerId, 'hiddenDiv');
        } else {
            addClassFunc(spinnerId, 'hiddenDiv');
        }
    }

    function printDefaultHeader() {
        // printdisplayName('loginName', getStoredObject(objectDef.displayname));
        loadPage('profilePix', 'appComponents/displayPicture.html');
    }


    function divToScreenHeight(divId, startAt) {
        var elemClass = document.getElementsByClassName(divId);
        for (var i = 0; i < elemClass.length; ++i) {
            elemClass[i].style.height = screen.height - startAt;
        }
    }

    function divToScreenWidth(divId, startAt) {
        var elemClass = document.getElementsByClassName(divId);
        for (var i = 0; i < elemClass.length; ++i) {
            elemClass[i].style.width = screen.width - startAt;
        }
    }

    function printQrCode(printLocId, printInfo, qrCodeClass) {
        $('#' + printLocId).qrcode(printInfo);
        $('#' + printLocId).addClass(qrCodeClass);
    }

    function printImage(displayDivClass, src, className) {
        if ((src !== undefined) && (src.toString().search('/assets/images/profile_avatar_small.jpg') < 0)) {
            var divs = document.getElementsByClassName(displayDivClass);
            for (var i = 0; i < divs.length; i++) {
                divs[i].innerHTML = '<img src="' + src + '" class="' + className + '" alt="">';
            }
        }
    }

    function printdisplayName(id, name) {
        document.getElementById(id).innerHTML = name;
    }

    function successfulRegistration(json) {
        genericSpinnerFuntion('spinnerBlock');
        if (json.status === 'OK') {
            slideLeft('registerBody', 'loginBody');
            addClassFunc('termsAndConditions', 'hiddenDiv');
            alert('Registration successful, proceed with Login...');
        } else {
            alert(json.message);
        }
        return json;
    }


    function dataFunction(data) {
        alert(data);
    }

    function failFunction(status, error) {
        alert("Status: " + status);
        alert("Error: " + error);
    }



    var count = 1;
    function mainSlideShow() {
        if (count === 1) {
            slideDown('slideOne', 'slideTwo');
            ++count;
        } else if (count === 2) {
            slideLeft('slideTwo', 'slideThree');
            ++count;
        } else if (count === 3) {
            slideRight('slideThree', 'slideFour');
            ++count;
        } else {
            slideUp('slideFour', 'slideOne');
            count = 1;
        }
    }

    function initMainSlide() {
        setInterval(function () {
            mainSlideShow();
        }, 10000);
    }

    function login(formId) {
        postLoginForm(formId);
    }




    function ValidateEmail(email, messageLoc)
    {
        var uemail = document.getElementById(email);
        if (uemail.value.length > 0) {
            var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (uemail !== null && uemail.value.match(mailformat))
            {
                unFlagElement(messageLoc);
                return true;
            }
            else
            {
                flagElement(email, messageLoc);
                uemail.focus();
                return false;
            }
        } else {
            flagElement(email, messageLoc);
            return false;
        }
    }

    function validateEmailWithoutFlagging(email)
    {
        var uemail = document.getElementById(email);
        if (uemail.value.length > 0) {
            var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (uemail !== null && uemail.value.match(mailformat))
            {
                return true;
            }
            else
            {
                uemail.focus();
                return false;
            }
        } else {
            return false;
        }
    }

    function valUserName(email, messageLoc) {
        if (ValidateEmail(email, messageLoc)) {
            //alertMessage("");
            hideThis('valAlert');
            return true;
        } else {
            alertMessage("enter a valid email address");
            return false;
        }
    }

    function valLoginUserName(email) {
        var uemail = document.getElementById(email);
        uemail.value = uemail.value.toString().trim().toLowerCase();
        if (validateEmailWithoutFlagging(email)) {
            unFlagElementByBoxShaddow(uemail);
            return true;
        } else {
            flagElementByBoxShaddow(uemail);
            alertMessage("Please enter a valid DM User Name");
            return false;
        }
    }

    function valEmail(email) {
        var uemail = document.getElementById(email);
        uemail.value = uemail.value.toString().trim().toLowerCase();
        if (validateEmailWithoutFlagging(email)) {
            unFlagElementByBoxShaddow(uemail);
            return true;
        } else {
            flagElementByBoxShaddow(uemail);
            alertMessage("Please enter a valid Email");
            return false;
        }
    }

    function valResetPassword(email, messageLoc) {
        if (ValidateEmail(email, messageLoc)) {
            return true;
        } else {
            alertMessage("enter a valid email address");
            return false;
        }
    }

    function register() {
        if (valUserName('regusername', 'valUserName')) {
            if (validateNewPassword('regpassword', 'valPassword')) {
                if (comparePassword('regpassword', 'regconfirmpassword', 'valconfirmpassword')) {
                    swapDivRollLeft('registerBody', 'termsAndConditions');
                }
            }
        } else {
            // alert('false');
        }
    }

    function resetPassword() {
        if (valResetPassword('resetEmail', 'valResetEmail')) {
            passResetBacker();
        } else {
            // alert('false');
        }
    }

    function appendComponent(componentId, appendId) {

    }

    function printTodebugWindow(message) {
        document.getElementById('debugWindowWriteUp').innerHTML = message;
    }

    function regSuccssful() {
        document.getElementById('loginName').innerHTML = document.getElementById('username').value;
        document.getElementById('displayPicture').innerHTML = '<img src="res/images/dummyUser.png" class="profilePix" alt="">';
        slideLeft('loginIndex', "leftPanel");
    }

    function regFailed() {
        slideLeft('debugWindow', 'loginBody');
        alertMessage('Registration Failed...');
    }

    function validateNewPassword(newPassword, valPassStrength) {
        var strength = document.getElementById(valPassStrength);
        var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).*$", "g");
        var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
        var enoughRegex = new RegExp("(?=.{6,}).*", "g");
        var pwd = document.getElementById(newPassword);
        if (pwd.value.length === 0) {
            alertMessage('Enter new password');
            strength.innerHTML = '*';
            pwd.focus();
            return false;
        } else if (false === enoughRegex.test(pwd.value)) {
            alertMessage('password must not be less than six characters');
            strength.innerHTML = '*';
            pwd.focus();
            return false;
        } else if (strongRegex.test(pwd.value)) {
            hideThis('valAlert');
            hideThis('okAlert');
            strength.innerHTML = '';
            okMessage('Strong Password!');
            return true;
        } else if (mediumRegex.test(pwd.value)) {
            hideThis('valAlert');
            hideThis('okAlert');
            strength.innerHTML = '';
            okMessage('Password Strenght: Medium');
            return true;
        } else {
            alertMessage('Weak Password !!(add mixture of text and numbers)');
            strength.innerHTML = '*';
            pwd.focus();
            return false;
        }
    }



    function printLoadingStatusWithloadingDots(locId, loadingMessage) {
        var print = '<center class="loadingDots"><span>' + loadingMessage + '</span><span><img src="../res/images/loading-dots.gif" style="width: 70px;padding-left: 3px;" alt=""></span></center>';
        document.getElementById(locId).innerHTML = print;
    }

    function distroyLoadingPrint(loadingDots) {
        var loadingClass = document.getElementsByClassName(loadingDots);
        for (var i = 0; i < loadingClass.length; ++i) {
            loadingClass[i].innerHTML = '';
        }
    }

    var currentLoadingDisplay = null;

    function loadingDisplayInit(loadingMessage) {
        loadingMessage = ((loadingMessage === undefined) || (loadingMessage === null)) ? '' : loadingMessage;
        document.getElementById('loadingMessageId').innerHTML = loadingMessage;
        document.getElementById('loadingPrint').style.display = 'block';
        processTime = 0;
        currentLoadingDisplay = setTimeout(function () {
            loadingDisplaydistroy();
            alert('Operation seems to be <br/> taking too long.<br/> Please try again Shortly');
        }, 15000);
    }

    function longProccessloadingDisplayInit(loadingMessage) {
        loadingMessage = ((loadingMessage === undefined) || (loadingMessage === null)) ? '' : loadingMessage;
        document.getElementById('loadingMessageId').innerHTML = loadingMessage;
        document.getElementById('loadingPrint').style.display = 'block';
        processTime = 0;
        currentLoadingDisplay = setTimeout(function () {
            loadingDisplaydistroy();
            alert('Operation seems to be <br/> taking too long.<br/> Please try again Shortly');
        }, 300000);
    }

    function loadingDisplayWithProgressBar(loadingMessage) {
        loadingMessage = ((loadingMessage === undefined) || (loadingMessage === null)) ? '' : loadingMessage;
        document.getElementById('loadingMessageId').innerHTML = loadingMessage;
        document.getElementById('loadingPrint').style.display = 'block';
        document.getElementById('progressBar').style.display = 'block';
    }

    function loadingDisplayWithoutLoadingDotsInit(loadingMessage) {
        document.getElementById('loadingDots').style.display = 'none';
        loadingDisplayInit(loadingMessage);
    }




    function loadingDisplayIsActive() {
        return ((document.getElementById('loadingPrint').style.display) !== 'none');
    }
    function loadingDisplaydistroy() {
        clearTimeout(currentLoadingDisplay);
        document.getElementById('loadingPrint').style.display = 'none';
        document.getElementById('loadingDots').style.display = 'inline';
        document.getElementById('progressBar').style.display = 'none';
    }





    function printLoadingStatus(locId, loadingMessage) {
        var print = '<div><span>' + loadingMessage + '</span></div>';
        document.getElementById(locId).innerHTML = print;
    }



    function comparePassword(newPassword, confirmNewPassword, confirmNewPasswordVal) {
        hideThis('valAlert');
        hideThis('okAlert');
        var newPass = document.getElementById(newPassword).value;
        var confirmNew = document.getElementById(confirmNewPassword).value;
        if (newPass === confirmNew) {
            document.getElementById(confirmNewPasswordVal).innerHTML = '';
            return true;
        } else {
            alertMessage('Confirm password does not match New password');
            document.getElementById(confirmNewPasswordVal).innerHTML = '*';
            document.getElementById(confirmNewPassword).focus();
            return false;
        }
    }
    function printFormElement(formId) {
        var kvpairs = [];
        var form = document.getElementById(formId);
        for (var i = 0; i < form.elements.length; i++) {
            var e = form.elements[i];
            kvpairs.push(encodeURIComponent(e.name) + "=" + encodeURIComponent(e.value));
        }
        var queryString = kvpairs.join("<br/>");
        return queryString;
    }

    function renderElseOnCheck(checkId, renderId) {
        var checked = document.getElementById(checkId).checked;
        if (checked === true) {
            document.getElementById(renderId).style.display = 'block';
        } else {
            document.getElementById(renderId).style.display = 'none';
        }
    }

    function flagElement(element, messageLoc) {
        document.getElementById(messageLoc).innerHTML = "*";
        document.getElementById(element).focus();

    }

    function unFlagElement(messageLoc) {
        document.getElementById(messageLoc).innerHTML = "";
    }
    function registerButtonClick() {
        slideLeft('loginBody', 'registerBody');
        document.getElementById('regtopbacker').style.display = 'block';
    }

    function resetPassButtonClick() {
        slideLeft('loginBody', 'forgotPassword');
        document.getElementById('regtopbacker').style.display = 'block';
    }

    function passResetBacker() {
        slideLeft('forgotPassword', 'loginBody');
        document.getElementById('regtopbacker').style.display = 'none';

    }

    function registerBacker() {
        slideLeft('registerBody', 'loginBody');
        //document.getElementById('regtopbacker').style.display = 'none';

    }

    function hideThis(id) {
        if (document.getElementById(id) !== null) {
            document.getElementById(id).style.display = "none";
        }
    }


    function alertMessage(message) {
        // document.getElementById('valAlert').innerHTML = message;
        //document.getElementById('valAlert').style.display = 'block';
        alert(message);
    }

    function displayAlert(id, message) {
        document.getElementById(id).innerHTML = message;
        document.getElementById(id).style.display = 'block';
    }

    function okMessage(message) {
//    if (document.getElementById('okAlert') !== null) {
//        document.getElementById('okAlert').innerHTML = message;
//        document.getElementById('okAlert').style.display = 'block';
//    }
        alert(message);
    }

    function injectLink(writeUp) {
        document.getElementById("parseHeader").innerHTML = writeUp;
        document.getElementById("parseBody").innerHTML = writeUp;
        slideLeft("leftPanel", "injectBody");
    }

    var lastId = '';

    function edit(changeId) {
        if (lastId.length > 1) {
            lastId = changeId;
        } else {
            reset(lastId);
            lastId = changeId;
        }
        $('#' + changeId).attr("id", "editId");
    }

    function reset(resetId) {
        $('#editId').attr("id", resetId);
    }
    function backer() {
        slideLeft("injectBody", "leftPanel");
    }

    function logout() {
        window.location = '../index.html';
    }



    function customAlert(message, callback, title, buttonName) {
        title = title || "default title";
        buttonName = buttonName || 'OK';
        if (navigator.notification && navigator.notification.alert) {

            navigator.notification.alert(
                    message, // message
                    callback, // callback
                    title, // title
                    buttonName  // buttonName
                    );

        } else {
            //configureAlert();
            window.alert(message);
            callback();
        }

    }

    function nativealert(message) {
        // customAlert(message, dummyFunction, 'DygitalME', 'OK');
    }

    function dummyFunction() {

    }

    function inputClickInit() {
//    var tagName = document.getElementsByTagName('input');
//    var className;
//    for (var i = 0; i < tagName.length; ++i) {
//        (function() {
//            var elemId = new String();
//            var nextId = (Math.random() * i).toString();
//            className = tagName[i].className;
//            if (isValidGeneralInputField(tagName[i])) {
//                var elemId = tagName[i].id;
//                ((elemId === undefined) || (elemId === null) || (elemId.toString().trim() === '')) ? tagName[i].setAttribute("id", nextId) : {};
//                elemId = tagName[i].id;
//                //console.log(elemId);
//                tagName[i].addEventListener("focus", function() {
//                    staticInput('staticInputPrint', elemId);
//                }, false);
//            }
//        }());
//    }
    }

    function textareaClickInit() {
//    var tagName = document.getElementsByTagName('textarea');
//    for (var i = 0; i < tagName.length; ++i) {
//        (function() {
//            var elemId = new String();
//            var nextId = (Math.random() * i).toString();
//            if (isValidGeneralTextAreaField(tagName[i])) {
//                var elemId = tagName[i].id;
//                ((elemId === undefined) || (elemId === null) || (elemId.toString().trim() === '')) ? tagName[i].setAttribute("id", nextId) : {};
//                elemId = tagName[i].id;
//                //console.log(elemId);
//                tagName[i].addEventListener("focus", function() {
//                    staticInput('staticInputPrint', elemId);
//                }, false);
//            }
//        }());
//    }
    }

    function genInputInit() {
//    textareaClickInit();
//    inputClickInit();
    }

    function isValidGeneralInputField(elem) {
        return ((elem.type === 'number') || (elem.type === 'password') || (elem.type === 'text') || (elem.type === 'email') || (elem.type === 'search') || (elem.type === 'tel'));
    }

    function isValidGeneralTextAreaField(elem) {
        return (elem.id !== 'globalInput');
    }


    function staticInput(id, elemId) {
        globalInputElementId = elemId;
        (document.getElementById(globalInputElementId).type === 'password') ? document.getElementById('globalInputType').innerHTML = genInputPassword() : document.getElementById('globalInputType').innerHTML = genInputTextArea();
        document.getElementById('globalInput').value = '';
        document.getElementById(id).style.display = 'block';
        document.getElementById('globalInput').focus();
        document.getElementById('globalInput').value = document.getElementById(globalInputElementId).value;
        //document.getElementById('globalInput').placeholder = inputElement.placeholder;
    }

    function passwordInput(id, elemId) {
        document.getElementById('globalInput').value = '';
        document.getElementById(id).style.display = 'block';
        document.getElementById('globalInput').focus();
        globalInputElementId = elemId;
        document.getElementById('globalInput').value = document.getElementById(globalInputElementId).value;
        //document.getElementById('globalInput').placeholder = inputElement.placeholder;
    }

    function globalInputDone(id) {
        document.getElementById(id).style.display = 'none';
        document.getElementById(globalInputElementId).value = document.getElementById('globalInput').value;
    }

    function genInputTextArea() {
        return '<textarea id="globalInput" name="contract_description" class="globalStaticInput" placeholder=""></textarea>';
    }

    function genInputPassword() {
        return '<input type="password" id="globalInput" class="globalStaticInput"/>';
    }

    function isValidDMDoc(fileName) {
        var exts = ['.jpg', '.jpeg', '.gif', '.png', '.doc', '.docx', '.pdf'];
        var ext = fileName.substr(fileName.lastIndexOf('.'));
        var hasExt = false;
        for (var i = 0; i < exts.length; ++i) {
            try {
                if (ext === exts[i]) {
                    hasExt = true;
                }
            } catch (err) {
                //   alert(err);
            }
        }
        return hasExt;
    }


    function debugAlert(message) {
        if (appFunctionalData.isDebug) {
            alert(message);
        }
    }

    function debugLog(message) {
        if (appFunctionalData.isDebug) {
            console.log(message);
        }
    }

    function toggleSecDisplay(controlId, toggleId) {
        var controlElem = document.getElementById(controlId);
        if (controlElem.checked) {
            displayDivLeft(toggleId);
        } else {
            hideDivLeft(toggleId);
        }
    }

    function singleSelectRadio(thisObj, elemClass) {
        var elemClass = document.getElementsByClassName(elemClass);
        for (var i = 0; i < elemClass.length; ++i) {
            elemClass[i].checked = false;
        }
        document.getElementById(thisObj.id).checked = true;
    }

    function loadPage(loadLoc, loadPageName, callBack) {
        //$('#' + loadLoc).load(loadPageName, callBack);
//        return true;
        $.when(
                $.get(loadPageName, function (data) {
                    $('#' + loadLoc).html(data);
                })
                ).done(function () {
            callBack();
        });
    }

    function createElementFromHTMLString(str) {
        var frag = document.createElement('div');
        var elem = document.createElement('div');
        elem.innerHTML = str;
        var i = 1;
        while (elem.childNodes[i]) {
            frag.appendChild(elem.childNodes[i]);
            ++i;
        }
        return frag;
    }

    function toggleEdit(slideIn) {
        if (containClassFunc(slideIn, 'hiddenDiv')) {
            renderInputsActive('pageInputInactive');
        } else {
            disableElementInputs('pageInputInactive');
        }
    }

    function removeElem(id) {
        var elem = document.getElementById(id);
        return elem.parentNode.removeChild(elem);
    }

    function getToRenderFromTemplate(pageName, templateId, dataSource, callback) {
        loadPage('templateBuildLoad', pageName, function () {
            ((Template7 === undefined) ? Template7 = window.Template7 : {});
            var template = $('#' + templateId).html();
            // compile it with Template7
            var compiledTemplate = Template7.compile(template);
            // Now we may render our compiled template by passing required context
            callback(compiledTemplate(dataSource));
        });
    }


    function triggerTM7butRowClick(id) {
        $('.tab-link').removeClass('active');
        $('#' + id).addClass('active');
        $('.tab').removeClass('active');
        var ref = (document.getElementById(id).href).toString();
        ref = ref.substr((ref.indexOf('#') + 1), ref.length);
        $('#' + ref).addClass('active');
        $('.tabs').css("transform", "translate3d(-" + ((parseInt(ref.charAt(3))) - 1) + "00%, 0px, 0px)");
    }

    return {
        removeElem: removeElem,
        swapDivFade: swapDivFade,
        rightSlide: rightSlide,
        swapDivRollLeft: swapDivRollLeft,
        loadPage: loadPage,
        slideLeft: slideLeft,
        slideUp: slideUp,
        homeScreenSlideUp: homeScreenSlideUp,
        homeScreenSlideDown: homeScreenSlideDown,
        toggleDivDisPlay: toggleDivDisPlay,
        displayDivLeft: displayDivLeft,
        getTabHeaderSwiper: getSwiperWithTabHeader,
        hideDivLeft: hideDivLeft,
        cancelDefaultAction: cancelDefaultAction,
        containClassFunc: containClassFunc,
        containClassFuncClass: containClassFuncClass,
        slideSubPage: slideSubPage,
        pageBacker: pageBacker,
        isNullOrUnDefined: isNullOrUnDefined,
        createElementFromHTMLString: createElementFromHTMLString,
        display: display,
        hide: hide,
        filterUserDp: filterUserDp,
        printImage: printImage,
        toggleEdit: toggleEdit,
        noRecFound: noRecFound,
        renderInputsActive: renderInputsActive,
        disableElementInputs: disableElementInputs,
        contains: contains,
        loadformInputs: loadformInputs,
        onSrollBottom: onSrollBottom,
        onSrollTop: onSrollTop,
        activeTab: activeTab,
        addClassById: addClassById,
        zoomSlideByClass: zoomSlideByClass,
        singleSelectRadio: singleSelectRadio,
        getToRenderFromTemplate: getToRenderFromTemplate,
        triggerTM7butRowClick: triggerTM7butRowClick,
        removeClassByClass:removeClassByClass,
        hideVisibility:hideVisibility
    };

    function isDate(txtDate)
    {
        var currVal = txtDate;
        if(currVal == '')
            return false;
        //Declare Regex
        var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
        var dtArray = currVal.match(rxDatePattern); // is format OK?
        if (dtArray == null)
            return false;
        //Checks for mm/dd/yyyy format.
        dtMonth = dtArray[1];
        dtDay= dtArray[3];
        dtYear = dtArray[5];
        if (dtMonth < 1 || dtMonth > 12)
            return false;
        else if (dtDay < 1 || dtDay> 31)
            return false;
        else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31)
            return false;
        else if (dtMonth == 2)
        {
            var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
            if (dtDay> 29 || (dtDay ==29 && !isleap))
                return false;
        }
        return true;
    }

}
;

