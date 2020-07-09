
// button(type="button", id="replyBtn", class="btn btn-primary btn-lg", data-id=`${doc.id}`, onclick="doFoo()") Reply2
/*
var subCommentReply = function() {
	var subComForm = document.getElementById("addSubCommentForm");
	var replyButton = document.getElementById("replyBtn");
	var mcID = $(replyButton).data("id");
	var pathmcID = "/comments/subcomment/"+mcID;
	subComForm.setAttribute("action", pathmcID);
	$('#addSubCommentFormModal').modal({
      keyboard: false,
      backdrop: 'static'
    })
}
*/

//button(type="button", class="subCommentReply btn btn-primary btn-lg", data-id=`${doc.id}`) Reply
$(document).on("click", ".subCommentReply", function () {
     var mcID = $(this).data("id");
     var pathmcID = "/comments/subcomment/"+mcID;
     $("#addSubCommentForm").attr("action",pathmcID);
     //$("#addSubCommentForm").setAttribute("action", pathmcID);
     $('#addSubCommentFormModal').modal({
      keyboard: false,
      backdrop: 'static'
    })
});


/* http://stackoverflow.com/questions/10626885/passing-data-to-a-bootstrap-modal */
/*
$('#addSubCommentFormModal').on('show.bs.modal', function(e) {
    //get data-id attribute of the clicked element
    var bookId = $(e.relatedTarget).data('book-id');
    //populate the textbox
    $(e.currentTarget).find('input[name="bookId"]').val(bookId);
});
*/

// button(type="button", class="subCommentReply btn btn-primary btn-lg", data-id=`${doc.id}`) Reply
/*
$(document).on("click", ".subCommentReply", function () {
     var mcid = $(this).data('id');
     $("#addSubCommentForm").val( myBookId );
     console.log("MMmmmmmmodal !!!!!! mcid: ", mcid)
     //$(".modal-body #bookId").val( myBookId );
     // As pointed out in comments, 
     // it is superfluous to have to manually call the modal.
     // $('#addBookDialog').modal('show');
});
*/

var doCommentModal = function() {
    $('#addMainCommentFormModal').modal({
      keyboard: false,
      backdrop: 'static'
    })
}

/*
var doSubCommentModal = function() {
    $('#addSubCommentFormModal').modal({
      keyboard: false,
      backdrop: 'static'
    })
}*/
