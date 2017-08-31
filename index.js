$(document).ready(function() {
    
    class MyForm {
        constructor(name, email, phone) {
            this.name = name;
            this.email = email;
            this.phone = phone;
        }

        validate() {
            let isValid = false;
            let errorFields = [];
            
            const domains = [
                'ya.ru',
                'yandex.ru',
                'yandex.ua',
                'yandex.by',
                'yandex.kz',
                'yandex.com'
            ];
            
            let fields = [
                {
                    value: $('#fio').val(),
                    rule: function(val) {
                        if (!/([А-Яа-яA-Za-z]+ ){2}[А-Яа-яA-Za-z]+/.test(val)) {
                            errorFields.push('fio');
                        }
                    }
                },
                {
                    value: $('#email').val(),
                    rule: function(val) {
                        
                        let inputDomain = $('#email').val().split('@')[1];
                        
                        if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(val)) {
                            errorFields.push('email');
                        } else {
                            for (let value of domains) {
                                if (value === inputDomain) {
                                    break;
                                }
                            } 
                        }
                    }
                },
                {
                    value: $('#phone').val(),
                    rule: function(val) {
                        if (val === '') {
                            errorFields.push('phone')
                        }
                    }
                }
            ];
            
            for (let field of fields) {
                field.rule(field.value);
            }
            
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
            let ajaxUrl = '';
            this.validate();
            
            if (this.validate().isValid) {
                ajaxUrl = 'json/success.json'
            } else {
                ajaxUrl = 'json/error.json'
            };
            
            let resultContainer = $('#resultContainer');
            $.ajax({
                type: 'GET',
                url: 'json/progress.json',
                dataType: 'json',
                success: function(result) {
                    resultContainer.html(result);
                    console.log(result);
                },
                error: function() {
                    console.log('query failure!')
                }
            });
        }
    };
    
    $('#submitButton').click(function(e) {
        e.preventDefault();
        
        const form = new MyForm();
        form.setData({
            name: $('#fio').val(),
            email: $('#email').val(),
            phone: $('#phone').val()
        })
        console.log(form.getData(), form.validate().errorFields);
        form.submit();
    }); 
});
