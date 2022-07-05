function Validator(option) {
    // get the parent form
    const form = document.querySelector(option.form);
    let isValid = true;

    if (form) {

        option.rules.forEach(rule => {

            const target = form.querySelector(rule.selector);
            let errMsg = '';
            if (target) {
                errMsg = rule.test(target, rule?.list, rule?.fieldName, rule?.currentID);
                console.log(errMsg)

                const msgForm = target.nextElementSibling.classList.contains('form-message') ? target.nextElementSibling : undefined;
                if (errMsg) {
                    if (msgForm) {
                        msgForm.innerHTML = errMsg;
                    }

                    isValid = false;
                }

                target.oninput = () => {
                    msgForm.innerHTML = '';
                }
            }
        })

        return isValid;
    }
}

// rules
Validator.isRequired = (selector) => {
    return {
        selector,
        test: function(target) {
            return target.value.length <= 0 || target.value == undefined ? 'This field cannot be empty' : '';
        }
    }
}

Validator.isUnique = (selector, list, fieldName, currentID) => {

    return {
        selector,
        list,
        fieldName,
        currentID,
        test: function(target, list, fieldName, currentID) {

            let item;
            if (currentID !== undefined) {
                item = list.find(e => {
                    return e[fieldName] == target.value && currentID !== e['book_id'];
                })
            }
            else {
                item = list.find(e => {
                    return e[fieldName] == target.value;
                })
            }

            return item != undefined ? `The ${fieldName} has already existed` : '';
        }
    }
}