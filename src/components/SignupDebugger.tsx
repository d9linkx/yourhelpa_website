import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft } from 'lucide-react';

const API_URL = 'https://script.google.com/macros/s/AKfycbz8PasKHgjeBS5DjJ8KS5g0eqW82Yb6P9t5X0ttXD2w9Y878lsV7jRegrRiDHq8LkeI/exec';

interface SignupDebuggerProps {
  onNavigate: (page: string) => void;
  onBack?: () => void;
}

export function SignupDebugger({ onNavigate, onBack }: SignupDebuggerProps) {
  const [testEmail, setTestEmail] = useState(`test${Date.now()}@example.com`);
  const [testPassword, setTestPassword] = useState('Test123!');
  const [testName, setTestName] = useState('Test User');
  const [testPhone, setTestPhone] = useState('+2348012345678');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('Testing connection...');

    try {
      // Test 1: Simple GET request
      setResult('Test 1: Testing GET request...');
      const getResponse = await fetch(API_URL, {
        method: 'GET',
        mode: 'no-cors',
      });
      setResult(prev => prev + '\n✅ GET request sent (no-cors mode)');

      // Test 2: POST with registration data
      setResult(prev => prev + '\n\nTest 2: Testing POST request...');
      const postResponse = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'register',
          email: testEmail,
          password: testPassword,
          firstName: testName,
          phone: testPhone
        })
      });

      setResult(prev => prev + `\n✅ POST response status: ${postResponse.status}`);

      if (postResponse.ok) {
        const data = await postResponse.json();
        setResult(prev => prev + '\n\n✅ SUCCESS! Response:');
        setResult(prev => prev + '\n' + JSON.stringify(data, null, 2));
      } else {
        setResult(prev => prev + `\n❌ Error: ${postResponse.statusText}`);
        const text = await postResponse.text();
        setResult(prev => prev + '\nResponse: ' + text);
      }

    } catch (error) {
      setResult(prev => prev + '\n\n❌ ERROR:');
      setResult(prev => prev + '\n' + (error as Error).message);
      setResult(prev => prev + '\n\nFull error: ' + JSON.stringify(error, null, 2));
      
      console.error('Full error details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-yellow-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-primary/10">
          <h1 className="text-3xl font-bold text-primary mb-4">🔍 Signup Debugger</h1>
          <p className="text-muted-foreground mb-8">
            This tool helps diagnose signup issues by testing the Google Sheets API connection.
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <Label>Test Email</Label>
              <Input
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>

            <div>
              <Label>Test Name</Label>
              <Input
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="Test User"
              />
            </div>

            <div>
              <Label>Test Password</Label>
              <Input
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="Password"
                type="password"
              />
            </div>

            <div>
              <Label>Test Phone</Label>
              <Input
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="+234..."
              />
            </div>
          </div>

          <Button 
            onClick={testConnection} 
            disabled={loading}
            className="w-full h-12 mb-6"
          >
            {loading ? 'Testing...' : '🧪 Test Signup Connection'}
          </Button>

          {result && (
            <div className="bg-gray-900 text-green-400 p-6 rounded-xl font-mono text-sm whitespace-pre-wrap overflow-x-auto">
              {result}
            </div>
          )}

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <h3 className="font-bold text-yellow-900 mb-2">📋 Checklist:</h3>
            <ul className="space-y-2 text-sm text-yellow-800">
              <li>✅ Google Apps Script deployed as web app</li>
              <li>✅ Access set to "Anyone" (not "Anyone with Google account")</li>
              <li>✅ Execute as "Me" (your account)</li>
              <li>✅ Correct API URL in code</li>
              <li>✅ Google Sheet has "Users" and "Sessions" tabs</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="font-bold text-blue-900 mb-2">🔗 Current API URL:</h3>
            <code className="text-xs text-blue-800 break-all">
              {API_URL}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}