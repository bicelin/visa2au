import { defineConfig } from 'tinacms';

export default defineConfig({
  branch: process.env.VERCEL_GIT_COMMIT_REF || '',
  clientId: process.env.TINA_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'imgs',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        name: 'blog',
        label: 'Blog Posts',
        path: 'content/blog',
        format: 'md',
        defaultItem: () => ({
          title: 'New Blog Post',
          date: new Date().toISOString().split('T')[0],
          author: 'Natasha Arens',
          category: 'Partner Visas',
          readTime: '5 min read',
        }),
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.slug || 
                (values?.title || '')
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/^-|-$/g, '');
            },
          },
        },
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
            name: 'excerpt',
            label: 'Excerpt',
            required: true,
            ui: {
              component: 'textarea',
            },
          },
          {
            type: 'datetime',
            name: 'date',
            label: 'Date',
            required: true,
            ui: {
              dateFormat: 'YYYY-MM-DD',
              timeFormat: false,
            },
          },
          {
            type: 'string',
            name: 'author',
            label: 'Author',
            required: true,
            options: [
              { label: 'Natasha Arens', value: 'Natasha Arens' },
              { label: 'Sergey Vinnichenko', value: 'Sergey Vinnichenko' },
              { label: 'Denis Kosachev', value: 'Denis Kosachev' },
              { label: 'Franz Somera', value: 'Franz Somera' },
            ],
          },
          {
            type: 'string',
            name: 'category',
            label: 'Category',
            required: true,
            options: [
              { label: 'Partner Visas', value: 'Partner Visas' },
              { label: 'Employer Sponsorship', value: 'Employer Sponsorship' },
              { label: 'Visitor Visas', value: 'Visitor Visas' },
              { label: 'Skills Assessment', value: 'Skills Assessment' },
              { label: 'Family Visas', value: 'Family Visas' },
              { label: 'Citizenship', value: 'Citizenship' },
              { label: 'Visa Refusals', value: 'Visa Refusals' },
              { label: 'Work Visas', value: 'Work Visas' },
              { label: 'Protection Visas', value: 'Protection Visas' },
              { label: 'Skilled Visas', value: 'Skilled Visas' },
            ],
          },
          {
            type: 'string',
            name: 'readTime',
            label: 'Read Time',
            required: true,
            options: [
              { label: '3 min read', value: '3 min read' },
              { label: '4 min read', value: '4 min read' },
              { label: '5 min read', value: '5 min read' },
              { label: '6 min read', value: '6 min read' },
              { label: '7 min read', value: '7 min read' },
              { label: '8 min read', value: '8 min read' },
            ],
          },
          {
            type: 'image',
            name: 'image',
            label: 'Featured Image',
            required: true,
          },
          {
            type: 'string',
            name: 'metaDescription',
            label: 'Meta Description',
            required: true,
            ui: {
              component: 'textarea',
            },
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },
    ],
  },
});
