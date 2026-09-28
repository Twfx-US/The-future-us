import OpenAI from 'openai';

// 兼容 OpenAI 接口的提供商 baseURL
const baseURLMap: Record<string, string> = {
    'deepseek': 'https://api.deepseek.com',
    'openai': 'https://api.openai.com/v1',
    'xai': 'https://api.x.ai/v1',
    'mistral': 'https://api.mistral.ai/v1',
    'moonshot': 'https://api.moonshot.cn/v1',
};

// 注意：google 和 anthropic 暂不支持 OpenAI 格式，需单独实现，本插件暂未支持
// 但为了扩展，保留映射，若使用会抛出错误

export async function callAI(
    messages: OpenAI.ChatCompletionMessageParam[],
    config: { apiProvider: string; apiKey: string; model: string; maxTokens: number }
): Promise<string> {
    const { apiProvider, apiKey, model, maxTokens } = config;
    const baseURL = baseURLMap[apiProvider];
    if (!baseURL) {
        throw new Error(`提供商 ${apiProvider} 暂未支持 OpenAI 格式，请选用其他提供商。`);
    }
    const client = new OpenAI({ baseURL, apiKey });
    const completion = await client.chat.completions.create({
        model,
        messages,
        max_tokens: maxTokens,
        stream: false,
    }) as OpenAI.ChatCompletion;
    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('API 返回内容为空');
    return content;
}

export async function askDeepSeek(
    question: string,
    config: { apiProvider: string; apiKey: string; model: string; maxTokens: number }
): Promise<string> {
    return callAI([{ role: 'user', content: question }], config);
}

export async function explainCode(
    code: string,
    config: { apiProvider: string; apiKey: string; model: string; maxTokens: number }
): Promise<string> {
    const prompt = `请解释下面这段代码的功能和关键实现细节（用中文回答）：\n\n\`\`\`\n${code}\n\`\`\``;
    return callAI([{ role: 'user', content: prompt }], config);
}

export async function askWithHistory(
    history: { role: 'user' | 'assistant'; content: string }[],
    config: { apiProvider: string; apiKey: string; model: string; maxTokens: number }
): Promise<string> {
    const messages = history.map(msg => ({ role: msg.role, content: msg.content }));
    return callAI(messages, config);
}