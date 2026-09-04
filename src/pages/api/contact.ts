import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const { name, email, phone, message } = await request.json();

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }

  const now = new Date();
  const formattedDate = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  const formattedTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: import.meta.env.CONTACT_FROM_EMAIL,
      to: import.meta.env.CONTACT_TO_EMAIL,
      subject: `New inquiry from ${name}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f0f2f5; padding: 24px;">
          <div style="background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">

            <div style="padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb;">
              <table width="100%"><tr>
                <td style="font-size: 18px; font-weight: bold; color: #111827;">Hyrdan Pest</td>
                <td style="text-align: right; font-size: 12px; color: #6b7280;">
                  Notifikasi<br>${formattedDate} • ${formattedTime}
                </td>
              </tr></table>
            </div>

            <div style="padding: 32px;">
              <h1 style="font-size: 22px; color: #111827; margin: 0 0 8px;">Pesan Baru Diterima</h1>
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 24px;">
                Pelanggan baru telah mengisi formulir kontak di situs web Anda. Lihat detail di bawah untuk membalas pesan.
              </p>

              <div style="background-color: #f9fafb; border-radius: 10px; padding: 20px 24px; border: 1px solid #e5e7eb;">
                <p style="font-weight: bold; color: #111827; margin: 0 0 4px;">Detail Pengirim</p>
                <p style="font-size: 13px; color: #6b7280; margin: 0 0 16px;">Informasi yang dikirim oleh pelanggan.</p>

                <p style="font-size: 12px; color: #6b7280; margin: 0 0 2px;">Nama</p>
                <p style="font-size: 14px; color: #111827; margin: 0 0 12px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">${name}</p>

                <p style="font-size: 12px; color: #6b7280; margin: 0 0 2px;">Email</p>
                <p style="font-size: 14px; color: #111827; margin: 0 0 12px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">${email}</p>

                <p style="font-size: 12px; color: #6b7280; margin: 0 0 2px;">Nomor Telepon</p>
                <p style="font-size: 14px; color: #111827; margin: 0 0 12px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">${phone || '-'}</p>

                <p style="font-size: 12px; color: #6b7280; margin: 0 0 2px;">Pesan</p>
                <p style="font-size: 14px; color: #111827; margin: 0;">${message}</p>
              </div>

              <div style="margin-top: 24px;">
                <a href="mailto:${email}" style="display: inline-block; background-color: #5EA500; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; padding: 12px 24px; border-radius: 8px; margin-right: 8px;">Balas Pesan</a>
              </div>
            </div>

            <div style="padding: 20px 32px; background-color: #f9fafb; text-align: center; font-size: 12px; color: #9ca3af;">
              Hyrdan Pest • Office Address Placeholder<br><br>
              Email ini dikirim secara otomatis dari formulir kontak situs web.<br>
              © ${now.getFullYear()} Hyrdan Pest. All rights reserved.
            </div>

          </div>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'Failed to send' }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};