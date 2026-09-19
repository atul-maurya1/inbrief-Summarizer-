import { useContext, useState } from "react";
import { authContext } from "../context/authContext";
import { Link } from "react-router-dom";

function ProfilePic() {
	const { user } = useContext(authContext);

	let img = "";
	let name = user?.data?.firstName[0] + user?.data?.lastName[0];
	return (
		<div>
			{user === null ? (
				<div>
					{" "}
					<Link
						to="/login"
						className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						Log in
					</Link>
				</div>
			) : (
				<div className="flex size-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50">
					{img ? (
						<img src="placeholder" alt="profile pic" />
					) : (
						<p className="text-sm font-bold text-blue-700">{name}</p>
					)}
				</div>
			)}
		</div>
	);
}

export default ProfilePic;
