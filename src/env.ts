export interface EnvironmentVariables {
    'System.TeamFoundationCollectionUri': string;
    'System.TeamProject': string;
    'System.DefinitionId': string;
    'System.AccessToken': string;
    'Build.BuildId': string;
    'Build.SourceBranch': string;
}

export function loadEnvironmentVariables(): EnvironmentVariables {
    return {
        'System.TeamFoundationCollectionUri': loadEnvironmentVariable('System.TeamFoundationCollectionUri'),
        'System.TeamProject': loadEnvironmentVariable('System.TeamProject'),
        'System.DefinitionId': loadEnvironmentVariable('System.DefinitionId'),
        'System.AccessToken': loadEnvironmentVariable('System.AccessToken'),
        'Build.BuildId': loadEnvironmentVariable('Build.BuildId'),
        'Build.SourceBranch': loadEnvironmentVariable('Build.SourceBranch')
    };
}

export function loadEnvironmentVariable(name: string): string {
    const actualName = name.replace(/\./g, '_').toUpperCase();
    const value = process.env[actualName];
    if (!value) {
        throw new Error(`Missing environment variable: ${name} (${actualName})`);
    }
    return value;
}
