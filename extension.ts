import * as vscode from 'vscode';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { askDeepSeek, explainCode, askWithHistory } from './api';
import * as Tesseract from 'tesseract.js';

// ================== 加载 .env（静默） ==================
const envPath = path.join(__dirname, '..', '.env');
try {
    dotenv.config({ path: envPath });
} catch (_) {
    // 忽略 .env 加载错误（非必须）
}

// ================== 语言映射 ==================
type Language = 'zh-CN' | 'en' | 'ja' | 'de' | 'fr' | 'ko';

const langMap: Record<Language, any> = {
  'zh-CN': {
    title: 'AI 助手', settings: '设置', clear: '清空', placeholder: '输入你的问题...',
    send: '发送', thinking: '思考中...',
    welcome: '你好！我是 AI 助手，你可以向我提问或让我解释代码。',
    insertCode: '插入代码', error: '❌ 错误：',
    codeInserted: '代码已在新文件中打开', fileReplaced: '文件已替换',
    codeInsertedAtCursor: '代码已插入', noActiveEditor: '没有活动的编辑器，请先打开一个文件',
    chooseAction: '选择代码插入方式', newFile: '📄 新建文件',
    replaceFile: '📝 替换当前文件', insertAtCursor: '✏️ 插入到光标位置',
    settingsTitle: 'AI 连接设置', provider: 'API 提供商',
    modelLabel: '模型名称', maxTokens: '最大 Token 数',
    save: '保存设置', saving: '保存中...', saveSuccess: '✅ 设置已保存！',
    saveError: '❌ 保存失败：', missingKey: '❌ 请填写 API Key',
    apiKeyPlaceholder: '请输入 API Key...', switchLanguage: '语言:',
  },
  'en': {
    title: 'AI Assistant', settings: 'Settings', clear: 'Clear',
    placeholder: 'Type your question...', send: 'Send', thinking: 'Thinking...',
    welcome: 'Hello! I am an AI assistant. Ask me anything or ask me to explain code.',
    insertCode: 'Insert Code', error: '❌ Error: ',
    codeInserted: 'Code opened in new file', fileReplaced: 'File replaced',
    codeInsertedAtCursor: 'Code inserted', noActiveEditor: 'No active editor, please open a file first',
    chooseAction: 'Choose code insertion method', newFile: '📄 New File',
    replaceFile: '📝 Replace Current File', insertAtCursor: '✏️ Insert at Cursor',
    settingsTitle: 'AI Connection Settings', provider: 'API Provider',
    modelLabel: 'Model Name', maxTokens: 'Max Tokens',
    save: 'Save Settings', saving: 'Saving...', saveSuccess: '✅ Settings saved!',
    saveError: '❌ Save failed: ', missingKey: '❌ Please enter API Key',
    apiKeyPlaceholder: 'Enter API Key...', switchLanguage: 'Language:',
  },
  'ja': {
    title: 'AI アシスタント', settings: '設定', clear: 'クリア',
    placeholder: '質問を入力してください...', send: '送信', thinking: '考え中...',
    welcome: 'こんにちは！私はAIアシスタントです。質問やコードの説明を依頼できます。',
    insertCode: 'コードを挿入', error: '❌ エラー：',
    codeInserted: 'コードを新しいファイルで開きました', fileReplaced: 'ファイルを置き換えました',
    codeInsertedAtCursor: 'コードを挿入しました', noActiveEditor: 'アクティブなエディタがありません。先にファイルを開いてください',
    chooseAction: 'コード挿入方法を選択', newFile: '📄 新規ファイル',
    replaceFile: '📝 現在のファイルを置換', insertAtCursor: '✏️ カーソル位置に挿入',
    settingsTitle: 'AI 接続設定', provider: 'API プロバイダー',
    modelLabel: 'モデル名', maxTokens: '最大トークン数',
    save: '設定を保存', saving: '保存中...', saveSuccess: '✅ 設定を保存しました！',
    saveError: '❌ 保存に失敗しました：', missingKey: '❌ APIキーを入力してください',
    apiKeyPlaceholder: 'APIキーを入力...', switchLanguage: '言語:',
  },
  'de': {
    title: 'AI-Assistent', settings: 'Einstellungen', clear: 'Löschen',
    placeholder: 'Geben Sie Ihre Frage ein...', send: 'Senden', thinking: 'Denke nach...',
    welcome: 'Hallo! Ich bin ein KI-Assistent. Stellen Sie mir Fragen oder lassen Sie mich Code erklären.',
    insertCode: 'Code einfügen', error: '❌ Fehler: ',
    codeInserted: 'Code in neuer Datei geöffnet', fileReplaced: 'Datei ersetzt',
    codeInsertedAtCursor: 'Code eingefügt', noActiveEditor: 'Kein aktiver Editor, bitte öffnen Sie zuerst eine Datei',
    chooseAction: 'Code-Einfügemethode wählen', newFile: '📄 Neue Datei',
    replaceFile: '📝 Aktuelle Datei ersetzen', insertAtCursor: '✏️ An Cursor einfügen',
    settingsTitle: 'KI-Verbindungseinstellungen', provider: 'API-Anbieter',
    modelLabel: 'Modellname', maxTokens: 'Max. Token',
    save: 'Einstellungen speichern', saving: 'Speichern...', saveSuccess: '✅ Einstellungen gespeichert!',
    saveError: '❌ Speichern fehlgeschlagen: ', missingKey: '❌ Bitte geben Sie den API-Schlüssel ein',
    apiKeyPlaceholder: 'API-Schlüssel eingeben...', switchLanguage: 'Sprache:',
  },
  'fr': {
    title: 'Assistant IA', settings: 'Paramètres', clear: 'Effacer',
    placeholder: 'Entrez votre question...', send: 'Envoyer', thinking: 'Réflexion...',
    welcome: 'Bonjour ! Je suis un assistant IA. Posez-moi des questions ou demandez-moi d\'expliquer du code.',
    insertCode: 'Insérer le code', error: '❌ Erreur : ',
    codeInserted: 'Code ouvert dans un nouveau fichier', fileReplaced: 'Fichier remplacé',
    codeInsertedAtCursor: 'Code inséré', noActiveEditor: 'Aucun éditeur actif, veuillez d\'abord ouvrir un fichier',
    chooseAction: 'Choisissez la méthode d\'insertion du code', newFile: '📄 Nouveau fichier',
    replaceFile: '📝 Remplacer le fichier actuel', insertAtCursor: '✏️ Insérer à la position du curseur',
    settingsTitle: 'Paramètres de connexion IA', provider: 'Fournisseur API',
    modelLabel: 'Nom du modèle', maxTokens: 'Nombre max de tokens',
    save: 'Enregistrer les paramètres', saving: 'Enregistrement...', saveSuccess: '✅ Paramètres enregistrés !',
    saveError: '❌ Échec de l\'enregistrement : ', missingKey: '❌ Veuillez saisir la clé API',
    apiKeyPlaceholder: 'Entrez la clé API...', switchLanguage: 'Langue:',
  },
  'ko': {
    title: 'AI 어시스턴트', settings: '설정', clear: '지우기',
    placeholder: '질문을 입력하세요...', send: '보내기', thinking: '생각 중...',
    welcome: '안녕하세요! 저는 AI 어시스턴트입니다. 질문하거나 코드를 설명해 달라고 요청하세요.',
    insertCode: '코드 삽입', error: '❌ 오류: ',
    codeInserted: '새 파일에 코드가 열렸습니다', fileReplaced: '파일이 교체되었습니다',
    codeInsertedAtCursor: '코드가 삽입되었습니다', noActiveEditor: '활성 편집기가 없습니다. 먼저 파일을 열어주세요',
    chooseAction: '코드 삽입 방법 선택', newFile: '📄 새 파일',
    replaceFile: '📝 현재 파일 교체', insertAtCursor: '✏️ 커서 위치에 삽입',
    settingsTitle: 'AI 연결 설정', provider: 'API 제공자',
    modelLabel: '모델 이름', maxTokens: '최대 토큰 수',
    save: '설정 저장', saving: '저장 중...', saveSuccess: '✅ 설정이 저장되었습니다!',
    saveError: '❌ 저장 실패: ', missingKey: '❌ API 키를 입력하세요',
    apiKeyPlaceholder: 'API 키 입력...', switchLanguage: '언어:',
  },
};

// ================== 工具函数 ==================
function getLanguage(): Language {
  const config = vscode.workspace.getConfiguration('deepseek');
  return config.get<Language>('language', 'en');
}
async function setLanguage(lang: Language) {
  const config = vscode.workspace.getConfiguration('deepseek');
  await config.update('language', lang, vscode.ConfigurationTarget.Global);
}
function detectLanguage(code: string): string | undefined {
  const lines = code.split('\n');
  if (lines.length > 0) {
    const first = lines[0].trim();
    if (first.startsWith('#!/usr/bin/env python') || first.startsWith('#!python')) return 'python';
    if (first.startsWith('#!/bin/bash')) return 'shellscript';
    if (first.startsWith('#!/usr/bin/env node')) return 'javascript';
    if (code.includes('import React') || code.includes('from "react"')) return 'typescriptreact';
    if (code.includes('<?php')) return 'php';
    if (code.includes('<!DOCTYPE html>')) return 'html';
    if (code.includes('def ') && code.includes('import ')) return 'python';
    if (code.includes('function ') || code.includes('const ') || code.includes('let ')) return 'javascript';
    if (code.includes('class ') && code.includes('{') && code.includes('}')) return 'typescript';
  }
  return undefined;
}
let chatHistory: { role: 'user' | 'assistant'; content: string }[] = [];

const providerDisplayNames: Record<string, any> = {
  'deepseek': { 'zh-CN': 'DeepSeek', 'en': 'DeepSeek' },
  'openai': { 'zh-CN': 'OpenAI', 'en': 'OpenAI' },
  'google': { 'zh-CN': 'Google Gemini', 'en': 'Google Gemini' },
  'anthropic': { 'zh-CN': 'Anthropic Claude', 'en': 'Anthropic Claude' },
  'meta': { 'zh-CN': 'Meta Llama', 'en': 'Meta Llama' },
  'xai': { 'zh-CN': 'xAI Grok', 'en': 'xAI Grok' },
  'mistral': { 'zh-CN': 'Mistral', 'en': 'Mistral' },
  'moonshot': { 'zh-CN': 'Moonshot Kimi', 'en': 'Moonshot Kimi' }
};
const modelOptions: Record<string, string[]> = {
  'deepseek': ['deepseek-v4-pro', 'deepseek-chat', 'deepseek-coder'],
  'openai': ['gpt-5.6-sol', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  'google': ['gemini-3.5-pro', 'gemini-2.5-flash'],
  'anthropic': ['claude-fable-5', 'claude-opus-5', 'claude-sonnet-5'],
  'meta': ['llama-4-maverick', 'llama-3.3-70b'],
  'xai': ['grok-4.5', 'grok-4'],
  'mistral': ['mistral-medium-3.5', 'mistral-small-3.1'],
  'moonshot': ['kimi-k3', 'kimi-k2']
};

// ================== OCR 引擎 ==================
abstract class OcrEngine { abstract recognize(buffer: Buffer, language: string): Promise<string>; }

class TesseractEngine extends OcrEngine {
  async recognize(buffer: Buffer, language: string): Promise<string> {
    try {
      const result = await Tesseract.recognize(buffer, language, {});
      return result.data.text.trim();
    } catch (err: any) { throw new Error(`Tesseract 识别失败: ${err.message}`); }
  }
}

class GoogleVisionEngine extends OcrEngine {
  private client: any;
  constructor(apiKey: string) {
    super();
    try {
      const vision = require('@google-cloud/vision');
      this.client = new vision.ImageAnnotatorClient({ apiKey });
    } catch (err) { throw new Error('Google Vision 未安装，请运行 npm install @google-cloud/vision'); }
  }
  async recognize(buffer: Buffer, language: string): Promise<string> {
    try {
      const [result] = await this.client.textDetection(buffer);
      return result.fullTextAnnotation?.text?.trim() || '';
    } catch (err: any) { throw new Error(`Google Vision 识别失败: ${err.message}`); }
  }
}

class AzureVisionEngine extends OcrEngine {
  private client: any;
  constructor(endpoint: string, key: string) {
    super();
    try {
      const { ComputerVisionClient } = require('@azure/cognitiveservices-computervision');
      const { ApiKeyCredentials } = require('@azure/ms-rest-js');
      const credentials = new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } });
      this.client = new ComputerVisionClient(credentials, endpoint);
    } catch (err) { throw new Error('Azure Vision 未安装，请运行 npm install @azure/cognitiveservices-computervision @azure/ms-rest-js'); }
  }
  async recognize(buffer: Buffer, language: string): Promise<string> {
    try {
      const result = await this.client.recognizePrintedTextInStream(true, buffer, { language });
      let text = '';
      if (result.regions) {
        for (const region of result.regions) {
          for (const line of region.lines) {
            for (const word of line.words) text += word.text + ' ';
            text += '\n';
          }
        }
      }
      return text.trim();
    } catch (err: any) { throw new Error(`Azure Vision 识别失败: ${err.message}`); }
  }
}

class AmazonTextractEngine extends OcrEngine {
  private client: any;
  constructor(accessKey: string, secretKey: string, region: string) {
    super();
    try {
      const AWS = require('aws-sdk');
      AWS.config.update({ accessKeyId: accessKey, secretAccessKey: secretKey, region });
      this.client = new AWS.Textract();
    } catch (err) { throw new Error('AWS SDK 未安装，请运行 npm install aws-sdk'); }
  }
  async recognize(buffer: Buffer, language: string): Promise<string> {
    try {
      const params = { Document: { Bytes: buffer } };
      const result = await this.client.detectDocumentText(params).promise();
      let text = '';
      if (result.Blocks) {
        for (const block of result.Blocks) {
          if (block.BlockType === 'LINE' && block.Text) text += block.Text + '\n';
        }
      }
      return text.trim();
    } catch (err: any) { throw new Error(`Amazon Textract 识别失败: ${err.message}`); }
  }
}

// ================== 安全增强：密钥管理 ==================
const SECRET_PREFIX = 'deepseek-key-';

async function getApiKey(provider: string, context: vscode.ExtensionContext): Promise<string> {
  // 1. 环境变量（最高优先级）
  const envKey = process.env[`${provider.toUpperCase()}_API_KEY`];
  if (envKey) return envKey;

  // 2. SecretStorage
  const secretKey = `${SECRET_PREFIX}${provider}`;
  let stored = await context.secrets.get(secretKey);
  if (stored) return stored;

  // 3. 回退到旧的 settings.json（迁移）
  const config = vscode.workspace.getConfiguration('deepseek');
  let oldKey = '';
  if (provider === 'deepseek') {
    oldKey = config.get<string>('apiKey', '');
  } else {
    const field = `${provider}ApiKey`;
    oldKey = config.get<string>(field, '');
  }
  if (oldKey) {
    await context.secrets.store(secretKey, oldKey);
    if (provider === 'deepseek') {
      await config.update('apiKey', undefined, vscode.ConfigurationTarget.Global);
    } else {
      await config.update(`${provider}ApiKey`, undefined, vscode.ConfigurationTarget.Global);
    }
    return oldKey;
  }
  throw new Error(`未找到 ${provider} 的 API Key，请设置环境变量或通过设置界面配置`);
}

async function getSecureConfig(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('deepseek');
  const provider = config.get<string>('apiProvider', 'deepseek');
  const apiKey = await getApiKey(provider, context);
  const model = config.get<string>('model', '');
  const maxTokens = config.get<number>('maxTokens', 2048);
  return { apiProvider: provider, apiKey, model, maxTokens };
}

async function migrateOldKeys(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('deepseek');
  const providers = ['deepseek', 'openai', 'google', 'anthropic', 'meta', 'xai', 'mistral', 'moonshot'];
  for (const p of providers) {
    const field = p === 'deepseek' ? 'apiKey' : `${p}ApiKey`;
    const old = config.get<string>(field, '');
    if (old) {
      await context.secrets.store(`${SECRET_PREFIX}${p}`, old);
      await config.update(field, undefined, vscode.ConfigurationTarget.Global);
    }
  }
}

// ================== OCR 工厂（含云端开关与警告） ==================
function createOcrEngine(provider: string, config: vscode.WorkspaceConfiguration, context: vscode.ExtensionContext): OcrEngine {
  const offlineMode = config.get<boolean>('offlineMode', false);
  if (offlineMode && provider !== 'tesseract') {
    vscode.window.showWarningMessage('离线模式已启用，强制使用本地 Tesseract OCR');
    provider = 'tesseract';
  }

  const allowCloud = config.get<boolean>('allowCloudOCR', false);
  if (!allowCloud && provider !== 'tesseract') {
    vscode.window.showWarningMessage('云端 OCR 已禁用，自动切换到本地 Tesseract（可在设置中开启）');
    provider = 'tesseract';
  }

  if (provider !== 'tesseract') {
    vscode.window.showInformationMessage(`图片将上传至 ${provider} 进行 OCR，请确认您信任该服务商。`);
  }

  switch (provider) {
    case 'tesseract': return new TesseractEngine();
    case 'google': {
      const key = config.get<string>('googleVisionApiKey', '');
      if (!key) throw new Error('请配置 Google Vision API Key');
      return new GoogleVisionEngine(key);
    }
    case 'azure': {
      const endpoint = config.get<string>('azureVisionEndpoint', '');
      const key = config.get<string>('azureVisionKey', '');
      if (!endpoint || !key) throw new Error('请配置 Azure Vision 端点与密钥');
      return new AzureVisionEngine(endpoint, key);
    }
    case 'amazon': {
      const accessKey = config.get<string>('amazonAccessKey', '');
      const secretKey = config.get<string>('amazonSecretKey', '');
      const region = config.get<string>('amazonRegion', 'us-east-1');
      if (!accessKey || !secretKey) throw new Error('请配置 AWS 访问密钥');
      return new AmazonTextractEngine(accessKey, secretKey, region);
    }
    default: throw new Error(`不支持的 OCR 提供商: ${provider}`);
  }
}

// ================== UI 安全指示器 ==================
function getSecurityStatusHtml(context: vscode.ExtensionContext): string {
  const config = vscode.workspace.getConfiguration('deepseek');
  const provider = config.get<string>('apiProvider', 'deepseek');
  const ocrProvider = config.get<string>('ocrProvider', 'tesseract');
  const offline = config.get<boolean>('offlineMode', false);
  const allowCloud = config.get<boolean>('allowCloudOCR', false);

  let parts: string[] = [];
  const aiName = provider.charAt(0).toUpperCase() + provider.slice(1);
  parts.push(`AI: ${aiName}`);
  const ocrLabel = ocrProvider === 'tesseract' ? '本地 Tesseract' : ocrProvider;
  parts.push(`OCR: ${ocrLabel}`);
  if (offline) parts.push('🚀 离线');
  if (!allowCloud && ocrProvider !== 'tesseract') parts.push('🔒 云端禁');
  const hasEnv = process.env[`${provider.toUpperCase()}_API_KEY`];
  parts.push(hasEnv ? '🔑 环境变量' : '🔐 加密存储');
  return `<div style="font-size:11px;color:var(--vscode-descriptionForeground);padding:4px 0;border-top:1px solid var(--vscode-panel-border);margin-top:4px;">${parts.join(' | ')}</div>`;
}

// ================== HTML 生成（聊天界面） ==================
function getChatHtml(lang: Language, context: vscode.ExtensionContext): string {
  const t = langMap[lang];
  const languageOptions = Object.keys(langMap).map(key => {
    const label = key === 'zh-CN' ? '中文' : key === 'en' ? 'English' : key === 'ja' ? '日本語' : key === 'de' ? 'Deutsch' : key === 'fr' ? 'Français' : '한국어';
    return `<option value="${key}" ${key === lang ? 'selected' : ''}>${label}</option>`;
  }).join('');
  const securityHtml = getSecurityStatusHtml(context);

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>DeepSeek Chat</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}html,body{height:100%;overflow:hidden}
body{font-family:var(--vscode-font-family);color:var(--vscode-editor-foreground);background:var(--vscode-editor-background);display:flex;flex-direction:column;padding:8px}
#header{display:flex;justify-content:space-between;align-items:center;padding-bottom:8px;border-bottom:1px solid var(--vscode-panel-border);flex-shrink:0}
#header h2{font-size:16px}
#header .actions{display:flex;gap:6px;align-items:center}
#header .actions button,#header .actions select{background:transparent;border:none;color:var(--vscode-foreground);cursor:pointer;padding:4px 8px;border-radius:4px}
#header .actions button:hover,#header .actions select:hover{background:var(--vscode-list-hoverBackground)}
#messages{flex:1;overflow-y:auto;padding:8px 0;display:flex;flex-direction:column;gap:12px}
.msg{padding:8px 12px;border-radius:8px;max-width:95%;white-space:pre-wrap;word-wrap:break-word}
.msg.user{background:var(--vscode-button-background);color:var(--vscode-button-foreground);align-self:flex-end}
.msg.assistant{background:var(--vscode-editor-inactiveSelectionBackground);align-self:flex-start}
.msg.assistant .actions{margin-top:6px;display:flex;gap:8px}
.msg.assistant .actions button{background:transparent;border:1px solid var(--vscode-panel-border);border-radius:4px;padding:2px 8px;cursor:pointer;color:var(--vscode-foreground)}
.msg.assistant .actions button:hover{background:var(--vscode-list-hoverBackground)}
#input-area{display:flex;flex-direction:column;gap:6px;padding:8px 0;border-top:1px solid var(--vscode-panel-border);flex-shrink:0}
.button-row{display:flex;gap:8px;flex-wrap:wrap}
.button-row button{background:var(--vscode-button-background);color:var(--vscode-button-foreground);border:none;border-radius:4px;padding:4px 12px;cursor:pointer;font-size:13px;height:30px;display:inline-flex;align-items:center;gap:4px}
.button-row button:hover{background:var(--vscode-button-hoverBackground)}
.input-row{display:flex;gap:8px;align-items:flex-end}
.input-row textarea{flex:1;background:var(--vscode-input-background);color:var(--vscode-input-foreground);border:1px solid var(--vscode-input-border);border-radius:6px;padding:6px 8px;resize:none;font-size:14px;min-height:40px;max-height:120px;font-family:inherit}
.input-row textarea:focus{outline:none;border-color:var(--vscode-focusBorder)}
.input-row button#sendBtn{background:var(--vscode-button-background);color:var(--vscode-button-foreground);border:none;border-radius:6px;padding:6px 14px;cursor:pointer;font-size:14px;height:40px}
.input-row button#sendBtn:hover{background:var(--vscode-button-hoverBackground)}
.input-row button#sendBtn:disabled{opacity:0.5;cursor:not-allowed}
.loading{font-style:italic;opacity:0.7}
#security-status{font-size:11px;color:var(--vscode-descriptionForeground);padding:4px 0;border-top:1px solid var(--vscode-panel-border);margin-top:4px}
</style>
</head>
<body>
<div id="header"><h2>${t.title}</h2><div class="actions"><select id="langSelect">${languageOptions}</select><button id="settingsBtn">${t.settings}</button><button id="clearBtn">${t.clear}</button></div></div>
<div id="messages"></div>
<div id="input-area">
  <div class="button-row">
    <button id="uploadBtn">📄 文本</button>
    <button id="uploadImageBtn">🖼️ 图片</button>
  </div>
  <div class="input-row">
    <textarea id="promptInput" rows="1" placeholder="${t.placeholder}"></textarea>
    <button id="sendBtn">${t.send}</button>
  </div>
  <div id="security-status">${securityHtml}</div>
</div>
<script>
const vscode = acquireVsCodeApi();
const messagesContainer = document.getElementById('messages');
const promptInput = document.getElementById('promptInput');
const sendBtn = document.getElementById('sendBtn');
const settingsBtn = document.getElementById('settingsBtn');
const clearBtn = document.getElementById('clearBtn');
const langSelect = document.getElementById('langSelect');
const uploadBtn = document.getElementById('uploadBtn');
const uploadImageBtn = document.getElementById('uploadImageBtn');
const t = ${JSON.stringify(t)};

// 文本上传
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.txt,.md,.js,.py,.json,.html,.css,.xml,.csv,.log,.sh,.bat,.ps1,.yaml,.yml,.toml,.ini,.conf,.cfg';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);
uploadBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', function(e) {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    const content = event.target?.result;
    if (typeof content === 'string') {
      promptInput.value = content;
      promptInput.dispatchEvent(new Event('input'));
      promptInput.focus();
    } else vscode.postMessage({ command: 'showError', error: '无法读取文件内容' });
  };
  reader.onerror = () => vscode.postMessage({ command: 'showError', error: '读取文件时出错' });
  reader.readAsText(file);
  this.value = '';
});

// 图片上传（OCR）
const imageFileInput = document.createElement('input');
imageFileInput.type = 'file';
imageFileInput.accept = 'image/*';
imageFileInput.style.display = 'none';
document.body.appendChild(imageFileInput);
uploadImageBtn.addEventListener('click', () => imageFileInput.click());
imageFileInput.addEventListener('change', function(e) {
  const file = this.files[0];
  if (!file) return;
  promptInput.placeholder = '识别中...';
  sendBtn.disabled = true;
  const reader = new FileReader();
  reader.onload = (event) => {
    const arrayBuffer = event.target?.result;
    if (!arrayBuffer) {
      vscode.postMessage({ command: 'showError', error: '读取图片失败' });
      promptInput.placeholder = t.placeholder;
      sendBtn.disabled = false;
      return;
    }
    vscode.postMessage({ command: 'dropImage', data: arrayBuffer });
  };
  reader.onerror = () => {
    vscode.postMessage({ command: 'showError', error: '读取图片时出错' });
    promptInput.placeholder = t.placeholder;
    sendBtn.disabled = false;
  };
  reader.readAsArrayBuffer(file);
  this.value = '';
});

function addMessage(role, content, canInsert = false) {
  const div = document.createElement('div');
  div.className = 'msg ' + role;
  div.textContent = content;
  if (role === 'assistant' && canInsert) {
    const actions = document.createElement('div');
    actions.className = 'actions';
    const insertBtn = document.createElement('button');
    insertBtn.textContent = t.insertCode;
    insertBtn.addEventListener('click', () => vscode.postMessage({ command: 'insertCode', content: content }));
    actions.appendChild(insertBtn);
    div.appendChild(actions);
  }
  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
let loadingDiv = null;
function showLoading() { if (!loadingDiv) { loadingDiv = document.createElement('div'); loadingDiv.className = 'msg assistant loading'; loadingDiv.textContent = t.thinking; messagesContainer.appendChild(loadingDiv); messagesContainer.scrollTop = messagesContainer.scrollHeight; } }
function hideLoading() { if (loadingDiv) { loadingDiv.remove(); loadingDiv = null; } }
function sendMessage() {
  const text = promptInput.value.trim();
  if (!text) return;
  promptInput.value = '';
  addMessage('user', text);
  showLoading();
  vscode.postMessage({ command: 'sendMessage', text: text });
  sendBtn.disabled = true;
}
sendBtn.addEventListener('click', sendMessage);
promptInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });
promptInput.addEventListener('input', () => { promptInput.style.height = 'auto'; promptInput.style.height = Math.min(promptInput.scrollHeight, 120) + 'px'; });
settingsBtn.addEventListener('click', () => vscode.postMessage({ command: 'openSettings' }));
clearBtn.addEventListener('click', () => { messagesContainer.innerHTML = ''; vscode.postMessage({ command: 'clearHistory' }); });
langSelect.addEventListener('change', function() { vscode.postMessage({ command: 'changeLanguage', language: this.value }); });

window.addEventListener('message', event => {
  const msg = event.data;
  if (msg.command === 'addAssistantMessage') { hideLoading(); addMessage('assistant', msg.content, true); sendBtn.disabled = false; }
  else if (msg.command === 'showError') { hideLoading(); addMessage('assistant', t.error + msg.error); sendBtn.disabled = false; promptInput.placeholder = t.placeholder; }
  else if (msg.command === 'clear') { messagesContainer.innerHTML = ''; }
  else if (msg.command === 'addUserMessage') { addMessage('user', msg.content); }
  else if (msg.command === 'recognitionDone') { promptInput.placeholder = t.placeholder; sendBtn.disabled = false; promptInput.focus(); }
});
promptInput.focus();
window.addEventListener('load', () => addMessage('assistant', t.welcome));
</script>
</body>
</html>`;
}

// ================== 设置面板 HTML（异步，显示密钥状态） ==================
async function getSettingsHtml(lang: Language, context: vscode.ExtensionContext): Promise<string> {
  const t = langMap[lang];
  const config = vscode.workspace.getConfiguration('deepseek');
  const currentProvider = config.get<string>('apiProvider', 'deepseek');
  const currentModel = config.get<string>('model', '');
  const maxTokens = config.get<number>('maxTokens', 2048);
  const currentOcrProvider = config.get<string>('ocrProvider', 'tesseract');
  const currentOcrLanguage = config.get<string>('ocrLanguage', 'chi_sim+eng');
  const currentGoogleKey = config.get<string>('googleVisionApiKey', '');
  const currentAzureEndpoint = config.get<string>('azureVisionEndpoint', '');
  const currentAzureKey = config.get<string>('azureVisionKey', '');
  const currentAwsAccessKey = config.get<string>('amazonAccessKey', '');
  const currentAwsSecretKey = config.get<string>('amazonSecretKey', '');
  const currentAwsRegion = config.get<string>('amazonRegion', 'us-east-1');
  const allowCloud = config.get<boolean>('allowCloudOCR', false);
  const offline = config.get<boolean>('offlineMode', false);

  const hasKey = !!(process.env[`${currentProvider.toUpperCase()}_API_KEY`] ||
                    await context.secrets.get(`${SECRET_PREFIX}${currentProvider}`));

  const providerOptions = Object.keys(providerDisplayNames).map(p =>
    `<option value="${p}" ${p === currentProvider ? 'selected' : ''}>${providerDisplayNames[p][lang] || p}</option>`
  ).join('');
  const modelList = modelOptions[currentProvider] || [];
  const modelOptionsHtml = modelList.map(m => `<option value="${m}" ${m === currentModel ? 'selected' : ''}>${m}</option>`).join('');
  const ocrOptions = ['tesseract', 'google', 'azure', 'amazon'].map(e =>
    `<option value="${e}" ${e === currentOcrProvider ? 'selected' : ''}>${e.charAt(0).toUpperCase()+e.slice(1)}</option>`
  ).join('');

  const statusText = hasKey ? '✅ 密钥已加密存储' : '⚠️ 未配置密钥（请填写或使用环境变量）';
  const placeholderText = hasKey ? '密钥已配置（留空保留）' : '请输入 API Key...';
  const clearBtnHtml = hasKey ? `<button id="clearKeyBtn" style="margin-top:4px;background:var(--vscode-errorForeground);color:white;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;">清除密钥</button>` : '';

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>AI Settings</title>
<style>body{font-family:var(--vscode-font-family);padding:20px;background:var(--vscode-editor-background);color:var(--vscode-editor-foreground)}
.form-group{margin-bottom:16px}label{display:block;font-weight:bold;margin-bottom:4px}input,select{width:100%;padding:6px;background:var(--vscode-input-background);color:var(--vscode-input-foreground);border:1px solid var(--vscode-input-border)}
button{background:var(--vscode-button-background);color:var(--vscode-button-foreground);border:none;padding:8px 16px;cursor:pointer}
.status{margin-top:8px;padding:4px}.success{color:green}.error{color:red}
hr{margin:20px 0;border:0;border-top:1px solid var(--vscode-panel-border)}
.checkbox-group{display:flex;align-items:center;gap:8px;margin-top:4px}
.checkbox-group input[type="checkbox"]{width:auto;margin:0}
.key-status{font-size:12px;color:var(--vscode-descriptionForeground);margin-top:4px}
</style></head><body>
<h2>${t.settingsTitle}</h2>
<div class="form-group"><label>${t.provider}</label><select id="providerSelect">${providerOptions}</select></div>
<div class="form-group">
  <label id="apiKeyLabel">API Key</label>
  <input type="password" id="apiKeyInput" placeholder="${placeholderText}" value="">
  <div id="keyStatus" class="key-status">${statusText}</div>
  ${clearBtnHtml}
</div>
<div class="form-group"><label>${t.modelLabel}</label><select id="modelSelect">${modelOptionsHtml}</select></div>
<div class="form-group"><label>${t.maxTokens}</label><input type="number" id="maxTokensInput" value="${maxTokens}"></div>
<hr>
<div class="form-group"><label>OCR 引擎</label><select id="ocrProviderSelect">${ocrOptions}</select></div>
<div class="form-group"><label>识别语言</label><input type="text" id="ocrLanguageInput" value="${currentOcrLanguage}" placeholder="chi_sim+eng"></div>
<div class="form-group"><label>Google Vision API Key</label><input type="password" id="googleVisionKey" value="${currentGoogleKey}"></div>
<div class="form-group"><label>Azure Vision 端点</label><input type="text" id="azureEndpoint" value="${currentAzureEndpoint}"></div>
<div class="form-group"><label>Azure Vision 订阅密钥</label><input type="password" id="azureKey" value="${currentAzureKey}"></div>
<div class="form-group"><label>AWS Access Key ID</label><input type="text" id="awsAccessKey" value="${currentAwsAccessKey}"></div>
<div class="form-group"><label>AWS Secret Access Key</label><input type="password" id="awsSecretKey" value="${currentAwsSecretKey}"></div>
<div class="form-group"><label>AWS 区域</label><input type="text" id="awsRegion" value="${currentAwsRegion}"></div>
<hr>
<div class="form-group checkbox-group">
  <input type="checkbox" id="allowCloudOCR" ${allowCloud ? 'checked' : ''}>
  <label for="allowCloudOCR">允许云端 OCR（默认关闭，更安全）</label>
</div>
<div class="form-group checkbox-group">
  <input type="checkbox" id="offlineMode" ${offline ? 'checked' : ''}>
  <label for="offlineMode">完全离线模式（强制本地 OCR，禁止云端 AI）</label>
</div>
<button id="saveBtn">${t.save}</button>
<div id="status" class="status"></div>
<script>
const vscode = acquireVsCodeApi();
const providerSelect = document.getElementById('providerSelect');
const apiKeyInput = document.getElementById('apiKeyInput');
const modelSelect = document.getElementById('modelSelect');
const maxTokensInput = document.getElementById('maxTokensInput');
const saveBtn = document.getElementById('saveBtn');
const statusDiv = document.getElementById('status');
const apiKeyLabel = document.getElementById('apiKeyLabel');
const clearKeyBtn = document.getElementById('clearKeyBtn');
const t = ${JSON.stringify(t)};
const providerNames = ${JSON.stringify(providerDisplayNames)};
const modelOptions = ${JSON.stringify(modelOptions)};
const lang = '${lang}';

function updateFields(provider) {
  const displayName = providerNames[provider]?.[lang] || provider;
  apiKeyLabel.textContent = displayName + ' API Key';
  const models = modelOptions[provider] || [];
  modelSelect.innerHTML = '';
  models.forEach(m => { const opt = document.createElement('option'); opt.value = m; opt.textContent = m; modelSelect.appendChild(opt); });
  const currentModel = '${currentModel}';
  if (models.includes(currentModel)) modelSelect.value = currentModel;
  else if (models.length > 0) modelSelect.value = models[0];
}
updateFields(providerSelect.value);
providerSelect.addEventListener('change', function() { updateFields(this.value); });

if (clearKeyBtn) {
  clearKeyBtn.addEventListener('click', () => {
    const provider = providerSelect.value;
    vscode.postMessage({ command: 'clearKey', provider: provider });
  });
}

saveBtn.addEventListener('click', () => {
  const provider = providerSelect.value;
  const apiKey = apiKeyInput.value.trim();
  const model = modelSelect.value;
  const maxTokens = parseInt(maxTokensInput.value) || 2048;
  const ocrProvider = document.getElementById('ocrProviderSelect').value;
  const ocrLanguage = document.getElementById('ocrLanguageInput').value;
  const googleKey = document.getElementById('googleVisionKey').value;
  const azureEndpoint = document.getElementById('azureEndpoint').value;
  const azureKey = document.getElementById('azureKey').value;
  const awsAccessKey = document.getElementById('awsAccessKey').value;
  const awsSecretKey = document.getElementById('awsSecretKey').value;
  const awsRegion = document.getElementById('awsRegion').value;
  const allowCloud = document.getElementById('allowCloudOCR').checked;
  const offlineMode = document.getElementById('offlineMode').checked;
  if (!apiKey && !process.env[provider.toUpperCase()+'_API_KEY']) {
    statusDiv.textContent = '请填写 API Key（或设置环境变量）';
    statusDiv.className = 'status error';
    return;
  }
  vscode.postMessage({ command: 'save', provider, apiKey, model, maxTokens, ocrProvider, ocrLanguage,
    googleVisionApiKey: googleKey, azureVisionEndpoint: azureEndpoint, azureVisionKey: azureKey,
    amazonAccessKey: awsAccessKey, amazonSecretKey: awsSecretKey, amazonRegion: awsRegion,
    allowCloudOCR: allowCloud, offlineMode: offlineMode });
  statusDiv.textContent = t.saving; statusDiv.className = 'status';
});

window.addEventListener('message', event => {
  const msg = event.data;
  if (msg.command === 'saveSuccess') { statusDiv.textContent = t.saveSuccess; statusDiv.className = 'status success'; }
  else if (msg.command === 'saveError') { statusDiv.textContent = t.saveError + msg.error; statusDiv.className = 'status error'; }
  else if (msg.command === 'keyCleared') { statusDiv.textContent = '✅ 密钥已清除'; statusDiv.className = 'status success'; setTimeout(() => location.reload(), 1000); }
});
</script></body></html>`;
}

// ================== 侧边栏提供者（含 refreshWebview） ==================
class SettingsViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  constructor(private readonly _context: vscode.ExtensionContext) {}

  public refreshWebview() {
    this._updateWebview();
  }

  resolveWebviewView(webviewView: vscode.WebviewView, _: any, __: any) {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };
    this._updateWebview();
    webviewView.webview.onDidReceiveMessage(async (message: any) => {
      switch (message.command) {
        case 'sendMessage': {
          chatHistory.push({ role: 'user', content: message.text });
          try {
            const config = await getSecureConfig(this._context);
            const answer = await askWithHistory(chatHistory, config);
            chatHistory.push({ role: 'assistant', content: answer });
            webviewView.webview.postMessage({ command: 'addAssistantMessage', content: answer });
          } catch (err: any) {
            webviewView.webview.postMessage({ command: 'showError', error: err.message || '未知错误' });
          }
          break;
        }
        case 'changeLanguage': {
          const newLang = message.language as Language;
          if (langMap[newLang]) {
            await setLanguage(newLang);
            this._updateWebview();
            webviewView.webview.postMessage({ command: 'languageChanged' });
          }
          break;
        }
        case 'insertCode': {
          const content = message.content;
          const lang = getLanguage();
          const t = langMap[lang];
          const actions = [t.newFile, t.replaceFile, t.insertAtCursor];
          vscode.window.showQuickPick(actions, { placeHolder: t.chooseAction }).then(selection => {
            if (!selection) return;
            const editor = vscode.window.activeTextEditor;
            if (selection === t.newFile) {
              const languageId = detectLanguage(content) || 'plaintext';
              vscode.workspace.openTextDocument({ content, language: languageId }).then(doc => vscode.window.showTextDocument(doc));
              vscode.window.showInformationMessage(t.codeInserted);
            } else if (selection === t.replaceFile) {
              if (!editor) { vscode.window.showErrorMessage(t.noActiveEditor); return; }
              const fullRange = new vscode.Range(editor.document.positionAt(0), editor.document.positionAt(editor.document.getText().length));
              editor.edit(editBuilder => editBuilder.replace(fullRange, content)).then(success => { if (success) vscode.window.showInformationMessage(t.fileReplaced); });
            } else if (selection === t.insertAtCursor) {
              if (!editor) { vscode.window.showErrorMessage(t.noActiveEditor); return; }
              const position = editor.selection.active;
              editor.edit(editBuilder => editBuilder.insert(position, content)).then(success => { if (success) vscode.window.showInformationMessage(t.codeInsertedAtCursor); });
            }
          });
          break;
        }
        case 'openSettings': {
          vscode.commands.executeCommand('deepseek.openSettings');
          break;
        }
        case 'clearHistory': {
          chatHistory = [];
          webviewView.webview.postMessage({ command: 'clear' });
          break;
        }
        case 'dropImage': {
          const buffer = Buffer.from(message.data);
          try {
            const config = vscode.workspace.getConfiguration('deepseek');
            const provider = config.get<string>('ocrProvider', 'tesseract');
            const language = config.get<string>('ocrLanguage', 'chi_sim+eng');
            const engine = createOcrEngine(provider, config, this._context);
            const text = await engine.recognize(buffer, language);
            webviewView.webview.postMessage({ command: 'recognitionDone' });
            chatHistory.push({ role: 'user', content: text });
            webviewView.webview.postMessage({ command: 'addUserMessage', content: text });
            const aiConfig = await getSecureConfig(this._context);
            const answer = await askWithHistory(chatHistory, aiConfig);
            chatHistory.push({ role: 'assistant', content: answer });
            webviewView.webview.postMessage({ command: 'addAssistantMessage', content: answer });
          } catch (err: any) {
            webviewView.webview.postMessage({ command: 'recognitionDone' });
            webviewView.webview.postMessage({ command: 'showError', error: 'OCR 识别失败: ' + err.message });
          }
          break;
        }
        default: console.warn('未知命令:', message.command);
      }
    });
  }
  private _updateWebview() {
    if (!this._view) return;
    const lang = getLanguage();
    this._view.webview.html = getChatHtml(lang, this._context);
  }
}

// ================== 扩展激活与命令 ==================
export async function activate(context: vscode.ExtensionContext) {
  // 迁移旧密钥
  await migrateOldKeys(context);

  const provider = new SettingsViewProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('deepseek-settings-view', provider)
  );

  const askCommand = vscode.commands.registerCommand('deepseek.ask', async () => {
    const question = await vscode.window.showInputBox({ prompt: '向 AI 提问', placeHolder: '例如：如何在 TypeScript 中实现单例模式？' });
    if (!question) return;
    await callWithProgress('AI 正在思考...', async () => {
      const config = await getSecureConfig(context);
      const answer = await askDeepSeek(question, config);
      showResult(answer);
    });
  });

  const explainCommand = vscode.commands.registerCommand('deepseek.explainCode', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { vscode.window.showErrorMessage('请先打开一个编辑器并选中代码'); return; }
    const selection = editor.selection;
    const code = editor.document.getText(selection);
    if (!code) { vscode.window.showErrorMessage('请选中要解释的代码'); return; }
    await callWithProgress('AI 正在解释代码...', async () => {
      const config = await getSecureConfig(context);
      const explanation = await explainCode(code, config);
      showResult(explanation);
    });
  });

  const settingsCommand = vscode.commands.registerCommand('deepseek.openSettings', () => {
    const panel = vscode.window.createWebviewPanel('deepseekSettings', 'AI 设置', vscode.ViewColumn.One, { enableScripts: true });
    const lang = getLanguage();
    getSettingsHtml(lang, context).then(html => {
      panel.webview.html = html;
    });
    panel.webview.onDidReceiveMessage(async (message: any) => {
      if (message.command === 'save') {
        try {
          const config = vscode.workspace.getConfiguration('deepseek');
          await config.update('apiProvider', message.provider, vscode.ConfigurationTarget.Global);
          await config.update('model', message.model, vscode.ConfigurationTarget.Global);
          await config.update('maxTokens', message.maxTokens, vscode.ConfigurationTarget.Global);
          await config.update('ocrProvider', message.ocrProvider, vscode.ConfigurationTarget.Global);
          await config.update('ocrLanguage', message.ocrLanguage, vscode.ConfigurationTarget.Global);
          await config.update('googleVisionApiKey', message.googleVisionApiKey, vscode.ConfigurationTarget.Global);
          await config.update('azureVisionEndpoint', message.azureVisionEndpoint, vscode.ConfigurationTarget.Global);
          await config.update('azureVisionKey', message.azureVisionKey, vscode.ConfigurationTarget.Global);
          await config.update('amazonAccessKey', message.amazonAccessKey, vscode.ConfigurationTarget.Global);
          await config.update('amazonSecretKey', message.amazonSecretKey, vscode.ConfigurationTarget.Global);
          await config.update('amazonRegion', message.amazonRegion, vscode.ConfigurationTarget.Global);
          await config.update('allowCloudOCR', message.allowCloudOCR, vscode.ConfigurationTarget.Global);
          await config.update('offlineMode', message.offlineMode, vscode.ConfigurationTarget.Global);

          if (message.apiKey) {
            const keyField = message.provider === 'deepseek' ? 'apiKey' : `${message.provider}ApiKey`;
            await config.update(keyField, undefined, vscode.ConfigurationTarget.Global);
            await context.secrets.store(`${SECRET_PREFIX}${message.provider}`, message.apiKey);
          }

          vscode.window.showInformationMessage('设置已保存');
          panel.dispose();
          provider.refreshWebview();
        } catch (err) {
          vscode.window.showErrorMessage(`保存失败: ${err}`);
        }
      } else if (message.command === 'clearKey') {
        try {
          await context.secrets.delete(`${SECRET_PREFIX}${message.provider}`);
          vscode.window.showInformationMessage('密钥已清除');
          const lang = getLanguage();
          getSettingsHtml(lang, context).then(html => {
            panel.webview.html = html;
          });
        } catch (err) {
          vscode.window.showErrorMessage(`清除密钥失败: ${err}`);
        }
      }
    });
  });

  context.subscriptions.push(askCommand, explainCommand, settingsCommand);

  const disposable1 = vscode.commands.registerCommand('my-ocr.recognizeFromClipboard', async () => {
    vscode.window.showInformationMessage('请点击侧边栏的 "🖼️ 图片" 按钮上传图片进行识别');
  });
  const disposable2 = vscode.commands.registerCommand('my-ocr.recognizeFromFile', async () => {
    vscode.window.showInformationMessage('请点击侧边栏的 "🖼️ 图片" 按钮上传图片进行识别');
  });
  context.subscriptions.push(disposable1, disposable2);
}

async function callWithProgress<T>(title: string, task: () => Promise<T>) {
  await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title, cancellable: false }, async () => {
    try { await task(); } catch (error: any) { vscode.window.showErrorMessage(`错误: ${error.message || error}`); }
  });
}
function showResult(content: string) {
  vscode.workspace.openTextDocument({ content, language: 'markdown' }).then(doc => vscode.window.showTextDocument(doc));
}
export function deactivate() {}