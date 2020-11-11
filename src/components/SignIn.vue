<template>
  <div>
    <Loading v-if="loggingIn" />
    <div v-if="!loggedIn" class="top-of-page">
      <!-- if user is signing in, not making new account -->
      <div v-if="!signingUp && !loggingIn">
        <div v-if="showSignIn">
          <div v-if="!hideSignInForgottenPassword">
            <h2>Log in</h2>
            <form id="sign-in" v-on:keyup.enter="signIn(signInEmail)" v-on:submit.prevent>
              <label for="email">Email</label>
              <input type="email" id="email" v-model="signInEmail" />
              <label for="password">Password</label>
              <input type="password" id="password" v-model="signInPassword" />
            </form>
            <p v-if="showErrorMessage" class="message">{{ errorMessage }}</p>
            <button
              type="button"
              v-on:click="
                signIn(signInEmail);
                signUpEmail = '';
                signUpPassword = '';
              "
            >Log in</button>
            <button
              v-on:click="
                showForgotPassword = true;
                hideSignInForgottenPassword = true;
              "
            >Forgotten password?</button>
          </div>
          <div v-if="showForgotPassword">
            <form id="forgot-password" v-on:submit.prevent v-on:keyup.enter="forgotPassword">
              <!-- FIX -->
              <label for="forgot-password-email">Email:</label>
              <input type="email" id="forgot-password-email" v-model="forgottenEmail" />
            </form>
            <button for="forgot-password" type="button" v-on:click="forgotPassword">Reset password</button>

            <button
              type="button"
              v-on:click="
                hideSignInForgottenPassword = false;
                showForgotPassword = false;
              "
            >Back to sign in</button>
          </div>
          <div v-if="showForgotPasswordConfirm">
            <p v-if="showForgottenPasswordError">{{ forgottenPasswordErrorMessage }}</p>
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

              <label for="forgot-password-new-password">Re-type new password:</label>
              <input
                type="password"
                id="forgot-password-new-password-retype"
                @input="handlePasswords"
                v-model="forgottenPasswordNewPasswordRetype"
              />
            </form>
            <p class="message" v-if="passwordFormatMessage">
              Password must be a minimum of 8 characters, contain at least one
              uppercase and one lowercase character, and one special character
            </p>
            <p class="message" v-if="passwordsDoNotMatchMessage">Passwords do not match</p>
            <button
              type="button"
              for="forgot-password-confirm-code"
              v-on:click="changePassword"
              :disabled="!validPassword"
            >Change password</button>

            <button
              v-if="showForgotPasswordConfirm"
              v-on:click="
                showForgotPassword = false;
                hideSignInForgottenPassword = false;
                showForgotPasswordConfirm = false;
                forgottenEmail = '';
              "
            >Back to sign in</button>
          </div>
          <!-- if user has signed up but has not confirmed email -->
        </div>
      </div>

      <!-- if not making new account (signing up) -->
      <div
        v-if=" !loggingIn &&
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
        >Create an account</button>
      </div>

      <!-- if making new account (signing up) -->
      <div v-if="signingUp">
        <div id="signup-grid">
          <div></div>
          <form v-on:keyup.enter="createAccount" v-on:submit.prevent>
            <label for="name">Name</label>
            <input type="text" id="name" v-model="signUpName" />
            <label for="email">Email</label>
            <input type="email" id="email" v-model="signUpEmail" />
            <label for="password">Password</label>
            <input type="password" id="password" v-model="signUpPassword" @input="handlePasswords" />

            <label for="passwordRetype">Re-enter password</label>
            <input
              type="password"
              id="passwordRetype"
              v-model="signUpPasswordRetype"
              @input="handlePasswords"
            />
          </form>
        </div>
        <p class="message" v-if="passwordFormatMessage">
          Password must be a minimum of 8 characters, contain at least one
          uppercase and one lowercase character, and one special character
        </p>
        <p class="message" v-if="passwordsDoNotMatchMessage">Passwords do not match</p>
        <button type="button" v-on:click="createAccount" :disabled="!validPassword">Create account</button>

        <button
          v-on:click="
            signingUp = false;
            signUpEmail = '';
            signUpPassword = '';
            signUpName = '';
            showSignIn = true;
          "
        >Back to sign in</button>
      </div>
      <!-- if have made new account but have not confirmed -->
      <div v-if="confirmingSignUp">
        <p>Email: {{ signUpEmail ? signUpEmail : signInEmail }}</p>
        <p
          v-if="userNotConfirmed && userNotConfirmedMessage"
          class="message"
        >You must confirm your account to sign in</p>
        <form v-on:keyup.enter="confirmSignUp" v-on:submit.prevent>
          <label for="code">Verification code:</label>
          <input type="text" id="password" v-model="confirmSignUpCode" />
        </form>

        <p class="message">Enter the verification code sent to your email</p>

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
        >Back to sign in</button>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "./Loading.vue";
import { Auth } from "aws-amplify";
var aws = require("aws-sdk");
import { mapActions, mapState } from "vuex";

//  <button v-on:click="confirmSignUp">Confirm sign up</button>

export default {
  name: "SignIn",
  components: {
    Loading
  },
  computed: {
    ...mapState("loggedIn", ["loggedIn"]),
    ...mapState("loggedIn", ["name"])
  },
  methods: {
    ...mapActions("loggedIn", ["logIn", "logOut"]),
    async signIn(email) {
      this.loggingIn = true;
      let password;
      if (this.signInPassword.length > 1) {
        password = this.signInPassword;
      } else {
        password = this.signUpPassword;
      }
      try {
        aws.config.update({ region: "eu-west-2" });
        let user = await Auth.signIn(email, password);
        let payload = { userId: user.username, name: user.attributes.name };
        this.logIn(payload);
        this.loggingIn = false;
        this.signInEmail = "";
        this.signInPassword = "";
        this.signUpName = "";
        this.signUpEmail = "";
        this.signUpPassword = "";
        this.signUpPasswordRetype = "";
        this.showErrorMessage = false;
      } catch (error) {
        this.loggingIn = false;
        this.showSignIn = true;
        if (error.message === "User is not confirmed.") {
          this.userNotConfirmed = true;
          this.userNotConfirmedMessage = true;
          this.showSignIn = false;
          this.confirmingSignUp = true;
        } else if (error.code === "NotAuthorizedException") {
          this.showErrorMessage = true;
          this.errorMessage = error.message;
        } else {
          this.signingUp = false;
          this.showSignIn = true;
          this.confirmingSignUp = false;
          this.userNotConfirmed = false;
          this.userNotConfirmedMessage = false;
          this.signUpName = "";
          this.signInPassword = "";
          this.signUpPassword = "";
          this.signUpPasswordRetype = "";
        }
        alert("Error signing in: " + error.message);
      }
    },
    async forgotPassword() {
      this.showForgotPasswordConfirm = true;
      this.showForgotPassword = false;
      try {
        const isSuccess = await Auth.forgotPassword(this.forgottenEmail);
      } catch (error) {
        alert("Error: " + error.message);
        this.showForgottenPasswordError = true;
        this.forgottenPasswordErrorMessage = "Error: " + error.message;
        console.log(error);
      }
    },
    async changePassword() {
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
            name: this.signUpName
          }
        });
        this.signingUp = false;
        this.confirmingSignUp = true;
        this.userNotConfirmed = true;
        /*this.signUpEmail = "";
        this.signUpPassword = "";
        this.signUpName = "";*/
      } catch (error) {
        alert("Error signing up: " + error.message);
        console.log("error signing up:", error);
      }
    },

    async confirmSignUp() {
      let email;
      if (this.signInEmail) {
        email = this.signInEmail;
      } else {
        email = this.signUpEmail;
      }
      try {
        const userConfirm = await Auth.confirmSignUp(
          email,
          this.confirmSignUpCode
        );
        alert("Successfully registered! You will be automatically logged in");
        //this.signUpEmail = "";
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

        console.log("error confirming sign up", error);
      }
    },
    async resendCode() {
      try {
        Auth.resendSignUp(this.signUpEmail);
        alert("Verification code has been sent to registered email");
      } catch (error) {
        alert("Error re-sending verification code: " + error.message);
        console.log("error re-sending verification code", error);
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
    }
  },
  data() {
    return {
      loggingIn: false,
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
      forgottenPasswordErrorMessage: ""
    };
  }
};
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  padding: 0.5rem;
}

button {
  margin: 1rem auto;
  display: block;
  align-items: center;
}

#sign-in {
  display: grid;
  grid-template-columns: 10ch auto;
  row-gap: 1ch;
  margin-left: auto;
  margin-right: auto;
  width: 30%;
}

form {
  display: grid;
  grid-template-columns: 40% auto;
  row-gap: 1ch;
  margin-left: auto;
  margin-right: auto;
  width: 40%;
}
label {
  text-align: left;
}

@media (max-width: 900px) {
  #sign-in {
    display: block;
    width: auto;
  }
  form {
    display: block;
    margin: 0;
    margin: auto;
    width: auto;
  }

  label {
    text-align: center;
    display: block;
  }
}
</style>
