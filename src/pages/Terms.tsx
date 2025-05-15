
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              Welcome to TripLink. By accessing or using our service, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              TripLink provides a platform that connects travelers who are looking to share their travel experiences. We do not organize trips ourselves, but merely facilitate connections between users.
            </p>

            <h2>3. User Accounts</h2>
            <p>
              Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account. Users must be at least 18 years old to create an account.
            </p>

            <h2>4. Code of Conduct</h2>
            <p>
              Users agree to interact with others in a respectful manner. Harassment, hate speech, or any form of discriminatory behavior is not tolerated.
            </p>

            <h2>5. Trip Information</h2>
            <p>
              Information about trips is provided by users. While we strive to encourage accurate listings, we cannot guarantee the accuracy of all information. Users should exercise due diligence before committing to a trip.
            </p>

            <h2>6. Privacy</h2>
            <p>
              Our Privacy Policy describes how we collect, use, and protect your information. By using TripLink, you agree to our collection and use of information as described in our Privacy Policy.
            </p>

            <h2>7. Termination</h2>
            <p>
              We reserve the right to terminate or suspend any user account at our discretion, without notice, particularly for violations of these Terms of Service.
            </p>

            <h2>8. Changes to Terms</h2>
            <p>
              We may modify these terms at any time. Continued use of TripLink after any such changes constitutes your consent to such changes.
            </p>

            <h2>9. Disclaimers and Limitations of Liability</h2>
            <p>
              TripLink is provided "as is" without warranties of any kind. We are not responsible for the actions of users or the accuracy of information provided by users.
            </p>

            <h2>10. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at support@triplink.com.
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

export default Terms;
