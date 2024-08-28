import axios from 'axios';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const token: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token?.account?.response?.access_token}`,
    };

    const apiUrl = `${process.env.BE_API_HOST}/permission`;

    const response = await axios.post(apiUrl, data, { headers });

    return NextResponse.json(response.data, { status: response.status });

  } catch (error: any) {
    // Handle Axios errors
    if (error.response) {
      // Server responded with a status other than 200 range
      const { status, data } = error.response;
      return NextResponse.json({ message: data.message || 'Error' }, { status });
    } else if (error.request) {
      // Request was made but no response received
      return NextResponse.json({ message: 'No response from server' }, { status: 500 });
    } else {
      // Something happened while setting up the request
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
}
