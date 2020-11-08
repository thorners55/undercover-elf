<template>
  <div>
    <!-- if user already logged in -->
    <div v-if="loggedIn">
      <p>Hello, {{ name }}!</p>
      <p>You are logged in</p>
      <button v-on:click="signOut">Sign out</button>
    </div>

    <!-- if user is not logged in -->
    <div v-if="!loggedIn">
      <button v-on:click="signIn">click</button>
      <!-- if user is signing in, not making new account -->
      <div v-if="!signingUp">
        <div v-if="showSignIn">
          <div v-if="!hideSignInForgottenPassword">
            <p>Sign in</p>
            <form
              id="sign-in"
              v-on:keyup.enter="signIn(signInEmail)"
              v-on:submit.prevent
            >
              <label for="email">Email:</label>
              <input type="email" id="email" v-model="signInEmail" />
              <label for="password">Password:</label>
              <input type="password" id="password" v-model="signInPassword" />
            </form>
            <button
              type="button"
              v-on:click="
                signIn(signInEmail);
                signUpEmail = '';
                signUpPassword = '';
              "
            >
              Sign in
            </button>
            <button
              v-on:click="
                showForgotPassword = true;
                hideSignInForgottenPassword = true;
              "
            >
              Forgotten password?
            </button>
          </div>
          <div v-if="showForgotPassword">
            <form
              id="forgot-password"
              v-on:submit.prevent
              v-on:keyup.enter="forgotPassword"
            >
              <!-- FIX -->
              <label for="forgot-password-email">Email:</label>
              <input
                type="email"
                id="forgot-password-email"
                v-model="forgottenEmail"
              />
              <button type="button" v-on:click="forgotPassword">
                Reset password
              </button>
            </form>

            <button
              type="button"
              v-on:click="
                hideSignInForgottenPassword = false;
                showForgotPassword = false;
              "
            >
              Back to sign in
            </button>
          </div>
          <div v-if="showForgotPasswordConfirm">
            <p v-if="showForgottenPasswordError">
              {{ forgottenPasswordErrorMessage }}
            </p>
            <p>Email: {{ forgottenEmail }}</p>
            <form
              id="forgot-password-confirm-code"
              v-on:keyup.enter="changePassword"
              v-on:submit.prevent
            >
              <label for="forgot-password-confirm-code">Code:</label>
              <input
                type="text"
                id="forgot-password-confirm-code"
                v-model="forgottenPasswordConfirmCode"
              />
              <label for="forgot-password-new-password">New password:</label>
              <input
                type="password"
                id="forgot-password-new-password"
                @input="handlePasswords"
                v-model="forgottenPasswordNewPassword"
              />
              <p v-if="passwordFormatMessage">
                Password must be a minimum of 8 characters, contain at least one
                uppercase and one lowercase character, and one special character
              </p>
              <label for="forgot-password-new-password"
                >Re-type new password:</label
              >
              <input
                type="password"
                id="forgot-password-new-password-retype"
                @input="handlePasswords"
                v-model="forgottenPasswordNewPasswordRetype"
              />
              <p v-if="passwordsDoNotMatchMessage">Passwords do not match</p>
              <button
                type="button"
                v-on:click="changePassword"
                :disabled="!validPassword"
              >
                Change password
              </button>
            </form>

            <button
              v-if="showForgotPasswordConfirm"
              v-on:click="
                showForgotPassword = false;
                hideSignInForgottenPassword = false;
                showForgotPasswordConfirm = false;
                forgottenEmail = '';
              "
            >
              Back to sign in
            </button>
          </div>
          <!-- if user has signed up but has not confirmed email -->
        </div>
        <p v-if="showErrorMessage">{{ errorMessage }}</p>
      </div>

      <div v-if="userNotConfirmed && userNotConfirmedMessage">
        <p>You must confirm your account to sign in.</p>
        <button
          v-on:click="
            confirmingSignUp = true;
            showSignIn = false;
            userNotConfirmedMessage = false;
          "
        >
          Verify account
        </button>
      </div>

      <!-- if not making new account (signing up) -->
      <div
        v-if="
          !signingUp &&
            !userNotConfirmed &&
            !showForgotPassword &&
            !showForgotPasswordConfirm
        "
      >
        <p>Don't have an account?</p>
        <button
          v-on:click="
            (signingUp = true), (signInEmail = '');
            signInPassword = '';
          "
        >
          Create an account
        </button>
      </div>

      <!-- if making new account (signing up) -->
      <div v-if="signingUp">
        <form v-on:keyup.enter="createAccount" v-on:submit.prevent>
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="signUpName" />
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="signUpEmail" />
          <label for="password">Password:</label>
          <input
            type="password"
            id="password"
            v-model="signUpPassword"
            @input="handlePasswords"
          />
          <p v-if="passwordFormatMessage">
            Password must be a minimum of 8 characters, contain at least one
            uppercase and one lowercase character, and one special character
          </p>
          <label for="passwordRetype">Re-enter password:</label>
          <input
            type="password"
            id="passwordRetype"
            v-model="signUpPasswordRetype"
            @input="handlePasswords"
          />
          <p v-if="passwordsDoNotMatchMessage">Passwords do not match</p>
          <button
            type="button"
            v-on:click="createAccount"
            :disabled="!validPassword"
          >
            Create account
          </button>
        </form>

        <button
          v-on:click="
            signingUp = false;
            signUpEmail = '';
            signUpPassword = '';
            signUpName = '';
          "
        >
          Back to sign in
        </button>
      </div>
      <!-- if have made new account but have not confirmed -->
      <div v-if="confirmingSignUp">
        <p>Email: {{ signUpEmail ? signUpEmail : signInEmail }}</p>
        <form v-on:keyup.enter="confirmSignUp" v-on:submit.prevent>
          <label for="code">Verification code:</label>
          <input type="text" id="password" v-model="confirmSignUpCode" />
        </form>
        <button v-on:click="confirmSignUp">Submit verification code</button>
        <button v-on:click="resendCode">Re-send verification code</button>
        <button
          type="button"
          v-on:click="
            signingUp = false;
            showSignIn = true;
            confirmingSignUp = false;
            userNotConfirmed = false;
            userNotConfirmedMessage = false;
            signUpName = '';
            signUpEmail = '';
            signUpName = '';
            signInEmail = '';
            signInPassword = '';
          "
        >
          Back to sign in
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Auth } from "aws-amplify";
var aws = require("aws-sdk");
import { mapActions, mapState } from "vuex";

//  <button v-on:click="confirmSignUp">Confirm sign up</button>

export default {
  name: "SignIn",
  computed: {
    ...mapState("loggedIn", ["loggedIn"]),
    ...mapState("loggedIn", ["name"]),
  },
  methods: {
    ...mapActions("loggedIn", ["logIn", "logOut"]),
    async signIn(email) {
      console.log("beginning of signIn");
      console.log(email);
      let password;
      if (this.signInPassword.length > 1) {
        password = this.signInPassword;
      } else {
        password = this.signUpPassword;
      }
      try {
        aws.config.update({ region: "eu-west-2" });
        let user = await Auth.signIn(email, password);
        console.log("after signIn");
        console.log(user);
        let payload = { userId: user.username, name: user.attributes.name };
        this.logIn(payload);
        this.signInEmail = "";
        this.signInPassword = "";
        this.signUpName = "";
        this.signUpEmail = "";
        this.signUpPassword = "";
        this.signUpPasswordRetype = "";
      } catch (error) {
        if (error.code === "UserNotConfirmedException") {
          this.userNotConfirmed = true;
          this.userNotConfirmedMessage = true;
          this.showSignIn = false;
        } else if (error.code === "NotAuthorizedException") {
          this.showErrorMessage = true;
          this.errorMessage = error.message;
        }
        this.signingUp = false;
        this.showSignIn = true;
        this.confirmingSignUp = false;
        this.userNotConfirmed = false;
        this.userNotConfirmedMessage = false;
        this.signUpName = "";
        this.signInPassword = "";
        this.signUpPassword = "";
        this.signUpPasswordRetype = "";
        alert("Error signing in: " + error.message);
        console.log("error signing in", error);
      }
    },
    async forgotPassword() {
      console.log("forgot password");
      this.showForgotPasswordConfirm = true;
      this.showForgotPassword = false;
      try {
        const isSuccess = await Auth.forgotPassword(this.forgottenEmail);
        console.log(isSuccess);
      } catch (error) {
        alert("Error: " + error.message);
        this.showForgottenPasswordError = true;
        this.forgottenPasswordErrorMessage = "Error: " + error.message;
        console.log(error);
      }
    },
    async changePassword() {
      console.log("change password");
      console.log(typeof this.forgottenPasswordConfirmCode);
      try {
        await Auth.forgotPasswordSubmit(
          this.forgottenEmail,
          this.forgottenPasswordConfirmCode,
          this.forgottenPasswordNewPassword
        );
        this.forgottenPasswordConfirmCode = "";
        this.forgottenPasswordNewPassword = "";
        this.forgottenPasswordError = false;
        this.forgottenPasswordErrorMessage = "";
        this.showForgotPasswordConfirm = false;
        this.showSignIn = true;
        this.hideSignInForgottenPassword = false;
        alert(
          "Your password has been changed successfully! You can now go back to the sign in page and sign in using your new password"
        );
      } catch (error) {
        console.log(error);
        alert("Error: " + error.message);
        this.showForgottenPasswordError = true;
        this.forgottenPasswordErrorMessage = "Error: " + error.message;
        this.forgottenPasswordConfirmCode = "";
        this.forgottenPasswordNewPassword = "";
      }
    },
    async createAccount() {
      this.showSignIn = false;

      try {
        const { user } = await Auth.signUp({
          username: this.signUpEmail,
          password: this.signUpPassword,
          attributes: {
            name: this.signUpName,
          },
        });
        this.signingUp = false;
        this.confirmingSignUp = true;
        this.userNotConfirmed = true;
        /*this.signUpEmail = "";
        this.signUpPassword = "";
        this.signUpName = "";*/
        console.log(user, "sign up");
      } catch (error) {
        alert("Error signing up: " + error.message);
        console.log("error signing up:", error);
      }
    },
    async handlePasswords() {
      // if doesnt match regex, show a message saying doesnt match and keep button disabled
      const regex = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/;
      let password;
      let passwordRetype;
      if (this.forgottenEmail) {
        password = this.forgottenPasswordNewPassword;
        passwordRetype = this.forgottenPasswordNewPasswordRetype;
      } else {
        password = this.signUpPassword;
        passwordRetype = this.signUpPasswordRetype;
      }

      const passwordFormat = regex.test(password);
      if (passwordFormat) {
        this.passwordFormatMessage = false;
        if (password === passwordRetype) {
          this.validPassword = true;
          this.passwordsDoNotMatchMessage = false;
        } else {
          this.passwordsDoNotMatchMessage = true;
          this.validPassword = false;
        }
      } else {
        this.passwordFormatMessage = true;
      }
    },
    async confirmSignUp() {
      let email;
      if (this.signInEmail) {
        email = this.signInEmail;
      } else {
        email = this.signUpEmail;
      }
      console.log("confirmSignUp");
      console.log(this.signUpEmail, this.signInEmail);
      try {
        const userConfirm = await Auth.confirmSignUp(
          email,
          this.confirmSignUpCode
        );
        console.log(userConfirm);
        alert("Successfully registered! You will be automatically logged in");
        //this.signUpEmail = "";
        console.log(email, this.signUpPassword);
        this.signIn(this.signUpEmail);
        this.signingUp = false;
        this.showSignIn = true;
        this.confirmingSignUp = false;
        this.userNotConfirmed = false;
        this.userNotConfirmedMessage = false;
        this.confirmSignUpCode = "";
        this.signUpPassword = "";
        this.signUpEmail = "";
      } catch (error) {
        alert("Error confirming sign up: " + error.message);
        this.confirmSignUpCode = "";
        this.signUpPassword = "";
        this.signUpEmail = "";
        console.log("error confirming sign up", error);
      }
    },
    async resendCode() {
      console.log(this.signUpEmail);
      try {
        Auth.resendSignUp(this.signUpEmail);
        alert("Verification code has been sent to registered email");
      } catch (error) {
        alert("Error re-sending verification code: " + error.message);
        console.log("error re-sending verification code", error);
      }
    },
    async signOut() {
      try {
        await Auth.signOut();
        localStorage.removeItem("undercoverElfUserId");
        localStorage.removeItem("undercoverElfName");
        localStorage.removeItem("undercoverElfGroups");
        localStorage.undercoverElfLoggedIn = false;
        this.logOut();
        this.$router.push({ path: "/" });
        console.log("signed out");
      } catch (error) {
        alert("Error signing out: " + error.message);
        console.log("error signing out: ", error);
      }
    },
  },
  data() {
    return {
      showSignIn: true,
      signingUp: false,
      confirmingSignUp: false,
      signInEmail: "",
      signInPassword: "",
      signUpName: "",
      signUpEmail: "",
      signUpPassword: "",
      signUpPasswordRetype: "",
      validPassword: false,
      passwordFormatMessage: false,
      passwordsDoNotMatchMessage: false,
      confirmSignUpCode: "",
      userNotConfirmed: false,
      userNotConfirmedMessage: false,
      showErrorMessage: false,
      errorMessage: "",
      showForgotPassword: false,
      forgottenEmail: "",
      hideSignInForgottenPassword: false,
      forgottenPasswordConfirmCode: "",
      forgottenPasswordNewPassword: "",
      forgottenPasswordNewPasswordRetype: "",
      showForgotPasswordConfirm: false,
      showForgottenPasswordError: false,
      forgottenPasswordErrorMessage: "",
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
