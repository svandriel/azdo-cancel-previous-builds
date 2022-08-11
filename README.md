# azdo-cancel-previous-builds

[![Node.js CI](https://github.com/svandriel/azdo-cancel-previous-builds/actions/workflows/node.js.yml/badge.svg)](https://github.com/svandriel/azdo-cancel-previous-builds/actions/workflows/node.js.yml)

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
  displayName: Cancel previous builds
  env:
    System.AccessToken: $(System.AccessToken)
```

Since the `System.AccessToken` is a secret variable, you need to explitly add it to make it available.

_Note: The access token needs to have the 'read builds' and 'update builds' permission.  
You can also use a custom access token that has these permissions._

The script requires these environment variables, which should be present in the context
of an Azure Devops build:

- `System.TeamFoundationCollectionUri`: The base URL to the Azure Devops collection
- `System.TeamProject`: The name of the project
- `System.DefinitionId`: The ID of the build definition
- `Build.BuildId`: The ID of the current build
- `Build.SourceBranch`: The current source code branch being built
- `System.AccessToken`: A private access token  
   _This one needs to be explitly added like in the example above._

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
