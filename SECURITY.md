安全政策 / Security Policy

支持版本 / Supported Versions

我们始终建议使用最新版本，以获得最新的安全修复和功能增强。以下版本目前获得安全支持：

版本	支持状态

1.1.x	✅ 积极维护

1.0.x	⚠️ 仅安全补丁

< 1.0	❌ 不再支持

报告漏洞 / Reporting a Vulnerability

如果您发现任何安全漏洞，请不要在公共 Issue 中提及，而是通过以下方式私下联系我们：



📧 发送邮件至：security@yourdomain.com（请替换为您的实际邮箱）



🔒 使用 GitHub 的 Private vulnerability reporting（私有漏洞报告）功能（如果已启用）



我们承诺：



在 48 小时内确认收到您的报告。



在 7 天内评估漏洞影响并制定修复计划。



在修复后 14 天内发布补丁版本，并在 CHANGELOG 中致谢（经您同意）。



我们感谢每一位为项目安全做出贡献的研究者。



安全措施 / Security Measures

本项目在设计和开发中始终将安全置于首位，目前已实施以下措施：



🔐 密钥存储

VSCode SecretStorage：所有 API Key 默认使用 VSCode 的加密存储，不会以明文形式保存在 settings.json 中。



环境变量支持：支持通过系统环境变量（如 DEEPSEEK\_API\_KEY）注入密钥，适合 CI/CD 和高级用户，优先级高于 SecretStorage。



自动迁移：旧版本中的明文密钥在首次启动时自动迁移至加密存储，并清理明文残留。



🖼️ OCR 隐私

默认本地引擎：图片 OCR 默认使用本地 Tesseract，图片不会离开您的计算机。



云端可控：如需使用云端 OCR（Google Vision、Azure、Amazon），必须在设置中手动开启 allowCloudOCR，启用时会显示明确的上传警告。



离线模式：开启 offlineMode 后，强制使用本地 OCR，并禁止所有云端 AI 调用，适用于高安全或内网环境。



🌐 网络通信

所有 API 请求均通过 HTTPS/TLS 加密传输，无明文数据传输。



仅与官方公开的 API 端点通信，未经第三方代理或中间服务。



📊 透明可见

侧边栏底部内置 安全状态指示器，实时显示当前 AI 提供商、OCR 引擎类型、密钥来源（环境变量/加密存储）以及离线模式状态，让您始终掌控。



📦 依赖安全

使用 npm audit 定期检查依赖库漏洞，并及时更新。



关键依赖（如 openai、tesseract.js）均来自官方源，且保持最新稳定版。



依赖管理 / Dependency Management

我们使用 npm 管理依赖，并通过 package-lock.json 锁定版本以确保可重复构建。如果您担心供应链安全，可以自行审查以下核心依赖：



openai – OpenAI API 官方 SDK



tesseract.js – 本地 OCR 引擎（纯 JavaScript）



dotenv – 环境变量加载（开发时）



建议您在安装前使用 npm audit 进行检查。



联系方式 / Contact

安全相关问题：security@yourdomain.com



一般问题或建议：请使用 GitHub Issues



紧急安全事件：请直接发送加密邮件（GPG 公钥可另行提供）



致谢 / Acknowledgments

我们感谢以下安全研究者和社区成员为本项目安全做出的贡献（名单将在此处逐步列出）。



最后更新：2026-09-03



Security Policy

Supported Versions

We always recommend using the latest version to receive the most up‑to‑date security fixes and feature enhancements. The following versions are currently supported with security updates:



Version	Support Status

1.1.x	✅ Actively maintained

1.0.x	⚠️ Security patches only

< 1.0	❌ No longer supported

Reporting a Vulnerability

If you discover any security vulnerability, please do not disclose it publicly in issues or discussions. Instead, contact us privately via:



📧 Email: security@yourdomain.com (replace with your actual address)



🔒 GitHub Private vulnerability reporting (if enabled for this repository)



We commit to:



Acknowledge receipt of your report within 48 hours.



Assess the impact and develop a fix within 7 days.



Release a patched version within 14 days after the fix is ready, with credit to you (if you agree).



We greatly appreciate every security researcher who helps make this project safer.



Security Measures

This project has been designed and developed with security as a top priority. We have implemented the following measures:



🔐 Key Storage

VSCode SecretStorage: All API keys are stored using VSCode's encrypted storage by default – they are never saved in plaintext in settings.json.



Environment Variable Support: Keys can also be provided via system environment variables (e.g., DEEPSEEK\_API\_KEY), which take precedence over SecretStorage – ideal for CI/CD and advanced users.



Automatic Migration: Plaintext keys from older versions are automatically migrated to SecretStorage on first launch, and the plaintext is removed.



🖼️ OCR Privacy

Local Engine by Default: Image OCR uses the local Tesseract engine by default – your images never leave your computer.



Cloud-Only When Explicitly Enabled: To use cloud‑based OCR (Google Vision, Azure, Amazon), you must manually enable allowCloudOCR in settings. A clear warning is shown before any upload.



Offline Mode: Enabling offlineMode forces local OCR and blocks all cloud AI calls – perfect for high‑security or air‑gapped environments.



🌐 Network Communication

All API requests are transmitted via HTTPS/TLS – no plaintext data is sent.



We communicate only with official public API endpoints – no third‑party proxies or intermediaries.



📊 Transparency

A built‑in Security Status Indicator at the bottom of the sidebar shows, in real time: your AI provider, OCR engine type, key source (environment variable / encrypted storage), and whether offline mode is active.



📦 Dependency Safety

We regularly run npm audit to check for known vulnerabilities in our dependencies and update them promptly.



Critical dependencies (e.g., openai, tesseract.js) are sourced from official channels and kept at stable, up‑to‑date versions.



Dependency Management

We use npm for dependency management, with package-lock.json to lock versions for reproducible builds. If you are concerned about supply‑chain security, you may review the following core dependencies:



openai – Official OpenAI API SDK



tesseract.js – Pure‑JavaScript local OCR engine



dotenv – Environment variable loader (development only)



We recommend running npm audit before installation to check for any known issues.



Contact

Security‑related issues: security@yourdomain.com



General questions or suggestions: please use GitHub Issues



Urgent security incidents: send an encrypted email (GPG key can be provided upon request)



Acknowledgments

We would like to thank the following security researchers and community members for their contributions to the security of this project (list will be gradually added here).



Last updated: 2026-09-03



You can replace security@yourdomain.com with your actual contact email before uploading to GitHub. If you prefer to keep both Chinese and English versions in the same file, you may combine them – but this pure English version is ready to be used as your SECURITY.md.





