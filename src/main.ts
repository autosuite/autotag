import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';

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
        "owner": owner,
        "repo": repo,
        "title": milestone
    });
}

async function run() {
    exec.exec('git log -1 --pretty=%B', [], {
        listeners: {
            stdout: (data: Buffer) => {
                const commitMessage: string = data.toString().trim();
                core.info(`Last commit we saw: ${commitMessage}`);

                const prefix: string = core.getInput('prefix').trim();
                if (!prefix || prefix == "") {
                    core.setFailed("You need a prefix! Check your inputs.");
                }

                if (commitMessage.includes(prefix)) {
                    /* Read the prefix. It can have a v in front, or not. */

                    const milestone: RegExpMatchArray | null = commitMessage.match(new RegExp(
                        `(?<=${prefix})v?\\d\\d\\d, "g"`
                    ));

                    if (!milestone) {
                        core.setFailed(`The message after your prefix: ${prefix}, is not SemVer.`);
                    } else {
                        createMilestone(milestone[0]);
                    }
                }
            }
        }
    })
}

run();
