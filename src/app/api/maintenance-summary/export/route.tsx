import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const { searchParams } = new URL(req.url);
    const train_set = searchParams.getAll('train_set[]');
    const gerbong = searchParams.getAll('gerbong[]');
    const order = searchParams.get('order');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const viewAll = searchParams.get('viewAll');
    const startedAt = searchParams.get('startedAt');
    const endedAt = searchParams.get('endedAt');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Prepare the request URL and body
    const apiUrl = `${process.env.BE_API_HOST}/maintenance-summary/export`;

    const headers = {
      Authorization: `Bearer ${token?.account?.response?.access_token}`,
      'Content-Type': 'application/json',
    };

    const queryParams = {
      train_set,
      gerbong,
      order,
      page,
      limit,
      viewAll,
      startedAt,
      endedAt,
    };

    // Make the POST request using Axios to fetch the PDF file as a stream
    const response = await axios.get(apiUrl, {
      headers,
      params: queryParams,
      responseType: 'stream', // Important for handling file streams
    });

    // Prepare the response headers for the client to download the file
    const fileName = 'Maintenance_Report.pdf';
    const contentDisposition = response.headers['content-disposition'] || `attachment; filename="${fileName}"`;

    return new Response(response.data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': contentDisposition,
      },
    });
  } catch (error: any) {
    // Handle Axios errors
    if (error.response) {
      const { status, data } = error.response;
      return NextResponse.json({ message: data.message || 'Error' }, { status });
    } else if (error.request) {
      return NextResponse.json({ message: 'No response from server' }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
}
