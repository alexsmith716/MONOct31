var helper = {
    init: function() {
        $.cookie('userLocation', '', { path: '/' });
        window.showLoading = function() {
            $('.modal-backdrop').show();
        };
        window.hideLoading = function() {
            $('.modal-backdrop').hide();
        };
        showLoading();
        $('label[for="canadianMsg"]').hide();
        $('input[data-widget="zip-field"]').off('change');
        $('input[data-widget="zip-field"]').unbind('change');

        var code = helper.getCookies('__pcode'); 
        if (code == '' || code == undefined || code == null || code == 'undefined') {
            helper.getProgramList();
        } else {
            helper.getProgramType(code);
        }
        var ktpa = helper.getCookies('_KTPA');
        var ktpaConfirm = helper.getCookies('_KTPA_CONFIRM');

        if (ktpa && ktpaConfirm) {
            $('.loading').show();
            ktpa = encodeURI(ktpa);
            var params = {
                ktpaCookie: ktpa,
                ktpaConfirmCookie: ktpaConfirm
            };
            helper.getUserDataOnLoad(params);
            helper.unBindFields();
            if ($('.shippingAddress').is(":visible")) {
                $('#samebillShip').prop('checked', false);
            } else {
                $('#samebillShip').prop('checked', true);
            }
            $('.loading').hide();
        } else {
            helper.getCountries([{element: 'country', defaultValue: ''}, {element: 'shippingCountry', defaultValue: ''}]);
            helper.getStates([{element: 'state', defaultValue: ''}, {element: 'shippingState', defaultValue: ''}, {element: 'mbeState', defaultValue: ''}, , {element: 'currentSchoolState', defaultValue: ''}]);
            helper.getGradYear([{element: 'gradYear', defaultValue: ''}]);
            setTimeout(function() {
                hideLoading();}, 1000);
            $('[name="email"]').prop('required', true);
            $('[name="confirmEmail"]').prop('required', true);
            $('[name="password"]').prop('required', true);
            $('[name="confirmPassword"]').prop('required', true);
            if ($('.shippingAddress').is(":visible")) {
                $('#samebillShip').prop('checked', false);
            } else {
                $('#samebillShip').prop('checked', true);
            }
            //Raygun New user
            if (("RaygunObject" in window) && (RaygunObject == 'rg4js')) {
                rg4js('setUser', {
                    identifier: helper.getCookies('__cartID'),
                    isAnonymous: true,
                    email: '?',
                    firstName: '?',
                    fullName: '?'
                });
            }
        }
        $('.additional-info .addlReq').prop('required', true);
        $("[name='samebillShip']").on('change', function() {
            $('.shippingAddress').toggleClass('hidden');
            if ($('.shippingAddress').hasClass('hidden')) {
                $('.shippingAddress .reqAttr').prop('required', false);
                helper.validatePOBox('streetAddress');
                helper.validatePOBox('apt');
                $(this).val('TRUE');
            } else {
                helper.unBindField('streetAddress');
                helper.unBindField('apt');
                $('.shippingAddress .reqAttr').prop('required', true);
                $('.shippingAddress').find('input:text').val('');
                $('.shippingAddress').find('#shippingPhoneNumber').val('');
                $('.shippingAddress').find('select').val('');
                $(this).val('FALSE');
            }
        });

        $('#addLschoolName').hide();
        $('#currentSchoolName').prop('disabled', true);
        $('#amaMeNumberField').hide();
        $('#canadaPermResidentChecked').hide();
        //initializes jquery event handlers
        helper.initializeJqueryEvents();
    },
    
    initializeJqueryEvents:  function(){
        $('#streetAddress').on('change', function() {
            if ($('#samebillShip').length && $('.shippingAddress').hasClass('hidden')) {
                var pattern = /\bP(ost|ostal)?([ \.]*(O|0)(ffice)?)?([ \.]*Box)?\b/i;
                if(pattern.test($(this).val())){
                    if (is_safari) {
                        $('#streetAddressInvalid').removeClass('hide').addClass('show');
                    } else {
                        $(this).get(0).setCustomValidity("We do not ship to PO Boxes");
                    }
                } else {
                    if (is_safari) {
                        $('#streetAddressInvalid').removeClass('show').addClass('hide');
                    } else {
                        $(this).get(0).setCustomValidity('');
                    }
                }
            } else {
                if (is_safari) {
                    $('#streetAddressInvalid').removeClass('show').addClass('hide');
                } else {
                    $(this).get(0).setCustomValidity('');
                }
            }
        });
        $('#apt').on('change', function() {
            if ($('#samebillShip').length && $('.shippingAddress').hasClass('hidden')) {
                var pattern = /\bP(ost|ostal)?([ \.]*(O|0)(ffice)?)?([ \.]*Box)?\b/i;
                if(pattern.test($(this).val())){
                    if (is_safari) {
                        $('#aptInvalid').removeClass('hide').addClass('show');
                    } else {
                        $(this).get(0).setCustomValidity("We do not ship to PO Boxes");
                    }
                } else {
                    if (is_safari) {
                        $('#aptInvalid').removeClass('show').addClass('hide');
                    } else {
                        $(this).get(0).setCustomValidity('');
                    }
                }
            } else {
                if (is_safari) {
                    $('#aptInvalid').removeClass('show').addClass('hide');
                } else {
                    $(this).get(0).setCustomValidity('');
                }
            }
        });
        $('#shippingStreetAddress').on('change', function() {
            if (!$('.shippingAddress').hasClass('hidden')) {
                var pattern = /\bP(ost|ostal)?([ \.]*(O|0)(ffice)?)?([ \.]*Box)?\b/i;
                if(pattern.test($(this).val())){
                    if (is_safari) {
                        $('#shippingAddressInvalid').removeClass('hide').addClass('show');
                    } else {
                        $(this).get(0).setCustomValidity("We do not ship to PO Boxes");
                    }
                } else {
                    if (is_safari) {
                        $('#shippingAddressInvalid').removeClass('show').addClass('hide');
                    } else {
                        $(this).get(0).setCustomValidity('');
                    } 
                }
            } else {
                if (is_safari) {
                    $('#shippingAddressInvalid').removeClass('show').addClass('hide');
                } else {
                    $(this).get(0).setCustomValidity('');
                } 
            }
        });
        $('#shippingApt').on('change', function() {
            if (!$('.shippingAddress').hasClass('hidden')) {
                var pattern = /\bP(ost|ostal)?([ \.]*(O|0)(ffice)?)?([ \.]*Box)?\b/i;
                if(pattern.test($(this).val())){
                    if (is_safari) {
                        $('#shippingAptInvalid').removeClass('hide').addClass('show');
                    } else {
                        $(this).get(0).setCustomValidity("We do not ship to PO Boxes");
                    }
                } else {
                    if (is_safari) {
                        $('#shippingAptInvalid').removeClass('show').addClass('hide');
                    } else {
                        $(this).get(0).setCustomValidity('');
                    }
                }
            } else {
                if (is_safari) {
                    $('#shippingAddressInvalid').removeClass('show').addClass('hide');
                } else {
                    $(this).get(0).setCustomValidity('');
                } 
            }
        });
        $("#zip").alphanum();
        $("#shippingZip").alphanum();
        $("[name='zip']").on('change', function() {
            $.cookie('userLocation', '', { path: '/' });
            var state = $('#state').val();
            if (helper.validateZip($(this).val(), state)) {
                if (is_safari) {
                    $('#billzipinvalid').removeClass('show').addClass('hide');
                } else {
                    $(this).get(0).setCustomValidity('');
                }
                KL.info("ValidZip", $(this).val());
                return true;
            } else {
                if (is_safari) {
                    $('#billzipinvalid').removeClass('hide').addClass('show');
                } else {
                    $(this).get(0).setCustomValidity("Please enter a valid Zip/Postal Code");
                }
                KL.warn("ValidZip", $(this).val());
                return false;
            }
        });

        $("[name='shippingZip']").on('change', function() {
            $.cookie('userLocation', '', { path: '/' });
            var state = $('#shippingState').val();
            if (helper.validateZip($(this).val(), state)) {
                if (is_safari) {
                    $('#shipzipinvalid').removeClass('show').addClass('hide');
                } else {
                    $(this).get(0).setCustomValidity('');
                }                
                KL.info("ValidShippingZip", $(this).val());
                return true;
            } else {
                if (is_safari) {
                    $('#shipzipinvalid').removeClass('hide').addClass('show');
                } else {
                    $(this).get(0).setCustomValidity("Please enter a valid Zip/Postal Code");
                }
                KL.warn("ValidShippingZip", $(this).val());
                return false;
            }
        });

        $('#currentSchoolState').on('change', function() {
            $('#currentSchoolName').removeClass('hide').prop('required', 'required');
            $('#schoolName').addClass('hide').prop('required', false);
            var _pcode = $('#programOfInterest').val() == undefined ? helper.getCookies('__pcode') : $('#programOfInterest').val(); //'4600010';
            var state = $('#currentSchoolState').val() == '' ? $('#state').val() : $('#currentSchoolState').val();
            if (_pcode != '' && state != '') {
                helper.getCurrentSchoolName(_pcode, state, '');
            } else {
                $('#currentSchoolName').prop('disabled', 'disabled');
                KL.info("currentSchoolState", "disabled");
            }
        });

        $('#programOfInterest').on('change', function() {
            var type = $('#programOfInterest option:selected').attr('type');
            //resets all hidden elements
            $('.mbe-section').addClass('hidden');
            $('.additional-info .no-addl').removeClass('hidden');
            $('.additional-info .addlReq').prop('required', true);
            $('.med').addClass('hidden');
            $('#parent-account-details').addClass('hidden');
            $('#parent-account-details .form-control').prop('required', false);
            $('#currentSchoolState').removeClass('hide').val('');
            $('#currentSchoolName').prop('disabled', 'disabled');
            $('#currentSchoolName').html('<option value="">Name of Current School/Alma Mater</option>');
            $('#amaMeNumberField').hide();
            $('#currentSchoolName').removeClass('hide').prop('required', 'required');
            $('#schoolName').addClass('hide').prop('required', false);
            $('input[name=medRadio]').prop('checked', '');
            switch (type) {
                case 'mbe':
                    $('.mbe-section').removeClass('hidden');
                    $('#mbeState').prop('required', true);
                    KL.info("programOfInterest", type);
                    break;
                case 'addl':
                    $('.additional-info .no-addl').addClass('hidden');
                    $('.additional-info .addlReq').prop('required', false);
                    KL.info("programOfInterest", type);
                    break;
                case 'med':
                    $('.med').removeClass('hidden');
                    $('#medRadio').prop('required', true);
                    KL.info("programOfInterest", type);
                    break;
                case 'precollege':
                    $('#parent-account-details').removeClass('hidden');
                    $('#parent-account-details .form-control').prop('required', 'required');
                    KL.info("programOfInterest", type);
                    break;
            }
            //on programOfInterest change, pcode is updated to drop-down selection value
            var pcode = helper.getCookies('__pcode');
            var domain = document.domain.split('.');
            helper.setCookie('__pcode',$('#programOfInterest').val(),"","."+domain[domain.length-2]+"."+domain[domain.length-1]);
        });

        $('input[name=medRadio]').on('change', function(e) {
            var val = $(this).val();
            helper.checkMedSchoolValue(val);
        });

        $('#currentSchoolName').on('change', function() {
            var schoolNotinList = $('#currentSchoolName').val() == '1';
            if (schoolNotinList == true) {
                $('#addLschoolName').show();
                KL.info("currentSchoolName", "Not selected");
            } else {
                $('#addLschoolName').hide();
                KL.info("currentSchoolName", "Selected");
            }
        });

        $('#idontknowmytestDate').on('change', function() {
            if ($(this).hasClass('checked')) {
                $(this).removeClass('checked');
                $('#test-date-input').prop('disabled', '');
                KL.info("idontknowmytestDate", "NOT checked");
            } else {
                $(this).addClass('checked');
                $('#test-date-input').prop('disabled', 'disabled');
                $('#test-date-input').val("");
                KL.info("idontknowmytestDate", "Checked");
            }
        });

        $("[name='parentConfirmEmail']").on('change', function() {
            helper.validateParams('parentEmail', 'parentConfirmEmail');
        });

        $("input[name=canadaPermResident]:radio").change(function () {
            var val = $('input[name=canadaPermResident]:checked').val();
            if (val == 'true'){
                $('#canadaPermResidentChecked').show();
                $('label[for="nonCanadianMsg"]').hide();
                $('label[for="canadianMsg"]').show();
            } else {
                $('#canadaPermResidentChecked').hide();
                $('label[for="nonCanadianMsg"]').show();
                $('label[for="canadianMsg"]').hide();
            }
        });

        $("[name='sendMarketingEmail']").on('change', function() {
            if($(this).val() == 'true'){
                $(this).val('false');
            } else{
                $(this).val('true');
            }
        });

        $('#loginForm').on('submit', function(e) {
            e.preventDefault();
            showLoading();
            $('#formSignIn .form-control').removeClass('has-error');
            $('.loginerror').addClass('hide');
            $('.login-form-has-error').addClass('hide');
            var serviceUrl = $(this).attr('action'),
                data = {},
                result = true,
                email = $('#login-email').val(),
                password = $('#login-password').val();
            if (email == '' || password == '') {
                $('#formSignIn .form-control').addClass('has-error');
                $('.loginerror').removeClass('hide');
                KL.warn("loginForm", "user login error with: " + email);
                return false;
            }
            if ($('#rememberMe').prop('checked')) {
                data = {
                    email: email,
                    password: password,
                    rememberMe: 'true'
                };
                KL.info("rememberMe", "rememberMe checked");
            } else {
                data = {
                    email: email,
                    password: password
                };
                KL.info("rememberMe", "rememberMe not checked");
            }
            $.ajax({
                url: serviceUrl,
                type: 'POST',
                data: JSON.stringify(data),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                accept: 'application/json',
                success: function(data) {
                    if (data.response == 'success' && data.user) {
                        helper.hideFields(data.user.firstName);
                        helper.bindUserData(data.user);
                        KL.info("loginForm", "user login successful " + email);
                        helper.getCountries([{element: 'country', defaultValue: data.user.country}, {element: 'shippingCountry', defaultValue: data.user.shippingCountry}]);
                        helper.getStates([{element: 'state', defaultValue: data.user.state}, {element: 'shippingState', defaultValue: data.user.shippingState}, {element: 'mbeState', defaultValue: data.user.mbeState}, , {element: 'currentSchoolState', defaultValue: data.user.schoolState}]);
                        helper.getGradYear([{element: 'gradYear', defaultValue: data.user.graduationYear}]);
                        helper.getCurrentSchoolName('', data.user.schoolState, data.user.schoolId ); 
                        if (helper.checkEmptyString(data.user.testDate) == null) {
                            $('#idontknowmytestDate').click(); //.prop('checked', true);
                            $('#test-date-input').prop('disabled', 'disabled');
                        }
                        helper.unBindFields();
                        hideLoading();
                    } else {
                        if (data.response.response === 'Invalid Email Address/Password combination') {
                            $('#formSignIn .form-control').addClass('has-error');
                            $('.loginerror').removeClass('hide');
                            KL.warn("loginForm", email);
                        } else {
                            $('#formSignIn .form-control').addClass('has-error');
                            $('.login-form-has-error').removeClass('hide');
                        }
                        hideLoading();
                        KL.error("loginForm", "user login error with: " + email); 
                        return false;
                    }
                }
            });
        });

        $('#forgot-password').on('click', function(e) {
            e.preventDefault();
            $('.emaildeco').removeClass('has-error');
            $('.emaildeco-error').removeClass('show').html('');
            var serviceUrl = '/rest-services/userLogin/forgotPassword';
            data = {},
            emaildeco = $('#emaildeco').val();
            if (emaildeco == '') {
                $('.emaildeco').addClass('has-error');
                $('.emaildeco-error').addClass('show').html('Please enter email');
                KL.warn("forgot-password", "user didn't enter email");
                return false;
            }
            if (!helper.validateEmail(emaildeco)) {
                $('.emaildeco').addClass('has-error');
                $('.emaildeco-error').addClass('show').html('Please enter your valid email');
                KL.warn("forgot-password", "user enter invalid email " + emaildeco);
                return false;
            }
            $('.loading').show();
            data = {
                "email": emaildeco
            };

            $.ajax({
                url: serviceUrl,
                type: 'POST',
                data: JSON.stringify(data),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                accept: 'application/json',
                success: function(data) {

                    if (data.response == 'success') {
                        $('.alert-warning').show();
                        $('.loading').hide();
                        KL.info("forgot-password", "successful recovery password with " + emaildeco);
                    } else {
                        $('.emaildeco').addClass('has-error');
                        $('.emaildeco-error').addClass('show').html('Could not validate your email.');
                        $('.loading').hide();
                        KL.error("forgot-password", "Could not validate your email" + emaildeco);
                        return false;
                    }
                },
                error: function(xhr, status) {

                    $('.emaildeco').addClass('has-error');
                    $('.emaildeco-error').addClass('show').html('Could not validate your email.');
                    $('.loading').hide();
                    KL.error("forgot-password", "Could not validate your email" + status);
                    return false;
                },
                beforeSend: function() {
                    $('#emaildeco').val(emaildeco);
                }
            });
        });

        $('#emaildeco').on('keypress', function(e) {
            var key = e.keyCode;
            if (key === 13) {
                $('#emaildeco').val();
                $('#forgot-password').click();
            }
        });

        $('#main-form').on('submit', function(e) {
            if (is_safari && $('.error:visible').length > 0) {
                return false;
            } else {
                showLoading();
                var serviceUrl = $(this).attr('action');
                $('.main-error-message').addClass('hide');
                var data = helper.postData();
                $.ajax({
                    url: serviceUrl,
                    type: 'POST',
                    data: JSON.stringify(data),
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    accept: 'application/json',
                    error: function(xhr, status) {
                        hideLoading();
                        $('.main-error-message').removeClass('hide');
                        KL.error("registationSubmit", "registation error" + status);
                        return false;
                    },
                    success: function(data) {
                        if (data.response == 'OK') {
                            KL.info("registationSubmit", data.response);
                            //Raygun Logged In User
                            if (("RaygunObject" in window) && (RaygunObject == 'rg4js')) {
                                rg4js('setUser', {
                                    identifier: helper.getCookies('__cartID'),
                                    isAnonymous: false,
                                    email: $('#email').val(),
                                    firstName: $('#firstName').val(),
                                    fullName: $('#firstName').val() + ' ' + $('#lastName').val()
                                });
                            }
                            location.href = decodeURIComponent(data.redirectUrl);
                            hideLoading();
                        } else {
                            $('.main-error-message').removeClass('hide');
                            hideLoading();
                            KL.error("registationSubmit", data.response);
                            return false;
                        }
                    }
                });
                return false;
            }
        });
    },

    unBindField: function(id) {
        $('#' + id).off('change');
        $('#' + id).unbind('change');
        $('#' + id).get(0).setCustomValidity('');
    },

    unBindFields: function() {
        $('#email').get(0).setCustomValidity('');
        $('#email').prop('required', false);
        $('#email').off('change');
        $('#email').unbind('change');
        $('#email').removeAttr('onchange'); 

        $('#confirmEmail').get(0).setCustomValidity('');
        $('#confirmEmail').prop('required', false);
        $('#confirmEmail').off('change');
        $('#confirmEmail').unbind('change');
        $('#confirmEmail').removeAttr('onchange');

        $('#password').get(0).setCustomValidity('');
        $('#password').prop('required', false);
        $('#password').off('change');
        $('#password').unbind('change');
        $('#password').removeAttr('onchange');

        $('#confirmPassword').get(0).setCustomValidity('');
        $('#confirmPassword').prop('required', false);
        $('#confirmPassword').off('change');
        $('#confirmPassword').unbind('change');
        $('#confirmPassword').removeAttr('onchange');
    },

    clearForgotPassword: function() {
        $('.alert-warning').hide();
        $('.emaildeco').removeClass('has-error');
        $('.emaildeco-error').removeClass('show').html('');
        $('#emaildeco').val('');
    },

    URL: {
        countryListServiceURL: '/rest-services/countryList',
        stateListServiceURL: '/rest-services/leadRegistration/stateList',
        fetchRegisteredUserURL: '/rest-services/studentRegistration/fetchRegisteredUser',
        graduationYearServiceURL: '/rest-services/leadRegistration/graduationYears',
        programServiceURL: '/rest-services/leadRegistration/programs',
        schoolServiceURL: '/rest-services/leadRegistration/schoolList',
        registerUserURL: '/rest-services/studentRegistration/registerUser',
        validateRegisteredUserURL: '/rest-services/studentRegistration/validateRegisteredUser'
    },

    getCountries: function(countryListData) {
        $.ajax({
            url: helper.URL.countryListServiceURL,
            dataType: 'json',
            success: function(data) {
                KL.info("getCountries", "Loaded");
                if (data != null && data.countries.length > 0) {
                    _.each(countryListData, function(item) {
                        helper.rederTemplate(item.element, 'country-list', {
                            data: data.countries,
                            defaultValue: item.defaultValue
                        });
                    });
                }
            },
            error: function(xhr, status) {
                KL.error("getCountries", status);
            }
        });
    },

    validateRegisteredUserService: function(email) {
        var result;
        $.ajax({
            url: helper.URL.validateRegisteredUserURL + '?email=' + email,
            dataType: 'json',
            async: false,
            success: function(data) {
                if (data != null && data.response == 'OK') {
                    result = true;
                    KL.info("validateRegisteredUserService", email + " " + data.response);
                } else {
                    result = false;
                    KL.error("validateRegisteredUserService", "Can NOT validate user with following email: " + email);
                }
            }
        });
        return result;
    },

    getStates: function(stateListData) {
        $.ajax({
            url: helper.URL.stateListServiceURL,
            dataType: 'json',
            success: function(response) {
                KL.info("getStates", "Loaded");
                if (response != null && response.data != null) {
                    _.each(stateListData, function(item) {
                        helper.rederTemplate(item.element, 'state-list', {
                            data: response.data,
                            defaultValue: item.defaultValue
                        });
                    });
                }
            },
            error: function(xhr, status) {
                KL.error("getStates", status);
            }
        });
    },

    getGradYear: function(gradYear) {
        $.ajax({
            url: helper.URL.graduationYearServiceURL,
            dataType: 'json',
            success: function(response) {
                KL.info("getGradYear", "loaded");
                if (response != null && response.data != null) {
                    _.each(gradYear, function(item) {
                        helper.rederTemplate(item.element, 'grad-year', {
                            data: response.data,
                            defaultValue: item.defaultValue
                        });
                    });
                }
            },
            error: function(xhr, status) {
                KL.error("getGradYear", status);
            }
        });
    },

    getCurrentSchoolName: function(_pcode, state, schoolId) {
        var _pcode = $('#programOfInterest').val() == undefined ? helper.getCookies('__pcode') : $('#programOfInterest').val();
        $.ajax({
            url: '/rest-services/leadRegistration/schoolList?programOfInterestId=' + _pcode + '&state=' + state,
            dataType: 'json',
            success: function(response) {
                KL.info("getCurrentSchoolName", "loaded");
                if (response != null && jQuery.isEmptyObject(response.data) == false && state !== 'internationalMedSchool') {
                    var data = response.data;
                    var html = _.template($('#current-school-name').html(),{
                        data: data
                    });
                    $('#currentSchoolName').prop('disabled', '');
                    $('#currentSchoolName').html(html);
                    if (schoolId != '') {
                        $('#currentSchoolName').val(schoolId);
                    }
                } else {
                    $('#currentSchoolName').addClass('hide').prop('required', false);
                    $('#schoolName').removeClass('hide').prop('required', 'required');
                    /*if ($('#currentSchoolName option').length === 1) {
                        $('#currentSchoolName').addClass('hide').prop('required', false);
                        $('#schoolName').removeClass('hide').prop('required', 'required');
                    }*/
                }
            },
            error: function(xhr, status) {
                KL.error("getCurrentSchoolName", status);
            }
        });
    },

    getProgramList: function() {
        $.ajax({
            url: helper.URL.programServiceURL,
            dataType: 'json',
            success: function(response) {
                KL.info("getProgramList", "loaded");
                if (response != null && response.data != null) {
                    $('#programOfInterest').html(_.template($('#program-of-interest').html(), {
                        data: response.data
                    }));
                }
            },
            error: function(xhr, status) {
                KL.error("getProgramList", status);
            }
        });
    },

    rederTemplate: function(elementId, template, data) {
        $('#' + elementId).html(_.template($('#' + template).html(), data));
        if (elementId == 'mbeState') {
            $('#mbeState option').eq(0).text('I plan on taking the bar exam for the state of');
            $('#mbeState option[value=non-us-ca]').remove();
            $('#mbeState option[value=separator]').remove();
        };
        $('#currentSchoolState option').eq(0).text('State/Province of Current School/Alma Mater');
    },

    getProgramType: function(id) {
        $.ajax({
            url: '/rest-services/leadRegistration/programs',
            dataType: 'json',
            success: function(response) {
                $('#programOfInterest').hide();
                if (response != null && response.data != null) {
                    var programs = response.data;
                    for (var i = 0; i < programs.length; i++) {
                        if (programs[i].id == id) {
                            $('#programType').val(programs[i].type);
                            switch (programs[i].type) {
                                case 'mbe':
                                    $('.mbe-section').removeClass('hidden');
                                    $('#mbeState').prop('required', true);
                                    KL.info("getProgramType", programs[i].type);
                                    break;
                                case 'addl':
                                    $('.additional-info .no-addl').addClass('hidden');
                                    $('.additional-info .addlReq').prop('required', false);
                                    KL.info("getProgramType", programs[i].type);
                                    break;
                                case 'med':
                                    $('.med').removeClass('hidden');
                                    KL.info("getProgramType", programs[i].type);
                                    break;
                                case 'precollege':
                                    $('#parent-account-details').removeClass('hidden');
                                    $('#parent-account-details .form-control').prop('required', 'required');
                                    KL.info("getProgramType", programs[i].type);
                                    break;
                            }
                        }
                    }
                }
            },
            error: function(xhr, status) {
                KL.error("getProgramType", status);
            }
        });
    },

    validateRegisteredUser: function(email, field) {
        var property1 = document.getElementsByName(field)[0];
        var result = helper.validateRegisteredUserService(email);
        if (result) {
            property1.setCustomValidity("It seems your email address is already in our system. Sign in, or enter a new email address");
            KL.error("validateRegisteredUser", email + " already existed");
            return false;
        } else {
            property1.setCustomValidity('');
            KL.info("validateRegisteredUser", email);
            return true;
        }
    },

    showLoading: function() {
        $('.modal-backdrop').show();
    },

    hideLoading: function() {
        $('.modal-backdrop').hide();
    },

    getUserDataOnLoad: function(params) {
        var serviceUrl = helper.URL.fetchRegisteredUserURL + '?ktpaCookie=' + params.ktpaCookie + '&ktpaConfirmCookie=' + params.ktpaConfirmCookie;
        $.ajax({
            url: serviceUrl,
            type: 'POST',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            accept: 'application/json',
            success: function(data) {
                KL.info("getUserDataOnLoad", params.ktpaCookie + " " + data.response);
                if (data.response == 'success' && data.user) {
                    helper.hideFields(data.user.firstName);
                    helper.bindUserData(data.user);
                    helper.getCountries([{element: 'country', defaultValue: data.user.country}, {element: 'shippingCountry', defaultValue: data.user.shippingCountry}]);
                    helper.getStates([{element: 'state', defaultValue: data.user.state}, {element: 'shippingState', defaultValue: data.user.shippingState}, {element: 'mbeState', defaultValue: data.user.mbeState}, , {element: 'currentSchoolState', defaultValue: data.user.schoolState}]);
                    helper.getGradYear([{element: 'gradYear', defaultValue: data.user.graduationYear}]);
                    var medSchoolValue = data.medSchoolValue === '' || data.medSchoolValue === null || data.medSchoolValue === undefined ? helper.getCookies('__medSchoolValue') : data.medSchoolValue;
                    if (medSchoolValue == '5') {
                        helper.getCurrentSchoolName('', 'internationalMedSchool', data.user.schoolId ); 
                    } else {
                        helper.getCurrentSchoolName('', data.user.schoolState, data.user.schoolId ); 
                    }
                    if (helper.checkEmptyString(data.user.testDate) == null) {
                        $('#idontknowmytestDate').click(); //.prop('checked', true);
                        $('#test-date-input').prop('disabled', 'disabled');
                    }
                }
                helper.unBindFields();
                helper.hideLoading();
            },
            error: function(xhr, status) {
                helper.hideLoading();
                KL.error("getUserDataOnLoad", params.ktpaCookie + " " + status);
            }
        });
    },

    hideFields: function(firstName) {
        $('#newHere').addClass('hide');
        $('#page-header h3').html('Welcome Back, ' + firstName).addClass('beta');
        $('p.account-message').html('<strong>Please verify your account information</strong>');
        $('p.sub-title').html('');
        $('[name="email"]').hide();
        $('[name="confirmEmail"]').hide();
        $('[name="password"]').hide();
        $('[name="confirmPassword"]').hide();
        $('[name="email"]').prop('required', false);
        $('[name="confirmEmail"]').prop('required', false);
        $('[name="password"]').prop('required', false);
        $('[name="confirmPassword"]').prop('required', false);
        $('#login-widget').addClass('hide');
        return null;
    },

    prePopulateCountry: function(state, field, field2, field3) {
        var clone = $('#' + field2).clone();
        if (state != undefined && state != null && state != '') {
            var mask = '(000) 000-0000';
            if (state == 'non-us-ca') {
                $('#' + field2).replaceWith(clone);
                helper.getCountries([{element: field, defaultValue: ""}]);
                $('#' + field2).val('');
                $('#' + field2).prop('required', true);
                 if(field == 'country'){
                   // $('input:radio[name=canadaPermResident]:nth(1)').attr('checked',true);
                    $('input:radio[name=canadaPermResident]')[1].checked = true;
                    $("#canadaPermResident").trigger("change");
                }
                return true;
            }
            if (state == 'AB' || state == "BC" || state == "MB" || state == "NB" || state == 'NF' || state == 'NT' || state == "NS" || state == "NU" || state == 'ON' || state == "PE" || state == 'QC' || state == 'SK' || state == 'YT') {
                $('#' + field2).prop('required', true);
                helper.getCountries([{element: field, defaultValue: 'CA'}]);
                $('#' + field2).mask(mask);
                $("#"+ field3).attr('maxlength','7')
                if(field == 'country'){
                    $('input:radio[name=canadaPermResident]')[0].checked = true; 
                    //$('input:radio[name=canadaPermResident]:nth(0)').attr('checked',true);
                    $("#canadaPermResident").trigger("change");
                }
            } else {
                $('#' + field2).prop('required', true);
                helper.getCountries([{element: field, defaultValue: 'US'}]);
                $('#' + field2).mask(mask);
                $("#"+ field3).attr('maxlength','5')
                if(field == 'country'){
                   // $('input:radio[name=canadaPermResident]:nth(1)').attr('checked',true);
                    $('input:radio[name=canadaPermResident]')[1].checked = true;
                    $("#canadaPermResident").trigger("change");
                }
            }
        }
        return true;
    },

    validateEmailField: function(email, field, field2) {
        if ($('#email').css('display') == 'block') {
            if (helper.validateEmailValue(email)) {
                if (is_safari) {
                    $('#'+field+'improper').removeClass('show').addClass('hide');
                } else {
                    $('#'+field).get(0).setCustomValidity('');
                }
                if(helper.validateRegisteredUserService(email)){
                    if (is_safari) {
                        $('#emailregistered').removeClass('hide').addClass('show');
                    } else {
                        $('#'+field).get(0).setCustomValidity("It seems your email address is already in our system. Sign in, or enter a new email address");
                    }
                    return false;
                } else {
                    if (is_safari) {
                        $('#emailregistered').removeClass('show').addClass('hide');
                    }
                    if(helper.validateParams(field, field2)){
                        helper.unBindField(field);
                        KL.info("validateEmailField", email);
                        return true;
                    } else{
                        KL.warn("validateEmailField", email + " NOT match");
                        return false;
                    }
                }
            } else{
                if (is_safari) {
                    $('#'+field+'improper').removeClass('hide').addClass('show');
                } else {
                    $('#'+field).get(0).setCustomValidity(helper.toTitleCase(field) + " is in improper format");
                }
                KL.warn("validateEmailField", email + " is in improper format");
                return false;
            }
        }
    },

    validateEmail: function(email, field) {
        var property1 = document.getElementsByName(field)[0];
        if (helper.validateEmailValue(email)) {
            $('#' + field).removeClass('has-error');
            KL.info("validateEmail", email);
            return true;
        } else {
            $('#' + field).addClass('has-error');
            KL.warn("validateEmail", email + " invalid");
            return false;
        }
    },

    validatePhoneNumber: function(number, field, field2) {
        var phone = helper.formatNumber(number);
        var country = $('#' + field).val();
        if ((country == 'US') || (country == 'CA')) {
            if (phone.length == '10') {
                if (is_safari) {
                    $('#billphoneinvalid').removeClass('show').addClass('hide');
                } else {
                    $('#' + field2).get(0).setCustomValidity('');
                }
                helper.unBindField(field2);
                KL.info("validatePhoneNumber", phone);
            } else {
                if (is_safari) {
                    $('#billphoneinvalid').removeClass('hide').addClass('show');
                } else {
                    $('#' + field2).get(0).setCustomValidity("Please enter 10 digit phone number");
                }
                KL.warn("validatePhoneNumber", phone + " is incorrect");
            }
        } else {
            $('#' + field2).get(0).setCustomValidity('');
            helper.unBindField(field2);
            KL.info("validatePhoneNumber", phone + " is outside US/CA");
        }
    },

    validateEmailValue: function(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    },

    validateBlankSpaces: function(field) {
        var val = field.trim();
        if (val == '') {
            KL.warn("validateBlankSpaces", field + " is blank")
            return false;
        }
        return true
    },

    toTitleCase: function(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    },

    checkEmptyString: function(str) {
        if (str == undefined || typeof str === "undefined" || str.length == 0 || jQuery.isEmptyObject(str)) {
            KL.warn("checkEmptyString", str + " is empty")
            return null;
        } else {
            return str;
        }
    },

    getCookies: function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return '';
    },

    setCookie: function(name, value, days, domain) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        } else {
            var expires = "";
        }
        if (domain !== '') {
            var cookie = name + "=" + value + expires + "; path=/" + "; domain=" + domain;
        } else {
            var cookie = name + "=" + value + expires + "; path=/";
        }
        document.cookie = cookie;
    },

    getUrlParameter: function(name) {
        var queryString = location.search.substr(1);
        var paramArray = queryString.split('&');
        for (var i = 0; i < paramArray.length; i++) {
            var param = paramArray[i].split('=');
            if (param[0] == name) {
                return param[1];
            }
        }
        return null;
    },

    validatePOBox: function(id) {
        var pattern = /\bP(ost|ostal)?([ \.]*(O|0)(ffice)?)?([ \.]*Box)?\b/i;
        var idInvalid = id + 'Invalid';
        if (pattern.test(document.getElementById(id).value)) {
            if (is_safari) {
                $('#' + idInvalid).removeClass('hide').addClass('show');
            } else {
                document.getElementById(id).setCustomValidity('We do not ship to PO Boxes');
            }
        } else {
            if (is_safari) {
                $('#'+ idInvalid).removeClass('show').addClass('hide');
            } else {
                document.getElementById(id).setCustomValidity('');
            }
        }
    },
    
    validateAndClearPOBox: function(id) {
        var pattern = /\bP(ost|ostal)?([ \.]*(O|0)(ffice)?)?([ \.]*Box)?\b/i;
        if (pattern.test(document.getElementById(id).value)) {
            document.getElementById(id).value = '';
        }   
    },

    getCookies: function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return '';
    },

    validateZip: function(zip, state) {
        if (zip != undefined && zip != null && zip != '') {
            if (state == 'non-us-ca') {
                return true;
            }
            if (state == 'AB' || state == "BC" || state == "MB" || state == "NB" || state == 'NF' || state == 'NT' || state == "NS" || state == "NU" || state == 'ON' || state == "PE" || state == 'QC' || state == 'SK' || state == 'YT') {
                var regex = /^([a-zA-Z][0-9][a-zA-Z]+\s)*[0-9][a-zA-Z][0-9]/;
                return regex.test(zip);
            } else {
                var regex = /\d{5}-\d{4}$|^\d{5}$/;
                return regex.test(zip);
            }
        }
        return true;
    },

    validateParams: function(str1, str2) {
        if ($('#' + str2).val() != '') {
            var property1 = document.getElementsByName(str1)[0],
            property2 = document.getElementsByName(str2)[0];
            if (property1.value != property2.value) {
                if (is_safari) {
                    if (str2 == 'email') {
                        $('#' + str1 + 'match').removeClass('hide').addClass('show');
                    } else {
                        $('#' + str2 + 'match').removeClass('hide').addClass('show');
                    }
                } else {
                    $('#'+ str2).get(0).setCustomValidity(helper.toTitleCase(str1) + 's don\'t match');
                }
                KL.warn("validateParams", str1 + " and " + str2 + " Dont Match");
                return false;
            } else {
                if (is_safari) {
                    if (str2 == 'email') {
                        $('#' + str1 + 'match').removeClass('show').addClass('hide');
                    } else {
                        $('#' + str2 + 'match').removeClass('show').addClass('hide');
                    }
                } else {
                    if (str2 == 'email') {
                        $('#' + str1).get(0).setCustomValidity('');
                    } else {
                        $('#'+ str2).get(0).setCustomValidity('');
                    }
                }
                return true;
            }
        }
    },

    formatNumber: function(number) {
        var phoneNumber = number.replace(/[^\d\+]/g, "");
        phoneNumber = phoneNumber.replace(/[^0-9]/, '');
        return phoneNumber;
    },

    formatDate: function(date) {
        if (helper.checkEmptyString(date) == null) {
            return null;
        }
        var date = date.split('T')[0];
        var formatted = moment(date, 'YYYY-MM-DD').format('MMM DD, YYYY');
        return formatted;
    },

    checkMedSchoolValue: function(val) {
        if (val == "5") {
            $('#amaMeNumberField').show();
            $('#currentSchoolState').prop('required', false);
            $('#currentSchoolState').hide();
            var _pcode = $('#programOfInterest').val() == undefined ? helper.getCookies('__pcode') : $('#programOfInterest').val();
            var state = "internationalMedSchool";
            if (_pcode != '' && state != '') {
                helper.getCurrentSchoolName(_pcode, state, '');
            } else {
                $('#currentSchoolName').prop('disabled', 'disabled');
                KL.info("currentSchoolName", "disabled");
            }
        } else {
            $('#amaMeNumberField').show();
            $('#currentSchoolState').show().val('');
            $('#currentSchoolName').prop('disabled', false).val('');
            $('#currentSchoolName').html('<option value="">Name of Current School/Alma Mater</option>');
        }
        var domain = document.domain.split('.');
        helper.setCookie('__medSchoolValue',val,"","."+domain[domain.length-2]+"."+domain[domain.length-1]);
    },

    postData: function() {
        var domain = document.domain.split('.');
        helper.setCookie('__canadianPermResidentValue',$('input[name=canadaPermResident]:checked').val(),"","."+domain[domain.length-2]+"."+domain[domain.length-1]);
        helper.setCookie('__sendMarketingEmailValue',$('#sendMarketingEmail').val(),"","."+domain[domain.length-2]+"."+domain[domain.length-1]);

        var data = {
            kaptestRegistration: 'true',
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            email: $('#email').val(),
            confimEmail: $('#confirmEmail').val(),
            password: $('#password').val(),
            confirmPassword: $('#confirmPassword').val() == undefined || $('#confirmPassword').val() == '' ? null : $('#confirmPassword').val(),
            billingFirstName: $('#billingFirstName').val() == undefined || $('#billingFirstName').val() == '' ? null : $('#billingFirstName').val(),
            billingLastName: $('#billingLastName').val() == undefined || $('#billingLastName').val() == '' ? null : $('#billingLastName').val(),
            streetAddress: $('#streetAddress').val() == undefined ? null : $('#streetAddress').val(),
            apt: $('#apt').val() == undefined ? null : $('#apt').val(),
            city: $('#city').val() == undefined ? null : $('#city').val(),
            state: $('#state').val() == undefined ? null : $('#state').val(),
            zip: $('#zip').val() == undefined ? null : $('#zip').val(),
            country: $('#country').val() == undefined ? null : $('#country').val(),
            phoneNumber: $('#phoneNumber').val() == undefined ? null : helper.formatNumber($('#phoneNumber').val()),
            billingAddressType: $('input[name=billingAddressType]:checked').val() == undefined ? "1" : $('input[name=billingAddressType]:checked').val(),
            samebillShip: $("#samebillShip").val(),
            shippingFirstName: $('#shippingFirstName').val() == undefined || $('#shippingFirstName').val() == '' ? null : $('#shippingFirstName').val(),
            shippingLastName: $('#shippingLastName').val() == undefined || $('#shippingLastName').val() == '' ? null : $('#shippingLastName').val(),
            shippingStreetAddress: $('#shippingStreetAddress').val() == undefined || $('#shippingStreetAddress').val() == '' ? null : $('#shippingStreetAddress').val(),
            shippingApt: $('#shippingApt').val() == undefined || $('#shippingApt').val() == '' ? null : $('#shippingApt').val(),
            shippingCity: $('#shippingCity').val() == undefined || $('#shippingCity').val() == '' ? null : $('#shippingCity').val(),
            shippingState: $('#shippingState').val() == undefined || $('#shippingState').val() == '' ? null : $('#shippingState').val(),
            shippingZip: $('#shippingZip').val() == undefined || $('#shippingZip').val() == '' ? null : $('#shippingZip').val(),
            shippingCountry: $('#shippingCountry').val() == undefined || $('#shippingCountry').val() == '' ? null : $('#shippingCountry').val(),
            shippingphoneNumber: $('#shippingPhoneNumber').val() == undefined || $('#shippingPhoneNumber').val() == '' ? null : helper.formatNumber($('#shippingPhoneNumber').val()),
            shippingAddressType: $('input[name=shippingAddressType]:checked').val() == undefined ? "1" : $('input[name=shippingAddressType]:checked').val(),
            parentFirstName: $('#parentFirstName').val() == undefined || $('#parentFirstName').val() == '' ? null : $('#parentFirstName').val(),
            parentLastName: $('#parentLastName').val() == undefined || $('#parentLastName').val() == '' ? null : $('#parentLastName').val(),
            parentEmail: $('#parentEmail').val() == undefined || $('#parentEmail').val() == '' ? null : $('#parentEmail').val(),
            parentConfirmEmail: $('#parentConfirmEmail').val() == undefined || $('#parentConfirmEmail').val() == '' ? null : $('#parentConfirmEmail').val(),
            schoolState: $('#currentSchoolState').val() == undefined || $('#currentSchoolState').val() == '' ? null : $('#currentSchoolState').val(),
            schoolName: $('#currentSchoolName').val() == undefined || $('#currentSchoolName').val() == '' ? $('#schoolName').val() : $('#currentSchoolName option:selected').text(),
            schoolId: $('#currentSchoolName').val() == undefined || $('#currentSchoolName').val() == '' ? '1' : $('#currentSchoolName').val(),
            graduationYear: $('#gradYear').val() == undefined || $('#gradYear').val() == '' ? "0" : $('#gradYear').val(),
            testDate: $('#test-date-input').val() == undefined || $('#test-date-input').val() == '' ? null : $('#test-date-input').val(),
            pcode: $('#programOfInterest').val() == undefined || $('#programOfInterest').val() == '' ? helper.getCookies('__pcode') : $('#programOfInterest').val(),
            mbeState: $('#mbeState').val() == undefined || $('#mbeState').val() == '' ? null : $('#mbeState').val(),
            abaNumber: $('#abaNumber').val() == undefined || $('#abaNumber').val() == null || $('#abaNumber').val() == '' ? null : $('#abaNumber').val(),
            amaMeNumberValue: $('#amaMeNumberValue').val() == undefined || $('#amaMeNumberValue').val() == null || $('#amaMeNumberValue').val() == '' ? null : $('#amaMeNumberValue').val(),
            repName: $('#repName').val() == undefined || $('#repName').val() == null || $('#repName').val() == '' ? null : $('#repName').val(),
            medSchoolValue: helper.getCookies('__medSchoolValue') == undefined || helper.getCookies('__medSchoolValue') == null || helper.getCookies('__medSchoolValue') == '' ? null : helper.getCookies('__medSchoolValue'),
            resume: helper.getUrlParameter('resume') == undefined || helper.getUrlParameter('resume') == null ? null : helper.getUrlParameter('resume'),
            canadaPermResident : $('input[name=canadaPermResident]:checked').val() == undefined || $('input[name=canadaPermResident]:checked').val() == '' ? 'false' : $('input[name=canadaPermResident]:checked').val(),
            sendMarketingEmail: $("#sendMarketingEmail").val() == undefined  || $('#sendMarketingEmail').val() == null || $('#sendMarketingEmail').val() == '' ? "false" : $('#sendMarketingEmail').val()
        }
        KL.info("regPostingData", "firstName " + data.firstName + " lastName " + data.lastName + " email " + data.email + " billingFirstName " + data.billingFirstName + " billingLastName " + data.billingLastName + " streetAddress " + data.streetAddress + " apt " + data.apt + " city " + data.city + " state " + data.state + " country " + data.country + " phoneNumber " + data.phoneNumber + " billingAddressType " + data.billingAddressType + " samebillShip " + data.samebillShip + " shippingFirstName " + data.shippingFirstName + " shippingLastName " + data.shippingLastName + " shippingStreetAddress " + data.shippingStreetAddress + " shippingApt " + data.shippingApt + " shippingCity " + data.shippingCity + " shippingState " + data.shippingState + " shippingZip " + data.shippingZip + " shippingCountry " + data.shippingCountry + " shippingphoneNumber " + data.shippingphoneNumber + " shippingAddressType " + data.shippingAddressType + " parentFirstName " + data.parentFirstName + " parentLastName " + data.parentLastName + " parentEmail " + data.parentEmail + " schoolState " + data.schoolState + " schoolName " + data.schoolName + " schoolId " + data.schoolId + " graduationYear " + data.graduationYear + " testDate " + data.testDate + " pcode " + data.pcode + " mbeState " + data.mbeState + " abaNumber " + data.abaNumber + " amaMeNumberValue " + data.amaMeNumberValue + " repName " + data.repName + " medSchoolValue " + data.medSchoolValue + " resume " + data.resume + " canadaPermResident " + data.canadaPermResident + " sendMarketingEmail " + data.sendMarketingEmail);
        return data;
    },

    bindUserData: function(data) {
        $('#firstName').val(data.firstName);
        $('#lastName').val(data.lastName);
        $('#email').val(data.email).addClass('hide').prop('required', false);
        $('#confirmEmail').val(data.email).addClass('hide').prop('required', false);
        $('#password').val(data.password).addClass('hide').prop('required', false);
        $('#confirmPassword').val(data.confirmPassword).addClass('hide').prop('required', false);
        $('#billingFirstName').val(data.billingFirstName);
        $('#billingLastName').val(data.billingLastName);
        $('#streetAddress').val(data.streetAddress);
        $('#city').val(data.city);
        $('#apt').val(data.apt);
        $('#state').val(data.state);
        $('#zip').val(data.zip);
        $('#country').val(data.country);
        $('#phoneNumber').val(data.phoneNumber);
        $('#billingAddressType').prop("checked", true)
        $('#shippingFirstName').val(data.shippingFirstName);
        $('#shippingLastName').val(data.shippingLastName);
        $('#shippingStreetAddress').val(data.shippingStreetAddress);
        $('#shippingApt').val(data.shippingApt);
        $('#shippingCity').val(data.shippingCity);
        $('#shippingState').val(data.shippingState);
        $('#shippingZip').val(data.shippingZip);
        $('#shippingCountry').val(data.shippingCountry);
        $('#shippingPhoneNumber').val(data.shippingphoneNumber);
        $('#shippingAddressType').prop("checked", true)
        $('#currentSchoolState').val(data.schoolState);
        $('#currentSchoolName').prop('selected', 'selected');
        $('#gradYear').val(data.graduationYear);
        $('#amaMeNumberValue').val(data.amaMeNumberValue);
        $('#test-date-input').val(data.testDate == undefined ? '' : data.testDate);
        if (data.testDate == undefined || data.testDate == null) {
            $('#idontknowmytestDate').click();
        } else {
            $('#test-date-input').val(helper.formatDate(data.testDate));
        }

        var _pcode = $('#programOfInterest').val() == undefined || $('#programOfInterest').val() == '' ? helper.getCookies('__pcode') : $('#programOfInterest').val();
        var state = data.schoolState != '' ? data.schoolState : $('#currentSchoolState').val();
        if (_pcode != '' && _pcode != null && _pcode != undefined && _pcode != 'undefined' && state != '') {

            $('#programOfInterest').val(_pcode);
            helper.getCurrentSchoolName(_pcode, state, data.schoolId);
            var type = $('#programOfInterest option:selected').attr('type');

            switch (type) {
                case 'mbe':
                    $('.mbe-section').removeClass('hidden');
                    $('#mbeState').prop('required', true);
                    KL.info("programOfInterest", type);
                    break;
                case 'addl':
                    $('.additional-info .no-addl').addClass('hidden');
                    $('.additional-info .addlReq').prop('required', false);
                    KL.info("programOfInterest", type);
                    break;
                case 'med':
                    $('.med').removeClass('hidden');
                    KL.info("programOfInterest", type);
                    break;
                case 'precollege':
                    $('#parent-account-details').removeClass('hidden');
                    $('#parent-account-details .form-control').prop('required', 'required');
                    KL.info("programOfInterest", type);
                    break;
            }
        }

        if (data.shippingStreetAddress != data.streetAddress) {
            $('#samebillShip').val('FALSE');
            $('#samebillShip').prop('checked', false);
            $('.shippingAddress').toggleClass('hidden');
            $('.shippingAddress .reqAttr').prop('required', true);
        } else {
            //if samebillship and bill address contains po box
            if ($('#samebillShip').length && $('#samebillShip').prop('checked', true)) {
                helper.validateAndClearPOBox('streetAddress');
                helper.validateAndClearPOBox('apt');
            }
        }
        $('#abaNumber').val(data.abaNumber);
        $('#mbeState').val(data.mbeState);
        $('#repName').val(data.repName);
        $('#parentFirstName').val(data.parentFirstName);
        $('#parentLastName').val(data.parentLastName);
        $('#parentEmail').val(data.parentEmail);
        $('#parentConfirmEmail').val(data.parentEmail);


        var medSchoolValue = data.medSchoolValue === '' || data.medSchoolValue === null || data.medSchoolValue === undefined ? helper.getCookies('__medSchoolValue') : data.medSchoolValue;
        if (medSchoolValue == '4') {
            $('input[name=medRadio]').eq(0).prop('checked', 'checked');
            helper.checkMedSchoolValue(medSchoolValue);
        } else if (medSchoolValue == '5') {
            $('input[name=medRadio]').eq(1).prop('checked', 'checked');
            helper.checkMedSchoolValue(medSchoolValue);
        }

        //Raygun Logged In User
        if (("RaygunObject" in window) && (RaygunObject == 'rg4js')) {
            rg4js('setUser', {
                identifier: helper.getCookies('__cartID'),
                isAnonymous: false,
                email: data.email,
                firstName: data.firstName,
                fullName: data.firstName + ' ' + data.lastName
            });
        }

         if(helper.getCookies('__canadianPermResidentValue') == 'true'){
            $('input:radio[name=canadaPermResident]:nth(0)').attr('checked',true);
            $("#canadaPermResident").trigger("change");
        } else{
            $('input:radio[name=canadaPermResident]:nth(1)').attr('checked',true);
            $("#canadaPermResident").trigger("change");
        }

        if(helper.getCookies('__sendMarketingEmailValue') == 'true'){
            $("[name='sendMarketingEmail']").attr('checked', true);
            $("[name='sendMarketingEmail']").trigger("change");
        } else{
            $("[name='sendMarketingEmail']").attr('checked', false);
            $("[name='sendMarketingEmail']").trigger("change");
        }
    }
}

$(function () {
    helper.init();
    KL.init();
});