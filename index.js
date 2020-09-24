const core = require("@actions/core");
const github = require("@actions/github");

const SMALL_RANGE = [1, 6];
const MEDIUM_RANGE = [7, 13];
const LABEL_BIG = `Big PR: > ${MEDIUM_RANGE[1]}`;
const LABEL_MEDIUM = `Medium PR: ${MEDIUM_RANGE[0]} - ${MEDIUM_RANGE[1]}`;
const LABEL_SMALL = `Small PR: < ${MEDIUM_RANGE[0]}`;

try {
  const contextPullRequest = github.context.payload.pull_request;

  if (!contextPullRequest) {
    throw new Error(
      "This action can only be invoked in `pull_request` events. Otherwise the pull request can't be inferred."
    );
  }

  const prNumber = contextPullRequest.number;
  const repoToken = core.getInput("repo-token");

  const octokit = new github.GitHub(repoToken);

  const filesChanged = octokit.pulls.listFiles({
    ...github.context.repo,
    pull_number: prNumber,
  });

  const label = getLabel(filesChanged.length);

  if (label) {
    octokit.issues
      .addLabels({
        ...github.context.repo,
        issue_number: prNumber,
        labels: [label],
      })
      .then(() => {
        console.log(`Label ${label} was automatically added`);
      });
  } else {
    console.log("No label was added.");
  }
} catch (error) {
  core.setFailed(error.message);
}

function getLabel(numberOfFilesChanged) {
  if (isPrSmall(numberOfFilesChanged)) {
    return LABEL_SMALL;
  }

  if (isPrMedium(numberOfFilesChanged)) {
    return LABEL_MEDIUM;
  }

  if (isPrBig(numberOfFilesChanged)) {
    return LABEL_BIG;
  }

  return "";
}

function isPrSmall(numberOfFilesChanged) {
  return (
    numberOfFilesChanged >= SMALL_RANGE[0] &&
    numberOfFilesChanged <= SMALL_RANGE[1]
  );
}

function isPrMedium(numberOfFilesChanged) {
  return (
    numberOfFilesChanged > MEDIUM_RANGE[0] &&
    numberOfFilesChanged <= MEDIUM_RANGE[1]
  );
}

function isPrBig(numberOfFilesChanged) {
  return numberOfFilesChanged > MEDIUM_RANGE[1];
}
