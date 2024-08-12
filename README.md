<!-- Allow this file to not have a first line heading -->
<!-- markdownlint-disable-file MD041 no-emphasis-as-heading -->

<!-- inline html -->
<!-- markdownlint-disable-file MD033 -->

<div align="center">

# `➡️ Auto Review by Label`

<!--- FIXME: Update crate, repo and CI workflow names here! Remove any that are not relevant --->
[![Build Status](https://github.com/EmbarkStudios/action-auto-review-by-label/workflows/test/badge.svg)](https://github.com/EmbarkStudios/action-auto-review-by-label/actions?workflow=test)
[![Embark](https://img.shields.io/badge/embark-open%20source-blueviolet.svg)](https://embark.dev)
</div>

A small utility action that automatically adds a bot review in the presence of a selected label.

## Usage

Create a new `.github/workflows/approve-by-label.yml` file:

```yaml
name: approve-by-label
on:
  pull_request:
    types: [labeled, unlabeled]
jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/setup-node@v1
      - uses: EmbarkStudios/action-auto-review-by-label
        with:
          github-token: ${{ secrets.BOT_TOKEN }}
          bot-username: thefuntastic
          label-name: skip-review
```

The following options are required:

- `github-token`: Personal access token for the account performing reviews. Note that the built-in github actions token does not have permission for review approval, so a new token must be generated. For details on generating a new token, see the [offical guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).
- `bot-username`: Username of the account associated with the token - is used to detect existing reviews. Will result in review approval spam if misconfigured.
- `label-name`: Name of the label intended to trigger auto-approval.

## Limitations

Removing the chosen label doesn't remove the review from the PR. This is because once github records a positive review, dismissing it only converts it back to a pending review.

A pending review can interfere with merge rules that require all approvals to be green. So instead we leave the review in place, requiring human users to manually intervene if necessary. 

## Maintenance

This project uses node, typescript and yarn as a package manager. These are common web technologies, but if you're getting started you will need to install node and yarn. 

```
yarn install
```

Will initialize the project and download dependencies

Now you should be able to call various yarn commands as defined in `package.json`, but the important will be:

```
yarn test 
yarn dist
```

`yarn dist` is necessary to update `dist/index.js`, which is the actual output used by the github action. The workflow `.github/workflows/publish.yml` should call these in case you forget.

## Contributing

[![Contributor Covenant](https://img.shields.io/badge/contributor%20covenant-v1.4-ff69b4.svg)](CODE_OF_CONDUCT.md)

We welcome community contributions to this project.

Please read our [Contributor Guide](CONTRIBUTING.md) for more information on how to get started.
Please also read our [Contributor Terms](CONTRIBUTING.md#contributor-terms) before you make any contributions.

Any contribution intentionally submitted for inclusion in an Embark Studios project, shall comply with the Rust standard licensing model (MIT OR Apache 2.0) and therefore be dual licensed as described below, without any additional terms or conditions:

### License

This contribution is dual licensed under EITHER OF

- Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or <http://opensource.org/licenses/MIT>)

at your option.

For clarity, "your" refers to Embark or any other licensee/user of the contribution.
