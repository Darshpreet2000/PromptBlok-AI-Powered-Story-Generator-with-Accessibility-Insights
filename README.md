# PromptBlok - AI-Powered Story Generator with Accessibility Insights

**PromptBlok** is a powerful Storyblok Space Plugin that leverages Google's Generative AI (Gemini) to revolutionize content creation workflows. It enables users to generate Storyblok components and complete stories through natural language prompts, while providing AI-powered accessibility analysis to ensure inclusive content.

## 🚀 Demo

### 🎥 Demo Video
<p align="center">
  <a href="https://www.youtube.com/watch?v=yiGru0iyr88" target="_blank">
    <img src="https://img.youtube.com/vi/yiGru0iyr88/maxresdefault.jpg" alt="PromptBlok Demo Video" width="600" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
  </a>
  <br>
  <em>Click the image to watch the full demo video</em>
</p>

### 🌐 Live Demo
**Try PromptBlok live**: [https://prompt-blok-ai-powered-story-genera.vercel.app/](https://prompt-blok-ai-powered-story-genera.vercel.app/)

## ✨ Features

### 🤖 Component Generator
- **AI-Powered Schema Creation**: Generate complete Storyblok component schemas using natural language prompts
- **Interactive UI Preview**: See how your components will look in the Storyblok editor before publishing
- **Direct Publishing**: Publish generated components directly to your Storyblok space
- **Comprehensive Field Types**: Support for all Storyblok field types including text, images, rich text, tables, and more

### 📝 Story Content Generator
- **Complete Story Creation**: Generate entire Storyblok stories by combining your available components
- **Component Integration**: Automatically utilizes existing components in your space
- **Context-Aware Generation**: AI understands your component library and generates appropriate content structures

### ♿ Accessibility Report
- **AI-Powered Analysis**: Comprehensive accessibility evaluation of your Storyblok content
- **WCAG Compliance**: Identifies potential accessibility issues and provides actionable recommendations
- **Content Enhancement**: Suggests improvements for better inclusivity

### ⚙️ Settings & Configuration
- **Personal Access Tokens**: Securely manage your Storyblok and Google Gemini API credentials
- **Space Configuration**: Easily configure space-specific settings
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🏗️ Architecture

PromptBlok is built as a Storyblok Space Plugin using:
- **Frontend**: Next.js 13 with Pages Router, Material-UI, and TypeScript
- **AI Integration**: Google Generative AI (Gemini 2.0 Flash) for content generation
- **Backend**: Serverless API routes for secure API interactions
- **Content Management**: Direct integration with Storyblok Management API
- **Authentication**: Storyblok App Bridge for secure space plugin authentication

## 📋 Prerequisites

- Node.js 18.x or higher
- pnpm package manager
- Google Gemini API key
- Storyblok Personal Access Token
- ngrok or similar tunneling service for local development

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/Darshpreet2000/PromptBlok-AI-Powered-Story-Generator-with-Accessibility-Insights.git
cd PromptBlok-AI-Powered-Story-Generator-with-Accessibility-Insights

# Install dependencies
pnpm install
```


### 2. API Token Setup

Update the `src/constants/access_constants.ts` file with your API keys:

```typescript
export const STORYBLOK_ACCESS_TOKEN = "your_storyblok_personal_access_token";
export const GEMINI_API_KEY = "your_google_gemini_api_key";
```

**Additional setup for Accessibility Report:**
Update the `STORYBLOK_TOKEN` constant in `src/components/AccessibilityReportTab.tsx`:

```typescript
const STORYBLOK_TOKEN = 'your_storyblok_public_access_token'; // Line 51
```

**How to get these tokens:**
- **Storyblok Personal Access Token**: Go to your Storyblok account settings → Personal Access Tokens → Generate new token (used for API management operations)
- **Storyblok Public Access Token**: In your Storyblok space settings → Access Tokens → Generate public token (used for content fetching in accessibility reports)
- **Google Gemini API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey) → Create API key

### 3. Development Setup

```bash
# Start development server
pnpm dev
```

### 4. Local Tunneling

For Storyblok integration, expose your local server:

```bash
# Using ngrok
ngrok http 3000
```

Note the generated URL (e.g., `https://abc123.ngrok.io`) for the next steps.

## 🔧 Storyblok Extension Setup

### Partner Portal Setup

1. Navigate to [Storyblok Partner Portal](https://app.storyblok.com/#/partner/apps)
2. Click **New Extension**
3. Fill in extension details:
   - **Name**: PromptBlok AI Generator
   - **Slug**: promptblok-ai-generator
4. Select **Sidebar** as extension type
5. Click **Save**

### Organization Setup (Alternative)

1. Go to [Organization Extensions](https://app.storyblok.com/#/me/org/apps)
2. Click **New Extension**
3. Configure as above

### Extension Configuration

In your extension settings:

- **Index to your page**: `{BASE_URL}` (your ngrok URL)
- **Redirection endpoint**: `{BASE_URL}/api/connect/callback`
- **Enable App Bridge**: ✅ Required

### Space Installation

1. Open extension's **General** tab
2. Click **Install Link** in new tab
3. Select target space
4. Navigate to space: **Apps > PromptBlok AI Generator**

## 🎯 Usage Guide

### Component Generation

1. **Access Component Generator**: Click the "Component Generator" tab
2. **Enter Prompt**: Describe your desired component (e.g., "Create a hero banner with title, subtitle, background image, and CTA button")
3. **Generate**: Click "Generate Component" to create the schema
4. **Preview**: Review the UI preview and raw JSON
5. **Publish**: Click "Publish Component" to add it to your Storyblok space

### Story Content Generation

1. **Access Story Generator**: Click the "Story Content Generator" tab
2. **Enter Prompt**: Describe the story content you want to create
3. **Generate**: The AI will create a complete story using your available components
4. **Review & Publish**: Examine the generated content and publish to Storyblok

### Accessibility Analysis

1. **Access Reports**: Click the "Accessibility Report" tab
2. **Generate Report**: Click to analyze your content
3. **Review Insights**: Get AI-powered accessibility recommendations

### Settings Configuration

1. **Access Settings**: Click the "Settings" tab
2. **Space Settings**: Configure space-specific preferences (Note: API tokens are configured in the constants file)

## 🛠️ Tech Stack

- **Framework**: Next.js 13 (Pages Router)
- **Language**: TypeScript
- **UI Library**: Material-UI (@mui/material)
- **AI**: Google Generative AI (Gemini)
- **CMS**: Storyblok Management API
- **Authentication**: Storyblok App Bridge
- **Styling**: Material-UI Theme System
- **Markdown**: React Markdown + Remark GFM
- **Build Tool**: pnpm

## 📁 Project Structure

```
PromptBlok/
├── src/
│   ├── components/          # React components
│   │   ├── ComponentGeneratorTab.tsx
│   │   ├── StoryContentGeneratorTab.tsx
│   │   ├── AccessibilityReportTab.tsx
│   │   ├── SettingsTab.tsx
│   │   └── SpacePluginUI.tsx
│   ├── pages/               # Next.js pages and API routes
│   │   ├── api/             # Serverless API functions
│   │   │   ├── generate-component.ts
│   │   │   ├── generate-story-content.ts
│   │   │   ├── generate-accessibility-report.ts
│   │   │   └── create-storyblok-component.ts
│   │   ├── plugin.tsx       # Main plugin page
│   │   └── index.tsx        # Settings/configuration page
│   ├── prompts/             # AI prompt templates
│   │   ├── component_generate.ts
│   │   ├── story_generate.ts
│   │   └── accessibility_report_generate.ts
│   ├── constants/           # API keys and configuration
│   ├── utils/               # Helper functions
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
├── docs/                    # Documentation images
├── package.json
├── tsconfig.json
└── next.config.js
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `CLIENT_ID` | Storyblok OAuth Client ID | Yes |
| `CLIENT_SECRET` | Storyblok OAuth Client Secret | Yes |
| `BASE_URL` | Local development URL (ngrok) | Yes |

**Note**: API tokens (GEMINI_API_KEY and STORYBLOK_ACCESS_TOKEN) are configured directly in `src/constants/access_constants.ts`.

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**: Link your GitHub repo to Vercel
2. **Environment Variables**: Set all required environment variables in Vercel dashboard
3. **Build Settings**: Ensure `pnpm` is selected as package manager
4. **Domain**: Update extension settings with production URL

### Manual Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Storyblok**: For the amazing headless CMS platform
- **Google AI**: For the powerful Generative AI capabilities
- **Material-UI**: For the comprehensive React component library
- **Storyblok Community**: For inspiration and best practices

## 📞 Support

For questions, issues, or contributions:

- **GitHub Issues**: [Report bugs or request features](https://github.com/Darshpreet2000/PromptBlok-AI-Powered-Story-Generator-with-Accessibility-Insights/issues)
- **Storyblok Community**: Join discussions on the [Storyblok Forum](https://forum.storyblok.com/)

---

**Built with ❤️ for the Storyblok community**
