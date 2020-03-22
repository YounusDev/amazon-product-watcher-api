module.exports = async function sendFormattedJson(obj, omit = [], checkChild = true) {

    try {
        await Object.keys(obj).forEach((item) => {

            let attr = obj[item];

            if (_.isPlainObject(attr)) {

                if (checkChild) {

                    Object.keys(attr).forEach((childItem) => {

                        let childAttr = attr[childItem];

                        if (_.isPlainObject(childAttr)) {
                            sendFormattedJson(childAttr, omit);
                        } else {
                            removeOmitAttr(attr, omit);
                        }
                    });
                }
            } else {
                removeOmitAttr(obj, omit);
            }
        });

        return this.res.json(obj);

    } catch (e) {}
};

function removeOmitAttr(obj, omit) {

    delete obj.createdAt;
    delete obj.updatedAt;

    if (omit.length > 0) {
        omit.forEach((item) => {
            delete obj[item];
        });
    }
}
