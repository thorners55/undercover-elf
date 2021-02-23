<template>
  <div>
    <Loading v-if="signIn.loggingIn" />
    <div v-if="!loggedIn" class="top-of-page">
      <!-- START if user is signing in, not making new account -->
      <div v-if="!signIn.signingUp && !signIn.loggingIn">
        <div v-if="signIn.showSignIn">
          <div v-if="!forgotPassword.hideSignInForgottenPassword">
            <h2>Log in</h2>
            <form
              id="sign-in"
              v-on:keyup.enter="signInFunc(signIn.signInEmail)"
              v-on:submit.prevent
            >
              <label for="email">Email</label>
              <input type="email" id="email" v-model="signIn.signInEmail" />
              <label for="password">Password</label>
              <input
                :type="signIn.showSignInPassword ? 'text' : 'password'"
                id="password"
                v-model="signIn.signInPassword"
              />

              <input
                type="checkbox"
                v-on:click="toggleShowPassword('signIn')"
                id="show-sign-in-password-checkbox"
                :checked="signIn.showSignInPassword ? true : false"
              />
              <label
                for="show-sign-in-password-checkbox"
                class="show-password-label"
                >Show password</label
              >
            </form>
            <p v-if="errors.showErrorMessage" class="message">
              {{ errors.errorMessage }}
            </p>
            <!-- can't put button inside form for styling reasons--->
            <button
              for="sign-in"
              type="submit"
              v-on:click="
                signInFunc(signIn.signInEmail);
                signUp.signUpEmail = '';
                signUp.signUpPassword = '';
              "
            >
              Log in
            </button>
            <button
              v-on:click="
                forgotPassword.showForgotPassword = true;
                forgotPassword.hideSignInForgottenPassword = true;
              "
            >
              Forgotten password?
            </button>
          </div>
          <!-- if user has forgotten password START -->
          <div v-if="forgotPassword.showForgotPassword">
            <form
              id="forgot-password"
              v-on:submit.prevent
              v-on:keyup.enter="forgotPasswordFunc"
            >
              <label for="forgot-password-email">Email:</label>
              <input
                type="email"
                id="forgot-password-email"
                v-model="forgotPassword.forgottenEmail"
              />
            </form>
            <!-- can't put button inside form for styling reasons--->
            <button
              for="forgot-password"
              type="button"
              v-on:click="forgotPasswordFunc"
            >
              Reset password
            </button>
            <button
              type="button"
              v-on:click="
                forgotPassword.hideSignInForgottenPassword = false;
                forgotPassword.showForgotPassword = false;
              "
            >
              Back to sign in
            </button>
          </div>
          <div v-if="forgotPassword.showForgotPasswordConfirm">
            <p
              v-if="forgotPassword.showForgottenPasswordError"
              class="instructions"
            >
              {{ forgotPassword.forgottenPasswordErrorMessage }}
            </p>
            <p>Email: {{ forgotPassword.forgottenEmail }}</p>
            <form
              id="forgot-password-confirm"
              v-on:keyup.enter="changePassword"
              v-on:submit.prevent
            >
              <label for="forgot-password-confirm-code">Code:</label>
              <input
                type="text"
                id="forgot-password-confirm-code"
                v-model="forgotPassword.forgottenPasswordConfirmCode"
              />
              <label for="forgot-password-new-password">New password:</label>
              <input
                :type="
                  forgotPassword.showForgotPasswordPassword
                    ? 'text'
                    : 'password'
                "
                id="forgot-password-new-password"
                @input="handlePasswords"
                v-model="forgotPassword.forgottenPasswordNewPassword"
              />

              <label for="forgot-password-new-password"
                >Re-type new password:</label
              >
              <input
                :type="
                  forgotPassword.showForgotPasswordPassword
                    ? 'text'
                    : 'password'
                "
                id="forgot-password-new-password-retype"
                @input="handlePasswords"
                v-model="forgotPassword.forgottenPasswordNewPasswordRetype"
              />
              <input
                type="checkbox"
                v-on:click="toggleShowPassword('forgotPassword')"
                id="show-forgot-password-checkbox"
                :checked="
                  forgotPassword.showForgotPasswordPassword ? true : false
                "
              />
              <label
                for="show-forgot-password-checkbox"
                class="show-password-label"
                >Show password</label
              >
            </form>
            <p class="instructions" v-if="passwordFormat.passwordFormatMessage">
              Password must be a minimum of 8 characters and contain:
            </p>
            <ul
              class="instructions"
              v-if="passwordFormat.passwordFormatMessage"
            >
              <li>At least one uppercase character</li>
              <li>At least one lowercase character</li>
              <li>A special character</li>
              <li>A number</li>
            </ul>
            <p class="message" v-if="passwordFormat.passwordsDoNotMatchMessage">
              Passwords do not match
            </p>
            <!-- can't put button inside form for styling reasons--->
            <button
              type="button"
              for="forgot-password-confirm"
              v-on:click="changePassword"
              :disabled="!passwordFormat.validPassword"
            >
              Change password
            </button>

            <button
              v-if="forgotPassword.showForgotPasswordConfirm"
              v-on:click="
                forgotPassword.showForgotPassword = false;
                forgotPassword.hideSignInForgottenPassword = false;
                forgotPassword.showForgotPasswordConfirm = false;
                forgotPassword.forgottenEmail = '';
              "
            >
              Back to sign in
            </button>
          </div>
          <!-- if user has forgotten password END -->
        </div>
      </div>
      <div
        v-if="
          !signIn.loggingIn &&
            !signIn.signingUp &&
            !unconfirmedUser.userNotConfirmed &&
            !forgotPassword.showForgotPassword &&
            !forgotPassword.showForgotPasswordConfirm
        "
      >
        <p>Don't have an account?</p>
        <button
          v-on:click="
            (signIn.signingUp = true), (signIn.signInEmail = '');
            signIn.signInPassword = '';
          "
        >
          Create an account
        </button>
      </div>
      <!-- END if user is signing in, not making new account -->

      <!-- START if making new account (signing up) -->
      <div v-if="signIn.signingUp">
        <div id="signup-grid">
          <div></div>
          <h2>Create an account</h2>
          <form
            id="create-account"
            v-on:keyup.enter="createAccount"
            v-on:submit.prevent
          >
            <label for="name">Name</label>
            <input type="text" id="name" v-model="signUp.signUpName" />
            <label for="email">Email</label>
            <input type="email" id="email" v-model="signUp.signUpEmail" />
            <label for="password">Password</label>
            <input
              :type="signUp.showSignUpPassword ? 'text' : 'password'"
              id="password"
              v-model="signUp.signUpPassword"
              @input="handlePasswords"
            />

            <label for="passwordRetype">Re-enter password</label>
            <input
              :type="signUp.showSignUpPassword ? 'text' : 'password'"
              id="passwordRetype"
              v-model="signUp.signUpPasswordRetype"
              @input="handlePasswords"
            />
            <input
              type="checkbox"
              v-on:click="toggleShowPassword('signUp')"
              id="show-sign-up-password-checkbox"
              :checked="signUp.showSignUpPassword ? true : false"
            />
            <label
              for="show-sign-up-password-checkbox"
              class="show-password-label"
              >Show password</label
            >
          </form>
        </div>
        <p class="instructions" v-if="passwordFormat.passwordFormatMessage">
          Password must be a minimum of 8 characters and contain:
        </p>
        <ul class="instructions" v-if="passwordFormat.passwordFormatMessage">
          <li>At least one uppercase character</li>
          <li>At least one lowercase character</li>
          <li>A special character</li>
          <li>A number</li>
        </ul>
        <p class="message" v-if="passwordFormat.passwordsDoNotMatchMessage">
          Passwords do not match
        </p>
        <!-- can't put button inside form for styling reasons--->
        <button
          type="submit"
          for="create-account"
          v-on:click="createAccount"
          :disabled="!passwordFormat.validPassword"
        >
          Create account
        </button>
        <button
          v-on:click="
            signIn.signingUp = false;
            signUp.signUpEmail = '';
            signUp.signUpPassword = '';
            signUp.signUpPasswordRetype = '';
            signUp.signUpName = '';
            signIn.showSignIn = true;
            signUp.showSignUpPassword = false;
          "
        >
          Back to sign in
        </button>
      </div>
      <!-- END if making new account (signing up) -->

      <!-- START if have made new account but have not confirmed -->
      <div v-if="signIn.confirmingSignUp">
        <p>
          Email:
          {{ signUp.signUpEmail ? signUp.signUpEmail : signIn.signInEmail }}
        </p>
        <p
          v-if="
            unconfirmedUser.userNotConfirmed &&
              unconfirmedUser.userNotConfirmedMessage
          "
          class="message"
        >
          You must confirm your account to sign in
        </p>
        <form
          id="confirm-sign-up"
          v-on:keyup.enter="confirmSignUp"
          v-on:submit.prevent
        >
          <label for="code">Verification code:</label>
          <input type="text" id="password" v-model="signUp.confirmSignUpCode" />
        </form>
        <p class="instructions">
          Please enter the verification code sent to your email. If you do not
          receive an email, check your junk folder.
        </p>
        <!-- can't put button inside form for styling reasons--->
        <button for="confirm-sign-up" type="submit" v-on:click="confirmSignUp">
          Submit verification code
        </button>
        <button v-on:click="resendCode">Re-send verification code</button>
        <button
          v-on:click="
            signIn.signingUp = false;
            signIn.showSignIn = true;
            signIn.confirmingSignUp = false;
            unconfirmedUser.userNotConfirmed = false;
            unconfirmedUser.userNotConfirmedMessage = false;
            signUp.signUpName = '';
            signUp.signUpEmail = '';
            signUp.signUpName = '';
            signIn.signInEmail = '';
            signIn.signInPassword = '';
          "
        >
          Back to sign in
        </button>
      </div>
      <!-- END if have made new account but have not confirmed -->
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
    Loading,
  },
  computed: {
    ...mapState("loggedIn", ["loggedIn"]),
    ...mapState("loggedIn", ["name"]),
  },
  methods: {
    ...mapActions("loggedIn", ["logIn", "logOut"]),
    // methods reset data (input fields and what is shown) according to what makes sense with the user experience - sometimes will reset data and sometimes won't, e.g. if logging in and is an incorrect password, will reset the password field but not the sign in email
    async signInFunc(email) {
      this.signIn.loggingIn = true;
      let password;
      if (this.signIn.signInPassword.length > 1) {
        password = this.signIn.signInPassword;
      } else {
        password = this.signUp.signUpPassword;
      }
      try {
        aws.config.update({ region: "eu-west-2" });
        let user = await Auth.signIn(email, password);
        let payload = { userId: user.username, name: user.attributes.name };
        this.logIn(payload);
      } catch (error) {
        this.signIn.loggingIn = false;
        this.signIn.showSignIn = true;
        if (error.message === "User is not confirmed.") {
          this.unconfirmedUser.userNotConfirmed = true;
          this.unconfirmedUser.userNotConfirmedMessage = true;
          this.signIn.showSignIn = false;
          this.signIn.confirmingSignUp = true;
        } else if (error.code === "NotAuthorizedException") {
          this.errors.showErrorMessage = true;
          this.errors.errorMessage = error.message;
        } else {
          alert("Error signing in: " + error.message);
          this.signIn.signingUp = false;
          this.signIn.showSignIn = true;
          this.signIn.confirmingSignUp = false;
          this.unconfirmedUser.userNotConfirmed = false;
          this.unconfirmedUser.userNotConfirmedMessage = false;
          this.signUp.signUpName = "";
          this.signIn.signInPassword = "";
          this.signUp.signUpPassword = "";
          this.signUp.signUpPasswordRetype = "";
        }
      }
    },
    toggleShowPassword(signInUpOrForgotPassword) {
      if (signInUpOrForgotPassword === "signIn") {
        this.signIn.showSignInPassword = !this.signIn.showSignInPassword;
      } else if (signInUpOrForgotPassword === "signUp") {
        this.signUp.showSignUpPassword = !this.signUp.showSignUpPassword;
      } else {
        this.forgotPassword.showForgotPasswordPassword = !this.forgotPassword
          .showForgotPasswordPassword;
      }
    },
    async forgotPasswordFunc() {
      try {
        const isSuccess = await Auth.forgotPassword(
          this.forgotPassword.forgottenEmail
        );
        this.forgotPassword.showForgotPasswordConfirm = true;
        this.forgotPassword.showForgotPassword = false;
      } catch (error) {
        this.forgotPassword.showForgotPassword = true;
        this.forgotPassword.showForgotPasswordConfirm = false;
        alert("Error: " + error.message);
        this.forgotPassword.showForgottenPasswordError = true;
        this.forgotPassword.forgottenPasswordErrorMessage =
          "Error: " + error.message;
        console.log(error);
      }
    },
    async changePassword() {
      try {
        await Auth.forgotPasswordSubmit(
          this.forgotPassword.forgottenEmail,
          this.forgotPassword.forgottenPasswordConfirmCode,
          this.forgotPassword.forgottenPasswordNewPassword
        );
        this.forgotPassword.forgottenPasswordConfirmCode = "";
        this.forgotPassword.forgottenPasswordNewPassword = "";
        this.forgottenPasswordError = false;
        this.forgotPassword.forgottenPasswordErrorMessage = "";
        this.forgotPassword.showForgotPasswordConfirm = false;
        this.signIn.showSignIn = true;
        this.forgotPassword.hideSignInForgottenPassword = false;
        alert(
          "Your password has been changed successfully! You can now go back to the sign in page and sign in using your new password"
        );
      } catch (error) {
        console.log(error);
        alert("Error: " + error.message);
        this.forgotPassword.showForgottenPasswordError = true;
        this.forgotPassword.forgottenPasswordErrorMessage =
          "Error: " + error.message;
        this.forgotPassword.forgottenPasswordConfirmCode = "";
        this.forgotPassword.forgottenPasswordNewPassword = "";
        this.forgotPassword.forgottenPasswordNewPasswordRetype = "";
      }
    },
    async createAccount() {
      this.signIn.showSignIn = false;
      try {
        const { user } = await Auth.signUp({
          username: this.signUp.signUpEmail,
          password: this.signUp.signUpPassword,
          attributes: {
            name: this.signUp.signUpName,
          },
        });
        this.signIn.signingUp = false;
        this.signIn.confirmingSignUp = true;
        this.unconfirmedUser.userNotConfirmed = true;
      } catch (error) {
        alert("Error signing up: " + error.message);
        console.log("error signing up:", error);
      }
    },
    async confirmSignUp() {
      this.signIn.loggingIn = true;
      let email;
      if (this.signIn.signInEmail) {
        email = this.signIn.signInEmail;
      } else {
        email = this.signUp.signUpEmail;
      }
      try {
        this.signIn.loggingIn = true;
        this.signIn.confirmingSignUp = false;
        const userConfirm = await Auth.confirmSignUp(
          email,
          this.signUp.confirmSignUpCode
        );
        this.signInFunc(email);
        this.signIn.signingUp = false;
        this.signIn.showSignIn = true;
        this.signIn.confirmingSignUp = false;
        this.unconfirmedUser.userNotConfirmed = false;
        this.unconfirmedUser.userNotConfirmedMessage = false;
        this.signUp.confirmSignUpCode = "";
        this.signUp.signUpPassword = "";
        this.signUp.signUpEmail = "";
        alert(
          "Successfully registered! Click OK to be be automatically logged in"
        );
      } catch (error) {
        this.signIn.confirmingSignUp = true;
        alert("Error confirming sign up: " + error.message);
        this.signUp.confirmSignUpCode = "";
        console.log("error confirming sign up", error);
      }
    },
    async resendCode() {
      try {
        Auth.resendSignUp(this.signUp.signUpEmail);
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
      if (this.forgotPassword.forgottenEmail) {
        password = this.forgotPassword.forgottenPasswordNewPassword;
        passwordRetype = this.forgotPassword.forgottenPasswordNewPasswordRetype;
      } else {
        password = this.signUp.signUpPassword;
        passwordRetype = this.signUp.signUpPasswordRetype;
      }

      const passwordFormat = regex.test(password);
      if (passwordFormat) {
        this.passwordFormat.passwordFormatMessage = false;
        if (password === passwordRetype) {
          this.passwordFormat.validPassword = true;
          this.passwordFormat.passwordsDoNotMatchMessage = false;
        } else {
          this.passwordFormat.passwordsDoNotMatchMessage = true;
          this.passwordFormat.validPassword = false;
        }
      } else {
        this.passwordFormat.passwordFormatMessage = true;
      }
    },
  },
  data() {
    return {
      signIn: {
        loggingIn: false,
        showSignIn: true,
        signingUp: false,
        signInEmail: "",
        signInPassword: "",
        showSignInPassword: false,
      },
      signUp: {
        confirmingSignUp: false,
        showSignUpPassword: false,
        signUpName: "",
        signUpEmail: "",
        signUpPassword: "",
        signUpPasswordRetype: "",
        confirmSignUpCode: "",
      },
      passwordFormat: {
        validPassword: false,
        passwordFormatMessage: false,
        passwordsDoNotMatchMessage: false,
      },
      unconfirmedUser: {
        userNotConfirmed: false,
        userNotConfirmedMessage: false,
      },
      forgotPassword: {
        hideSignInForgottenPassword: false,
        forgottenEmail: "",
        showForgotPasswordPassword: false,
        showForgotPassword: false,
        forgottenPasswordConfirmCode: "",
        forgottenPasswordNewPassword: "",
        forgottenPasswordNewPasswordRetype: "",
        showForgotPasswordConfirm: false,
        showForgottenPasswordError: false,
        forgottenPasswordErrorMessage: "",
      },
      errors: {
        showErrorMessage: false,
        errorMessage: "",
      },
    };
  },
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
