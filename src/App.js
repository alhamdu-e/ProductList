import { useEffect, useReducer, useState, useSyncExternalStore } from "react";
import desserts from "./data";

const initialState = [];
const dessertsReducer = (state, action) => {
	switch (action.type) {
		case "addToCart":
			const isItemExist = state.find((item) => item.id === action.payload.id);
			if (isItemExist) {
				return state.map((item) =>
					item.id === action.payload.id
						? { ...item, quantity: item.quantity + 1 }
						: item
				);
			} else {
				return [...state, { ...action.payload, quantity: 1 }];
			}
		case "removeFromCart":
			const itemToRemove = state.find((item) => item.id === action.payload.id);
			if (itemToRemove.quantity === 1) {
				return state;
			} else {
				return state.map((item) =>
					item.id === action.payload.id
						? { ...item, quantity: item.quantity - 1 }
						: item
				);
			}
		case "remove":
			return state.filter((item) => item.id !== action.payload.id);
		case "new":
			return initialState;

		default:
			return state;
	}
};
function App() {
	const [cart, dispatch] = useReducer(dessertsReducer, initialState);
	const [total, setTotal] = useState(0);
	const [showConfirm, seConfirm] = useState(false);
	useEffect(() => {
		const tot = cart.reduce((sum, item) => {
			return (sum = sum + item.quantity * item.price);
		}, 0);
		setTotal(tot);
	}, [cart]);
	const addToCart = (item) => {
		dispatch({ type: "addToCart", payload: item });
	};
	const removeFromCart = (item) => {
		dispatch({ type: "removeFromCart", payload: item });
	};
	const remove = (item) => {
		dispatch({ type: "remove", payload: item });
	};

	return (
		<div>
			<div className="flex flex-col  md:p-24 lg:space-y-0  space-y-8 md:space-x-8 p-8 lg:flex-row bg-[#FCF8F5] pb-40">
				<div>
					<h1 className="font-bold text-4xl mb-6">Desserts</h1>
					<div className="grid grid-cols-1 gap-6  sm:grid-cols-2 md:grid-cols-3">
						{/* first div */}

						{desserts.map((dessert) => (
							<div className=" flex space-y-3 flex-col" key={dessert.id}>
								<div className=" text-center">
									<img
										src={dessert.image.tablet}
										className="hidden sm:block "
										alt=""
									/>
									<img
										src={dessert.image.mobile}
										className="sm:hidden"
										alt=""
									/>
									<div>
										{!cart.find((item) => item.id === dessert.id) && (
											<div>
												<button
													className="flex items-center justify-center space-x-2 py-2 px-4 rounded-3xl  border  border-gray-600  w-fit  mx-auto bg-white -translate-y-5 "
													onClick={() => addToCart(dessert)}>
													<img src="./images/icon-add-to-cart.svg" alt="" />
													<span className="font-bold text-lg  md:text-sm">
														Add To Cart
													</span>
												</button>
											</div>
										)}
										{cart.find((item) => item.id === dessert.id) && (
											<div className="flex space-x-8 items-center justify-center  py-2 px-4 rounded-3xl  border  border-gray-600  w-fit  mx-auto bg-[#C23C0E] -translate-y-5 ">
												<button
													className="border p-1 py-2 rounded-full flex justify-center items-center"
													onClick={() => removeFromCart(dessert)}>
													<img
														src="./images/icon-decrement-quantity.svg"
														alt=""
													/>
												</button>
												<span className="text-white">
													{
														cart.find((item) => item.id === dessert.id)
															?.quantity
													}
												</span>
												<button
													className="border p-1 rounded-full flex items-center justify-center"
													onClick={() => addToCart(dessert)}>
													<img
														src="./images/icon-increment-quantity.svg"
														alt=""
													/>
												</button>
											</div>
										)}
									</div>
								</div>
								<div>
									<p className="text-gray-400">{dessert.category}</p>
									<p className="text-[#0E0400] font-semibold">{dessert.name}</p>
									<p className="font-semibold text-[#C4572D]">
										${dessert.price}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="sm:w-[500px] lg:w-[600px] sm:mx-auto">
					<div className="bg-white p-8">
						<p className="text-[#C23C0E] font-extrabold text-lg mb-6">
							Your Cart({cart.length})
						</p>
						{cart.length === 0 && (
							<div className="flex space-y-5 flex-col justify-center items-center">
								<img src="./images/illustration-empty-cart.svg " alt="" />
								<p className="text-gray-400 text-sm">
									Your Added Items Will Appera Here
								</p>
							</div>
						)}

						{cart.length > 0 && (
							<>
								{cart.map((item) => (
									<div className="border-b border-slate-200 relative py-3">
										<p className="font-semibold text-lg capitalize">
											{item.category}
										</p>
										<div className="flex items-center space-x-2">
											<span className="text-[#C23C0E] font-bold">
												{item.quantity}x
											</span>
											<span className="text-slate-500 ">@ ${item.price}</span>
											<span className="text-slate-700 ">
												${item.quantity * item.price}
											</span>
										</div>
										<button
											className="absolute right-3 top-8 border rounded-full text-sm h-4 pb-[2px] w-5 flex justify-center items-center text-gray-800 border-gray-600"
											onClick={() => remove(item)}>
											&times;
										</button>
									</div>
								))}
								<div className="flex items-center justify-between  pt-6">
									<span>Order Total</span>{" "}
									<span className="text-3xl font-bold">{total}</span>
								</div>
								<div className="flex flex-col space-y-6">
									<div className="bg-[#FCF8F5] space-x-2 text-xs flex justify-center items-center py-4 mt-3 rounded-lg">
										<img src="./images/icon-carbon-neutral.svg" alt="" />
										<p>
											This is a <strong>Carbon-Neutral</strong> delivery
										</p>
									</div>
									<button
										className="bg-[#C23C0E] py-4 text-white rounded-3xl"
										onClick={() => seConfirm(!showConfirm)}>
										Confirm Order
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			</div>

			{showConfirm && (
				<div className="fixed bg-[rgba(83,78,78,0.5)] top-0  bottom-0 flex items-center justify-center left-0 right-0 sm:pt-5 pt-20 ">
					<div className="bg-white p-4  rounded-xl  w-full sm:w-auto sm:min-w-[400px]">
						<div className=" border-2 mb-3 border-green-600 rounded-full w-7 flex justify-center items-center">
							✔
						</div>
						<p className="font-bold text-3xl ">Order Confirmed</p>
						<p className="capitalize text-xs text-gray-400">
							we hope you enjoyed your food
						</p>
						<div className="bg-[#FCF8F5] rounded-lg p-4 mt-5">
							<div className="max-h-60 overflow-y-scroll">
								{cart.map((item) => (
									<div className="flex items-center justify-between border-b border-slate-300 py-2">
										<div className="flex items-center space-x-3">
											<img
												src={item.image.mobile}
												className="w-16 rounded-lg"
												alt=""
											/>
											<div className="">
												<p className="font-bold text-sm">{item.name}</p>
												<div>
													<span className="text-[#C23C0E] font-bold mr-2 text-xs">
														{item.quantity}x
													</span>
													<span className="text-slate-500 text-xs ">
														@ ${item.price}
													</span>
												</div>
											</div>
										</div>
										<span className="text-slate-700 text-sm">
											${item.quantity * item.price}
										</span>
									</div>
								))}
							</div>
							<div className="flex items-center justify-between  pt-3">
								<span>Order Total</span>{" "}
								<span className="text-3xl font-bold">{total}</span>
							</div>
						</div>
						<div className="flex flex-col space-y-6">
							<button
								className="bg-[#C23C0E] py-4 text-white rounded-3xl"
								onClick={() => {
									seConfirm(!showConfirm);
									dispatch({ type: "new" });
								}}>
								Start New Order
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default App;
