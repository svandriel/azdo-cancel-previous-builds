# azdo-cancel-previous-builds

This is a command-line script that will cancel any previous in-progress
Azure Devops builds.

## How it works

By using the environment variables set within Azure Devops pipelines,
this script will query the Azure Devops API to find previous runs of this pipeline
on the same branch.

It will then cancel these builds.

## Usage

From your Azure Devops pipeline, include a script task to include Node (v10 or up), and then execute the script:

```yaml
- task: NodeTool@0
  displayName: Install node
  inputs:
    versionSpec: 17.x
- script: npx azdo-cancel-previous-builds
```

## Development

First, run `npm install` to install dependencies.

Second, this script depends on certain environment variables to be present. To simulate this locally, create a file called `.env` and fill this with:

```
SYSTEM_ACCESSTOKEN=<your azure devops private access token>
SYSTEM_TEAMFOUNDATIONCOLLECTIONURI=https://dev.azure.com/<your organization>
SYSTEM_TEAMPROJECT=<your project>
SYSTEM_DEFINITIONID=<a build definition id>
BUILD_BUILDID=<a build id>
BUILD_SOURCEBRANCH=<a branch, e.g. refs/heads/master>
```

To run the script once, enter:

```
npm run start
```

To run the script on every change, enter:

```
npm run dev
```
