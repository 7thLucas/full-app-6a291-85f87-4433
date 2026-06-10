import { redirect } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getUserFromRequest, signJwt, buildAuthCookie } from "~/modules/authentication/authentication.server";
import { AuthService } from "~/modules/authentication/authentication.service";
import { useLoaderData } from "react-router";
import { AcceptInviteForm } from "~/modules/review-workflow/src/components/workflow/accept-invite-form";
import { UserRole } from "~/modules/authentication/authentication.types";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const token = params.token ?? "";
  const { ReviewInvitationService } = await import("~/modules/review-workflow/src/services/review-invitation.service");

  try {
    const invitation = await ReviewInvitationService.validateToken(token);
    const currentUser = getUserFromRequest(request);

    if (currentUser) {
      await ReviewInvitationService.accept(token, currentUser.sub);
      const project_id = (invitation.project_id as any)?._id ?? invitation.project_id;
      return redirect(`/projects/${project_id}`);
    }

    const { UserModel } = await import("~/modules/authentication/authentication.model");
    const existingUser = await UserModel.findOne({ email: invitation.email.toLowerCase(), deletedAt: null });

    return {
      invitation: JSON.parse(JSON.stringify(invitation)),
      mode: existingUser ? "login" : "register",
    };
  } catch (error: any) {
    return redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
  }
}

export async function action({ params, request }: ActionFunctionArgs) {
  const token = params.token ?? "";
  const formData = await request.formData();
  const mode = String(formData.get("mode") ?? "register");

  try {
    const { ReviewInvitationService } = await import("~/modules/review-workflow/src/services/review-invitation.service");
    const invitation = await ReviewInvitationService.validateToken(token);

    let userId: string;
    let userRole: UserRole;
    let username: string;
    let email: string;

    if (mode === "register") {
      const user = await AuthService.register({
        username: String(formData.get("username") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      });
      const { UserModel } = await import("~/modules/authentication/authentication.model");
      await UserModel.updateOne({ _id: user.id }, { role: UserRole.Client });
      userId = user.id;
      userRole = UserRole.Client;
      username = user.username;
      email = user.email;
    } else {
      const user = await AuthService.login({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      });
      userId = user.id;
      userRole = user.role as UserRole;
      username = user.username;
      email = user.email;
    }

    await ReviewInvitationService.accept(token, userId);
    const project_id = (invitation.project_id as any)?._id ?? invitation.project_id;

    const jwtToken = signJwt({ sub: userId, role: userRole, username, email });
    return redirect(`/projects/${project_id}`, {
      headers: { "Set-Cookie": buildAuthCookie(jwtToken, new URL(request.url).hostname) },
    });
  } catch (error: any) {
    return { error: error.message ?? "Failed to accept invitation" };
  }
}

export default function InviteRoute() {
  const data = useLoaderData<typeof loader>();
  if (!data || !("invitation" in data)) return null;
  return <AcceptInviteForm invitation={data.invitation} mode={data.mode as "register" | "login"} />;
}
