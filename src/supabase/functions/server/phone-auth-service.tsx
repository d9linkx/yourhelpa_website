/**
 * Handle phone signup
 */
export async function handlePhoneSignup(phone: string, firstName: string): Promise<{ success: boolean; error?: string }> {
  try {
    const formattedPhone = formatPhoneNumber(phone);
    
    // Check if user already exists
    const existingUser = await kv.get(`user:phone:${formattedPhone}`);
    if (existingUser) {
      return { success: false, error: 'Phone number already registered. Please sign in instead.' };
    }
    
    // Store firstName temporarily for use after OTP verification
    await kv.set(`temp:signup:${formattedPhone}`, JSON.stringify({ firstName, createdAt: new Date().toISOString() }));
    
    // Send OTP
    return await sendOTP(formattedPhone);
  } catch (error) {
    console.error('Error in phone signup:', error);
    return { success: false, error: 'Signup failed' };
  }
}