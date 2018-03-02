function checkPasswordMatch() {
  var password = $("#password").val();
  var confirmPassword = $("#passwordConfirm").val();

  if (password != confirmPassword) {
    $("#passID1").removeClass("symbol-login-input");
    $("#passID2").removeClass("symbol-login-input");
    $("#passID1Flair").removeClass("login-input:focus");
    $("#passID2Flair").removeClass("login-input:focus");
    $("#passID1Flair").removeClass("focus-login-input");
    $("#passID2Flair").removeClass("focus-login-input");
    $("#passID1").addClass("fail-password-input");
    $("#passID2").addClass("fail-password-input");
    $("#passMessage").html("Passwords do not match!");
    $('#create-btn').prop('disabled', true);
  }
  else {
    $("#passID1").removeClass("fail-password-input");
    $("#passID2").removeClass("fail-password-input");
    $("#passID1").addClass("symbol-login-input");
    $("#passID2").addClass("symbol-login-input");
    $("#passID1Flair").addClass("login-input:focus");
    $("#passID2Flair").addClass("login-input:focus");
    $("#passID1Flair").addClass("focus-login-input");
    $("#passID2Flair").addClass("focus-login-input");
    $("#passMessage").empty();
    $('#create-btn').prop('disabled', false);
  } 
}  

  $(document).ready(function () {
    $("#password, #passwordConfirm").keyup(checkPasswordMatch);
  });