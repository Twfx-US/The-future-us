# **DeepSeek AI Assistant**







\[English] | \[中文]



\---



Chinese (中文)



在 VS Code 中直接与 DeepSeek 等主流 AI 模型对话，支持代码生成、解释、编辑和多轮对话，并内置隐私保护增强。



特性



AI 聊天：在侧边栏中与 DeepSeek、OpenAI、Google Gemini、Anthropic Claude、Meta Llama、xAI Grok、Mistral、Moonshot Kimi 等 8 个主流提供商对话。

智能代码插入：点击“插入代码”，可选择新建文件、替换当前文件或插入到光标位置。

代码解释：选中代码，AI 帮你解释功能和实现细节。

多轮对话：支持上下文连续对话，记忆历史消息。

多语言界面：支持简体中文、English、日本語、Deutsch、Français 5 种界面语言，一键切换。

灵活配置：每个提供商独立存储 API Key，切换无缝。

隐私优先：API Key 加密存储，默认使用本地 OCR（Tesseract），支持完全离线模式，侧边栏实时显示安全状态。



快速开始



1\. 点击 VS Code 活动栏的 DeepSeek 图标打开侧边栏。

2\. 点击 设置，选择你的 API 提供商（如 DeepSeek），填入对应的 API Key（也可通过环境变量 `DEEPSEEK\_API\_KEY` 设置）。

3\. 开始提问！



安全提示：

所有 API Key 均加密存储（VSCode SecretStorage）或通过环境变量读取，不会明文保存。

图片 OCR 默认使用本地 Tesseract，不上传云端（如需云端，请在设置中开启“允许云端 OCR”）。

开启“离线模式”后，强制本地 OCR 并禁止云端 AI 调用，适合内网或高隐私场景。



获取 API Key



DeepSeek：\[platform.deepseek.com](https://platform.deepseek.com/)

OpenAI：\[platform.openai.com](https://platform.openai.com/)

Google Gemini：\[ai.google.dev](https://ai.google.dev/)

Anthropic Claude：\[console.anthropic.com](https://console.anthropic.com/)

Meta Llama（通过 Together AI 等）：\[together.ai](https://together.ai/)

xAI Grok：\[x.ai](https://x.ai/)

Mistral：\[console.mistral.ai](https://console.mistral.ai/)

Moonshot Kimi：\[platform.moonshot.cn](https://platform.moonshot.cn/)



命令



| 命令 | 功能 |

| `DeepSeek: 提问` | 弹出输入框，向 AI 提问 |

| `DeepSeek: 解释选中的代码` | 选中代码后，AI 帮你解释 |

| `DeepSeek: 打开设置面板` | 打开独立设置窗口 |



插入代码选项



点击 AI 回复下方的 “插入代码”，可以选择：

新建文件：自动检测语言并创建新文件。

替换当前文件：替换当前编辑器全部内容。

插入到光标位置：在光标处插入代码。



切换语言



在侧边栏右上角的下拉菜单中，可以随时切换界面语言（中文、English、韩语、日本語、Deutsch、Français）。



安全与隐私



所有网络请求均使用 HTTPS。

密钥优先从环境变量读取，否则使用 VSCode 加密存储。

默认本地 OCR，云端 OCR 需主动开启，并会显示上传警告。

侧边栏底部显示当前安全状态（AI 提供商、OCR 类型、密钥来源、离线模式等），透明可控。



许可证



MIT



\---



English



Chat directly with mainstream AI models like DeepSeek, OpenAI, Google Gemini, Anthropic Claude, Meta Llama, xAI Grok, Mistral, and Moonshot Kimi right inside VS Code. Supports code generation, explanation, editing, multi-turn conversations, and built‑in privacy enhancements.



Features



AI Chat: Chat with 8 major providers in the sidebar.

Smart Code Insertion: Click "Insert Code" to choose New File, Replace Current File, or Insert at Cursor.

Code Explanation: Select code and let AI explain its functionality.

Multi-turn Conversations: Context-aware continuous dialogue with message history.

Multi-language UI: Switch between  languages with a dropdown.

Flexible Configuration: Store API keys separately per provider.

Privacy First: Keys encrypted, local OCR by default, offline mode available, and a live security status indicator.



Quick Start



1\. Click the DeepSeek icon in the VS Code activity bar to open the sidebar.

2\. Click \*\*Settings\*\*, select your provider, and enter your API Key (or set it via environment variable, e.g. `DEEPSEEK\_API\_KEY`).

3\. Start asking!



Security Notes:

All API keys are stored encrypted (VSCode SecretStorage) or via environment variables – never in plaintext.

Image OCR defaults to local Tesseract (no cloud upload). Enable "Allow Cloud OCR" in settings if needed.

"Offline Mode" forces local OCR and disables cloud AI calls – ideal for air‑gapped or high‑privacy environments.



Get API Keys



DeepSeek: \[platform.deepseek.com](https://platform.deepseek.com/)

OpenAI: \[platform.openai.com](https://platform.openai.com/)

Google Gemini: \[ai.google.dev](https://ai.google.dev/)

Anthropic Claude: \[console.anthropic.com](https://console.anthropic.com/)

Meta Llama (via Together AI etc.): \[together.ai](https://together.ai/)

xAI Grok: \[x.ai](https://x.ai/)

Mistral: \[console.mistral.ai](https://console.mistral.ai/)

Moonshot Kimi: \[platform.moonshot.cn](https://platform.moonshot.cn/)



Commands



| Command | Function |

| `DeepSeek: Ask` | Open input box to ask AI |

| `DeepSeek: Explain Selected Code` | Explain selected code |

| `DeepSeek: Open Settings` | Open standalone settings window |



Code Insertion Options



Click “Insert Code” below any AI response to choose:

New File: Auto-detect language and create new file.

Replace Current File: Replace entire current editor content.

Insert at Cursor: Insert code at cursor position.



Switch Language



Use the dropdown menu in the top-right corner of the sidebar.



Security \& Privacy



All network requests use HTTPS.

Keys are read from environment variables first, otherwise from VSCode encrypted storage.

Local OCR is the default; cloud OCR must be explicitly enabled and shows a warning.

The sidebar shows a live security status (provider, OCR type, key source, offline mode).



License



MIT

