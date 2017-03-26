var mySubmitFunc = function(error, state){
  if (!error) {
    if (state === "signIn") {
        $('#myModal').modal('hide')
    }
    if (state === "signUp") {
        $('#myModal').modal('hide')
    }
  }
};

AccountsTemplates.configure({
    onSubmitHook: mySubmitFunc
});