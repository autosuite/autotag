const { exec } = require('child_process');

const core = require('@actions/core');
const Octokit = require("@octokit/rest");

/* Add the .trim() method to the String type. */

if (typeof (String.prototype.trim) === "undefined") {
    String.prototype.trim = function () {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

/*
 * Initialise GitHub API instance.
 */

console.log("Authenticating with the GitHub API...");

const octokit = Octokit({
    auth: core.getInput("github-token"),
    baseUrl: 'https://api.github.com',
});

/**
 * Use the GitHub API to create a milestone.
 *
 * @param {String} milestone the milestone name to create
 */
function createMilestone(milestone) {
    console.log("Milestone we want to create will be: [" + milestone + "]");

    const ownerRepo = core.getInput('github-repository');
    const owner = ownerRepo.split("/")[0];
    const repo = ownerRepo.split("/")[1];

    octokit.issues.createMilestone({
        owner,
        repo,
        milestone
    });
}

exec('git log -1 --pretty=format:"%s"', (err, stdout, _) => {
    if (err) {
        console.error(err);
    } else {
        let lastCommitLog = stdout;

        console.log("Last commit log was: " + lastCommitLog);

        const prefix = core.getInput('prefix') || 'pre-';

        if (!prefix || prefix == "") {
            console.error("You need a prefix!");

            process.exit(1);
        }

        const cleanedPrefix = prefix.trim();

        console.log("Prefix is: \"" + cleanedPrefix + "\".")

        if (lastCommitLog.includes(cleanedPrefix) || 1) {
            /* Extract the SemVer milestone. */

            const milestoneToCreate = "[pre-1.0.3] test blah".match(new RegExp("(?<=" + cleanedPrefix +
                ")\\d\\.\\d\\.\\d", "g"));

            if (!milestoneToCreate) {
                console.error("Message after prefix [" + cleanedPrefix +"] does not match SemVer.");

                process.exit(1);
            }

            createMilestone(milestoneToCreate[0]);
        } else {
            console.log("Couldn't find command to create milestone, so we won't.");
        }
    }
});
