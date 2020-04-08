module.exports = async function (req, res) {

    let userProjectId = req.param('id');
    let affiliateIds = req.param('affiliate_ids');
    let status = req.param('status');

    let userProject = await UserDomain.findOne({
        id    : userProjectId,
        userId: req.me.id
    });

    if (!userProject) {
        return res.status(404).json({message: 'invalid project id'});
    }

    if (!request.validate(req, res, {
        'affiliateIds': 'required',
        'status'  : 'required'
    })) return;


    await UserDomain.updateOne({userId: req.me.id, id: userProject.id})
        .set({
            domainUseFor    : {
                amazonProductService : {
                    affiliateIds : affiliateIds,
                    status: status
                }
            }
        });

    let updatedProduct = await UserDomain.withDomain({userId: req.me.id, id: userProject.id});

    return res.status(200).json({
        amazonProduct: updatedProduct
    });
}