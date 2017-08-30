$(document).ready(function() {
    
    class MyForm {
        constructor(name, email, phone) {
            this.name = name;
            this.email = email;
            this.phone = phone;
        }

        validate() {
            let isValid = false;
            return {
                isValid: isValid,
                errorFields: []
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
        console.log(form.getData());
        form.submit();
    }); 
});
