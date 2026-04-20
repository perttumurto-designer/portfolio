import type { Preview } from '@storybook/react'
import React from 'react'
import './fonts.css'
import '../app/globals.css'
import { BREAKPOINTS } from '../lib/breakpoints'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      options: {
        mobile: {
          name: 'Mobile 375',
          styles: { width: '375px', height: '667px' },
          type: 'mobile',
        },
        tablet: {
          name: `Tablet ${BREAKPOINTS.md}`,
          styles: { width: `${BREAKPOINTS.md}px`, height: '1024px' },
          type: 'tablet',
        },
        desktop: {
          name: `Desktop ${BREAKPOINTS.xl}`,
          styles: { width: `${BREAKPOINTS.xl}px`, height: '800px' },
          type: 'desktop',
        },
        wide: {
          name: 'Wide 1440',
          styles: { width: '1440px', height: '900px' },
          type: 'desktop',
        },
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Toggle light/dark mode',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    viewport: { value: 'desktop' },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light'
      return (
        <div className={theme === 'dark' ? 'dark' : ''}>
          <div className="bg-background text-foreground min-h-[100px] p-4">
            <Story />
          </div>
        </div>
      )
    },
  ],
}

export default preview
