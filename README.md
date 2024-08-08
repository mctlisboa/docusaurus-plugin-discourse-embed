# Docusaurus Plugin: Discourse Comments

This plugin integrates Discourse comments into your Docusaurus 3 site, appending them after the main content without requiring modifications to your theme's Layout component.

## Installation

```bash
npm install docusaurus-plugin-discourse-comments
```

## Usage

Add the plugin to your `docusaurus.config.js`:

```javascript
module.exports = {
  // ...other config
  plugins: [
    [
      'docusaurus-plugin-discourse-comments',
      {
        discourseUrl: 'https://your-discourse-instance.com/',
        discourseUserName: 'your-discourse-username',
        debugMode: false, // Optional, default: false
        embedRoutes: ['/docs/*', '/blog/*'], // Optional, default: ['/docs/*', '/blog/*']
      },
    ],
  ],
};
```

The plugin will automatically insert Discourse comments after the main content on the specified routes.

## Configuration Options

- `discourseUrl` (required): The URL of your Discourse instance. Make sure it ends with a trailing slash (`/`).
- `discourseUserName` (required): The Discourse username that will be used for creating topics.
- `debugMode` (optional): Enable debug logging. Default: false
- `embedRoutes` (optional): An array of routes where the Discourse embed component will be inserted. Default: ['/docs/*', '/blog/*']


## Required Headers for Discourse Embed

To ensure proper functioning of the Discourse embed, specific headers need to be set on your Discourse server for the `/embed/*` endpoint. These headers are crucial for allowing the embed to load correctly and securely on your Docusaurus site.

The following headers should be set on your Discourse server for requests to the `/embed/* endpoint:

- `Content-Security-Policy: frame-ancestors *`
- `Cross-Origin-Embedder-Policy: require-corp`
- `Cross-Origin-Opener-Policy: cross-origin`
- `Cross-Origin-Resource-Policy: cross-origin`

These headers should be set for requests containing "your-discourse-instance.com/embed" in the URL.

If you're using a service like Cloudflare to manage your Discourse instance, you can set these headers using Page Rules or Transform Rules. For other hosting solutions, consult their documentation on how to set custom headers for specific endpoints.

Note: These headers are set on the Discourse server, not on your Docusaurus site.

## How it works

The plugin automatically:
1. Injects the necessary scripts for Discourse embedding.
2. Adds a meta tag with the specified `discourseUserName` for Discourse to use when creating new topics.
3. Handles the insertion and removal of Discourse comments as you navigate through your site.
4. Appends the comments after the main content of your pages.
5. Sets the correct `discourseEmbedUrl` for each page, ensuring that comments are associated with the correct URL.

## Troubleshooting

If you're experiencing issues:

1. Set `debugMode: true` in the plugin options to enable detailed logging.
2. Open your browser's developer tools and check the console for logs prefixed with `[Discourse Comments Debug]`.
3. Verify that your Discourse instance allows embedding from your Docusaurus site's domain.
4. Check that the `discourseUrl` in your configuration ends with a trailing slash (`/`).
5. Ensure that the `discourseUserName` is set correctly and matches a valid user on your Discourse instance.
6. Ensure that the current route matches one of the `embedRoutes` patterns.
7. Confirm that the required headers (mentioned above) are correctly set for the `/embed` endpoint on your Discourse server.
8. Check the Network tab in your browser's developer tools to ensure the Discourse embed is loading without any CORS or CSP errors.


## Manual Testing

To manually trigger the rendering of comments from the browser console:

```javascript
window.renderDiscourseComments()
```

This can be useful for debugging or if you need to re-render comments after dynamic content changes.

## License

MIT