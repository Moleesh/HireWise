/** @format */

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
	if (req.method === 'OPTIONS') {
		return new Response(null, { status: 200, headers: corsHeaders });
	}

	try {
		const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = Deno.env.toObject();

		const body = await req.json();
		const { action, email, password, role, user_id } = body;

		if (action === 'create') {
			if (!email || !password) {
				return new Response(
					JSON.stringify({ error: 'Username and password are required' }),
					{
						status: 400,
						headers: { ...corsHeaders, 'Content-Type': 'application/json' },
					},
				);
			}
			if (password.length < 6) {
				return new Response(
					JSON.stringify({ error: 'Password must be at least 6 characters' }),
					{
						status: 400,
						headers: { ...corsHeaders, 'Content-Type': 'application/json' },
					},
				);
			}

			// Create user via admin API
			const adminRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
				method: 'POST',
				headers: {
					apikey: SUPABASE_SERVICE_ROLE_KEY,
					Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
					password,
					email_confirm: true,
					app_metadata: { role: role || 'member' },
				}),
			});

			const adminData = await adminRes.json();

			if (!adminRes.ok) {
				const msg =
					adminData.msg ||
					adminData.message ||
					adminData.error_description ||
					'Failed to create user';
				return new Response(JSON.stringify({ error: msg }), {
					status: adminRes.status,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				});
			}

			return new Response(
				JSON.stringify({ user: { id: adminData.id, email: adminData.email } }),
				{
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				},
			);
		}

		if (action === 'reset-password') {
			if (!user_id || !password || password.length < 6) {
				return new Response(
					JSON.stringify({ error: 'User and 6 character password required' }),
					{
						status: 400,
						headers: { ...corsHeaders, 'Content-Type': 'application/json' },
					},
				);
			}

			const updateRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${user_id}`, {
				method: 'PUT',
				headers: {
					apikey: SUPABASE_SERVICE_ROLE_KEY,
					Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ password }),
			});

			if (!updateRes.ok) {
				return new Response(JSON.stringify({ error: 'Failed to update password' }), {
					status: updateRes.status,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				});
			}

			return new Response(JSON.stringify({ success: true }), {
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			});
		}

		if (action === 'delete') {
			if (!user_id) {
				return new Response(JSON.stringify({ error: 'user_id is required' }), {
					status: 400,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				});
			}

			const deleteRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${user_id}`, {
				method: 'DELETE',
				headers: {
					apikey: SUPABASE_SERVICE_ROLE_KEY,
					Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
				},
			});

			if (!deleteRes.ok) {
				return new Response(JSON.stringify({ error: 'Failed to delete user' }), {
					status: deleteRes.status,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				});
			}

			return new Response(JSON.stringify({ success: true }), {
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			});
		}

		return new Response(JSON.stringify({ error: 'Unknown action' }), {
			status: 400,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return new Response(JSON.stringify({ error: message || 'Internal server error' }), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}
});
