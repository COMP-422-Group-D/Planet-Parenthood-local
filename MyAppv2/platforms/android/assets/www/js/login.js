function loginf(form)
{

	if(form.log.value == "login" && form.pass.value == "pass")
	{
		window.location('index.html')
	}
	else
	{
		alert("Incorrect Username or Password")/*displays error message*/

	}
}