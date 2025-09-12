import { cleanupTestAccount, checkAccountConflicts } from '../utils/accountCleanup';

// Add this to your browser console to clean up test accounts
(window as any).cleanupTestAccount = cleanupTestAccount;
(window as any).checkAccountConflicts = checkAccountConflicts;

// Example usage:
// cleanupTestAccount('gautamsid03@gmail.com', 'your-test-password')
// checkAccountConflicts('gautamsid03@gmail.com')

console.log('Account cleanup utilities loaded:');
console.log('- cleanupTestAccount(email, password) - Clean up a test account');
console.log('- checkAccountConflicts(email) - Check for conflicting data');
console.log('Example: cleanupTestAccount("gautamsid03@gmail.com", "test123")');
