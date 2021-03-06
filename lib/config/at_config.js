AccountsTemplates.configure({
    // Behavior
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    sendVerificationEmail: false,
    lowercaseUsername: false,
    focusFirstInput: true,

    // Appearance
    showAddRemoveServices: true,
    showForgotPasswordLink: false,
    showLabels: true,
    showPlaceholders: true,
    showResendVerificationEmailLink: false,
    hideSignInLink: true,
    hideSignUpLink: true,

    // Client-side Validation
    continuousValidation: true,
    negativeFeedback: true,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    //privacyUrl: 'privacy',
    //termsUrl: 'terms-of-use',

    // Redirects
    homeRoutePath: '/home',
    redirectTimeout: 4000,

    // Hooks
    //onLogoutHook: myLogoutFunc,
    //onSubmitHook: mySubmitFunc,
    //preSignUpHook: myPreSubmitFunc,
    //postSignUpHook: myPostSubmitFunc,

    // Texts
    texts: {
      title: {
          signUp: "Add New User"
      },
      button: {
          signUp: "Add",
          signIn: "Login"
      },
      //socialSignUp: "Social Sign Up",
      //socialIcons: {
        //  "meteor-developer": "fa fa-rocket"
      //},
      //title: {
        //  forgotPwd: "Recover Your Password"
      //},
    },
});