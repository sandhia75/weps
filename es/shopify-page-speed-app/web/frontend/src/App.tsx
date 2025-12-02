import React, { useState, useEffect } from 'react';
import {
  AppProvider,
  Page,
  Card,
  Layout,
  Text,
  Button,
  Checkbox,
  Select,
  TextField,
  SettingToggle,
  Tabs,
  SkeletonPage,
  SkeletonBodyText,
  PageActions,
  Stack,
  Badge,
  ResourceList,
  ResourceItem,
} from '@shopify/polaris';
import axios from 'axios';

interface PageSpeedSettings {
  enableImageOptimization: boolean;
  enableLazyLoading: boolean;
  enableCaching: boolean;
  imageQuality: number;
  cacheExpiration: number;
  minifyCSS: boolean;
  minifyJS: boolean;
  deferNonCriticalCSS: boolean;
}

interface PageAnalysis {
  url: string;
  score: {
    performance: number;
    accessibility: number;
    seo: number;
    bestPractices: number;
  };
  metrics: {
    firstContentfulPaint: string;
    largestContentfulPaint: string;
    cumulativeLayoutShift: string;
    timeToFirstByte: string;
  };
  suggestions: string[];
}

function App() {
  const [settings, setSettings] = useState<PageSpeedSettings | null>(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [analyzeUrl, setAnalyzeUrl] = useState('');
  const [analysis, setAnalysis] = useState<PageAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchMetrics();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/speed-settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await axios.get('/api/metrics');
      setMetrics(response.data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  const handleSettingChange = (key: keyof PageSpeedSettings, value: any) => {
    setSettings((prev) => prev ? { ...prev, [key]: value } : null);
  };

  const handleSaveSettings = async () => {
    try {
      await axios.post('/api/speed-settings', { settings });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    }
  };

  const handleAnalyzePage = async () => {
    if (!analyzeUrl) {
      alert('Please enter a URL');
      return;
    }

    setAnalyzing(true);
    try {
      const response = await axios.post('/api/analyze-page', { url: analyzeUrl });
      setAnalysis(response.data);
    } catch (error) {
      console.error('Failed to analyze page:', error);
      alert('Failed to analyze page');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <AppProvider>
        <SkeletonPage>
          <SkeletonBodyText />
        </SkeletonPage>
      </AppProvider>
    );
  }

  const tabs = [
    {
      id: 'dashboard',
      content: 'Dashboard',
      panelID: 'dashboard-content',
    },
    {
      id: 'settings',
      content: 'Settings',
      panelID: 'settings-content',
    },
    {
      id: 'analyze',
      content: 'Analyze Page',
      panelID: 'analyze-content',
    },
  ];

  return (
    <AppProvider>
      <Page
        title="Page Speed Optimizer"
        subtitle="Increase your store's page speed and improve Core Web Vitals"
      >
        <Tabs tabs={tabs} selected={activeTab} onSelect={setActiveTab}>
          {/* Dashboard Tab */}
          {activeTab === 0 && (
            <Layout>
              <Layout.Section>
                <Card>
                  <Text variant="headingMd" as="h3">
                    Performance Overview
                  </Text>
                  {metrics && (
                    <Stack gap="4">
                      <Stack distribution="fill">
                        <div>
                          <Text variant="bodyMd" as="p">
                            Average Page Load Time
                          </Text>
                          <Text variant="heading2xl" as="h2">
                            {metrics.averagePageLoadTime}
                          </Text>
                        </div>
                        <div>
                          <Text variant="bodyMd" as="p">
                            Average Page Size
                          </Text>
                          <Text variant="heading2xl" as="h2">
                            {metrics.averagePageSize}
                          </Text>
                        </div>
                        <div>
                          <Text variant="bodyMd" as="p">
                            Performance Score
                          </Text>
                          <Text variant="heading2xl" as="h2">
                            <Badge progress="complete">{metrics.performance}</Badge>
                          </Text>
                        </div>
                      </Stack>
                    </Stack>
                  )}
                </Card>
              </Layout.Section>

              <Layout.Section>
                <Card>
                  <Text variant="headingMd" as="h3">
                    Active Optimizations
                  </Text>
                  {settings && (
                    <Stack gap="4">
                      <ResourceList
                        resourceName={{ singular: 'optimization', plural: 'optimizations' }}
                        items={[
                          {
                            id: '1',
                            name: 'Image Optimization',
                            status: settings.enableImageOptimization ? 'Active' : 'Inactive',
                          },
                          {
                            id: '2',
                            name: 'Lazy Loading',
                            status: settings.enableLazyLoading ? 'Active' : 'Inactive',
                          },
                          {
                            id: '3',
                            name: 'Browser Caching',
                            status: settings.enableCaching ? 'Active' : 'Inactive',
                          },
                          {
                            id: '4',
                            name: 'CSS Minification',
                            status: settings.minifyCSS ? 'Active' : 'Inactive',
                          },
                          {
                            id: '5',
                            name: 'JS Minification',
                            status: settings.minifyJS ? 'Active' : 'Inactive',
                          },
                        ]}
                        renderItem={(item) => (
                          <ResourceItem id={item.id}>
                            <Stack distribution="fill">
                              <Text variant="bodyMd" as="p">
                                {item.name}
                              </Text>
                              <Badge status={item.status === 'Active' ? 'success' : 'info'}>
                                {item.status}
                              </Badge>
                            </Stack>
                          </ResourceItem>
                        )}
                      />
                    </Stack>
                  )}
                </Card>
              </Layout.Section>
            </Layout>
          )}

          {/* Settings Tab */}
          {activeTab === 1 && (
            <Layout>
              <Layout.Section>
                <Card>
                  <Text variant="headingMd" as="h3">
                    Optimization Settings
                  </Text>
                  {settings && (
                    <Stack gap="5">
                      <SettingToggle
                        action={{
                          content: settings.enableImageOptimization ? 'On' : 'Off',
                          onAction: () =>
                            handleSettingChange('enableImageOptimization', !settings.enableImageOptimization),
                        }}
                        enabled={settings.enableImageOptimization}
                      >
                        <Text variant="bodyMd" as="p">
                          <strong>Image Optimization</strong>
                        </Text>
                        <Text variant="bodySm" as="p" tone="subdued">
                          Automatically optimize and compress images. Converts images to modern formats
                          like WebP.
                        </Text>
                      </SettingToggle>

                      {settings.enableImageOptimization && (
                        <TextField
                          label="Image Quality (%)"
                          type="number"
                          value={settings.imageQuality.toString()}
                          onChange={(value) =>
                            handleSettingChange('imageQuality', parseInt(value))
                          }
                          min="1"
                          max="100"
                        />
                      )}

                      <SettingToggle
                        action={{
                          content: settings.enableLazyLoading ? 'On' : 'Off',
                          onAction: () =>
                            handleSettingChange('enableLazyLoading', !settings.enableLazyLoading),
                        }}
                        enabled={settings.enableLazyLoading}
                      >
                        <Text variant="bodyMd" as="p">
                          <strong>Lazy Loading</strong>
                        </Text>
                        <Text variant="bodySm" as="p" tone="subdued">
                          Load images only when they're about to be viewed. Reduces initial page load time.
                        </Text>
                      </SettingToggle>

                      <SettingToggle
                        action={{
                          content: settings.enableCaching ? 'On' : 'Off',
                          onAction: () =>
                            handleSettingChange('enableCaching', !settings.enableCaching),
                        }}
                        enabled={settings.enableCaching}
                      >
                        <Text variant="bodyMd" as="p">
                          <strong>Browser Caching</strong>
                        </Text>
                        <Text variant="bodySm" as="p" tone="subdued">
                          Enable browser caching to store assets locally and reduce repeat visits load
                          time.
                        </Text>
                      </SettingToggle>

                      {settings.enableCaching && (
                        <TextField
                          label="Cache Expiration (seconds)"
                          type="number"
                          value={settings.cacheExpiration.toString()}
                          onChange={(value) =>
                            handleSettingChange('cacheExpiration', parseInt(value))
                          }
                        />
                      )}

                      <SettingToggle
                        action={{
                          content: settings.minifyCSS ? 'On' : 'Off',
                          onAction: () =>
                            handleSettingChange('minifyCSS', !settings.minifyCSS),
                        }}
                        enabled={settings.minifyCSS}
                      >
                        <Text variant="bodyMd" as="p">
                          <strong>Minify CSS</strong>
                        </Text>
                        <Text variant="bodySm" as="p" tone="subdued">
                          Remove unnecessary characters from CSS files to reduce file size.
                        </Text>
                      </SettingToggle>

                      <SettingToggle
                        action={{
                          content: settings.minifyJS ? 'On' : 'Off',
                          onAction: () =>
                            handleSettingChange('minifyJS', !settings.minifyJS),
                        }}
                        enabled={settings.minifyJS}
                      >
                        <Text variant="bodyMd" as="p">
                          <strong>Minify JavaScript</strong>
                        </Text>
                        <Text variant="bodySm" as="p" tone="subdued">
                          Remove unnecessary characters from JavaScript files to reduce file size.
                        </Text>
                      </SettingToggle>

                      <SettingToggle
                        action={{
                          content: settings.deferNonCriticalCSS ? 'On' : 'Off',
                          onAction: () =>
                            handleSettingChange('deferNonCriticalCSS', !settings.deferNonCriticalCSS),
                        }}
                        enabled={settings.deferNonCriticalCSS}
                      >
                        <Text variant="bodyMd" as="p">
                          <strong>Defer Non-Critical CSS</strong>
                        </Text>
                        <Text variant="bodySm" as="p" tone="subdued">
                          Load non-critical CSS asynchronously to speed up initial page render.
                        </Text>
                      </SettingToggle>
                    </Stack>
                  )}
                  <PageActions
                    primaryAction={{
                      content: 'Save Settings',
                      onAction: handleSaveSettings,
                    }}
                  />
                </Card>
              </Layout.Section>
            </Layout>
          )}

          {/* Analyze Page Tab */}
          {activeTab === 2 && (
            <Layout>
              <Layout.Section>
                <Card>
                  <Text variant="headingMd" as="h3">
                    Analyze Your Page
                  </Text>
                  <Stack gap="4">
                    <TextField
                      label="Page URL"
                      value={analyzeUrl}
                      onChange={setAnalyzeUrl}
                      placeholder="https://your-store.myshopify.com"
                    />
                    <Button primary onClick={handleAnalyzePage} loading={analyzing}>
                      Analyze Page Speed
                    </Button>
                  </Stack>

                  {analysis && (
                    <Stack gap="4">
                      <Text variant="headingMd" as="h3">
                        Analysis Results for {analysis.url}
                      </Text>

                      <Stack distribution="fill">
                        <div>
                          <Text variant="bodyMd" as="p" tone="subdued">
                            Performance
                          </Text>
                          <Badge progress={analysis.score.performance > 80 ? 'complete' : 'partialComplete'}>
                            {analysis.score.performance}
                          </Badge>
                        </div>
                        <div>
                          <Text variant="bodyMd" as="p" tone="subdued">
                            Accessibility
                          </Text>
                          <Badge progress={analysis.score.accessibility > 80 ? 'complete' : 'partialComplete'}>
                            {analysis.score.accessibility}
                          </Badge>
                        </div>
                        <div>
                          <Text variant="bodyMd" as="p" tone="subdued">
                            SEO
                          </Text>
                          <Badge progress="complete">{analysis.score.seo}</Badge>
                        </div>
                        <div>
                          <Text variant="bodyMd" as="p" tone="subdued">
                            Best Practices
                          </Text>
                          <Badge progress={analysis.score.bestPractices > 80 ? 'complete' : 'partialComplete'}>
                            {analysis.score.bestPractices}
                          </Badge>
                        </div>
                      </Stack>

                      <Card>
                        <Text variant="headingMd" as="h3">
                          Web Vitals
                        </Text>
                        <Stack gap="3">
                          <Stack distribution="fill">
                            <div>
                              <Text variant="bodySm" as="p" tone="subdued">
                                First Contentful Paint
                              </Text>
                              <Text variant="headingSm" as="h4">
                                {analysis.metrics.firstContentfulPaint}
                              </Text>
                            </div>
                            <div>
                              <Text variant="bodySm" as="p" tone="subdued">
                                Largest Contentful Paint
                              </Text>
                              <Text variant="headingSm" as="h4">
                                {analysis.metrics.largestContentfulPaint}
                              </Text>
                            </div>
                            <div>
                              <Text variant="bodySm" as="p" tone="subdued">
                                Cumulative Layout Shift
                              </Text>
                              <Text variant="headingSm" as="h4">
                                {analysis.metrics.cumulativeLayoutShift}
                              </Text>
                            </div>
                            <div>
                              <Text variant="bodySm" as="p" tone="subdued">
                                Time to First Byte
                              </Text>
                              <Text variant="headingSm" as="h4">
                                {analysis.metrics.timeToFirstByte}
                              </Text>
                            </div>
                          </Stack>
                        </Stack>
                      </Card>

                      <Card>
                        <Text variant="headingMd" as="h3">
                          Optimization Suggestions
                        </Text>
                        <ResourceList
                          resourceName={{ singular: 'suggestion', plural: 'suggestions' }}
                          items={analysis.suggestions.map((suggestion, index) => ({
                            id: index.toString(),
                            title: suggestion,
                          }))}
                          renderItem={(item) => (
                            <ResourceItem id={item.id}>
                              <Text variant="bodyMd" as="p">
                                {item.title}
                              </Text>
                            </ResourceItem>
                          )}
                        />
                      </Card>
                    </Stack>
                  )}
                </Card>
              </Layout.Section>
            </Layout>
          )}
        </Tabs>
      </Page>
    </AppProvider>
  );
}

export default App;
