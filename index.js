// @ts-check

const path = require('path');

/** @type {import('@docusaurus/types').PluginModule} */
module.exports = function(context, options) {
  const {
    siteConfig: { baseUrl },
  } = context;

  const {
    discourseUrl,
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
                debugMode: ${debugMode},
                embedRoutes: ${JSON.stringify(embedRoutes)},
                baseUrl: '${baseUrl}',
              };
            `,
          },
        ],
      };
    },

    async contentLoaded({ actions }) {
      const { setGlobalData } = actions;
      setGlobalData({
        discourseUrl,
        debugMode,
        embedRoutes,
      });
    },
  };
};