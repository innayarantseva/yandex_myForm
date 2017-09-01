$(document).ready(function() {
    
    class MyForm {
        constructor(name, email, phone) {
            this.name = name;
            this.email = email;
            this.phone = phone;
        }

        validate() {
            let isValid = true;
            let errorFields = [];
            
            //check if we have an appropriate domain name 
            const domains = [
                'yandex.ua',
                'ya.ru',
                'yandex.ru',
                'yandex.by',
                'yandex.kz',
                'yandex.com'
            ];
            
            function isDomainValid(domain) {
                if (!domains.includes(domain)) {
                    return false;
                } else {
                    return true;
                }
            }; 
            
            //array consists of 'field' objects; each 'field' has a value and a validation rule
            let fields = [
                {
                    value: $('#fio').val(),
                    rule: function(val) {
                        if (!/([А-Яа-яA-Za-z]+ ){2}[А-Яа-яA-Za-z]+/.test(val)) {
                            errorFields.push('fio');
                            isValid = false;
                            $('#fio').addClass('error');
                        } else {
                            $('#fio').removeClass('error');
                        }
                    }
                },
                {
                    value: $('#email').val(),
                    rule: function(val) {
                        let inputDomain = $('#email').val().split('@')[1];
                        let isEmailValid = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(val);
                        
                        if (isEmailValid && isDomainValid(inputDomain)) {
                            $('#email').removeClass('error');
                        } else {
                            errorFields.push('email');
                            isValid = false;
                            $('#email').addClass('error');
                        };
                    }
                },
                {
                    value: $('#phone').val(),
                    rule: function(val) {
                        let isPhoneValid = /^\+7\(\d{3}\)\d{3}\-\d{2}\-\d{2}$/.test(val);
                        let isSumValid = val.replace(/\D/g, '').split('').map((el) => Number(el)).reduce((a, b) => a + b, 0) <= 30;
                        console.log(isSumValid);
                        if (isPhoneValid && isSumValid) {
                            $('#phone').removeClass('error');
                        } else {
                            errorFields.push('phone');
                            isValid = false;    
                            $('#phone').addClass('error');
                        }
                    }
                }
            ];
            
            //check if every 'field' value is valid according to its validation rule
            for (let field of fields) {
                field.rule(field.value);
            }
            
            //return an object with validation result
            return {
                isValid: isValid,
                errorFields: errorFields
            };
        }

        getData() {
            return this;
        }

        setData(data) {        
            this.name = data.name;
            this.email = data.email;
            this.phone = data.phone;

            $('#fio').val(data.name);
            $('#email').val(data.email);
            $('#phone').val(data.phone);
        }   
    
        submit() {
            this.validate();
            
            let resultContainer = $('#resultContainer');
            let formUrl = $('#myForm').attr('action');
            let isFormValid = this.validate().isValid;
                        
            function ajaxQuery() {
                if (isFormValid) {
                    $.ajax({
                        type: 'GET',
                        url: formUrl,
                        dataType: 'json',
                        success: function(result) {
                            let status = result.status;
                            resultContainer.addClass(status);

                            switch (status) {
                                case 'success':
                                    resultContainer.html('Success');
                                    $('#submitButton').attr('disabled', 'disabled');
                                    break;
                                case 'progress':
                                    resultContainer.html('Progress');
                                    //не смогла в timeout
//                                    setTimeout(ajaxQuery(), result.timeout);  
                                    console.log(result.timeout);
                                    break;
                                case 'error':
                                    resultContainer.html('Error: ' + result.reason);
                                    break;

                            }
                            console.log(result.status);
                        }
                    });
                }
            };
            
            ajaxQuery();
        }
    };
    
    $('#submitButton').click(function(e) {
        e.preventDefault();
        
        const form = new MyForm();
        
        form.setData({
            name: $('#fio').val(),
            email: $('#email').val(),
            phone: $('#phone').val()
            
        });
        
        form.submit();
    }); 
});
