

// false,'personalInfo',false
var toggleEditBtn = function (a,what,tab) {
    var cd, i, e;
    cd = document.getElementsByClassName(what);
    for(i=0; i < cd.length; i++) {
        e = cd[i]; 
        if(tab){
            e.style.display = "none";
        }else{
            if(e.style.display == "none") {
                e.style.display = "inline";
            } else {
                e.style.display = "none";
            }
        }
    }
    if(e.style.display === "inline"){
        what === "accountInfo" ? $("#updateAccountBtn").text("Done") : null;
        what === "personalInfo" ? $("#updatePersonalBtn").text("Done") : null;
    }
    if(e.style.display === "none"){
        what === "accountInfo" ? $("#updateAccountBtn").text("Update Account info") : null;
        what === "personalInfo" ? $("#updatePersonalBtn").text("Update Personal info") : null;
    }
}

$(".modal").on("shown.bs.modal", function() {
  $(this).find("[autofocus]").focus();
  var hasFocus = $("#state").is(":focus");
  var hasFocus2 = $("#inputElement").is(":focus");
  console.log("sssSsssss1:", hasFocus)
  console.log("sssSsssss2:", hasFocus2)
});

var doUserProfileEditModal = function(formID,titleText,inputAttr,inputType,currentValue,stateInitials) {

    document.getElementById( formID ).reset();
    $("#state").val('').trigger("change");

    var formLabelUpdate = document.getElementById( formID ).getElementsByTagName( "label" )[1];

    var ie = document.getElementById("inputElement");
    var iparent = ie.closest("div");  
    var se = document.getElementById("state");
    var sparent = se.closest("div");

    iparent.style.visibility = "hidden";
    sparent.style.visibility = "hidden";
    $( "#inputElement" ).prop( "disabled", true );
    $( "#state" ).prop( "disabled", true );

    if (inputType === "select"){
        sparent.style.visibility = "visible";
        $( "#state" ).prop( "disabled", false );
        //document.getElementById("state").setAttribute("autofocus", "autofocus");
        //$('.state').data('selectpicker').$button.focus();
        //$("select.autocomplete").selectpicker().data("selectpicker").$searchbox.focus();
        //$("input").selectpicker().parent().find(".selected a").focus();
        $( "#state" ).find("[option]").focus();
    }else{
        iparent.style.visibility = "visible";
        $( "#inputElement" ).prop( "disabled", false );
        var formInputUpdate = document.getElementById("inputElement")
        formInputUpdate.setAttribute("placeholder", titleText.toLowerCase());
        formLabelUpdate.setAttribute("for", inputAttr);
        formInputUpdate.setAttribute("name", inputAttr);
        formInputUpdate.setAttribute("type", inputType);
    }

    var formInputCurrent2 = document.getElementById( formID ).getElementsByClassName("dont-break-out")[0];

    //var formInputCurrent = document.getElementById( formID ).getElementsByTagName( "input" )[1];
    var formCurrentValueLabel = document.getElementById( formID ).getElementsByTagName( "label" )[0];
   
    formCurrentValueLabel.innerHTML = "Current " + titleText + ":";
    formLabelUpdate.innerHTML = "Change your " + titleText + ":";
    //formInputCurrent.value = currentValue;
    formInputCurrent2.innerHTML = currentValue;


    $("#userProfileFormModal").modal({
      keyboard: false,
      backdrop: "static"
    })
}

