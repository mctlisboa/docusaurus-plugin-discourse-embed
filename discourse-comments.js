// discourse-comments.js
import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from '@docusaurus/router';
import { usePluginData } from '@docusaurus/useGlobalData';

function DiscourseComments() {
  const location = useLocation();
  const pluginData = usePluginData('docusaurus-plugin-discourse-comments');
  const [config, setConfig] = useState(null);
  
  useEffect(() => {
    if (window.DiscourseCommentsPluginConfig) {
      setConfig(window.DiscourseCommentsPluginConfig);
    } else if (pluginData) {
      setConfig(pluginData);
    }
  }, [pluginData]);

  const debugLog = (message, data) => {
    if (config && config.debugMode) {
      console.log(`[Discourse Comments Debug] ${message}`, data);
    }
  };

  const findSuitableContainer = () => {
    const selectors = [
      'article',
      '.theme-doc-markdown',
      '.markdown',
      'main',
      '#__docusaurus'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) return element;
    }

    return null;
  };

  const waitForElement = (callback, maxAttempts = 10, interval = 200) => {
    let attempts = 0;

    const checkElement = () => {
      const element = findSuitableContainer();
      if (element) {
        callback(element);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkElement, interval);
      } else {
        debugLog('Suitable container for Discourse comments not found after maximum attempts');
      }
    };

    checkElement();
  };

  const constructEmbedUrl = () => {
    const currentUrl = new URL(window.location.href);
    return currentUrl.origin + currentUrl.pathname;
  };

  const shouldEmbed = (path) => {
    return config.embedRoutes.some(route => {
      if (route.endsWith('*')) {
        return path.startsWith(route.slice(0, -1));
      }
      return path === route;
    });
  };

  const renderComments = () => {
    const currentPath = location.pathname;
    debugLog('Current path:', currentPath);

    const canEmbed = shouldEmbed(currentPath);
    debugLog('Should embed comments:', canEmbed);
    debugLog('Embed routes:', config.embedRoutes);

    if (canEmbed) {
      waitForElement((container) => {
        debugLog('Suitable container found:', container);

        const existingEmbed = document.getElementById('discourse-comments');
        if (existingEmbed) {
          existingEmbed.remove();
          debugLog('Removed existing embed');
        }

        const embedContainer = document.createElement('div');
        embedContainer.id = 'discourse-comments';
        embedContainer.style.marginTop = '20px';

        container.parentNode.insertBefore(embedContainer, container.nextSibling);
        debugLog('New embed container inserted');

        const discourseEmbedUrl = constructEmbedUrl();
        debugLog('Constructed embed URL:', discourseEmbedUrl);
        
        window.DiscourseEmbed = {
          discourseUrl: config.discourseUrl,
          discourseEmbedUrl: discourseEmbedUrl,
        };

        debugLog('DiscourseEmbed object:', window.DiscourseEmbed);

        const embedScript = document.createElement('script');
        embedScript.type = 'text/javascript';
        embedScript.async = true;
        embedScript.src = `${config.discourseUrl}javascripts/embed.js`;
        document.body.appendChild(embedScript);

        debugLog('Embed script appended to body:', embedScript.src);

        embedScript.onerror = (error) => {
          console.error('Error loading Discourse embed script:', error);
        };

        embedScript.onload = () => {
          debugLog('Discourse embed script loaded successfully');
        };
      });
    } else {
      debugLog('Comments not embedded on this page');
    }
  };

  useEffect(() => {
    if (config) {
      debugLog('useEffect triggered. Location:', location);
      debugLog('Plugin configuration:', config);
      renderComments();
    }

    return () => {
      const existingEmbed = document.getElementById('discourse-comments');
      if (existingEmbed) {
        existingEmbed.remove();
        debugLog('Cleanup: Removed existing embed');
      }
    };
  }, [location, config]);

  return null;
}

// Expose the component and render method globally for testing
if (typeof window !== 'undefined') {
  window.DiscourseCommentsComponent = DiscourseComments;
  window.renderDiscourseComments = () => {
    const config = window.DiscourseCommentsPluginConfig;
    if (!config) {
      console.error('Discourse Comments Plugin: Configuration not found. Please ensure the plugin is properly initialized.');
      return;
    }

    const debugLog = (message, data) => {
      if (config.debugMode) {
        console.log(`[Discourse Comments Debug] ${message}`, data);
      }
    };

    debugLog('Manual render triggered');

    const findSuitableContainer = () => {
      const selectors = [
        'article',
        '.theme-doc-markdown',
        '.markdown',
        'main',
        '#__docusaurus'
      ];

      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) return element;
      }

      return null;
    };

    const waitForElement = (callback, maxAttempts = 10, interval = 200) => {
      let attempts = 0;

      const checkElement = () => {
        const element = findSuitableContainer();
        if (element) {
          callback(element);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkElement, interval);
        } else {
          console.error('Suitable container for Discourse comments not found after maximum attempts');
        }
      };

      checkElement();
    };

    const constructEmbedUrl = () => {
      const currentUrl = new URL(window.location.href);
      return currentUrl.origin + currentUrl.pathname;
    };

    const shouldEmbed = (path) => {
      return config.embedRoutes.some(route => {
        if (route.endsWith('*')) {
          return path.startsWith(route.slice(0, -1));
        }
        return path === route;
      });
    };

    const currentPath = window.location.pathname;
    const canEmbed = shouldEmbed(currentPath);

    debugLog('Current path:', currentPath);
    debugLog('Should embed comments:', canEmbed);
    debugLog('Embed routes:', config.embedRoutes);

    if (canEmbed) {
      waitForElement((container) => {
        debugLog('Suitable container found:', container);

        const commentDiv = document.getElementById('discourse-comments');
        if (commentDiv) {
          commentDiv.innerHTML = '';
          debugLog('Cleared existing comment div');
        }

        const embedContainer = document.createElement('div');
        embedContainer.id = 'discourse-comments';
        embedContainer.style.marginTop = '20px';
        container.parentNode.insertBefore(embedContainer, container.nextSibling);
        debugLog('New embed container inserted');

        const discourseEmbedUrl = constructEmbedUrl();
        
        window.DiscourseEmbed = {
          discourseUrl: config.discourseUrl,
          discourseEmbedUrl: discourseEmbedUrl,
        };

        debugLog('Updated DiscourseEmbed object:', window.DiscourseEmbed);

        const embedScript = document.createElement('script');
        embedScript.type = 'text/javascript';
        embedScript.async = true;
        embedScript.src = `${config.discourseUrl}javascripts/embed.js`;
        document.body.appendChild(embedScript);

        debugLog('Embed script appended to body:', embedScript.src);

        embedScript.onerror = (error) => {
          console.error('Error loading Discourse embed script:', error);
        };

        embedScript.onload = () => {
          debugLog('Discourse embed script loaded successfully');
        };
      });
    } else {
      debugLog('Comments not embedded on this page');
    }
  };
}

export default {
  onRouteUpdate({ location }) {
    // Delay the execution to ensure the plugin data is available
    setTimeout(() => {
      if (window.DiscourseCommentsPluginConfig) {
        window.renderDiscourseComments();
      } else {
        console.error('Discourse Comments Plugin: Configuration not available on route update. Retrying...');
        // Retry after a short delay
        setTimeout(() => {
          if (window.DiscourseCommentsPluginConfig) {
            window.renderDiscourseComments();
          } else {
            console.error('Discourse Comments Plugin: Configuration still not available. Please check your plugin configuration.');
          }
        }, 500);
      }
    }, 0);
  },
};