import 'html-validate/jest';

import { html } from '../html';

describe('[middleware] html', () => {
  it('should return valid html', async () => {
    const result = html();

    expect(result).toHTMLValidate();
  });

  it('should contain logo if specified', async () => {
    const result = html({
      logo: '/logo.png',
    });

    expect(result).toHTMLValidate();
    expect(result).toContain('alt="Logo"');
  });

  it('should contain back url if specified', async () => {
    const backUrl = '/back';

    const result = html({
      logo: '/logo.png',
      backUrl,
    });

    expect(result).toHTMLValidate();
    expect(result).toContain(`<a href="${backUrl}">`);
    expect(result).toContain(`<a href="${backUrl}"`);
    expect(result).toContain(`Back to main website`);
  });
});
