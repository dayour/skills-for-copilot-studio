import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Skills for Copilot Studio',
  tagline: 'Design, manage, author, and test Copilot Studio agents from your terminal',
  favicon: 'img/favicon.ico',

  url: 'https://dayour.github.io',
  baseUrl: '/skills-for-copilot-studio/',

  organizationName: 'dayour',
  projectName: 'skills-for-copilot-studio',

  onBrokenLinks: 'warn',

  markdown: {
    format: 'md',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: '../src',
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/dayour/skills-for-copilot-studio/tree/main/docs/src/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Skills for Copilot Studio',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/docs/agents/advisor',
          label: 'Agents',
          position: 'left',
        },
        {
          to: '/docs/patterns/overview',
          label: 'Patterns',
          position: 'left',
        },
        {
          to: '/docs/skills/overview',
          label: 'Skills',
          position: 'left',
        },
        {
          href: 'https://github.com/dayour/skills-for-copilot-studio',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Get Started',
          items: [
            { label: 'Installation', to: '/docs/getting-started' },
            { label: 'Setup Guide', to: '/docs/setup-guide' },
            { label: 'Troubleshooting', to: '/docs/troubleshooting' },
          ],
        },
        {
          title: 'Agents',
          items: [
            { label: 'Advisor', to: '/docs/agents/advisor' },
            { label: 'Author', to: '/docs/agents/author' },
            { label: 'Manage', to: '/docs/agents/manage' },
            { label: 'Test', to: '/docs/agents/test' },
          ],
        },
        {
          title: 'Skills & Patterns',
          items: [
            { label: 'All Skills', to: '/docs/skills/overview' },
            { label: 'Authoring', to: '/docs/skills/authoring' },
            { label: 'Deployment & ALM', to: '/docs/skills/deployment' },
            { label: 'Testing', to: '/docs/skills/testing' },
            { label: 'Pattern Library', to: '/docs/patterns/overview' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'This Fork', href: 'https://github.com/dayour/skills-for-copilot-studio' },
            { label: 'Upstream Project', href: 'https://github.com/microsoft/skills-for-copilot-studio' },
            { label: 'Contributing', href: 'https://github.com/microsoft/skills-for-copilot-studio/blob/main/CONTRIBUTING.md' },
            { label: 'Copilot Studio', href: 'https://aka.ms/CopilotStudio' },
          ],
        },
      ],
      copyright: `Copyright &copy; ${new Date().getFullYear()} Microsoft Corporation. MIT License. This site is maintained by <a href="https://github.com/dayour">@dayour</a> as a fork of the upstream project.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'powershell', 'json', 'yaml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
