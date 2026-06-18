import { type CollectionEntry, getCollection } from "astro:content";

/** filter out draft items based on the environment */
export async function getAllMore(): Promise<CollectionEntry<"more">[]> {
	return await getCollection("more", ({ data }) => {
		return import.meta.env.PROD ? !data.draft : true;
	});
}

/** Get all pinned items */
export async function getPinnedMore(): Promise<CollectionEntry<"more">[]> {
	return await getCollection("more", ({ data }) => {
		return (import.meta.env.PROD ? !data.draft : true) && data.pinned === true;
	});
}

/** groups items by year */
export function groupMoreByYear(items: CollectionEntry<"more">[]) {
	return items.reduce<Record<string, CollectionEntry<"more">[]>>((acc, item) => {
		const year = item.data.publishDate.getFullYear();
		if (!acc[year]) {
			acc[year] = [];
		}
	acc[year]?.push(item);
		return acc;
	}, {});
}

/** returns all tags created from more items */
export function getAllMoreTags(items: CollectionEntry<"more">[]) {
	return items.flatMap((item) => [...item.data.tags]);
}

/** returns all unique tags */
export function getUniqueMoreTags(items: CollectionEntry<"more">[]) {
	return [...new Set(getAllMoreTags(items))];
}

/** returns a count of each unique tag */
export function getUniqueMoreTagsWithCount(items: CollectionEntry<"more">[]): [string, number][] {
	return [
		...getAllMoreTags(items).reduce(
			(acc, t) => acc.set(t, (acc.get(t) ?? 0) + 1),
			new Map<string, number>(),
		),
	].sort((a, b) => b[1] - a[1]);
}