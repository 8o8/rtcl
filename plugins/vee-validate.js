import Vue from 'vue'
import VeeValidate from 'vee-validate'

const config = {
    delay: 500,
    strict: false,
}

Vue.use(VeeValidate, config)

VeeValidate.Validator.extend('verify_password', {
    getMessage: field => `Password must contain a mix of upper and lower case letters, and at least 1 number`,
    validate: value => {
        //var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
        return strongRegex.test(value);
    }
});