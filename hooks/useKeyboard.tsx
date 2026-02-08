import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

export const useKeyboard = () => {
	const [keyboardStatus, setKeyboardStatus] = useState("Keyboard Hidden");

	useEffect(() => {
		const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
			setKeyboardStatus("Keyboard Shown");
		});
		const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
			setKeyboardStatus("Keyboard Hidden");
		});

		return () => {
			showSubscription.remove();
			hideSubscription.remove();
		};
	}, []);

	return { Keyboard, keyboardStatus };
};
