import * as vscode from 'vscode';

export interface DeepSeekConfig {
    apiProvider: string;
    apiKey: string;
    model: string;
    maxTokens: number;
}

// 提供商 -> 配置键映射
const keyMap: Record<string, string> = {
    'deepseek': 'apiKey',
    'openai': 'openaiApiKey',
    'google': 'googleApiKey',
    'anthropic': 'anthropicApiKey',
    'meta': 'metaApiKey',
    'xai': 'xaiApiKey',
    'mistral': 'mistralApiKey',
    'moonshot': 'moonshotApiKey'
};

export function getConfig(): DeepSeekConfig {
    const config = vscode.workspace.getConfiguration('deepseek');
    const provider = config.get<string>('apiProvider', 'deepseek');
    const keyField = keyMap[provider] || 'apiKey';
    const apiKey = config.get<string>(keyField, '');
    const model = config.get<string>('model', '');
    const maxTokens = config.get<number>('maxTokens', 2048);

    if (!apiKey) {
        const name = provider.charAt(0).toUpperCase() + provider.slice(1);
        vscode.window.showErrorMessage(`请先设置 ${name} API Key（在设置中搜索 deepseek）`);
        throw new Error('Missing API Key');
    }
    return { apiProvider: provider, apiKey, model, maxTokens };
}