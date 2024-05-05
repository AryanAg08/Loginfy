# Loginfy

 > Enable module export 
 > Make functions and required Endpoints. 
 > Create cookie checker and send request and check if its receiving properly
 > Try google auth enabler 
 > Discord Auth Enabler
 > Twitter Auth Enabler 
 > 


05-05-2024
-> Done with setting login options, fetching usermodels and checking for email, username, password!! 
-> Checking them when initiating the use function. 

06-05-2004

SetGlobalmodal 
// In your package file

// Global variable to store the user model
let globalUserModel = null;

// Function to set the user model
function setUserModel(userModel) {
    globalUserModel = userModel;
}

// Function to access the user model
function getUserModel() {
    return globalUserModel;
}

module.exports = { setUserModel, getUserModel };

// Generating user model has been saved into notion!!