更新日志

更新日志 / Changelog



\[1.0.1] - 2026-08-30



中文



新增

AI 聊天侧边栏：支持 8 个主流 AI 提供商（DeepSeek、OpenAI、Google Gemini、Anthropic Claude、Meta Llama、xAI Grok、Mistral、Moonshot Kimi）。

多轮对话：支持上下文连续对话，记忆历史消息。

智能代码插入：提供“新建文件”、“替换当前文件”、“插入到光标位置”三种方式。

多语言界面：支持简体中文、English、德语、法语、日语、韩语 6种语言，侧边栏内置切换下拉菜单。

灵活配置：每个提供商独立存储 API Key，切换提供商时自动切换对应 Key。

设置面板：独立窗口设置，可选择提供商、输入 API Key、选择模型、调整 Token 数。

语言检测：新建文件时自动识别代码语言（Python、JavaScript、TypeScript、HTML 等），并应用正确的语法高亮。

密钥安全存储：API Key 现使用 VSCode SecretStorage 加密存储，支持环境变量（如 `DEEPSEEK\_API\_KEY`）优先.。

默认本地 OC：`allowCloudOCR` 默认关闭，图片 OCR 默认使用本地 Tesseract，保护隐私。

云端 OCR 警告：启用云端引擎时，显示明确提示，确保用户知情。

离线模式：新增 `offlineMode` 开关，开启后强制本地 OCR，禁止云端 AI（适用于高安全环境）。

安全状态指示器：侧边栏底部显示当前 AI/OCR 状态、密钥来源（环境变量/加密存储）。

设置面板增强：新增“允许云端 OCR”和“离线模式”复选框，配置更直观。



修复



修复模板字符串导致的编译错误。

修复设置保存后侧边栏状态未刷新问题。

修复 Webview Service Worker 加载错误。

修复 API 返回空内容时的错误提示。

修复语法高亮自动识别不准确的问题。



\---



English



Added

AI Chat Sidebar: Support 8 major AI providers (DeepSeek, OpenAI, Google Gemini, Anthropic Claude, Meta Llama, xAI Grok, Mistral, Moonshot Kimi).

Multi-turn Conversations: Context-aware continuous dialogue with message history.

Smart Code Insertion: Three options: New File, Replace Current File, Insert at Cursor.

Multi-language UI: Support 6 languages (Simplified Chinese, English,  Deutsch, Français，한국어) with built-in dropdown switcher in the sidebar.

Flexible Configuration: Store API keys separately for each provider, auto-switch keys when provider changes.

Settings Panel: Standalone settings window to select provider, enter API key, choose model, and adjust max tokens.

Language Detection: Auto-detect code language (Python, JavaScript, TypeScript, HTML, etc.) when creating new file, apply correct syntax highlighting.

Secure Key Storage: API Keys are now encrypted using VSCode SecretStorage, with environment variable support (e.g. `DEEPSEEK\_API\_KEY`) taking priority. 

Local OCR by Default: `allowCloudOCR` is now `false` by default, using local Tesseract for image OCR to protect privacy.

Cloud OCR Warning: A clear prompt is shown when a cloud OCR engine is enabled.

Offline Mode: New `offlineMode` switch forces local OCR and disables cloud AI calls (ideal for high-security environments).

Security Status Indicator: Displays current AI/OCR status and key source (env/encrypted) at the bottom of the sidebar.

Enhanced Settings Panel: Added checkboxes for "Allow Cloud OCR" and "Offline Mode" for easier configuration.



Fixed



Fixed compilation errors caused by template literal misuse.

Fixed sidebar status not refreshing after settings save.

Fixed Webview Service Worker loading error.

Fixed error message when API returns empty content.

Fixed inaccurate auto-detection of syntax highlighting.

