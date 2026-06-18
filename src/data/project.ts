import { type CollectionEntry, getCollection } from "astro:content";

/** filter out draft projects based on the environment */
export async function getAllProjects(): Promise<CollectionEntry<"project">[]> {
	return await getCollection("project", ({ data }) => {
		return import.meta.env.PROD ? !data.draft : true;
	});
}
