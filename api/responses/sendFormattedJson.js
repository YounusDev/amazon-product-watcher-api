module.exports = function sendFunction(obj, omit = [], checkChild = true) {

    let formattedData = formatFunc(_.cloneDeep(obj), omit, checkChild);

    return this.res.json(formattedData);
};

function formatFunc(obj, omit, checkChild) {

    let formattedData = {};

    Object.keys(obj).forEach((name) => {
        let val = obj[name];

        if (!omit.includes(name)) {

            if (_.isPlainObject(val) && checkChild) {
                formattedData[name] = formatFunc(val, omit, checkChild);
            } else {
                formattedData[name] = val;
            }
        }
    });

    return formattedData;
}
