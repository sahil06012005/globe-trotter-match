
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2>1. Information We Collect</h2>
            <p>
              TripLink collects information that you provide directly to us when creating an account, setting up your profile, or posting trips. This may include your name, email address, profile picture, and other information you choose to share.
            </p>

            <h2>2. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide and maintain our service</li>
              <li>Improve and personalize your experience</li>
              <li>Communicate with you about your account or transactions</li>
              <li>Send you updates and marketing communications</li>
              <li>Ensure the security of our platform</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>
              We may share your information with other users as needed for the functionality of the service (such as sharing profile information with potential travel companions). We do not sell your personal information to third parties.
            </p>

            <h2>4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
            </p>

            <h2>5. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>

            <h2>6. User Rights</h2>
            <p>
              You may access, update, or delete your personal information through your account settings. If you wish to completely delete your account, please contact us directly.
            </p>

            <h2>7. Children's Privacy</h2>
            <p>
              Our service is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children under 18.
            </p>

            <h2>8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "last updated" date.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@triplink.com.
            </p>

            <p className="text-sm text-gray-500 mt-8">
              Last updated: May 15, 2025
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Privacy;
