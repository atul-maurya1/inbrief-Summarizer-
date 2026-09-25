import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import SummeryContextProvider from "./context/summeryContextProvider.jsx";
import { AuthContextProvider } from "./context/authContextProvider.jsx";
import {HistoryContextProvider} from './context/historyContextProvider.jsx'

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<AuthContextProvider>
				<SummeryContextProvider>
					<HistoryContextProvider>
                       <App />
					</HistoryContextProvider>	
				</SummeryContextProvider>
			</AuthContextProvider>
		</BrowserRouter>
	</StrictMode>,
);
