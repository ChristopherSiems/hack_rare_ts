export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    // Extract the cookie from the request headers
    const authToken = req.cookies.authToken;

    if (!authToken) {
      // If no cookie is found, redirect to the sign-in page
      res.writeHead(302, { Location: "/signin" });
      res.end();
      return;
    }

    // If the cookie exists, send it back as JSON response
    res.status(200).json({ authToken });
  } else {
    // If the method is not GET, return a 405 Method Not Allowed
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
