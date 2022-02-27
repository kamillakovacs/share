import Document, { Html, Head } from "next/document";

export class ThankYouEmail extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <html>
            <body>
              <div>Thank you for your reservation. We look forward to seeing you at Share Spa - Oko-Park</div>
            </body>
          </html>
        </body>
      </Html>
    );
  }
}
