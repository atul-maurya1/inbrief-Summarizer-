import { useContext } from "react";
import { authContext } from "../context/authContext";
import { Link } from "react-router-dom";

function ProfilePic() {
	const { user } = useContext(authContext);

	// user is now always the plain user object: { firstName, lastName, email, ... }
	const firstName = user?.firstName || "";
	const lastName = user?.lastName || "";

	// Build initials safely – use first char of firstName, fallback to second char if lastName missing
	const initials = (firstName[0] || "").toUpperCase() + (lastName[0] || firstName[1] || "").toUpperCase();

	return (
		<div>
			{!user ? (
				<div>
					<Link
						to="/auth"
						className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						Log in
					</Link>
				</div>
			) : (
				<div className="flex size-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50">
					<p className="text-sm font-bold text-blue-700">{initials || "?"}</p>
				</div>
			)}
		</div>
	);
}

export default ProfilePic;
