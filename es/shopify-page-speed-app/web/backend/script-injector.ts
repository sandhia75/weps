/**
 * Script Injector - Handles injecting optimization script into Shopify store's theme
 */

import fetch from 'node-fetch';

interface ShopifyTheme {
  id: string;
  name: string;
  role: string;
}

interface ShopifyAsset {
  key: string;
  public_url?: string;
}

export class ScriptInjector {
  private shopDomain: string;
  private accessToken: string;
  private apiVersion: string = '2024-01';

  constructor(shopDomain: string, accessToken: string) {
    this.shopDomain = shopDomain;
    this.accessToken = accessToken;
  }

  /**
   * Get the active theme ID for the shop
   */
  async getActiveThemeId(): Promise<string> {
    const response = await fetch(
      `https://${this.shopDomain}/admin/api/${this.apiVersion}/themes.json`,
      {
        method: 'GET',
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get themes: ${response.statusText}`);
    }

    const data = (await response.json()) as { themes: ShopifyTheme[] };
    const activeTheme = data.themes.find((theme: ShopifyTheme) => theme.role === 'main');

    if (!activeTheme) {
      throw new Error('No active theme found');
    }

    return activeTheme.id;
  }

  /**
   * Inject optimization script into theme's layout/theme.liquid
   */
  async injectOptimizationScript(optimizationScript: string): Promise<boolean> {
    try {
      const themeId = await this.getActiveThemeId();
      console.log(`Injecting script into theme ${themeId}`);

      // Get the theme.liquid file
      const getResponse = await fetch(
        `https://${this.shopDomain}/admin/api/${this.apiVersion}/themes/${themeId}/assets.json?asset[key]=layout/theme.liquid`,
        {
          method: 'GET',
          headers: {
            'X-Shopify-Access-Token': this.accessToken,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!getResponse.ok) {
        throw new Error(`Failed to get theme asset: ${getResponse.statusText}`);
      }

      const assetData = (await getResponse.json()) as { asset: { value: string } };
      const themeLiquid = assetData.asset.value;

      // Add optimization script before closing </head> tag
      const injectionCode = `
<!-- Page Speed Optimizer App -->
<script>
${optimizationScript}
</script>
<!-- End Page Speed Optimizer App -->
`;

      let updatedThemeLiquid = themeLiquid;
      if (themeLiquid.includes('</head>')) {
        updatedThemeLiquid = themeLiquid.replace('</head>', `${injectionCode}</head>`);
      } else {
        // Fallback: add before closing body tag
        updatedThemeLiquid = themeLiquid.replace('</body>', `${injectionCode}</body>`);
      }

      // Update the theme.liquid file
      const updateResponse = await fetch(
        `https://${this.shopDomain}/admin/api/${this.apiVersion}/themes/${themeId}/assets.json`,
        {
          method: 'PUT',
          headers: {
            'X-Shopify-Access-Token': this.accessToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            asset: {
              key: 'layout/theme.liquid',
              value: updatedThemeLiquid,
            },
          }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error(`Failed to update theme asset: ${updateResponse.statusText}`);
      }

      console.log('✅ Optimization script injected successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to inject optimization script:', error);
      return false;
    }
  }

  /**
   * Remove optimization script from theme
   */
  async removeOptimizationScript(): Promise<boolean> {
    try {
      const themeId = await this.getActiveThemeId();
      console.log(`Removing script from theme ${themeId}`);

      // Get the theme.liquid file
      const getResponse = await fetch(
        `https://${this.shopDomain}/admin/api/${this.apiVersion}/themes/${themeId}/assets.json?asset[key]=layout/theme.liquid`,
        {
          method: 'GET',
          headers: {
            'X-Shopify-Access-Token': this.accessToken,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!getResponse.ok) {
        throw new Error(`Failed to get theme asset: ${getResponse.statusText}`);
      }

      const assetData = (await getResponse.json()) as { asset: { value: string } };
      let themeLiquid = assetData.asset.value;

      // Remove the injected script
      themeLiquid = themeLiquid.replace(
        /<!-- Page Speed Optimizer App -->[\s\S]*?<!-- End Page Speed Optimizer App -->/g,
        ''
      );

      // Update the theme.liquid file
      const updateResponse = await fetch(
        `https://${this.shopDomain}/admin/api/${this.apiVersion}/themes/${themeId}/assets.json`,
        {
          method: 'PUT',
          headers: {
            'X-Shopify-Access-Token': this.accessToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            asset: {
              key: 'layout/theme.liquid',
              value: themeLiquid,
            },
          }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error(`Failed to update theme asset: ${updateResponse.statusText}`);
      }

      console.log('✅ Optimization script removed successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to remove optimization script:', error);
      return false;
    }
  }
}
