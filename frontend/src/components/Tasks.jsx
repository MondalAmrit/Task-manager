import React, {useCallback, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loader from "./utils/Loader";
import Tooltip from "./utils/Tooltip";
import {toast} from "react-toastify";

const Tasks = () => {
	const authState = useSelector((state) => state.authReducer);
	const [tasks, setTasks] = useState([]);
	const [fetchData, {loading}] = useFetch();

	const fetchTasks = useCallback(() => {
		const config = {
			url: "/tasks",
			method: "get",
			headers: {Authorization: authState.token},
		};
		fetchData(config, {showSuccessToast: false}).then((data) =>
			setTasks(data.tasks)
		);
	}, [authState.token, fetchData]);

	useEffect(() => {
		if (!authState.isLoggedIn) return;
		fetchTasks();
	}, [authState.isLoggedIn, fetchTasks]);

	const handleDelete = (id) => {
		const config = {
			url: `/tasks/${id}`,
			method: "delete",
			headers: {Authorization: authState.token},
		};
		fetchData(config).then(() => fetchTasks());
	};

	const handleCompleteTask = (id) => {
		try {
			toast.success("Congratulations, you have completed a task...");
			setTimeout(() => {
				handleDelete(id);
			}, 3000);
		} catch (error) {
			console.error("Error completing task:", error);
		}
	};

	return (
		<>
			<div className="my-2 mx-auto max-w-[700px] py-4">
				{tasks.length !== 0 && (
					<h2 className="text-white my-2 ml-2 md:ml-0 text-xl">
						Your tasks ({tasks.length})
					</h2>
				)}
				{loading ? (
					<Loader />
				) : (
					<div>
						{tasks.length === 0 ? (
							<div className="w-[600px] h-[300px] flex items-center justify-center gap-4">
								<span className="text-white">No tasks found</span>
								<Link
									to="/tasks/add"
									className="bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md px-4 py-2"
								>
									+ Add new task{" "}
								</Link>
							</div>
						) : (
							tasks.map((task, index) => (
								<div
									key={task._id}
									className="bg-customPurple my-4 p-4 text-gray-600 rounded-lg shadow-lg border border-white"
								>
									<div className="flex">
										<span className="text-white font-bold">
											Task #{index + 1}
										</span>

										<Tooltip text={"Edit this task"} position={"top"}>
											<Link
												to={`/tasks/${task._id}`}
												className="ml-auto mr-2 text-green-600 cursor-pointer"
											>
												<i className="fa-solid fa-pen"></i>
											</Link>
										</Tooltip>

										<Tooltip text={"Complete this task"} position={"top"}>
											<span
												className="text-blue-500 cursor-pointer mr-2"
												onClick={() => handleCompleteTask(task._id)}
											>
												<i className="fa-solid fa-check"></i>
											</span>
										</Tooltip>

										<Tooltip text={"Delete this task"} position={"top"}>
											<span
												className="text-red-500 cursor-pointer"
												onClick={() => handleDelete(task._id)}
											>
												<i className="fa-solid fa-trash"></i>
											</span>
										</Tooltip>
									</div>
									<div className="text-white whitespace-pre">
										{task.description}
									</div>
									{task.completionDate && (
										<div className="text-white">
											Completion Date:{" "}
											{new Date(task.completionDate).toLocaleDateString(
												"en-GB"
											)}
										</div>
									)}
								</div>
							))
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default Tasks;
