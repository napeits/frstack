/*
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
 *
 * Copyright (c) 2013 ForgeRock AS. All Rights Reserved
 */
/*global security */

logger.info(" +++++++++++  Augment context for: {}", security);

var userDetail,
    params,
    rolesArr,
    resource = request.attributes.get("org.forgerock.security.context").get("passThroughAuth");

function isMemberOfAllowedGroups(roles) {
    var authConfig = openidm.read("config/authentication"),
        i,j;

    for (i=0;i<authConfig.allowedGroups.length;i++) {
        for (j=0;j<roles.length;j++) {
            // ldap is case (and to some degree whitespace) insensitive, so we have to be too:
            if (roles[j].toLowerCase().replace(/\s*(^|$|,|=)\s*/g, "$1") === authConfig.allowedGroups[i].toLowerCase().replace(/\s*(^|$|,|=)\s*/g, "$1")) {
                return true;
            }
        }
    }
    return false;
}

if (security && security.username && security.username !== "anonymous"
    && (! (security.userid && security.userid.id && security.userid.component && security["openidm-roles"].length) )) {
    if (security && security.username) {

        userDetail = openidm.query(resource, {
            'query' : {
                'Contains' : {
                    'field' : 'uid',
                    'values' : [
                        security.username
                    ]
                }
            }
        });
	logger.info(" ++ user detail result {}", userDetail.result);
    }

    if (userDetail && userDetail.result && userDetail.result.length === 1) {
        // Only augment userid if missing
        if (!security.userid || !security.userid.id) {
            security.userid = {"component" : resource, "id" : userDetail.result[0]._id };
        }

        if (security.userid.component === "system/ldap/account") {
            security["openidm-roles"] = isMemberOfAllowedGroups(userDetail.result[0].ldapGroups) ? ["openidm-admin","openidm-authorized"] : ["openidm-authorized"];
        }
        logger.info("Augmented context for {} with userid : {}, roles : {}", security.username, security.userid, security["openidm-roles"]);
    } else {
        if (userDetail && userDetail.result && userDetail.result.length > 1) {
            throw {
                "openidmCode" : 401,
                "message" : "Access denied, user detail retrieved ambiguous"
            };
        } else {
            throw {
                "openidmCode" : 401,
                "message" : "Access denied, no user detail could be retrieved"
            };
        }
    }
}
