import { getPersonalAccessTokenHandler, WebApi } from 'azure-devops-node-api';
import { BuildStatus } from 'azure-devops-node-api/interfaces/BuildInterfaces';

import { loadEnvironmentVariables } from './env';

export interface CancelPreviousBuildsOptions {
    dryRun: boolean;
}

export async function cancelPreviousBuilds(opts: CancelPreviousBuildsOptions) {
    const dryRun = opts.dryRun || false;
    const env = loadEnvironmentVariables();

    const project = env['System.TeamProject'];
    const buildId = +env['Build.BuildId'];
    const definitionId = +env['System.DefinitionId'];
    const token = env['System.AccessToken'];
    const baseUri = env['System.TeamFoundationCollectionUri'];

    const api = new WebApi(baseUri, getPersonalAccessTokenHandler(token));
    const buildApi = await api.getBuildApi();

    console.log(`Searching for in progress build for definition ${definitionId}...`);

    const builds = await buildApi.getBuilds(
        project,
        [definitionId],
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        BuildStatus.InProgress,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        env['Build.SourceBranch']
    );
    const priorBuilds = builds.filter(b => (b.id ?? 0) < buildId);
    if (priorBuilds.length === 0) {
        console.log(`No prior in progress builds found`);
        return;
    }
    console.log(`Found ${priorBuilds.length} prior in progress builds:`);
    priorBuilds.forEach(b => {
        console.log(`- ${b.buildNumber} - requested by ${b.requestedBy?.displayName}`);
    });

    if (dryRun && priorBuilds.length > 0) {
        console.log('Not cancelling build in dry run mode');
        return;
    }

    await Promise.all(
        priorBuilds.map(b => {
            if (!b.id) {
                throw new Error(`Missing build ID`);
            }
            const buildId = +b.id;
            console.log(`Cancelling build ${b.buildNumber} - requested by ${b.requestedBy?.displayName}`);
            return buildApi.updateBuild(
                {
                    status: BuildStatus.Cancelling
                },
                project,
                buildId
            );
        })
    );
}
