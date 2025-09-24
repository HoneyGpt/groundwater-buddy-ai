import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { name, email, message }: ContactRequest = await req.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send email to the team
    const emailResponse = await resend.emails.send({
      from: "INGRES-AI Contact <onboarding@resend.dev>",
      to: ["harshitabhaskaruni@gmail.com"],
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <p><strong>Message:</strong></p>
            <div style="background-color: #f9fafb; padding: 15px; border-left: 4px solid #2563eb; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
            <p>This message was sent through the INGRES-AI contact form.</p>
          </div>
        </div>
      `,
    });

    // Send confirmation email to user
    const confirmationResponse = await resend.emails.send({
      from: "INGRES-AI Team <onboarding@resend.dev>",
      to: [email],
      subject: "Thank you for contacting INGRES-AI",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            Thank you for reaching out!
          </h2>
          
          <div style="margin: 20px 0;">
            <p>Dear ${name},</p>
            
            <p>Thank you for contacting the INGRES-AI team. We have received your message and will get back to you as soon as possible.</p>
            
            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Your message:</strong></p>
              <p style="font-style: italic;">"${message}"</p>
            </div>
            
            <p>Our team typically responds within 24-48 hours during business days.</p>
            
            <p>In the meantime, feel free to explore our groundwater analysis tools and connect with us on LinkedIn.</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p>Best regards,<br>
            <strong>The INGRES-AI Team</strong><br>
            <em>Indian Groundwater Research & Environmental Systems</em></p>
            
            <p style="margin-top: 15px;">
              <a href="https://in.linkedin.com/in/harshitabhaskaruni1117" style="color: #2563eb; text-decoration: none;">
                🔗 Connect with us on LinkedIn
              </a>
            </p>
          </div>
        </div>
      `,
    });

    console.log("Emails sent successfully:", { emailResponse, confirmationResponse });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);