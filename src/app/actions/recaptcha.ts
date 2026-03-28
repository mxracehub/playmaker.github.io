'use server';

/**
 * @fileOverview reCAPTCHA Enterprise Server-Side Assessment.
 * 
 * Verifies the integrity of user actions by creating an assessment 
 * via the reCAPTCHA Enterprise API.
 */

export async function verifyRecaptchaAction(token: string, action: string) {
  const projectID = "studio-9017010772-a9339";
  // Using the API key from the Firebase config
  const apiKey = "AIzaSyDe0yoaGWHCK7ZxRCiKYSOCw03Sd9godZE"; 
  const siteKey = "6LfU-ZssAAAAAFcYu-2NemXNroyLyheF3YzMCh9v";

  const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectID}/assessments?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: {
          token: token,
          siteKey: siteKey,
          expectedAction: action,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`reCAPTCHA API error: ${response.statusText}`);
    }

    const result = await response.json();
    
    // In a production environment, you would check the score:
    // if (result.riskAnalysis.score < 0.5) throw new Error('High risk detected');
    
    return {
      success: !!result.tokenProperties?.valid,
      score: result.riskAnalysis?.score,
      reason: result.riskAnalysis?.reasons,
    };
  } catch (error) {
    console.error('reCAPTCHA Assessment Failed:', error);
    return { success: false, error: 'Verification service unavailable' };
  }
}
