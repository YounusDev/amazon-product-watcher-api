module.exports.objectHasAnyValue = function (obj, omitEmpty = false, checkChild = false, exclude = [], only = []) {
    let found        = false;
    let formattedObj = {};
    
    Object.keys(obj).forEach(objKey => {
        let val = obj[objKey];
        
        if (!_.isPlainObject(val)) {
            if (!only.length) {
                if (!exclude.includes(objKey)) {
                    if (val) {
                        found                = true
                        formattedObj[objKey] = val;
                    } else {
                        if (!omitEmpty) formattedObj[objKey] = val;
                    }
                } else {
                    // make a decisions first what you want to do with excluded val. assign or not
                    // formattedObj[objKey] = val;
                }
            } else {
                // only if only does not has any key
            }
        } else {
            //untested
            
            // let returnedObj = objectHasAnyValue(val);
            // found = returnedObj.status;
            // formattedObj[objKey] = returnedObj.formattedObject
        }
    })
    
    return {status     : found,
        formattedObject: formattedObj
    }
}

module.exports.objectKeysToSnakeCase = function (obj) {
    let snakeCaseObject = {};
    _.forEach(
        obj,
        (value, key) => {
            if (_.isPlainObject(value) || _.isArray(value)) {
                value = this.objectKeysToSnakeCase(value);
            }
            snakeCaseObject[_.snakeCase(key)] = value;
        }
    );
    return snakeCaseObject;
};
