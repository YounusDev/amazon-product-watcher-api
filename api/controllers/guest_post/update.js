module.exports = async function (req, res) {
    let userProjectId = req.param('id');
    let status        = req.param('status');
    let guestDomain   = req.param('guest_domain');
    let urls          = req.param('urls');

    let userProject = await UserDomain.findOne({
        id    : userProjectId,
        userId: req.me.id
    });

    if (!userProject) {
        return res.status(404).json({message: 'invalid project id'});
    }

    let prevLinksInGuestPosts = commonHelpers.objectKeysToSnakeCase(await LinkInGuestPost.find({
        userDomainId: userProjectId
    }));

    let forDelete = [];

    prevLinksInGuestPosts.map((prevObj, key) => {
        let foundPrevObj = false;

        urls.map((urlsObj, key) => {
            if (
                prevObj.holding_url === urlsObj.holding_url
                && prevObj.guest_post_url === urlsObj.guest_post_url
            ) {
                foundPrevObj = true;
            }
        });

        if (!foundPrevObj) forDelete.push(prevObj.id);
    });

    urls.map(async obj => {
        await LinkInGuestPost.linksInGuestPostCollection().updateOne(
            {
                user_domain_id: userProjectId,
                holding_url   : obj.holding_url,
                guest_post_url: obj.guest_post_url
            },
            {
                $setOnInsert: {
                    user_domain_id: userProjectId,
                    holding_url   : obj.holding_url,
                    guest_post_url: obj.guest_post_url
                }
            },
            {upsert: true}
        );
    });

    forDelete.map(async item => {
        await LinkInGuestPost.linksInGuestPostCollection().deleteOne({_id: sails.ObjectId(item)});
    });

    let guestDomainId = '';

    let upsertedGuestDomain = await Domain.domainCollection().updateOne(
        {
            url: guestDomain
        },
        {
            $setOnInsert: {
                url: guestDomain
            }
        },
        {upsert: true}
    );

    if (upsertedGuestDomain.upsertedId) {
        guestDomainId = upsertedGuestDomain.upsertedId._id;
    } else {
        let domain    = await Domain.findOne({url: guestDomain});
        guestDomainId = domain.id;
    }

    // it will try to preserve domain use for nested objects
    // cz updated one cant update only a single key of a nested object
    let prevDomainUseFor = _.cloneDeep(userProject.domainUseFor);
    if (!prevDomainUseFor.hasOwnProperty('guestPostsCheckService')) {
        prevDomainUseFor['guest_posts_check_service'] = {};
    }

    let modifiedDomainUseFor                                          = prevDomainUseFor;
    modifiedDomainUseFor.guest_posts_check_service['status']          = status;
    modifiedDomainUseFor.guest_posts_check_service['guest_domain_id'] = guestDomainId;

    let updatedProjectService = await UserDomain.updateOne({
        userId: req.me.id,
        id    : userProject.id
    })
        .set({
            domainUseFor: modifiedDomainUseFor
        });

    return res.status(200).json({
        project: commonHelpers.objectKeysToSnakeCase(updatedProjectService)
    });
};

