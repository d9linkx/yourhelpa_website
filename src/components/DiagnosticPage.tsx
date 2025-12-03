import { useState } from 'react';
import { Button } from './ui/button';
import { AlertCircle, CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';

interface DiagnosticPageProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function DiagnosticPage({ onNavigate, onBack }: DiagnosticPageProps) {
  const [testResults, setTestResults] = useState<any>({});
  const [testing, setTesting] = useState(false);

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz8PasKHgjeBS5DjJ8KS5g0eqW82Yb6P9t5X0ttXD2w9Y878lsV7jRegrRiDHq8LkeI/exec';

  const runDiagnostics = async () => {
    setTesting(true);
    const results: any = {};

    // Test 1: Basic GET request
    console.log('🧪 Test 1: Testing basic GET request...');
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
      });

      results.get = {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      };

      if (response.ok) {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          results.get.data = data;
          results.get.success = true;
        } catch (e) {
          results.get.rawResponse = text;
          results.get.parseError = 'Response is not JSON';
        }
      }
    } catch (error: any) {
      results.get = {
        success: false,
        error: error.toString(),
        message: error.message,
      };
    }

    // Test 2: POST request (register)
    console.log('🧪 Test 2: Testing POST request (registration)...');
    try {
      const testEmail = 'test' + Date.now() + '@example.com';
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'register',
          email: testEmail,
          password: 'Test123!',
          firstName: 'Diagnostic',
          phone: '+2348012345678',
        }),
      });

      results.post = {
        status: response.status,
        ok: response.ok,
      };

      if (response.ok) {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          results.post.data = data;
          results.post.success = data.success;
        } catch (e) {
          results.post.rawResponse = text;
          results.post.parseError = 'Response is not JSON';
        }
      }
    } catch (error: any) {
      results.post = {
        success: false,
        error: error.toString(),
        message: error.message,
      };
    }

    // Test 3: Direct browser test
    results.browserTest = {
      url: `${SCRIPT_URL}?action=test`,
      instruction: 'Click the link below to test in a new tab',
    };

    setTestResults(results);
    setTesting(false);
  };

  const getStatusIcon = (result: any) => {
    if (!result) return <AlertCircle className="w-5 h-5 text-gray-400" />;
    if (result.success || result.ok) return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-yellow-50 pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-emerald-600 mb-2">🔍 Google Apps Script Diagnostics</h1>
          <p className="text-gray-600 mb-8">
            This tool will help diagnose connection issues with your Google Apps Script backend.
          </p>

          {/* Script URL Display */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 mb-2">
              <strong>Script URL:</strong>
            </p>
            <code className="text-xs break-all text-emerald-600">{SCRIPT_URL}</code>
          </div>

          {/* Run Test Button */}
          <Button
            onClick={runDiagnostics}
            disabled={testing}
            className="w-full mb-8 bg-emerald-600 hover:bg-emerald-700"
            size="lg"
          >
            {testing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Running Diagnostics...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                Run Diagnostic Tests
              </>
            )}
          </Button>

          {/* Test Results */}
          {Object.keys(testResults).length > 0 && (
            <div className="space-y-6">
              {/* Test 1: GET Request */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  {getStatusIcon(testResults.get)}
                  <h3 className="text-gray-900">Test 1: Basic Connection (GET Request)</h3>
                </div>
                
                {testResults.get?.success === false ? (
                  <div className="space-y-2">
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                      <p className="font-semibold mb-2">❌ Connection Failed</p>
                      <p className="text-sm mb-2">{testResults.get.error}</p>
                      
                      {testResults.get.error?.includes('Failed to fetch') && (
                        <div className="mt-4 text-sm">
                          <p className="font-semibold mb-2">This usually means:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Google Apps Script is not deployed correctly</li>
                            <li>The script URL is wrong</li>
                            <li>The deployment doesn't have "Anyone" access</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 text-green-700 p-4 rounded-lg">
                    <p className="font-semibold mb-2">✅ Connection Successful</p>
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(testResults.get.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Test 2: POST Request */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  {getStatusIcon(testResults.post)}
                  <h3 className="text-gray-900">Test 2: Registration (POST Request)</h3>
                </div>
                
                {testResults.post?.success === false ? (
                  <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                    <p className="font-semibold mb-2">❌ POST Request Failed</p>
                    <p className="text-sm">{testResults.post.error}</p>
                  </div>
                ) : testResults.post?.success === true ? (
                  <div className="bg-green-50 text-green-700 p-4 rounded-lg">
                    <p className="font-semibold mb-2">✅ Registration Working</p>
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(testResults.post.data, null, 2)}
                    </pre>
                  </div>
                ) : testResults.post?.data ? (
                  <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
                    <p className="font-semibold mb-2">⚠️ Got Response but Registration Failed</p>
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(testResults.post.data, null, 2)}
                    </pre>
                  </div>
                ) : null}
              </div>

              {/* Test 3: Browser Test */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-blue-500" />
                  <h3 className="text-gray-900">Test 3: Direct Browser Test</h3>
                </div>
                
                <div className="bg-blue-50 text-blue-700 p-4 rounded-lg">
                  <p className="mb-3">Click this link to test the script directly in your browser:</p>
                  <a
                    href={testResults.browserTest.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Open in New Tab
                  </a>
                  <p className="mt-3 text-sm">
                    <strong>Expected:</strong> You should see JSON data like {`{"success": true, "message": "..."}`}
                  </p>
                  <p className="text-sm">
                    <strong>If you see an error:</strong> The script is not deployed correctly
                  </p>
                </div>
              </div>

              {/* Instructions if all tests fail */}
              {testResults.get?.success === false && (
                <div className="border-2 border-orange-500 rounded-lg p-6 bg-orange-50">
                  <h3 className="text-orange-900 mb-4">📋 Fix Instructions</h3>
                  
                  <div className="space-y-4 text-sm text-orange-900">
                    <div>
                      <p className="font-semibold mb-2">Step 1: Open Google Apps Script</p>
                      <p>1. Open your Google Sheet</p>
                      <p>2. Go to <strong>Extensions → Apps Script</strong></p>
                    </div>

                    <div>
                      <p className="font-semibold mb-2">Step 2: Verify the Code is Saved</p>
                      <p>1. Make sure you pasted the complete code</p>
                      <p>2. Click <strong>💾 Save</strong> (Ctrl+S)</p>
                      <p>3. Look for any red error indicators</p>
                    </div>

                    <div>
                      <p className="font-semibold mb-2">Step 3: Redeploy</p>
                      <p>1. Click <strong>Deploy → Manage deployments</strong></p>
                      <p>2. Click the <strong>Edit</strong> button (pencil icon)</p>
                      <p>3. Click <strong>New version</strong></p>
                      <p>4. Click <strong>Deploy</strong></p>
                      <p>5. Copy the new URL and update your frontend</p>
                    </div>

                    <div>
                      <p className="font-semibold mb-2">Step 4: Verify Settings</p>
                      <p>Make sure these settings are correct:</p>
                      <ul className="list-disc list-inside mt-2 ml-4">
                        <li><strong>Execute as:</strong> Me (your-email@gmail.com)</li>
                        <li><strong>Who has access:</strong> Anyone</li>
                      </ul>
                    </div>

                    <div className="bg-white p-4 rounded-lg mt-4">
                      <p className="font-semibold mb-2">Alternative: Create Fresh Deployment</p>
                      <p>1. Click <strong>Deploy → Manage deployments</strong></p>
                      <p>2. Delete ALL existing deployments</p>
                      <p>3. Click <strong>Deploy → New deployment</strong></p>
                      <p>4. Select <strong>Web app</strong></p>
                      <p>5. Set access to <strong>Anyone</strong></p>
                      <p>6. Copy the new URL</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}