/**
 * Google Sheets Connection Test Utility
 * Use this to verify your Google Sheets setup is working correctly
 */

import * as kv from '../supabase/functions/server/kv-helper.tsx';
import { 
  sheetsService, 
  SHEETS,
  saveUser,
  getUser,
  saveProvider,
  getProvider 
} from './google-sheets';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  duration: number;
}

/**
 * Run all tests
 */
export async function runAllTests(): Promise<TestResult[]> {
  console.log('🧪 Starting Google Sheets connection tests...\n');
  
  const results: TestResult[] = [];

  // Test 1: KV Get operation
  results.push(await testKVGet());

  // Test 2: KV Set operation
  results.push(await testKVSet());

  // Test 3: KV Delete operation
  results.push(await testKVDelete());

  // Test 4: Get all rows from a sheet
  results.push(await testGetAllRows());

  // Test 5: Append row to sheet
  results.push(await testAppendRow());

  // Test 6: Update row in sheet
  results.push(await testUpdateRow());

  // Test 7: User operations
  results.push(await testUserOperations());

  // Test 8: Provider operations
  results.push(await testProviderOperations());

  // Print results
  printResults(results);

  return results;
}

/**
 * Test KV Get
 */
async function testKVGet(): Promise<TestResult> {
  const start = Date.now();
  try {
    const value = await kv.get('test_key');
    return {
      name: 'KV Get',
      passed: true,
      message: `Successfully fetched value: ${value || 'null'}`,
      duration: Date.now() - start,
    };
  } catch (error) {
    return {
      name: 'KV Get',
      passed: false,
      message: `Error: ${error.message}`,
      duration: Date.now() - start,
    };
  }
}

/**
 * Test KV Set
 */
async function testKVSet(): Promise<TestResult> {
  const start = Date.now();
  try {
    const testValue = `test_${Date.now()}`;
    await kv.set('test_key', testValue);
    
    // Verify it was set
    const retrieved = await kv.get('test_key');
    const success = retrieved === testValue;
    
    return {
      name: 'KV Set',
      passed: success,
      message: success 
        ? `Successfully set and verified value: ${testValue}` 
        : `Value mismatch. Set: ${testValue}, Got: ${retrieved}`,
      duration: Date.now() - start,
    };
  } catch (error) {
    return {
      name: 'KV Set',
      passed: false,
      message: `Error: ${error.message}`,
      duration: Date.now() - start,
    };
  }
}

/**
 * Test KV Delete
 */
async function testKVDelete(): Promise<TestResult> {
  const start = Date.now();
  try {
    // Set a value first
    await kv.set('test_delete_key', 'delete_me');
    
    // Delete it
    await kv.del('test_delete_key');
    
    // Verify it's deleted
    const retrieved = await kv.get('test_delete_key');
    const success = retrieved === null;
    
    return {
      name: 'KV Delete',
      passed: success,
      message: success 
        ? 'Successfully deleted key' 
        : `Delete failed. Value still exists: ${retrieved}`,
      duration: Date.now() - start,
    };
  } catch (error) {
    return {
      name: 'KV Delete',
      passed: false,
      message: `Error: ${error.message}`,
      duration: Date.now() - start,
    };
  }
}

/**
 * Test Get All Rows
 */
async function testGetAllRows(): Promise<TestResult> {
  const start = Date.now();
  try {
    const rows = await sheetsService.getAllRows(SHEETS.USERS);
    return {
      name: 'Get All Rows',
      passed: true,
      message: `Successfully fetched ${rows.length} users`,
      duration: Date.now() - start,
    };
  } catch (error) {
    return {
      name: 'Get All Rows',
      passed: false,
      message: `Error: ${error.message}`,
      duration: Date.now() - start,
    };
  }
}

/**
 * Test Append Row
 */
async function testAppendRow(): Promise<TestResult> {
  const start = Date.now();
  try {
    const testId = `test_${Date.now()}`;
    const success = await sheetsService.appendRow(SHEETS.USERS, {
      id: testId,
      email: `test_${testId}@example.com`,
      firstName: 'Test',
      phone: '1234567890',
      emailVerified: 'FALSE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    return {
      name: 'Append Row',
      passed: success,
      message: success 
        ? `Successfully appended test user: ${testId}` 
        : 'Failed to append row',
      duration: Date.now() - start,
    };
  } catch (error) {
    return {
      name: 'Append Row',
      passed: false,
      message: `Error: ${error.message}`,
      duration: Date.now() - start,
    };
  }
}

/**
 * Test Update Row
 */
async function testUpdateRow(): Promise<TestResult> {
  const start = Date.now();
  try {
    // First, append a test row
    const testId = `test_update_${Date.now()}`;
    await sheetsService.appendRow(SHEETS.USERS, {
      id: testId,
      email: `test_${testId}@example.com`,
      firstName: 'TestUpdate',
      phone: '1234567890',
      emailVerified: 'FALSE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    // Update it
    const success = await sheetsService.updateRow(SHEETS.USERS, 'id', testId, {
      firstName: 'UpdatedName',
      emailVerified: 'TRUE',
    });
    
    return {
      name: 'Update Row',
      passed: success,
      message: success 
        ? `Successfully updated test user: ${testId}` 
        : 'Failed to update row',
      duration: Date.now() - start,
    };
  } catch (error) {
    return {
      name: 'Update Row',
      passed: false,
      message: `Error: ${error.message}`,
      duration: Date.now() - start,
    };
  }
}

/**
 * Test User Operations
 */
async function testUserOperations(): Promise<TestResult> {
  const start = Date.now();
  try {
    const testId = `user_test_${Date.now()}`;
    const userData = {
      id: testId,
      email: `test_${testId}@example.com`,
      firstName: 'John',
      phone: '2349012345678',
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };
    
    // Save user
    await saveUser(testId, userData);
    
    // Retrieve user
    const retrieved = await getUser(testId);
    const success = retrieved && retrieved.email === userData.email;
    
    return {
      name: 'User Operations',
      passed: success,
      message: success 
        ? `Successfully saved and retrieved user: ${testId}` 
        : 'Failed to save/retrieve user',
      duration: Date.now() - start,
    };
  } catch (error) {
    return {
      name: 'User Operations',
      passed: false,
      message: `Error: ${error.message}`,
      duration: Date.now() - start,
    };
  }
}

/**
 * Test Provider Operations
 */
async function testProviderOperations(): Promise<TestResult> {
  const start = Date.now();
  try {
    const testId = `provider_test_${Date.now()}`;
    const providerData = {
      userId: testId,
      businessName: 'Test Business',
      whatsappNumber: '2349012345678',
      verificationStatus: 'pending' as const,
      accountType: 'business' as const,
      bio: 'Test provider bio',
      services: [],
      totalEarnings: 0,
      pendingEarnings: 0,
      completedJobs: 0,
      rating: 0,
      totalReviews: 0,
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };
    
    // Save provider
    await saveProvider(testId, providerData);
    
    // Retrieve provider
    const retrieved = await getProvider(testId);
    const success = retrieved && retrieved.businessName === providerData.businessName;
    
    return {
      name: 'Provider Operations',
      passed: success,
      message: success 
        ? `Successfully saved and retrieved provider: ${testId}` 
        : 'Failed to save/retrieve provider',
      duration: Date.now() - start,
    };
  } catch (error) {
    return {
      name: 'Provider Operations',
      passed: false,
      message: `Error: ${error.message}`,
      duration: Date.now() - start,
    };
  }
}

/**
 * Print test results
 */
function printResults(results: TestResult[]): void {
  console.log('\n' + '='.repeat(80));
  console.log('📊 TEST RESULTS');
  console.log('='.repeat(80) + '\n');

  let passed = 0;
  let failed = 0;

  results.forEach((result, index) => {
    const icon = result.passed ? '✅' : '❌';
    const status = result.passed ? 'PASS' : 'FAIL';
    
    console.log(`${icon} Test ${index + 1}: ${result.name} - ${status}`);
    console.log(`   ${result.message}`);
    console.log(`   Duration: ${result.duration}ms\n`);
    
    if (result.passed) {
      passed++;
    } else {
      failed++;
    }
  });

  console.log('='.repeat(80));
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log('='.repeat(80) + '\n');

  if (failed === 0) {
    console.log('🎉 All tests passed! Your Google Sheets backend is working correctly.\n');
  } else {
    console.log('⚠️  Some tests failed. Please check the error messages above.\n');
  }
}

/**
 * Run quick connection test
 */
export async function quickTest(): Promise<boolean> {
  console.log('🔍 Running quick connection test...\n');
  
  try {
    const testKey = 'quick_test';
    const testValue = `test_${Date.now()}`;
    
    // Test write
    await kv.set(testKey, testValue);
    console.log('✅ Write test passed');
    
    // Test read
    const retrieved = await kv.get(testKey);
    if (retrieved === testValue) {
      console.log('✅ Read test passed');
    } else {
      console.log('❌ Read test failed');
      return false;
    }
    
    // Test delete
    await kv.del(testKey);
    console.log('✅ Delete test passed');
    
    console.log('\n🎉 Quick test completed successfully!\n');
    return true;
  } catch (error) {
    console.log(`\n❌ Quick test failed: ${error.message}\n`);
    return false;
  }
}

/**
 * Test specific sheet
 */
export async function testSheet(sheetName: string): Promise<void> {
  console.log(`🧪 Testing sheet: ${sheetName}\n`);
  
  try {
    const rows = await sheetsService.getAllRows(sheetName);
    console.log(`✅ Successfully accessed sheet: ${sheetName}`);
    console.log(`📊 Found ${rows.length} rows\n`);
    
    if (rows.length > 0) {
      console.log('Sample row:');
      console.log(JSON.stringify(rows[0], null, 2));
    }
  } catch (error) {
    console.log(`❌ Failed to access sheet: ${error.message}\n`);
  }
}

// Export for CLI usage
if (import.meta.main) {
  const args = Deno.args;
  
  if (args.includes('--quick')) {
    await quickTest();
  } else if (args.includes('--sheet') && args.length > 1) {
    const sheetIndex = args.indexOf('--sheet');
    const sheetName = args[sheetIndex + 1];
    await testSheet(sheetName);
  } else {
    await runAllTests();
  }
}
