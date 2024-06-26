"use client";
import { NextPage } from "next";
import { useCallback, useContext, useEffect, useState } from "react";
import Loader from "../../components/blog/Loader";
import PageHeader from "../../components/blog/PageHeader";
import PostList, { Article } from "../../components/blog/PostList";
import Button from "../../components/Button";
import Footer from "../../components/Footer";
import RudderContext from "../../components/RudderContext";
import { fetchAPI } from "../../utils/blog/fetch-api";
import { getAndSetAnonymousIdFromLocalStorage } from "../../utils/rudderstack_initialize";
import Navbar from "../../views/Navbar";


interface Meta {
	pagination: {
		start: number;
		limit: number;
		total: number;
	};
}

const Profile: NextPage = () => {
	const [meta, setMeta] = useState<Meta | undefined>();
	const [data, setData] = useState<Article[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { rudderEventMethods } = useContext(RudderContext);

	const fetchData = useCallback(async (start: number, limit: number) => {
		setIsLoading(true);
		try {
			const path = `/articles`;
			const urlParamsObject = {
				sort: { createdAt: "desc" },
				populate: {
					cover: { fields: ["url"] },
					category: { populate: "*" },
					authorsBio: {
						populate: "*",
					},
				},
				pagination: {
					start: start,
					limit: limit,
				},
			};
			const responseData = await fetchAPI(path, urlParamsObject);

			if (start === 0) {
				setData(responseData.data);
			} else {
				setData((prevData: Article[]) => [...prevData, ...responseData.data]);
			}

			setMeta(responseData.meta);
		} catch (error) {
			console.error(`[blog/index.tsx] Unable to fetch articles - ${JSON.stringify(error)}`);
		} finally {
			setIsLoading(false);
		}
	}, []);

	function loadMorePosts(): void {
		const nextPosts = meta?.pagination.start ?? 0 + (meta?.pagination.limit ?? 0);
		fetchData(nextPosts, Number(process.env.NEXT_PUBLIC_PAGE_LIMIT));
	}

	useEffect(() => {
		fetchData(0, Number(process.env.NEXT_PUBLIC_PAGE_LIMIT));
		const anonymousId = getAndSetAnonymousIdFromLocalStorage();
		rudderEventMethods?.track("absent", "page-visit", { type: "blog-list-page"}, anonymousId);
	}, [rudderEventMethods, fetchData]);

	if (isLoading) return <Loader />;

	return (
		<>
			<Navbar transparent={true} />
			<PageHeader heading="Our Blog" text="Checkout Something Cool" />
			<PostList data={data}>
				{(meta?.pagination.start ?? 0) + (meta?.pagination.limit ?? 0) <
					(meta?.pagination.total ?? 0) && (
						<div className="flex justify-center">
							<Button
								type="button"
								className="px-6 py-3 text-sm rounded-lg hover:underline"
								onClick={loadMorePosts} variant="outlined"							>
								Load more posts...
							</Button>
						</div>
					)}
			</PostList>
			<Footer />
		</>
	);
}

export default Profile;