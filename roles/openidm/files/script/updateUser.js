//response object
response = {};

//read in parameters
id = request.params['id'];
name =  request.params['name'];

path = "managed/user/" + id;

//find user using get-by-field-value using email address
user = openidm.read(path);

logger.error("Read user {}  request value {} name {}", path, request.value, name);

// define functions we need 
function sendEmail(email, message) {
	var params =  new Object();
	params._from = "openidm@example.com";
	params._to = email;	
	params._subject = "Account updated";
	params._body = "Your account details have been updated " + message;	 
	openidm.action("external/email", params);
}

if (user) {
	// patch list
	r = [{ "replace": "/givenName", "value": name}];
	revision = (parseInt(user._rev) +1).toString();
	try {
		response.result = openidm.patch(path,null,r);
		sendEmail(user.email,"Name updated to " + name);
	}
	catch(err) {
		logger.error("Error on update {}. Will rollback change to {}", err,path);		
		response.result = "error on update. Error =" + err;
         try {
             // this will also fail if a target is down, but it will
             // put the managed user back to the way it was
             res2 = openidm.update(path,revision,user);
             logger.error("Result of rolback {}", res2);
         }
         catch(err2) {
        	 // we ignore this error - because we expect the update to fail
        	 logger.error("expected error {}", err);
         }
	}	
}
//if user doesn't exist
else {
	response.comment = "Invalid id";	
}

//send result back
response;
