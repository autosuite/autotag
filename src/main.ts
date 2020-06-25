import * as core from '@actions/core';
import * as github from '@actions/github';

import * as autolib from '@teaminkling/autolib';

/**
 * Use the GitHub API to create a milestone.
 *
 * @param {String} milestone the milestone name to create
 */
async function createMilestone(milestone: string): Promise<void> {
    core.info(`Milestone we want to create will be: ${milestone}.`);

    const ownerRepo: string = core.getInput('github-repository');
    const owner: string = ownerRepo.split("/")[0];
    const repo: string = ownerRepo.split("/")[1];

    if (!owner || !repo) {
        core.setFailed(`github-repository was not set as a correct input! We got: ${ownerRepo}`);
    }

    new github.GitHub(core.getInput("github-token")).issues.createMilestone({
        "owner": owner, "repo": repo, "title": milestone,
    });
}

async function run() {
    const latestStableVersion: autolib.SemVer = await autolib.findLatestVersionFromGitTags(true);

    core.info(`Latest stable version found is: [${latestStableVersion}].`);

    /* Create next three logical versions. Don't allow 0.0.1. Overwriting is impossible. */

    if (!latestStableVersion.isZero()) {
        createMilestone(latestStableVersion.toString());

        const nextPatchVersion: autolib.SemVer = new autolib.SemVer(
            latestStableVersion.major, latestStableVersion.minor, latestStableVersion.patch + 1, null
        );

        createMilestone(nextPatchVersion.toString());
    }

    const nextMinorVersion: autolib.SemVer = new autolib.SemVer(
        latestStableVersion.major, latestStableVersion.minor + 1, 0, null
    );

    createMilestone(nextMinorVersion.toString());

    const nextMajorVersion: autolib.SemVer = new autolib.SemVer(latestStableVersion.major + 1, 0, 0, null);

    createMilestone(nextMajorVersion.toString());
}

run();
