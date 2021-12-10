import jwt from 'jsonwebtoken';

import { PasswordChecker } from '../PasswordChecker';

describe('[api] PasswordChecker', () => {
  it('should succeed with correct cookie string', async () => {
    const cookie = jwt.sign({}, 'password');

    const result = new PasswordChecker('password').check(cookie);

    expect(result).toBe(true);
  });
});
