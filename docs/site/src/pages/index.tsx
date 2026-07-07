import React from 'react';
import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';

// -- SVG icon helper ----------------------------------------------------------
const Ico = ({ d, size = 20 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
    strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);

// -- Feature data -------------------------------------------------------------
const features: { icon: string; title: string; desc: string; to: string }[] = [
  {
    icon: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94Z',
    title: 'Design & Advise',
    desc: 'Get pattern recommendations, review agent designs, and troubleshoot issues — the Advisor never writes YAML.',
    to: '/docs/agents/advisor',
  },
  {
    icon: 'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z',
    title: 'Author YAML',
    desc: 'Create topics, actions, knowledge sources, and triggers with schema-validated templates.',
    to: '/docs/agents/author',
  },
  {
    icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z',
    title: 'Manage & Deploy',
    desc: 'Clone, push, pull, and publish agent content between local files and the cloud — full ALM lifecycle.',
    to: '/docs/agents/manage',
  },
  {
    icon: 'M9 3h6M8 3v6l-4 11h16L16 9V3',
    title: 'Test Agents',
    desc: 'Run in-product evals against drafts, send point-tests, run Kit batch suites, and analyze evaluations.',
    to: '/docs/agents/test',
  },
  {
    icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z',
    title: 'Pattern Library',
    desc: 'Proven, recommended, and experimental design recipes with working YAML examples for common scenarios.',
    to: '/docs/patterns/overview',
  },
  {
    icon: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
    title: 'Schema Validation',
    desc: 'Validate against the official authoring schema. Look up kinds, definitions, and node types.',
    to: '/docs/reference/schema',
  },
];

// -- Workflow steps ------------------------------------------------------------
const steps: { num: string; label: string; cmd: string; desc: string }[] = [
  { num: '01', label: 'Advise',  cmd: '/copilot-studio:copilot-studio-advisor', desc: 'Get design guidance and pattern recommendations before you build.' },
  { num: '02', label: 'Manage',  cmd: '/copilot-studio:copilot-studio-manage',  desc: 'Clone an agent locally, then pull, push, and publish your changes.' },
  { num: '03', label: 'Author',  cmd: '/copilot-studio:copilot-studio-author',  desc: 'Create topics, actions, knowledge, and adaptive cards with validated YAML.' },
  { num: '04', label: 'Test',    cmd: '/copilot-studio:copilot-studio-test',    desc: 'Run in-product evals, point-tests, batch suites, and evaluation analysis.' },
];

// -- Stats --------------------------------------------------------------------
const stats: { value: string; label: string }[] = [
  { value: '28',  label: 'Purpose-built skills' },
  { value: '4',   label: 'Specialized agents' },
  { value: '15',  label: 'Proven design patterns' },
  { value: '18',  label: 'YAML templates' },
];

// =============================================================================
export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>

      {/* ================================================================== */}
      {/* HERO                                                               */}
      {/* ================================================================== */}
      <header className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroGrid} />
        <div className={clsx('container', styles.heroInner)}>
          <p className={styles.heroBadge}>Open-source plugin for Copilot Studio</p>
          <h1 className={styles.heroTitle}>
            <span className={styles.gradient}>Skills</span> for{' '}
            <span className={styles.gradient2}>Copilot Studio</span>
          </h1>
          <p className={styles.heroSub}>
            A plugin for Claude Code and GitHub Copilot CLI that enables designing, managing,
            authoring, and testing Microsoft Copilot Studio agents through
            YAML files — directly from your terminal.
          </p>
          <div className={styles.heroCtas}>
            <Link className={styles.btnPrimary} to="/docs/getting-started">
              Get Started
            </Link>
            <Link className={styles.btnGhost}
              href="https://github.com/microsoft/skills-for-copilot-studio">
              View on GitHub
            </Link>
          </div>

          {/* Terminal mockup */}
          <div className={styles.terminal}>
            <div className={styles.termBar}>
              <span className={styles.termDot} />
              <span className={styles.termDot} />
              <span className={styles.termDot} />
              <span className={styles.termTitle}>Terminal</span>
            </div>
            <pre className={styles.termBody}>{
`$ /copilot-studio:copilot-studio-author Create a topic that handles
  IT service requests with an adaptive card response

  Searching schema definitions...
  Generating topic YAML...
  Validating against authoring schema...
  Writing topics/ITServiceRequest.topic.yaml

  Topic created and validated successfully.`
            }</pre>
          </div>
        </div>
      </header>

      {/* ================================================================== */}
      {/* STATS STRIP                                                        */}
      {/* ================================================================== */}
      <section className={styles.statsStrip}>
        <div className={clsx('container', styles.statsInner)}>
          {stats.map((s, i) => (
            <div key={i} className={styles.stat}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================== */}
      {/* FEATURES                                                           */}
      {/* ================================================================== */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Capabilities</p>
            <h2 className={styles.sectionTitle}>
              Everything you need for the<br />
              <span className={styles.gradient}>full agent lifecycle</span>
            </h2>
            <p className={styles.sectionSub}>
              Four specialized agents backed by 28 purpose-built skills,
              15 proven design patterns, and 18 YAML templates.
            </p>
          </div>
          <div className={styles.featureGrid}>
            {features.map((f, i) => (
              <Link key={i} className={styles.featureCard} to={f.to}>
                <span className={styles.featureIcon}>
                  <Ico d={f.icon} />
                </span>
                <strong className={styles.featureTitle}>{f.title}</strong>
                <p className={styles.featureDesc}>{f.desc}</p>
                <span className={styles.featureArrow}>&#8594;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* QUICK START                                                        */}
      {/* ================================================================== */}
      <section className={styles.quickstart}>
        <div className="container">
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Quick Start</p>
            <h2 className={styles.sectionTitle}>
              Up and running in{' '}
              <span className={styles.gradient}>minutes</span>
            </h2>
          </div>
          <div className={styles.qsGrid}>
            <div className={styles.qsStep}>
              <div className={styles.qsNum}>1</div>
              <div>
                <strong>Install the plugin</strong>
                <code className={styles.qsCode}>/plugin install copilot-studio@skills-for-copilot-studio</code>
              </div>
            </div>
            <div className={styles.qsStep}>
              <div className={styles.qsNum}>2</div>
              <div>
                <strong>Clone your agent</strong>
                <code className={styles.qsCode}>/copilot-studio:copilot-studio-manage clone</code>
              </div>
            </div>
            <div className={styles.qsStep}>
              <div className={styles.qsNum}>3</div>
              <div>
                <strong>Author topics</strong>
                <code className={styles.qsCode}>/copilot-studio:copilot-studio-author Create a topic that handles password resets</code>
              </div>
            </div>
            <div className={styles.qsStep}>
              <div className={styles.qsNum}>4</div>
              <div>
                <strong>Push, publish, and test</strong>
                <code className={styles.qsCode}>/copilot-studio:copilot-studio-manage push, then /copilot-studio:copilot-studio-test Run evals against my agent</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* CTA                                                                */}
      {/* ================================================================== */}
      <section className={styles.cta}>
        <div className={styles.ctaGlow} />
        <div className={clsx('container', styles.ctaInner)}>
          <h2 className={styles.ctaTitle}>
            Start building agents{' '}
            <span className={styles.gradient}>today</span>
          </h2>
          <p className={styles.ctaSub}>
            Install the plugin, clone your Copilot Studio agent, and start
            authoring YAML topics in minutes. No context-switching required.
          </p>
          <div className={styles.heroCtas}>
            <Link className={styles.btnPrimary} to="/docs/getting-started">
              Read the Docs
            </Link>
            <Link className={styles.btnGhost} to="/docs/setup-guide">
              Setup Guide
            </Link>
          </div>
        </div>
      </section>

    </Layout>
  );
}
