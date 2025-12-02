// List of common personal email domains
const PERSONAL_EMAIL_DOMAINS = [
  // 'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'aol.com',
  'icloud.com',
  'mail.com',
  'protonmail.com',
  'yandex.com',
  'zoho.com',
  'gmx.com',
  'inbox.com',
  'msn.com',
];

/**
 * Validates if an email is a business email address
 * @param email - The email address to validate
 * @returns true if it's a business email, false if it's a personal email
 */
export const isBusinessEmail = (email: string): boolean => {
  if (!email || !email.includes('@')) {
    return false;
  }

  const domain = email.split('@')[1]?.toLowerCase();
  
  if (!domain) {
    return false;
  }

  return !PERSONAL_EMAIL_DOMAINS.includes(domain);
};

/**
 * Gets error message for invalid business email
 * @param email - The email address
 * @returns Error message string
 */
export const getEmailErrorMessage = (email: string): string => {
  if (!email || !email.includes('@')) {
    return 'Please enter a valid email address.';
  }

  const domain = email.split('@')[1]?.toLowerCase();
  
  if (PERSONAL_EMAIL_DOMAINS.includes(domain)) {
    return 'Please use a valid business email address.';
  }

  return '';
};
