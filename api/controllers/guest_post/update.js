const { domain } = require("process");

module.exports = async function (req, res) {
    let userProjectId = req.param('id');
    let status        = req.param('status');
    let urls          = req.param('urls');

    let userProject = await UserDomain.findOne({
        id    : userProjectId,
        userId: req.me.id
    });

    if (!userProject) {
        return res.status(404).json({message: 'invalid project id'});
    }

    let urlsHasError = false;

    let domains = []

    urls.map(obj => {
        if (obj.guest_post_url) {
            try {
                let parsedGuestdUrl = new URL(obj.guest_post_url);

                if(!parsedGuestdUrl.origin) {
                    urlsHasError = true;
                } else if(!domains.includes(parsedGuestdUrl.origin)) {
                    domains.push(parsedGuestdUrl.origin)
                }
            } catch {
                urlsHasError = true;
            }
            
        } else {
            urlsHasError = true;
        }

        if (obj.holding_url) {
            try {
                let parsedHoldingUrl = new URL(obj.holding_url);

                if(!parsedHoldingUrl.origin) {
                    urlsHasError = true;
                } else if(!domains.includes(parsedHoldingUrl.origin)) {
                    domains.push(parsedHoldingUrl.origin)
                }
            } catch {
                urlsHasError = true;
            }
            
        } else {
            urlsHasError = true;
        }
    });
    

    console.log(domains);

    if(urlsHasError) {
        return res.status(404).json({message: 'invalid urls given'});
    }
    
    await Promise.all(
        domains.map(async (domainName) => {
            await Domain.domainCollection().updateOne(
                {
                    url: domainName
                },
                {
                    $setOnInsert: {
                        url: domainName
                    }
                },
                {upsert: true}
            );
        })
    )

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

    await Promise.all(
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
        })
    );

    await Promise.all(
        forDelete.map(async item => {
            await LinkInGuestPost.linksInGuestPostCollection().deleteOne({_id: sails.ObjectId(item)});
        })
    )
    

    // // it will try to preserve domain use for nested objects
    // // cz updated one cant update only a single key of a nested object
    let prevDomainUseFor = _.cloneDeep(userProject.domainUseFor);
    if (!prevDomainUseFor.hasOwnProperty('guestPostsCheckService')) {
        prevDomainUseFor['guest_posts_check_service'] = {};
    }

    let modifiedDomainUseFor                                          = prevDomainUseFor;
    modifiedDomainUseFor.guest_posts_check_service['status']          = status;

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

