import React from 'react';
import { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import { usePluginData } from '@docusaurus/useGlobalData';

function DiscourseComments() {
  const location = useLocation();
  const { discourseUrl, discourseUserName, debugMode, embedRoutes } = usePluginData('docusaurus-plugin-discourse-comments');

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
      } else if (debugMode) {
        console.error('Suitable container for Discourse comments not found after maximum attempts');
      }
    };

    checkElement();
  };

  const constructEmbedUrl = (path) => {
    const siteUrl = window.location.origin;
    const fullPath = `${siteUrl}${path}`;
    return encodeURIComponent(fullPath);
  };

  const debugLog = (message, data) => {
    if (debugMode) {
      console.log(`[Discourse Comments Debug] ${message}`, data);
    }
  };

  const renderComments = () => {
    const currentPath = location.pathname;
    debugLog('Current path:', currentPath);

    const shouldEmbed = embedRoutes.some(route => {
      if (route.endsWith('*')) {
        return currentPath.startsWith(route.slice(0, -1));
      }
      return currentPath === route;
    });

    debugLog('Should embed comments:', shouldEmbed);
    debugLog('Embed routes:', embedRoutes);

    if (shouldEmbed) {
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

        const discourseEmbedUrl = constructEmbedUrl(currentPath);
        debugLog('Constructed embed URL:', decodeURIComponent(discourseEmbedUrl));
        
        window.DiscourseEmbed = {
          discourseUrl: discourseUrl,
          discourseEmbedUrl: discourseEmbedUrl,
        };

        debugLog('DiscourseEmbed object:', window.DiscourseEmbed);

        const embedScript = document.createElement('script');
        embedScript.type = 'text/javascript';
        embedScript.async = true;
        embedScript.src = `${discourseUrl}javascripts/embed.js`;
        document.body.appendChild(embedScript);

        debugLog('Embed script appended to body:', embedScript.src);

        embedScript.onerror = (error) => {
          console.error('Error loading Discourse embed script:', error);
        };

        embedScript.onload = () => {
          debugLog('Discourse embed script loaded successfully');
        };
      });
    }
  };

  useEffect(() => {
    debugLog('useEffect triggered. Location:', location);
    debugLog('Plugin configuration:', { discourseUrl, discourseUserName, debugMode, embedRoutes });
    renderComments();

    return () => {
      const existingEmbed = document.getElementById('discourse-comments');
      if (existingEmbed) {
        existingEmbed.remove();
        debugLog('Cleanup: Removed existing embed');
      }
    };
  }, [location, discourseUrl, discourseUserName, debugMode, embedRoutes]);

  return null;
}

// Expose the component and render method globally for testing
if (typeof window !== 'undefined') {
  window.DiscourseCommentsComponent = DiscourseComments;
  window.renderDiscourseComments = () => {
    const debugLog = (message, data) => {
      if (window.DiscourseEmbed.debugMode) {
        console.log(`[Discourse Comments Debug] ${message}`, data);
      }
    };

    debugLog('Manual render triggered');

    const findSuitableContainer = () => {
      const selectors = [
        'article',
        '.theme-doc-markdown',
        '.markdown'
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

    const constructEmbedUrl = (path) => {
      const siteUrl = window.location.origin;
      const fullPath = `${siteUrl}${path}`;
      return encodeURIComponent(fullPath);
    };

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

      const currentPath = window.location.pathname;
      const discourseEmbedUrl = constructEmbedUrl(currentPath);
      
      window.DiscourseEmbed = {
        ...window.DiscourseEmbed,
        discourseEmbedUrl: discourseEmbedUrl,
      };

      debugLog('Updated DiscourseEmbed object:', window.DiscourseEmbed);

      const embedScript = document.createElement('script');
      embedScript.type = 'text/javascript';
      embedScript.async = true;
      embedScript.src = `${window.DiscourseEmbed.discourseUrl}javascripts/embed.js`;
      document.body.appendChild(embedScript);

      debugLog('Embed script appended to body:', embedScript.src);

      embedScript.onerror = (error) => {
        console.error('Error loading Discourse embed script:', error);
      };

      embedScript.onload = () => {
        debugLog('Discourse embed script loaded successfully');
      };
    });
  };
}

export default {
  onRouteUpdate({ location }) {
    // We delay the execution slightly to allow for any React rendering to complete
    setTimeout(() => {
      window.renderDiscourseComments();
    }, 0);
  },
};