import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (username === 'test' && password === 'test') { // Replace with actual authentication logic
    const response = NextResponse.json({ success: true });
    response.cookies.set('token', 'your_generated_token', { // Set the token as a cookie
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite : "strict",
        path : "/"
    });
    return response;
  } else {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
}