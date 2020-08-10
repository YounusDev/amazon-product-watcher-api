module.exports.validate = function (req, res, fields) {
    let errors = {};

    Object.keys(fields).forEach((fieldName) => {
        let response = "";

        response = checkValidation(
            req,
            fieldName,
            _.isPlainObject(fields[fieldName])
                ? fields[fieldName].rule
                : fields[fieldName]
        );

        // if (_.isPlainObject(fields[fieldName])) {
        // errors[fieldName] = checkValidation(req, fieldName, fields[fieldName].rule);
        // } else {
        // errors[fieldName] = checkValidation(req, fieldName, fields[fieldName]);
        // }

        if (response) {
            errors[fieldName] = response;
        }
    });

    if (Object.keys(errors).length) {
        return res.status(422).json({ errors: errors }) && false;
    }

    return true;

    /*if (commonHelpers.objectHasAnyValue(errors).status) {

        res.json({errors: commonHelpers.objectHasAnyValue(errors, true).formattedObject})

        return false;
    } else {
        return true
    }*/
};

function checkValidation(req, fieldName, fieldInfo) {
    let error = "";
    let rules = fieldInfo.split("|");

    rules.forEach((rule) => {
        if (!error) {
            if (rule === "required") {
                if (!req.param(fieldName)) {
                    error = _.lowerCase(fieldName) + " field is required";
                }
            } else if (rule === "string") {
                if (!_.isString(req.param(fieldName))) {
                    error = _.lowerCase(fieldName) + " field must be string";
                }
            } else if (rule === "email") {
                let re = /\S+@\S+\.\S+/;
                let isMail = re.test(
                    String(req.param(fieldName)).toLowerCase()
                );

                if (!isMail) {
                    error = _.lowerCase(fieldName) + " field must be email";
                }
            } else if (rule === "confirmed") {
                if (req.param(fieldName) !== req.param("confirm_password")) {
                    error =
                        _.lowerCase(fieldName) +
                        " and confirm password does not match";
                }
            } else if (rule.includes("min")) {
                let ruleInfo = rule.split(":"),
                    value = ruleInfo[1];

                if (req.param(fieldName).length < value) {
                    error =
                        _.lowerCase(fieldName) +
                        " must be at least " +
                        value +
                        " characters.";
                }
            }
        }
    });

    return error;
}
