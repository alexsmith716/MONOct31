
console.log('####### > formValidation.js ');

$.validator.setDefaults({
    highlight: function(element) {
        $(element).closest('.form-group').addClass('has-error');
    },
    unhighlight: function(element) {
        $(element).closest('.form-group').removeClass('has-error');
    },

    errorElement: 'span',
    errorClass: 'help-inline',

    errorPlacement: function(error, element) {
        if (element.prop('type') === 'radio') {
            $( element )
                .closest( "form" )
                    .find( "label[for='" + element.attr( "name" ) + "']" )
                        .append( error );
        } else {
            $( element ).closest( "form" ).find( "label[for='" + element.attr( "id" ) + "']" ).append( error );
        }
    },
    submitHandler: function(form) {
        console.log('####### > formValidation.js > submitHandler()');
        form.submit();
    }

});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).ready(function() {
  
    //$('.selectpicker').selectpicker();

    $("#signUpFormID").validate({
        rules: {
            email: "required",
            displayname: "required",
            password: "required",
            firstname: "required",
            lastname: "required",
            city: "required",
            state: "required"
        },
        messages: {
            email: "  ( required )",
            displayname: "  ( required )",
            password: "  ( required )",
            firstname: "  ( required )",
            lastname: "  ( required )",
            city: "  ( required )",
            state: "  ( required )"
        }
    });

    var frm = document.getElementById("signUpFormID");
    
    $('.clrFavForm').click(function(event) {
        console.log('####### > formValidation.js > clrFavForm1 > ', this);
        if ( frm != null ) {
            frm.reset();
            $("#state").val('').trigger('change');
            $(frm).find(".form-group").removeClass("has-error"); 
            $(frm).data('validator').resetForm(); 
            //$('.selectpicker').selectpicker('refresh');
            //$('.selectpicker').selectpicker('deselectAll');
        }
        if ( this.id == 'cancelFormBtn' ) {
            window.location.href= '/';
        }
    });

    $('.selectpicker').change(function(){
        console.log('####### > formValidation.js > clrFavForm2 > ', this);
        if($(this).attr('id') == 'state'){
            $(this).closest('.form-group').removeClass('has-error');
            var serr = $(this).closest("form").find("label[for='state']").find("span[id='state-error']");
            serr.remove();
        }
    });

    $('.doModal').click(function(event) {
        console.log('####### > doModal !!!!!!')
        $('#updateFormModal').modal({
            keyboard: false,
            backdrop: 'static'
        })
    });

});
