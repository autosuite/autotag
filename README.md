# Automilestone

| Summary           | Badge                                              |
| ----------------- | -------------------------------------------------- |
| Release Stability | ![Autobadger Release Stability][release-stability] |
| Latest Release    | ![Autobadger Latest Release][latest-release]       |
| Code Quality      | [![Maintainability][quality-image]][quality-link]  |
| Code Coverage     | [![Test Coverage][coverage-image]][coverage-link]  |

[release-stability]: https://img.shields.io/static/v1?label=latest&message=0.1.0&color=purple
[latest-release]: https://img.shields.io/static/v1?label=stability&message=prerelease&color=yellow
[quality-image]: https://api.codeclimate.com/v1/badges/2a5e3b36c9c7907dc13e/maintainability
[quality-link]: https://codeclimate.com/github/autosuite/autocommit/maintainability
[coverage-image]: https://api.codeclimate.com/v1/badges/2a5e3b36c9c7907dc13e/test_coverage
[coverage-link]: https://codeclimate.com/github/autosuite/autocommit/test_coverage

## Introduction

GitHub Action that creates GitHub Milestones Whenever a commit is tagged with a prefix and then a SemVer version string.

For example: `[pre-1.0.1] blah` will create the `1.0.1` milestone if the prefix is `pre-` (default).

## Usage

Add this to your `main.yml` file (or whatever your workflow is called).

```yaml
name: my-workflow

on: [push]

jobs:
  autocommit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - uses: autosuite/automilestone@master
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          github-repository: ${{ github.repository }}
          prefix: pre-
```

## Configuration

> You can see all configuration in the [action.yml](action.yml) file.

| Variable     | Value              | Example                     | Default                     | Required? |
| ------------ | ------------------ | --------------------------- | --------------------------- | --------- |
| prefix       | A string.          | pre-                        | pre-                        | Yes.      |
| github-token | Your GitHub token. | ${{ secrets.GITHUB_TOKEN }} | ${{ secrets.GITHUB_TOKEN }} | Yes.      |
| email        | Your repository.   | autosuite/automilestone     | ${{ github.repository }}    | Yes.      |

## Documentation

If you would like to contribute to this project, please read our [contributors documentation](CONTRIBUTING.md) and our [code of conduct](CODE_OF_CONDUCT.md).

The license we use for this project is defined in [the license file](LICENSE).
