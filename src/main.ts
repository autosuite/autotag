import * as core from '@actions/core';
import * as github from '@actions/github';

import incrementVersion from "semver/functions/inc";
import versionLessThanEquals from "semver/functions/lte";

import * as autolib from '@teaminkling/autolib';


/**
 * Use the GitHub API to create a milestone.
 *
 * Note that we are assuming creating a milestone when it already exists is not a problem.
 *
 * @param milestone The milestone name to create.
 * @param owner The owner of the repo (account name).
 * @param repo The repo name.
 */
async function createMilestone(milestone: string, owner: string, repo: string): Promise<void> {
    core.info(`Milestone we want to create will be: ${milestone}.`);

    const token: string = core.getInput("github-token");
    await new github.GitHub(token).issues.createMilestone({
        "owner": owner, "repo": repo, "title": milestone,
    });
}


async function runAction() {
    /* Check repo info is good. */

    const ownerRepo: string = core.getInput('github-repository');

    const owner: string = ownerRepo.split("/")[0];
    const repo: string = ownerRepo.split("/")[1];

    if (!owner || !repo) {
        core.setFailed(`github-repository was not set as a correct input! We got: ${ownerRepo}`);
    }

    /* Find the latest version. */

    const latestStableVersion: string = await autolib.findLatestVersionFromGitTags(true);

    core.info(`Latest stable version found is: [${latestStableVersion}].`);

    /* Create next three logical versions. Don't allow 0.0.1. */

    if (!versionLessThanEquals(latestStableVersion, "0.0.1")) {
        /* Ensure the current latest tagged version is correctly milestoned. */

        await createMilestone(latestStableVersion, owner, repo);

        /* Find the next patch version, then increment. */

        const nextPatchVersion: string = incrementVersion(latestStableVersion, "patch")!;
        await createMilestone(nextPatchVersion, owner, repo);
    }

    /* Find the next minor version, then increment. */

    const nextMinorVersion: string = incrementVersion(latestStableVersion, "minor")!;
    await createMilestone(nextMinorVersion, owner, repo);

    /* Find the next major version, then increment. */

    const nextMajorVersion: string = incrementVersion(latestStableVersion, "major")!;
    await createMilestone(nextMajorVersion, owner, repo);
}


const actionRunner: Promise<void> = runAction();

/* Handle action promise. */

actionRunner.then(() => {});
