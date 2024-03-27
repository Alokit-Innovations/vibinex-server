import axios from "axios";
import { useEffect, useState } from "react";
import { AliasMap, AliasProviderMap } from "../types/AliasMap";
import Button from "./Button";
import Chip from "./Chip";

const GitAliasForm: React.FC<{ expanded: boolean }> = ({ expanded }) => {
	const [gitAliasMap, setGitAliasMap] = useState<AliasProviderMap | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [handleInputValues, setHandleInputValues] = useState<{ [key: string]: { github: string; bitbucket: string } }>({});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get<{ aliasProviderMap: AliasProviderMap }>(`/api/alias`, { params: { expanded } });
				if (!response.data?.aliasProviderMap) {
					throw new Error('Failed to fetch Git email aliases');
				}
				setGitAliasMap(response.data.aliasProviderMap);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching Git email aliases:", error);
			}
		};
		fetchData();
	}, [expanded]);

	const handleInputChange = (alias: string, provider: string, value: string) => {
		setHandleInputValues(prevState => ({
			...prevState,
			[alias]: {
				...prevState[alias],
				[provider]: value
			}
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			if (!gitAliasMap) {
				throw new Error('No new value to submit');
			}
			const updatedProviderMaps = gitAliasMap.providerMaps.map(providerMap => {
				const updatedHandleMaps = providerMap.handleMaps.map(handleMap => {
					const inputValue = handleInputValues[providerMap.alias]?.[handleMap.provider as keyof typeof handleInputValues['']];
					const updatedHandles = inputValue ? [inputValue.toString()] : [];
					return { ...handleMap, handles: updatedHandles };
				});
				return { ...providerMap, handleMaps: updatedHandleMaps };
			});

			const updatedGitAliasMap = { providerMaps: updatedProviderMaps };
			const response = await axios.post('/api/alias', { aliasProviderMap: updatedGitAliasMap }, {
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (!response) {
				throw new Error('Failed to save Git alias map');
			}
			alert("Git aliases updated successfully!");
		} catch (error) {
			console.error("Error saving Git aliases:", error);
			alert("An error occurred while saving Git aliases. Please try again.");
		}
	};

	if (loading) {
		return (<div>Loading...</div>)
	}
	return (
		<form onSubmit={handleSubmit}>
			{(gitAliasMap?.providerMaps && gitAliasMap.providerMaps.length > 0) ? (
				<>
					<h3 className="font-semibold my-4 ml-4">Please enter Github/Bitbucket usernames and click Submit:</h3>

					{/* Header */}
					<div className="grid grid-cols-3 border-b text-blue-800">
						<div className="p-4">
							<h3 className="text-center font-bold">Alias</h3>
						</div>
						<div className="p-4">
							<h3 className="text-center font-bold">Github</h3>
						</div>
						<div className="p-4">
							<h3 className="text-center font-bold">Bitbucket</h3>
						</div>
					</div>

					{/* Rows */}
					{gitAliasMap.providerMaps.map((providerMap: AliasMap) => (
						<div key={providerMap.alias} className="grid grid-cols-3 border-b border-gray-300">
							{/* Alias column */}
							<div className="p-4">
								<div>{providerMap.alias}</div>
							</div>

							{/* github column */}
							<div className="p-4">
								<div>
									<input
										type="text"
										value={handleInputValues[providerMap.alias]?.github || ''}
										onChange={(e) => handleInputChange(providerMap.alias, 'github', e.target.value)}
										className="mb-2 w-full"
									/>
								</div>
								{/* Display additional handles beneath the input field if available */}
								{providerMap.handleMaps?.find(handleMap => handleMap.provider === 'github')?.handles.map((handle: string) => (
									<Chip key={handle} name={handle} avatar={"/github-dark.svg"} disabled={false} />
								))}
							</div>

							{/* bitbucket column */}
							<div className="p-4">
								<div>
									<input
										type="text"
										value={handleInputValues[providerMap.alias]?.bitbucket || ''}
										onChange={(e) => handleInputChange(providerMap.alias, 'bitbucket', e.target.value)}
										className="mb-2 w-full"
									/>
								</div>
								{/* Display additional handles beneath the input field if available */}
								{providerMap.handleMaps?.find(handleMap => handleMap.provider === 'bitbucket')?.handles.map((handle: string) => (
									<Chip key={handle} name={handle} avatar={"/bitbucket-dark.svg"} disabled={false} />
								))}
							</div>
						</div>
					))}
					{/* Buttons */}
					<div className="mt-4 flex gap-2">
						<Button variant="contained" type="submit" className={`${expanded ? 'w-full block mb-4' : ''}`}>Submit</Button>
						{!expanded && (
							<Button variant="outlined" className="flex-grow" href="/settings">View all aliases</Button>
						)}
					</div>
				</>
			) : expanded ? (
				<div className="h-screen-1/2 text-primary-text flex flex-col items-center justify-center" >
					<p className="font-bold text-lg">No aliases found</p>
					<p>Please setup a repository from this account to view aliases</p>
				</div>
			) : null
			}
		</form>
	);
};

export default GitAliasForm;
