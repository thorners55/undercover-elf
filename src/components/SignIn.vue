<template>
  <div>
    <Loading v-if="loggingIn" />
    <div v-if="!loggedIn" class="top-of-page">
      <!-- if user is signing in, not making new account -->
      <div v-if="!signingUp && !loggingIn">
        <div v-if="showSignIn">
          <div v-if="!hideSignInForgottenPassword">
            <h2>Log in</h2>
            <form
              id="sign-in"
              v-on:submit="
                signIn(signInEmail);
                signUpEmail = '';
                signUpPassword = '';
              "
              v-on:keyup.enter="signIn(signInEmail)"
              v-on:submit.prevent
            >
              <label for="email">Email</label>
              <input type="email" id="email" v-model="signInEmail" />
              <label for="password">Password</label>
              <input
                :type="showSignInPassword ? 'text' : 'password'"
                id="password"
                v-model="signInPassword"
              />

              <input
                type="checkbox"
                v-on:click="toggleShowPassword('signIn')"
                id="show-sign-in-password-checkbox"
                :checked="showSignInPassword ? true : false"
              />
              <label for="show-sign-in-password-checkbox" class="show-password-label">Show password</label>
            </form>
            <p v-if="showErrorMessage" class="message">{{ errorMessage }}</p>
            <button type="button">Log in</button>
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
                :type="showForgotPasswordPassword ? 'text' : 'password'"
                id="forgot-password-new-password"
                @input="handlePasswords"
                v-model="forgottenPasswordNewPassword"
              />

              <label for="forgot-password-new-password">Re-type new password:</label>
              <input
                :type="showForgotPasswordPassword ? 'text' : 'password'"
                id="forgot-password-new-password-retype"
                @input="handlePasswords"
                v-model="forgottenPasswordNewPasswordRetype"
              />
              <input
                type="checkbox"
                v-on:click="toggleShowPassword('forgotPassword')"
                id="show-forgot-password-checkbox"
                :checked="showForgotPasswordPassword ? true : false"
              />
              <label for="show-forgot-password-checkbox" class="show-password-label">Show password</label>
            </form>
            <p
              class="instructions"
              v-if="passwordFormatMessage"
            >Password must be a minimum of 8 characters and contain:</p>
            <ul class="instructions" v-if="passwordFormatMessage">
              <li>At least one uppercase character</li>
              <li>At least one lowercase character</li>
              <li>A special character</li>
              <li>A number</li>
            </ul>
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
        v-if="
          !loggingIn &&
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
          <h2>Create an account</h2>
          <form
            id="create-account"
            v-on:submit="createAccount"
            v-on:keyup.enter="createAccount"
            v-on:submit.prevent
          >
            <label for="name">Name</label>
            <input type="text" id="name" v-model="signUpName" />
            <label for="email">Email</label>
            <input type="email" id="email" v-model="signUpEmail" />
            <label for="password">Password</label>
            <input
              :type="showSignUpPassword ? 'text' : 'password'"
              id="password"
              v-model="signUpPassword"
              @input="handlePasswords"
            />

            <label for="passwordRetype">Re-enter password</label>
            <input
              :type="showSignUpPassword ? 'text' : 'password'"
              id="passwordRetype"
              v-model="signUpPasswordRetype"
              @input="handlePasswords"
            />
            <input
              type="checkbox"
              v-on:click="toggleShowPassword('signUp')"
              id="show-sign-up-password-checkbox"
              :checked="showSignUpPassword ? true : false"
            />
            <label for="show-sign-up-password-checkbox" class="show-password-label">Show password</label>
          </form>
        </div>
        <p
          class="instructions"
          v-if="passwordFormatMessage"
        >Password must be a minimum of 8 characters and contain:</p>
        <ul class="instructions" v-if="passwordFormatMessage">
          <li>At least one uppercase character</li>
          <li>At least one lowercase character</li>
          <li>A special character</li>
          <li>A number</li>
        </ul>
        <p class="message" v-if="passwordsDoNotMatchMessage">Passwords do not match</p>
        <button type="button" for="create-account" :disabled="!validPassword">Create account</button>
        <button
          v-on:click="
            signingUp = false;
            signUpEmail = '';
            signUpPassword = '';
            signUpPasswordRetype = '';
            signUpName = '';
            showSignIn = true;
            showSignUpPassword = false;
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
        <form
          id="confirm-sign-up"
          v-on:submit="confirmSignUp"
          v-on:keyup.enter="confirmSignUp"
          v-on:submit.prevent
        >
          <label for="code">Verification code:</label>
          <input type="text" id="password" v-model="confirmSignUpCode" />
        </form>
        <p class="instructions">
          Please enter the verification code sent to your email. If you do not
          receive an email, check your junk folder.
        </p>

        <button for="confirm-sign-up" type="submit">Submit verification code</button>
        <button v-on:click="resendCode">Re-send verification code</button>
        <button
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
          alert("Error signing in: " + error.message);
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
      }
    },
    toggleShowPassword(signInUpOrForgotPassword) {
      if (signInUpOrForgotPassword === "signIn") {
        this.showSignInPassword = !this.showSignInPassword;
      } else if (signInUpOrForgotPassword === "signUp") {
        this.showSignUpPassword = !this.showSignUpPassword;
      } else {
        this.showForgotPasswordPassword = !this.showForgotPasswordPassword;
      }
    },
    async forgotPassword() {
      try {
        const isSuccess = await Auth.forgotPassword(this.forgottenEmail);
        this.showForgotPasswordConfirm = true;
        this.showForgotPassword = false;
      } catch (error) {
        this.showForgotPassword = true;
        this.showForgotPasswordConfirm = false;
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
      this.loggingIn = true;
      let email;
      if (this.signInEmail) {
        email = this.signInEmail;
      } else {
        email = this.signUpEmail;
      }
      try {
        this.loggingIn = true;
        this.confirmingSignUp = false;
        const userConfirm = await Auth.confirmSignUp(
          email,
          this.confirmSignUpCode
        );

        //this.signUpEmail = "";
        this.signIn(email);
        this.signingUp = false;
        this.showSignIn = true;
        this.confirmingSignUp = false;
        this.userNotConfirmed = false;
        this.userNotConfirmedMessage = false;
        this.confirmSignUpCode = "";
        this.signUpPassword = "";
        this.signUpEmail = "";
        alert(
          "Successfully registered! Click OK to be be automatically logged in"
        );
      } catch (error) {
        this.confirmingSignUp = true;
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
      showSignInPassword: false,
      showSignUpPassword: false,
      showForgotPasswordPassword: false,
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

button:disabled {
  background-color: rgb(206, 203, 203);
  color: grey;
}

#sign-in {
  display: grid;
  grid-template-columns: 10ch auto;
  row-gap: 1ch;
  margin-left: auto;
  margin-right: auto;
  width: 30%;
}

input[type="checkbox"] {
  margin-left: auto;
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

.instructions {
  color: #2c3e50;
  font-weight: bold;
  margin-bottom: 2ch;
}

.instructions > li {
  margin: 0.5ch;
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

  input {
    display: block;
    margin: auto;
  }

  input[type="checkbox"] {
    display: inline-block;
    margin: 1ch;
  }

  .show-password-label {
    display: inline-block;
  }
}
</style>
