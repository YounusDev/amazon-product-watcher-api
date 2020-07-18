module.exports = async function (req, res) {
    let logIds = req.param('ids')

    for (const id of logIds) {
        await ServiceLog.getDatastore().manager.collection(ServiceLog.tableName).updateOne(
            {
                _id: sails.ObjectId(id),
                seen_by: {$not : {$in: [req.me.id]}}
            },
            {
                $addToSet: {
                    seen_by: req.me.id
                }
            }
        );
    }

    return res.status(200).json({ notifications_update: true });
};

