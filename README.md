# Docusaurus Plugin: Discourse Comments

This plugin integrates Discourse comments into your Docusaurus 3 site, appending them after the `<article>` element without requiring modifications to your theme's Layout component.

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

The plugin will automatically insert Discourse comments after the `<article>` element on the specified routes.

## Configuration Options

- `discourseUrl` (required): The URL of your Discourse instance.
- `discourseUserName` (required): The Discourse username that will be used for creating topics.
- `debugMode` (optional): Enable debug logging. Default: false
- `embedRoutes` (optional): An array of routes where the Discourse embed component will be inserted. Default: ['/docs/*', '/blog/*']

## How it works

The plugin automatically:
1. Injects the necessary scripts for Discourse embedding.
2. Handles the insertion and removal of Discourse comments as you navigate through your site.
3. Appends the comments after the `<article>` element, which is typically where the main content of a Docusaurus page ends.
4. Sets the correct `discourseEmbedUrl` for each page, ensuring that comments are associated with the correct URL.
5. Adds a `<meta name="discourse-username" content="your-username">` tag to the page head, which is required by Discourse for embedding.

## Testing from the Console

To test the Discourse comments component from the browser console:

1. Open your browser's developer tools (usually F12 or right-click and select "Inspect").
2. Go to the Console tab.
3. To manually render the comments, run:
   ```javascript
   window.renderDiscourseComments()
   ```
4. If you want to inspect the component, you can access it via:
   ```javascript
   window.DiscourseCommentsComponent
   ```

These methods are helpful for debugging and ensuring the component is working as expected.

## Troubleshooting

If you're not seeing comments on your pages:

1. Check that the `discourseUrl` is correct and points to a valid Discourse instance.
2. Verify that the `discourseUserName` is set correctly and matches a valid user on your Discourse instance.
3. Verify that the current route matches one of the `embedRoutes` patterns.
4. Ensure that an `<article>` element exists on the page.
5. Check that the `discourse-username` meta tag is present in the page's `<head>`.
6. Set `debugMode: true` in the plugin options to see more detailed logs in the browser console.
7. Use the console methods described in the "Testing from the Console" section to manually trigger the component rendering.

## License

MIT