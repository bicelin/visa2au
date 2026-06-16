import { defineConfig } from 'tinacms';

// TinaCMS Configuration
// Use your existing tenancy code: a559a388-750d-4edb-9522-705642263b4c

const config = defineConfig({
  branch: 'main',
  // Get these from app.tina.io after setting up your project
  clientId: process.env.TINA_CLIENT_ID || 'YOUR_TINA_CLIENT_ID',
  token: process.env.TINA_TOKEN || 'YOUR_TINA_TOKEN',

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },

  // Define your content collections
  schema: {
    collections: [
      {
        name: 'blog',
        label: 'Blog Posts',
        path: 'src/content/blog',
        format: 'md',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'category',
            label: 'Category',
            required: true,
          },
          {
            type: 'datetime',
            name: 'date',
            label: 'Publish Date',
          },
          {
            type: 'string',
            name: 'author',
            label: 'Author',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
          {
            type: 'image',
            name: 'heroImage',
            label: 'Hero Image',
          },
          {
            type: 'string',
            name: 'tags',
            label: 'Tags',
            list: true,
          },
        ],
      },
      {
        name: 'visas',
        label: 'Visa Information',
        path: 'src/content/visas',
        format: 'md',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'visaCode',
            label: 'Visa Code',
            required: true,
          },
          {
            type: 'number',
            name: 'order',
            label: 'Display Order',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Content',
            isBody: true,
          },
        ],
      },
      {
        name: 'team',
        label: 'Team Members',
        path: 'src/content/team',
        format: 'md',
        fields: [
          {
            type: 'string',
            name: 'name',
            label: 'Name',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'title',
            label: 'Job Title',
          },
          {
            type: 'string',
            name: 'marn',
            label: 'MARN Number',
          },
          {
            type: 'string',
            name: 'locations',
            label: 'Locations',
            list: true,
          },
          {
            type: 'rich-text',
            name: 'bio',
            label: 'Biography',
          },
          {
            type: 'image',
            name: 'photo',
            label: 'Photo',
          },
        ],
      },
      {
        name: 'pages',
        label: 'Pages',
        path: 'src/content/pages',
        format: 'md',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'slug',
            label: 'URL Slug',
            required: true,
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Content',
            isBody: true,
          },
        ],
      },
    ],
  },
});

export default config;
