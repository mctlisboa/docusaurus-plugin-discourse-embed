// @ts-check

const path = require('path');

/** @type {import('@docusaurus/types').PluginModule} */
module.exports = function(context, options) {
  const {
    siteConfig: { baseUrl, url },
  } = context;

  const {
    discourseUrl,
    discourseUserName,
    debugMode = false,
    embedRoutes = ['/docs/*', '/blog/*'],
  } = options;

  return {
    name: 'docusaurus-plugin-discourse-comments',

    getClientModules() {
      return [path.resolve(__dirname, './discourse-comments')];
    },

    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: 'script',
            attributes: {
              type: 'text/javascript',
            },
            innerHTML: `
              window.DiscourseEmbed = {
                discourseUrl: '${discourseUrl}',
                discourseEmbedUrl: '' // This will be set dynamically in discourse-comments.js
              };
            `,
          },
          {
            tagName: 'meta',
            attributes: {
              name: 'discourse-username',
              content: discourseUserName,
            },
          },
        ],
      };
    },

    async contentLoaded({ actions }) {
      const { setGlobalData } = actions;
      console.log('Discourse Comments Plugin: Setting global data');
      setGlobalData({
        discourseUrl,
        discourseUserName,
        debugMode,
        embedRoutes,
        baseUrl,
        siteUrl: url,
      });
      console.log('Discourse Comments Plugin: Global data set');
    },
  };
};