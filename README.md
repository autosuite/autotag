# Automilestone

![Release Usability](https://img.shields.io/static/v1?label=stability&message=unusable&style=flat-square&color=red)
![Latest Release](https://img.shields.io/github/v/release/GH_USER/GH_REPO?sort=semver&style=flat-square)
![GitHub issues](https://img.shields.io/github/issues-raw/GH_USER/GH_REPO?style=flat-square)

## Introduction

Whenever a commit is tagged with a prefix and then a SemVer milestone, a new milestone is created with the SemVer version found.

For example: `[pre-1.0.1] blah` will create the `1.0.1` milestone if the prefix is `pre-` (default).

## Usage

Add this action to your workflow using:

```yaml
name: my-workflow

on: [push]

jobs:
  autocommit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - uses: teaminkling/skip-commit@master
        with:
          commit-filter: skip-ci
      - uses: teaminkling/automilestone@master
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          github-repository: ${{ github.repository }}
```

## Documentation

If you would like to contribute to this project, please read our [contributors documentation](CONTRIBUTING.md) and our [code of conduct](CODE_OF_CONDUCT.md).

The license we use for this project is defined in [the license file](LICENSE).

Thanks!
