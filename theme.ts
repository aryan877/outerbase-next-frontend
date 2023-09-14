import { createTheme } from '@mantine/core';

export const theme = createTheme({
  /* Put your mantine theme override here */

  colors: {
    primary: [
      '#f5ebff',
      '#e4d4fe',
      '#c4a7f6',
      '#a476ee',
      '#884de8',
      '#7732e5',
      '#6e24e4',
      '#5d18cb',
      '#5214b6',
      '#460da1',
    ],
    secondary: [
      '#f5f4f5',
      '#e6e6e6',
      '#cccccc',
      '#afafaf',
      '#979798',
      '#88878a',
      '#827f84',
      '#6f6d71',
      '#636066',
      '#57525b',
    ],
    Accent: [
      '#f6f6ea',
      '#e8e8e1',
      '#cdd0c9',
      '#b3b5ad',
      '#9c9f95',
      '#8d9186',
      '#868a7d',
      '#72776a',
      '#656b5c',
      '#565c4b',
    ],
    neural: [
      '#f8f3f8',
      '#e7e6e8',
      '#cccbcd',
      '#b1afb2',
      '#99979b',
      '#8a878d',
      '#838086',
      '#706d74',
      '#656069',
      '#59525d',
    ],
  },

  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    // 2xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    // inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    // none: '0 0 rgb(0, 0 / 0, 0)',
  },
});
